import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
      appInfo: {
        name: 'Marrymap Marketplace',
        version: '0.1.0',
      },
    })
  }

  return stripeClient
}

export function toStripeAmount(amount: number): number {
  // Amounts in this schema are major currency units (e.g. USD dollars).
  return Math.round(amount * 100)
}

export function fromStripeAmount(amount: number): number {
  return amount / 100
}
