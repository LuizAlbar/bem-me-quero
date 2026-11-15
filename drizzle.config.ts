import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
})
