import type { Endpoint } from 'payload'
import type Stripe from 'stripe'
import { getStripe, fromStripeAmount } from '../lib/stripe'

/**
 * POST /api/payments/stripe-webhook
 * Confirms marketplace PaymentIntents and updates ledger rows.
 */
export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe-webhook',
  method: 'post',
  handler: async (req) => {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature')

    let event: Stripe.Event

    try {
      if (webhookSecret && signature) {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      } else {
        event = JSON.parse(rawBody) as Stripe.Event
        req.payload.logger.warn('STRIPE_WEBHOOK_SECRET missing — webhook signature not verified')
      }
    } catch (error) {
      req.payload.logger.error(`Stripe webhook signature error: ${error}`)
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        await handlePaymentIntentSucceeded(req, event.data.object as Stripe.PaymentIntent, event.id)
        break
      }
      case 'payment_intent.payment_failed': {
        await handlePaymentIntentFailed(req, event.data.object as Stripe.PaymentIntent, event.id)
        break
      }
      default:
        break
    }

    return Response.json({ received: true })
  },
}

async function findPaymentByIntent(req: Parameters<Endpoint['handler']>[0], paymentIntentId: string) {
  const result = await req.payload.find({
    collection: 'payments',
    where: {
      'stripe.paymentIntentId': { equals: paymentIntentId },
    },
    limit: 1,
    depth: 0,
    req,
    overrideAccess: true,
  })
  return result.docs[0]
}

async function handlePaymentIntentSucceeded(
  req: Parameters<Endpoint['handler']>[0],
  intent: Stripe.PaymentIntent,
  eventId: string,
) {
  const child = await findPaymentByIntent(req, intent.id)
  if (!child) {
    req.payload.logger.warn(`No payment row for PaymentIntent ${intent.id}`)
    return
  }

  const paidAmount = fromStripeAmount(intent.amount_received || intent.amount)

  await req.payload.update({
    collection: 'payments',
    id: child.id,
    data: {
      status: 'paid',
      amountPaid: paidAmount,
      amountDue: 0,
      stripe: {
        ...(typeof child.stripe === 'object' ? child.stripe : {}),
        paymentIntentId: intent.id,
        chargeId: typeof intent.latest_charge === 'string' ? intent.latest_charge : undefined,
        latestEventId: eventId,
        transferId:
          typeof intent.transfer_data?.destination === 'string'
            ? undefined
            : child.stripe?.transferId,
      },
    },
    req,
    overrideAccess: true,
  })

  const parentDebtId =
    typeof child.parentDebt === 'string' ? child.parentDebt : child.parentDebt?.id

  if (parentDebtId) {
    const debt = await req.payload.findByID({
      collection: 'payments',
      id: parentDebtId,
      depth: 0,
      req,
      overrideAccess: true,
    })

    const nextPaid = (Number(debt.amountPaid) || 0) + paidAmount
    const nextDue = Math.max((Number(debt.amount) || 0) - nextPaid, 0)

    await req.payload.update({
      collection: 'payments',
      id: parentDebtId,
      data: {
        amountPaid: nextPaid,
        amountDue: nextDue,
        status: nextDue <= 0 ? 'paid' : 'partially_paid',
        stripe: {
          ...(typeof debt.stripe === 'object' ? debt.stripe : {}),
          latestEventId: eventId,
          chargeId: typeof intent.latest_charge === 'string' ? intent.latest_charge : debt.stripe?.chargeId,
        },
      },
      req,
      overrideAccess: true,
    })
  }
}

async function handlePaymentIntentFailed(
  req: Parameters<Endpoint['handler']>[0],
  intent: Stripe.PaymentIntent,
  eventId: string,
) {
  const child = await findPaymentByIntent(req, intent.id)
  if (!child) return

  await req.payload.update({
    collection: 'payments',
    id: child.id,
    data: {
      status: 'failed',
      stripe: {
        ...(typeof child.stripe === 'object' ? child.stripe : {}),
        latestEventId: eventId,
      },
    },
    req,
    overrideAccess: true,
  })

  const parentDebtId =
    typeof child.parentDebt === 'string' ? child.parentDebt : child.parentDebt?.id

  if (parentDebtId) {
    const debt = await req.payload.findByID({
      collection: 'payments',
      id: parentDebtId,
      depth: 0,
      req,
      overrideAccess: true,
    })

    const amountDue = Number(debt.amountDue) || 0
    const amountPaid = Number(debt.amountPaid) || 0

    await req.payload.update({
      collection: 'payments',
      id: parentDebtId,
      data: {
        status: amountPaid > 0 ? 'partially_paid' : amountDue > 0 ? 'due' : debt.status,
        stripe: {
          ...(typeof debt.stripe === 'object' ? debt.stripe : {}),
          latestEventId: eventId,
        },
      },
      req,
      overrideAccess: true,
    })
  }
}
