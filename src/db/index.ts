import * as dotenv from 'dotenv'
dotenv.config()

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

declare global {
  // eslint-disable-next-line no-var
  var __dbClient: postgres.Sql | undefined
}

const client =
  globalThis.__dbClient ||
  postgres(connectionString, {
    prepare: false,
    max: process.env.NODE_ENV === 'production' ? 10 : 3,
    idle_timeout: 15,
    connect_timeout: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__dbClient = client
}

export const db = drizzle(client, { schema })
export { schema }
