import type { Payload } from 'payload'

import { packageTemplateSeeds } from './packageTemplates.js'

/** Upsert demo packages so the web app always has CMS-backed seeds. */
export async function seedPackageTemplates(payload: Payload): Promise<number> {
  let written = 0

  for (const seed of packageTemplateSeeds) {
    const existing = await payload.find({
      collection: 'package-templates',
      where: { key: { equals: seed.key } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'package-templates',
        id: existing.docs[0].id,
        data: seed,
        overrideAccess: true,
      })
    } else {
      await payload.create({
        collection: 'package-templates',
        data: seed,
        overrideAccess: true,
      })
    }

    written += 1
  }

  return written
}
