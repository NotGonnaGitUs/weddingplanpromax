import type { CollectionAfterChangeHook } from 'payload'
import { billingPeriodFromDate, getPlatformFeeRate } from '../constants/payments'
import { extractCoupleIds } from '../lib/balances'

function relId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id: string }).id)
  }
  return undefined
}

/**
 * When a conversation becomes booked, record an event_debt payment
 * (couple owes the marketplace for that confirmed vendor event).
 */
export const createEventDebtOnBooking: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipBalanceAutomation) return doc

  const becameBooked = doc.status === 'booked' && previousDoc?.status !== 'booked'
  if (!becameBooked) return doc

  const weddingId = relId(doc.wedding)
  const vendorId = relId(doc.vendor)
  if (!weddingId || !vendorId) return doc

  const existing = await req.payload.find({
    collection: 'payments',
    where: {
      and: [
        { conversation: { equals: doc.id } },
        { kind: { equals: 'event_debt' } },
        { status: { not_in: ['cancelled'] } },
      ],
    },
    limit: 1,
    depth: 0,
    req,
  })

  if (existing.docs.length > 0) return doc

  const wedding = await req.payload.findByID({
    collection: 'weddings',
    id: weddingId,
    depth: 0,
    req,
  })

  const amount =
    Number(doc.activeQuote?.total) ||
    Number(
      (wedding.selectedVendors as Array<{ vendor?: unknown; acceptedPrice?: number; quotedPrice?: number }> | undefined)
        ?.find((row) => relId(row.vendor) === vendorId)?.acceptedPrice,
    ) ||
    Number(
      (wedding.selectedVendors as Array<{ vendor?: unknown; quotedPrice?: number }> | undefined)?.find(
        (row) => relId(row.vendor) === vendorId,
      )?.quotedPrice,
    ) ||
    0

  if (amount <= 0) {
    req.payload.logger.warn(
      `Skipped event_debt for conversation ${doc.id}: no quote/accepted amount available.`,
    )
    return doc
  }

  const feeRate = getPlatformFeeRate()
  const platformFee = Math.round(amount * feeRate * 100) / 100
  const coupleIds = extractCoupleIds(wedding.couple)
  const dueDate = wedding.weddingDate as string | undefined
  const budget =
    wedding.budget && typeof wedding.budget === 'object'
      ? (wedding.budget as { currency?: string })
      : undefined

  await req.payload.create({
    collection: 'payments',
    data: {
      kind: 'event_debt',
      status: 'due',
      title: `Confirmed booking — ${doc.subject || vendorId}`,
      wedding: weddingId,
      vendor: vendorId,
      conversation: doc.id,
      couple: coupleIds,
      currency: doc.activeQuote?.currency || budget?.currency || 'USD',
      amount,
      amountPaid: 0,
      amountDue: amount,
      platformFee,
      platformFeeRate: feeRate,
      vendorNet: Math.round((amount - platformFee) * 100) / 100,
      billingPeriod: billingPeriodFromDate(new Date()),
      dueDate,
      description: 'Marketplace debt created when the vendor event was confirmed.',
    },
    req,
  })

  return doc
}
