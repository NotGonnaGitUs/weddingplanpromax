import type { Payload, PayloadRequest } from 'payload'
import { billingPeriodFromDate } from '../constants/payments'

type Rel = string | { id: string } | null | undefined

function relId(value: Rel): string | undefined {
  if (!value) return undefined
  return typeof value === 'string' ? value : value.id
}

type MonthlyTally = {
  period: string
  grossBillings: number
  platformFees: number
  netBillings: number
  amountCollected: number
  amountOutstanding: number
  paymentCount: number
}

type Override = {
  req?: PayloadRequest
  context: { skipBalanceAutomation: true }
  overrideAccess?: boolean
}

function buildOverride(req?: PayloadRequest): Override {
  return req
    ? { req, context: { skipBalanceAutomation: true }, overrideAccess: true }
    : { context: { skipBalanceAutomation: true }, overrideAccess: true }
}

/**
 * Recompute vendor monthly tallies and couple outstanding balances
 * from all related payment documents.
 */
export async function recalculateBalances(args: {
  payload: Payload
  req?: PayloadRequest
  vendorId?: string
  coupleIds?: string[]
  weddingId?: string
}): Promise<void> {
  const { payload, req } = args
  const override = buildOverride(req)

  if (args.vendorId) {
    await recalculateVendorMonthlyBillings(payload, args.vendorId, override)
  }

  if (args.coupleIds?.length) {
    for (const coupleId of args.coupleIds) {
      await recalculateCoupleDebt(payload, coupleId, override)
    }
  }

  if (args.weddingId) {
    await recalculateWeddingPaymentTotals(payload, args.weddingId, override)
  }
}

async function recalculateVendorMonthlyBillings(
  payload: Payload,
  vendorId: string,
  override: Override,
) {
  const vendor = await payload.findByID({
    collection: 'vendors',
    id: vendorId,
    depth: 0,
    ...override,
  })

  const result = await payload.find({
    collection: 'payments',
    where: {
      and: [
        { vendor: { equals: vendorId } },
        { status: { not_in: ['cancelled', 'draft'] } },
      ],
    },
    limit: 1000,
    depth: 0,
    ...override,
  })

  const byPeriod = new Map<string, MonthlyTally>()

  const ensure = (period: string): MonthlyTally => {
    const existing = byPeriod.get(period)
    if (existing) return existing
    const created: MonthlyTally = {
      period,
      grossBillings: 0,
      platformFees: 0,
      netBillings: 0,
      amountCollected: 0,
      amountOutstanding: 0,
      paymentCount: 0,
    }
    byPeriod.set(period, created)
    return created
  }

  for (const payment of result.docs) {
    const period =
      (payment.billingPeriod as string | undefined) ||
      billingPeriodFromDate(new Date(payment.createdAt as string))
    const tally = ensure(period)
    const amount = Number(payment.amount) || 0
    const amountPaid = Number(payment.amountPaid) || 0
    const amountDue = Number(payment.amountDue) || 0
    const fee = Number(payment.platformFee) || 0

    if (payment.kind === 'event_debt') {
      tally.grossBillings += amount
      tally.platformFees += fee
      tally.netBillings += Math.max(amount - fee, 0)
      tally.amountOutstanding += Math.max(amountDue, 0)
      tally.paymentCount += 1
    }

    if (payment.kind === 'deposit' || payment.kind === 'balance_payment') {
      if (payment.status === 'paid' || payment.status === 'partially_paid') {
        tally.amountCollected += amountPaid || amount
      }
    }

    if (payment.kind === 'refund' && payment.status === 'paid') {
      tally.amountCollected -= amount
    }
  }

  const monthlyBillings = [...byPeriod.values()].sort((a, b) => b.period.localeCompare(a.period))
  const currentPeriod = billingPeriodFromDate()
  const current = monthlyBillings.find((row) => row.period === currentPeriod)
  const existingBilling =
    vendor.billing && typeof vendor.billing === 'object' ? vendor.billing : {}

  await payload.update({
    collection: 'vendors',
    id: vendorId,
    data: {
      billing: {
        ...existingBilling,
        monthlyBillings,
        currentMonthGross: current?.grossBillings ?? 0,
        currentMonthNet: current?.netBillings ?? 0,
        currentMonthOutstanding: current?.amountOutstanding ?? 0,
        lifetimeGross: monthlyBillings.reduce((sum, row) => sum + row.grossBillings, 0),
        lifetimeCollected: monthlyBillings.reduce((sum, row) => sum + row.amountCollected, 0),
      },
    },
    ...override,
  })
}

async function recalculateCoupleDebt(payload: Payload, coupleId: string, override: Override) {
  const couple = await payload.findByID({
    collection: 'users',
    id: coupleId,
    depth: 0,
    ...override,
  })

  const result = await payload.find({
    collection: 'payments',
    where: {
      and: [
        { couple: { equals: coupleId } },
        { status: { not_in: ['cancelled', 'draft'] } },
      ],
    },
    limit: 1000,
    depth: 0,
    ...override,
  })

  let totalDebt = 0
  let totalPaid = 0
  let outstandingBalance = 0

  for (const payment of result.docs) {
    const amount = Number(payment.amount) || 0
    const amountPaid = Number(payment.amountPaid) || 0
    const amountDue = Number(payment.amountDue) || 0

    if (payment.kind === 'event_debt') {
      totalDebt += amount
      outstandingBalance += Math.max(amountDue, 0)
    }

    if (
      (payment.kind === 'deposit' || payment.kind === 'balance_payment') &&
      (payment.status === 'paid' || payment.status === 'partially_paid')
    ) {
      totalPaid += amountPaid || amount
    }

    if (payment.kind === 'refund' && payment.status === 'paid') {
      totalPaid -= amount
    }
  }

  const existingBalances =
    couple.coupleBalances && typeof couple.coupleBalances === 'object' ? couple.coupleBalances : {}

  await payload.update({
    collection: 'users',
    id: coupleId,
    data: {
      coupleBalances: {
        ...existingBalances,
        totalDebt,
        totalPaid,
        outstandingBalance,
      },
    },
    ...override,
  })
}

async function recalculateWeddingPaymentTotals(
  payload: Payload,
  weddingId: string,
  override: Override,
) {
  const result = await payload.find({
    collection: 'payments',
    where: {
      and: [
        { wedding: { equals: weddingId } },
        { kind: { equals: 'event_debt' } },
        { status: { not_in: ['cancelled', 'draft'] } },
      ],
    },
    limit: 1000,
    depth: 0,
    ...override,
  })

  let totalDebt = 0
  let totalPaid = 0
  let outstandingBalance = 0

  for (const payment of result.docs) {
    totalDebt += Number(payment.amount) || 0
    totalPaid += Number(payment.amountPaid) || 0
    outstandingBalance += Math.max(Number(payment.amountDue) || 0, 0)
  }

  await payload.update({
    collection: 'weddings',
    id: weddingId,
    data: {
      paymentTotals: {
        totalDebt,
        totalPaid,
        outstandingBalance,
      },
      totalCost: totalDebt,
    },
    ...override,
  })
}

export function extractCoupleIds(couple: unknown): string[] {
  if (!couple) return []
  if (Array.isArray(couple)) {
    return couple.map((item) => relId(item as Rel)).filter(Boolean) as string[]
  }
  const id = relId(couple as Rel)
  return id ? [id] : []
}
