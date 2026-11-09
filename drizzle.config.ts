/// <reference types="node" />
import { env } from 'node:process'
import { defineConfig } from 'drizzle-kit'

const url = env.NUXT_DATABASE_URL

if (!url) {
  throw new Error('NUXT_DATABASE_URL is required')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url
  }
})
