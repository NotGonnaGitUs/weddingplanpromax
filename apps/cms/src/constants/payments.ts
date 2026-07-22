/** Marketplace payment kinds and statuses. */

export const PAYMENT_KINDS = [
  {
    value: 'event_debt',
    label: 'Event debt',
    description: 'Amount the couple owes for a confirmed vendor booking.',
  },
  {
    value: 'deposit',
    label: 'Deposit',
    description: 'Partial payment toward an event debt.',
  },
  {
    value: 'balance_payment',
    label: 'Balance payment',
    description: 'Payment reducing outstanding couple debt.',
  },
  {
    value: 'marketplace_fee',
    label: 'Marketplace fee',
    description: 'Platform commission on a booking.',
  },
  {
    value: 'vendor_payout',
    label: 'Vendor payout',
    description: 'Transfer from marketplace to vendor Connect account.',
  },
  {
    value: 'refund',
    label: 'Refund',
    description: 'Money returned to the couple.',
  },
] as const

export type PaymentKind = (typeof PAYMENT_KINDS)[number]['value']

export const paymentKindOptions = PAYMENT_KINDS.map(({ value, label }) => ({
  value,
  label,
}))

export const PAYMENT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'due', label: 'Due' },
  { value: 'partially_paid', label: 'Partially paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
] as const

export const paymentStatusOptions = PAYMENT_STATUSES.map(({ value, label }) => ({
  value,
  label,
}))

/** Default platform commission rate (e.g. 0.10 = 10%). Override via PLATFORM_FEE_RATE. */
export const DEFAULT_PLATFORM_FEE_RATE = 0.1

export function billingPeriodFromDate(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getPlatformFeeRate(): number {
  const raw = process.env.PLATFORM_FEE_RATE
  if (raw == null || raw === '') return DEFAULT_PLATFORM_FEE_RATE
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed >= 0 && parsed < 1 ? parsed : DEFAULT_PLATFORM_FEE_RATE
}
