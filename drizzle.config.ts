/// <reference types="node" />
import { defineConfig } from 'drizzle-kit'
import { existsSync } from 'node:fs'
import { env, loadEnvFile } from 'node:process'

if (existsSync('.env')) {
  loadEnvFile()
}

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
