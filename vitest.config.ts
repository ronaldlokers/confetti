/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'vitest/config'

export default defineConfig(() => {
  const testEnv = parseEnv(readFileSync('.env.test', 'utf8'))
  const databaseUrl = testEnv.NUXT_DATABASE_URL

  if (!databaseUrl) {
    throw new Error('NUXT_DATABASE_URL is required for tests')
  }

  if (new URL(databaseUrl).pathname !== '/confetti_test') {
    throw new Error('Tests require the confetti_test database')
  }

  return {
    test: {
      env: testEnv,
      projects: [
        {
          test: {
            name: 'unit',
            include: ['**/*.unit.spec.ts'],
            environment: 'node'
          }
        },
        {
          test: {
            name: 'e2e',
            include: ['**/*.e2e.spec.ts'],
            environment: 'node'
          }
        }
      ]
    }
  }
})
