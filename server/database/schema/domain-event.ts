import { relations, sql } from 'drizzle-orm'
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import type { DomainEvent } from '../../../shared/events/domain-event'
import { user } from './auth'
import { project } from './project'

export const domainEvent = pgTable(
  'domain_event',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: text('type').notNull(),
    version: integer('version').notNull(),
    actorId: text('actor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'restrict' }),
    aggregateType: text('aggregate_type').notNull(),
    aggregateId: text('aggregate_id').notNull(),
    payload: jsonb('payload').$type<DomainEvent['payload']>().notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull()
  },
  table => [
    index('domain_event_project_occurred_at_idx').on(table.projectId, table.occurredAt),
    index('domain_event_aggregate_occurred_at_idx').on(
      table.projectId,
      table.aggregateType,
      table.aggregateId,
      table.occurredAt
    ),
    check('domain_event_type_not_blank', sql`length(trim(${table.type})) > 0`),
    check('domain_event_version_positive', sql`${table.version} > 0`),
    check(
      'domain_event_aggregate_type_not_blank',
      sql`length(trim(${table.aggregateType})) > 0`
    ),
    check('domain_event_aggregate_id_not_blank', sql`length(trim(${table.aggregateId})) > 0`),
    check('domain_event_payload_is_object', sql`jsonb_typeof(${table.payload}) = 'object'`)
  ]
)

export const domainEventRelations = relations(domainEvent, ({ one }) => ({
  actor: one(user, {
    fields: [domainEvent.actorId],
    references: [user.id]
  }),
  project: one(project, {
    fields: [domainEvent.projectId],
    references: [project.id]
  })
}))
