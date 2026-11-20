import { randomUUID } from 'node:crypto'
import { env } from 'node:process'

import { eq, sql } from 'drizzle-orm'
import { TransactionRollbackError } from 'drizzle-orm/errors'
import { afterAll, expect, test } from 'vitest'

import { createDatabase, type Database } from '../../database'
import { user } from '../../database/schema/auth'
import { domainEvent } from '../../database/schema/domain-event'
import { project } from '../../database/schema/project'
import { createProject } from './create-project'

const databaseUrl = env.NUXT_DATABASE_URL

if (!databaseUrl) {
  throw new Error('NUXT_DATABASE_URL is required to run database tests')
}

const database = createDatabase(databaseUrl)
type DatabaseTransaction = Parameters<Parameters<Database['transaction']>[0]>[0]

afterAll(async () => {
  await database.$client.end()
})

async function inRollbackTransaction(
  assertions: (transaction: DatabaseTransaction) => Promise<void>
) {
  try {
    await database.transaction(async (transaction) => {
      await assertions(transaction)
      transaction.rollback()
    })
  } catch (error) {
    if (error instanceof TransactionRollbackError) {
      return
    }

    throw error
  }

  throw new Error('Test transaction was not rolled back')
}

async function createActor(transaction: DatabaseTransaction) {
  const actorId = randomUUID()

  await transaction.insert(user).values({
    id: actorId,
    name: 'Project Owner',
    email: `project-${actorId}@example.com`
  })

  return actorId
}

test('creates a project and its event in one transaction', async () => {
  await inRollbackTransaction(async (transaction) => {
    const actorId = await createActor(transaction)
    const created = await createProject(transaction, actorId, {
      name: ' Confetti ',
      prefix: ' cf '
    })
    const [event] = await transaction
      .select()
      .from(domainEvent)
      .where(eq(domainEvent.projectId, created.id))

    expect(created).toMatchObject({ ownerId: actorId, name: 'Confetti', prefix: 'CF' })
    expect(event).toMatchObject({
      type: 'project.created',
      version: 1,
      actorId,
      projectId: created.id,
      aggregateType: 'project',
      aggregateId: created.id,
      payload: { name: 'Confetti', prefix: 'CF' }
    })
  })
})

test('rolls back the project when its event cannot be stored', async () => {
  await inRollbackTransaction(async (transaction) => {
    const actorId = await createActor(transaction)
    await transaction.execute(sql`
      alter table ${domainEvent}
      add constraint domain_event_reject_rolled_back_project
      check (${domainEvent.payload}->>'name' <> 'Rolled back')
    `)

    await expect(
      createProject(transaction, actorId, { name: 'Rolled back', prefix: 'RB' })
    ).rejects.toThrow()

    const createdProjects = await transaction
      .select()
      .from(project)
      .where(eq(project.prefix, 'RB'))

    expect(createdProjects).toEqual([])
  })
})
