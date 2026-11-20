export type DomainEvent<
  Type extends string = string,
  Version extends number = number,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = Readonly<{
  id: string
  type: Type
  version: Version
  actorId: string
  projectId: string
  aggregateType: string
  aggregateId: string
  payload: Payload
  occurredAt: Date
}>
