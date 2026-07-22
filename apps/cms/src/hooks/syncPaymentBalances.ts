import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { recalculateBalances, extractCoupleIds } from '../lib/balances'

function relId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id: string }).id)
  }
  return undefined
}

/**
 * Payload automation: whenever a payment is written, re-add vendor monthly
 * tallies and couple/wedding outstanding balances from payment rows.
 */
export const syncPaymentBalancesAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  if (context?.skipBalanceAutomation) return doc

  const vendorIds = new Set<string>()
  const coupleIds = new Set<string>()
  const weddingIds = new Set<string>()

  const vendorId = relId(doc.vendor)
  const weddingId = relId(doc.wedding)
  if (vendorId) vendorIds.add(vendorId)
  if (weddingId) weddingIds.add(weddingId)
  for (const id of extractCoupleIds(doc.couple)) coupleIds.add(id)

  if (previousDoc) {
    const prevVendor = relId(previousDoc.vendor)
    const prevWedding = relId(previousDoc.wedding)
    if (prevVendor) vendorIds.add(prevVendor)
    if (prevWedding) weddingIds.add(prevWedding)
    for (const id of extractCoupleIds(previousDoc.couple)) coupleIds.add(id)
  }

  for (const id of vendorIds) {
    await recalculateBalances({ payload: req.payload, req, vendorId: id })
  }
  for (const id of coupleIds) {
    await recalculateBalances({ payload: req.payload, req, coupleIds: [id] })
  }
  for (const id of weddingIds) {
    await recalculateBalances({ payload: req.payload, req, weddingId: id })
  }

  return doc
}

export const syncPaymentBalancesAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
  context,
}) => {
  if (context?.skipBalanceAutomation) return doc

  await recalculateBalances({
    payload: req.payload,
    req,
    vendorId: relId(doc.vendor),
    coupleIds: extractCoupleIds(doc.couple),
    weddingId: relId(doc.wedding),
  })

  return doc
}
