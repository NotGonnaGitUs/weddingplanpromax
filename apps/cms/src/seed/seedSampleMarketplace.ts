import type { Payload } from 'payload'

import { sampleUsers, sampleVendors } from './sampleData.js'

type IdMap = Map<string, number | string>

/** Upsert marketplace vendor accounts + active published listings from sampleData. */
export async function seedSampleMarketplace(
  payload: Payload,
): Promise<{ users: number; vendors: number }> {
  const userIds: IdMap = new Map()
  const vendorDocIds: IdMap = new Map()
  let usersWritten = 0
  let vendorsWritten = 0

  const vendorUsers = sampleUsers.filter((u) => u.role === 'vendor')

  for (const user of vendorUsers) {
    const data = {
      email: user.email,
      password: user.password,
      role: user.role,
      displayName: user.displayName,
      phone: user.phone,
      onboardingStatus: user.onboardingStatus,
      accountProgress: user.accountProgress,
      vendorAccount: user.vendorAccount
        ? { businessRole: user.vendorAccount.businessRole || 'owner' }
        : undefined,
    }

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: user.email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        })
      : await payload.create({
          collection: 'users',
          data,
          overrideAccess: true,
        })

    userIds.set(user.id, doc.id)
    usersWritten += 1
  }

  const activeVendors = sampleVendors.filter(
    (v) => v.isActive !== false && v._status !== 'draft',
  )

  for (const vendor of activeVendors) {
    const ownerId = userIds.get(String(vendor.owner))
    if (ownerId == null) {
      payload.logger.warn(`Skipping vendor ${vendor.slug}: owner not seeded`)
      continue
    }

    const {
      id: _placeholderId,
      image: _image,
      gallery: _gallery,
      owner: _owner,
      ...rest
    } = vendor

    const data = {
      ...rest,
      owner: ownerId,
    }

    const existing = await payload.find({
      collection: 'vendors',
      where: { slug: { equals: vendor.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      draft: true,
    })

    const doc = existing.docs[0]
      ? await payload.update({
          collection: 'vendors',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
          draft: false,
        })
      : await payload.create({
          collection: 'vendors',
          data,
          overrideAccess: true,
          draft: false,
        })

    vendorDocIds.set(vendor.id, doc.id)
    vendorsWritten += 1
  }

  for (const user of vendorUsers) {
    const listingPlaceholder = user.vendorAccount?.vendorListing
    if (!listingPlaceholder) continue

    const userId = userIds.get(user.id)
    const listingId = vendorDocIds.get(String(listingPlaceholder))
    if (userId == null || listingId == null) continue

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        vendorAccount: {
          vendorListing: listingId,
          businessRole: user.vendorAccount?.businessRole || 'owner',
        },
      },
      overrideAccess: true,
    })
  }

  return { users: usersWritten, vendors: vendorsWritten }
}
