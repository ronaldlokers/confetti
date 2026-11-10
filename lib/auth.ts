import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { useDatabase } from '../server/database/index.ts'
import * as schema from '../server/database/schema.ts'

export const auth = betterAuth({
  database: drizzleAdapter(useDatabase(), {
    provider: 'pg',
    schema
  })
})
