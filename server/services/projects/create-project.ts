import { randomUUID } from 'node:crypto'

import type { Database } from '../../database'
import type { CreateProjectInput } from '../../../shared/contracts/project'
import { createProjectSchema } from '../../../shared/contracts/project'
import { projectCreatedEventSchema } from '../../../shared/events/project'
import { domainEvent } from '../../database/schema/domain-event'
import { project } from '../../database/schema/project'

type TransactionalDatabase = Pick<Database, 'transaction'>

export async function createProject(
  database: TransactionalDatabase,
  actorId: string,
  input: CreateProjectInput
) {
  const values = createProjectSchema.parse(input)

  return database.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(project)
      .values({ ownerId: actorId, ...values })
      .returning()

    if (!created) {
      throw new Error('Project was not returned after creation')
    }

    const event = projectCreatedEventSchema.parse({
      id: randomUUID(),
      type: 'project.created',
      version: 1,
      actorId,
      projectId: created.id,
      aggregateType: 'project',
      aggregateId: created.id,
      payload: values,
      occurredAt: new Date()
    })

    await transaction.insert(domainEvent).values(event)

    return created
  })
}
