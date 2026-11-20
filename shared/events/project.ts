import { z } from 'zod'

import { createProjectSchema } from '../contracts/project'

export const projectCreatedEventSchema = z.strictObject({
  id: z.uuid(),
  type: z.literal('project.created'),
  version: z.literal(1),
  actorId: z.string().min(1),
  projectId: z.uuid(),
  aggregateType: z.literal('project'),
  aggregateId: z.uuid(),
  payload: createProjectSchema,
  occurredAt: z.date()
})

export type ProjectCreatedEvent = z.output<typeof projectCreatedEventSchema>
