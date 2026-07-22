import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config.js'
import { seedPackageTemplates } from '../seed/seedPackageTemplates.js'

async function main() {
  process.env.SKIP_SEED = '1'
  const payload = await getPayload({ config })
  const count = await seedPackageTemplates(payload)
  payload.logger.info(`Upserted ${count} package-templates`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
