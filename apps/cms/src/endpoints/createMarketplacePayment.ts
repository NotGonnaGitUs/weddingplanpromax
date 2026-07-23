import type { Endpoint } from 'payload'
import { billingPeriodFromDate } from '../constants/payments'
import { getStripe, toStripeAmount } from '../lib/stripe'

function relId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id: string }).id)
  }
  return undefined
}

/**
 * POST /api/payments/create-intent
 * Body: { paymentId: string, mode?: 'deposit' | 'balance' }
 *
 * Creates (or reuses) a Stripe PaymentIntent for a due event_debt,
 * charged on the marketplace platform account.
 */
export const createMarketplacePaymentEndpoint: Endpoint = {
  path: '/create-intent',
  method: 'post',
  handler: async (req) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = req.json ? await req.json() : {}
    const paymentId = body?.paymentId as string | undefined
    const mode = (body?.mode as 'deposit' | 'balance' | undefined) || 'balance'
    const depositAmount = body?.depositAmount as number | undefined

    if (!paymentId) {
      return Response.json({ error: 'paymentId is required' }, { status: 400 })
    }

    const debt = await req.payload.findByID({
      collection: 'payments',
      id: paymentId,
      depth: 1,
      req,
    })

    if (debt.kind !== 'event_debt') {
      return Response.json({ error: 'Only event_debt rows can be collected' }, { status: 400 })
    }

    if (!['due', 'partially_paid'].includes(debt.status as string)) {
      return Response.json({ error: `Payment status ${debt.status} is not collectible` }, { status: 400 })
    }

    const amountDue = Number(debt.amountDue) || 0
    if (amountDue <= 0) {
      return Response.json({ error: 'Nothing due on this payment' }, { status: 400 })
    }

    const chargeAmount =
      mode === 'deposit' && depositAmount != null
        ? Math.min(Number(depositAmount), amountDue)
        : amountDue

    if (chargeAmount <= 0) {
      return Response.json({ error: 'Invalid charge amount' }, { status: 400 })
    }

    const vendorId = relId(debt.vendor)
    if (!vendorId) {
      return Response.json({ error: 'Payment is missing vendor' }, { status: 400 })
    }

    const vendor = await req.payload.findByID({
      collection: 'vendors',
      id: vendorId,
      depth: 0,
      req,
    })

    const connectAccountId = vendor.billing?.stripeConnectAccountId as string | undefined
    if (!connectAccountId) {
      return Response.json(
        { error: 'Vendor has not connected Stripe; cannot collect marketplace payment' },
        { status: 400 },
      )
    }

    const coupleIds = Array.isArray(debt.couple)
      ? debt.couple.map((c) => relId(c)).filter(Boolean)
      : []
    const primaryCoupleId = coupleIds[0]
    if (!primaryCoupleId) {
      return Response.json({ error: 'Payment is missing couple' }, { status: 400 })
    }

    const couple = await req.payload.findByID({
      collection: 'users',
      id: primaryCoupleId,
      depth: 0,
      req,
    })

    const stripe = getStripe()
    let customerId = couple.coupleBalances?.stripeCustomerId as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: couple.email,
        name: couple.displayName,
        metadata: {
          payloadUserId: String(couple.id),
        },
      })
      customerId = customer.id
      await req.payload.update({
        collection: 'users',
        id: couple.id,
        data: {
          coupleBalances: {
            ...(typeof couple.coupleBalances === 'object' ? couple.coupleBalances : {}),
            stripeCustomerId: customerId,
          },
        },
        req,
        context: { skipBalanceAutomation: true },
      })
    }

    const applicationFee = Math.round(
      chargeAmount * (Number(debt.platformFeeRate) || 0) * 100,
    ) / 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: toStripeAmount(chargeAmount),
      currency: (debt.currency || 'USD').toLowerCase(),
      customer: customerId,
      receipt_email: couple.email,
      description: `${debt.title} (${mode})`,
      transfer_data: {
        destination: connectAccountId,
      },
      application_fee_amount: toStripeAmount(applicationFee),
      metadata: {
        payloadPaymentId: String(debt.id),
        payloadWeddingId: String(relId(debt.wedding) || ''),
        payloadVendorId: vendorId,
        mode,
      },
    })

    const child = await req.payload.create({
      collection: 'payments',
      data: {
        title: `${mode === 'deposit' ? 'Deposit' : 'Balance payment'} — ${debt.title}`,
        kind: mode === 'deposit' ? 'deposit' : 'balance_payment',
        status: 'processing',
        wedding: relId(debt.wedding),
        vendor: vendorId,
        couple: coupleIds,
        conversation: relId(debt.conversation),
        parentDebt: debt.id,
        currency: debt.currency || 'USD',
        amount: chargeAmount,
        amountPaid: 0,
        amountDue: chargeAmount,
        platformFee: applicationFee,
        platformFeeRate: debt.platformFeeRate,
        vendorNet: Math.round((chargeAmount - applicationFee) * 100) / 100,
        billingPeriod: billingPeriodFromDate(),
        stripe: {
          customerId,
          paymentIntentId: paymentIntent.id,
          connectAccountId,
        },
      },
      req,
    })

    await req.payload.update({
      collection: 'payments',
      id: debt.id,
      data: {
        status: 'processing',
        stripe: {
          ...(typeof debt.stripe === 'object' ? debt.stripe : {}),
          customerId,
          paymentIntentId: paymentIntent.id,
          connectAccountId,
        },
      },
      req,
    })

    return Response.json({
      paymentId: child.id,
      parentDebtId: debt.id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: chargeAmount,
      currency: debt.currency || 'USD',
    })
  },
}
