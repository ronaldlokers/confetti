import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

import { eq, sql } from 'drizzle-orm'
import { afterAll, afterEach, beforeEach, expect, test } from 'vitest'

import { createDatabase } from '..'
import { user } from './auth'
import { domainEvent } from './domain-event'
import { project } from './project'

const databaseUrl = env.NUXT_DATABASE_URL

if (!databaseUrl) {
  throw new Error('NUXT_DATABASE_URL is required to run database tests')
}

const database = createDatabase(databaseUrl)
const actorId = randomUUID()
const email = `event-${randomUUID()}@example.com`
let projectId: string

beforeEach(async () => {
  await database.insert(user).values({ id: actorId, name: 'Event Actor', email })

  const [createdProject] = await database
    .insert(project)
    .values({ ownerId: actorId, name: 'Confetti', prefix: 'CF' })
    .returning({ id: project.id })

  if (!createdProject) {
    throw new Error('Project was not returned after creation')
  }

  projectId = createdProject.id
})

afterEach(async () => {
  // shortcut: TRUNCATE bypasses the trigger; use isolated schemas before event tests run in parallel.
  await database.execute(sql`truncate table ${domainEvent}`)
  await database.delete(project).where(eq(project.id, projectId))
  await database.delete(user).where(eq(user.id, actorId))
})

afterAll(async () => {
  await database.$client.end()
})

async function createEvent() {
  const [created] = await database
    .insert(domainEvent)
    .values({
      type: 'project.created',
      version: 1,
      actorId,
      projectId,
      aggregateType: 'project',
      aggregateId: projectId,
      payload: { name: 'Confetti' }
    })
    .returning()

  if (!created) {
    throw new Error('Domain event was not returned after creation')
  }

  return created
}

test('stores a typed domain event', async () => {
  const created = await createEvent()

  expect(created).toMatchObject({
    type: 'project.created',
    version: 1,
    actorId,
    projectId,
    aggregateType: 'project',
    aggregateId: projectId,
    payload: { name: 'Confetti' }
  })
  expect(created.id).toBeTypeOf('string')
  expect(created.occurredAt).toBeInstanceOf(Date)
})

test('rejects changes to stored domain events', async () => {
  const created = await createEvent()
  const immutableError = {
    cause: expect.objectContaining({ message: expect.stringContaining('domain events are immutable') })
  }

  await expect(
    database.update(domainEvent).set({ version: 2 }).where(eq(domainEvent.id, created.id))
  ).rejects.toMatchObject(immutableError)

  await expect(database.delete(domainEvent).where(eq(domainEvent.id, created.id))).rejects.toMatchObject(
    immutableError
  )
})

test.each([
  { type: ' ', version: 1, aggregateType: 'project', aggregateId: 'aggregate-id' },
  { type: 'project.created', version: 0, aggregateType: 'project', aggregateId: 'aggregate-id' },
  { type: 'project.created', version: 1, aggregateType: ' ', aggregateId: 'aggregate-id' },
  { type: 'project.created', version: 1, aggregateType: 'project', aggregateId: ' ' }
])('rejects invalid domain events', async (values) => {
  await expect(
    database.insert(domainEvent).values({
      actorId,
      projectId,
      payload: {},
      ...values
    })
  ).rejects.toThrow()
})
