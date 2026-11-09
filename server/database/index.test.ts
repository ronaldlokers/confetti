import { env } from 'node:process'
import { sql } from 'drizzle-orm'
import { afterAll, expect, test } from 'vitest'
import { createDatabase } from './index'

const databaseUrl = env.NUXT_DATABASE_URL

if (!databaseUrl) {
  throw new Error('NUXT_DATABASE_URL is required to run database tests')
}

const database = createDatabase(databaseUrl)

afterAll(async () => {
  await database.$client.end()
})

test('requires a database URL', () => {
  expect(() => createDatabase('')).toThrow(
    'NUXT_DATABASE_URL is required'
  )
})

test('connects to PostgreSQL', async () => {
  const result = await database.execute(
    sql<{ value: number }>`SELECT 1 AS value`
  )

  expect(result.rows).toEqual([{ value: 1 }])
})
