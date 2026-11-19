import { relations, sql } from 'drizzle-orm'
import { check, index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'

import { PROJECT_PREFIX_REGEX } from '../../../shared/constants/project'
import { user } from './auth'

export const project = pgTable(
  'project',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 100 }).notNull(),
    prefix: varchar('prefix', { length: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    index('project_owner_id_idx').on(table.ownerId),
    uniqueIndex('project_owner_id_prefix_unique').on(table.ownerId, table.prefix),
    check('project_name_not_blank', sql`length(trim(${table.name})) > 0`),
    check(
      'project_prefix_format',
      sql`${table.prefix} ~ ${sql.raw(`'${PROJECT_PREFIX_REGEX.source}'`)}`
    )
  ]
)

export const projectRelations = relations(project, ({ one }) => ({
  owner: one(user, {
    fields: [project.ownerId],
    references: [user.id]
  })
}))
