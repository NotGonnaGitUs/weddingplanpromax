import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Conversations } from './collections/Conversations'
import { Guests } from './collections/Guests'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { PackageTemplates } from './collections/PackageTemplates'
import { Payments } from './collections/Payments'
import { Users } from './collections/Users'
import { Vendors } from './collections/Vendors'
import { Weddings } from './collections/Weddings'
import { seedPackageTemplates } from './seed/seedPackageTemplates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function resolveDatabaseUri() {
  const raw = process.env.DATABASE_URI || `file:${path.resolve(dirname, '../data/marrymap.db')}`
  if (raw.startsWith('file:')) {
    const filePath = raw.slice('file:'.length)
    if (filePath.startsWith('./') || filePath.startsWith('../') || !path.isAbsolute(filePath)) {
      return `file:${path.resolve(dirname, '..', filePath)}`
    }
  }
  return raw
}

const databaseUri = resolveDatabaseUri()

const db = databaseUri.startsWith('file:') || databaseUri.startsWith('libsql:')
  ? sqliteAdapter({
      client: {
        url: databaseUri,
      },
    })
  : mongooseAdapter({
      url: databaseUri,
    })

/**
 * Marrymap Payload CMS config (`apps/cms`) — marketplace + couple planning core.
 * Defaults to SQLite for local demos; set DATABASE_URI=mongodb://... for MongoDB.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Vendors,
    Weddings,
    Guests,
    Conversations,
    Messages,
    Payments,
    Media,
    PackageTemplates,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  cors: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ],
  db,
  onInit: async (payload) => {
    if (process.env.SKIP_SEED === '1') return
    const count = await seedPackageTemplates(payload)
    payload.logger.info(`Seeded ${count} package-templates for the web demo`)
  },
})
