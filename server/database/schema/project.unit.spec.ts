import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

import { eq } from 'drizzle-orm'
import { afterAll, afterEach, expect, test } from 'vitest'

import { createDatabase } from '..'
import { user } from './auth'
import { project } from './project'

const databaseUrl = env.NUXT_DATABASE_URL

if (!databaseUrl) {
  throw new Error('NUXT_DATABASE_URL is required to run database tests')
}

const database = createDatabase(databaseUrl)
const email = `project-${randomUUID()}@example.com`
const ownerId = randomUUID()

afterEach(async () => {
  await database.delete(project).where(eq(project.ownerId, ownerId))
  await database.delete(user).where(eq(user.email, email))
})

afterAll(async () => {
  await database.$client.end()
})

async function createOwner() {
  await database.insert(user).values({
    id: ownerId,
    name: 'Project Owner',
    email
  })
}

test('stores a private project owned by a user', async () => {
  await createOwner()

  const [created] = await database
    .insert(project)
    .values({ ownerId, name: 'Confetti', prefix: 'CF' })
    .returning()

  if (!created) {
    throw new Error('Project was not returned after creation')
  }

  expect(created).toMatchObject({ ownerId, name: 'Confetti', prefix: 'CF' })
  expect(created.id).toBeTypeOf('string')
})

test('keeps prefixes unique within an owner', async () => {
  await createOwner()
  await database.insert(project).values({ ownerId, name: 'Confetti', prefix: 'CF' })

  await expect(
    database.insert(project).values({ ownerId, name: 'Another project', prefix: 'CF' })
  ).rejects.toThrow()
})

test('keeps an owner referenced by a project', async () => {
  await createOwner()
  await database.insert(project).values({ ownerId, name: 'Confetti', prefix: 'CF' })

  await expect(database.delete(user).where(eq(user.id, ownerId))).rejects.toThrow()
})

test.each([
  { name: ' ', prefix: 'CF' },
  { name: 'Confetti', prefix: 'confetti' }
])('rejects invalid project values', async (values) => {
  await createOwner()

  await expect(database.insert(project).values({ ownerId, ...values })).rejects.toThrow()
})
