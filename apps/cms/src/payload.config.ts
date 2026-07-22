import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Conversations } from './collections/Conversations'
import { Guests } from './collections/Guests'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { Payments } from './collections/Payments'
import { Users } from './collections/Users'
import { Vendors } from './collections/Vendors'
import { Weddings } from './collections/Weddings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Marrymap Payload CMS config (`apps/cms`) — marketplace + couple planning core.
 * Wire DATABASE_URI / PAYLOAD_SECRET via env when scaffolding the full app.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Vendors, Weddings, Guests, Conversations, Messages, Payments, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://127.0.0.1/marrymap',
  }),
})
