import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config.js'
import { seedPackageTemplates } from '../seed/seedPackageTemplates.js'
import { seedSampleMarketplace } from '../seed/seedSampleMarketplace.js'

async function main() {
  process.env.SKIP_SEED = '1'
  const payload = await getPayload({ config })
  const count = await seedPackageTemplates(payload)
  payload.logger.info(`Upserted ${count} package-templates`)
  const marketplace = await seedSampleMarketplace(payload)
  payload.logger.info(
    `Upserted ${marketplace.users} vendor users and ${marketplace.vendors} marketplace vendors`,
  )
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
