import { z } from 'zod'

import { PROJECT_PREFIX_REGEX } from '../constants/project'

const projectNameSchema = z.string().trim().min(1).max(100)
const projectPrefixSchema = z.string().regex(PROJECT_PREFIX_REGEX)

export const createProjectSchema = z.strictObject({
  name: projectNameSchema,
  prefix: z.string().trim().toUpperCase().pipe(projectPrefixSchema)
})

export const projectResponseSchema = z.object({
  id: z.uuid(),
  name: projectNameSchema,
  prefix: projectPrefixSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
})

export type CreateProjectInput = z.output<typeof createProjectSchema>
export type ProjectResponse = z.output<typeof projectResponseSchema>
