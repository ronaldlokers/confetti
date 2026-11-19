import { randomUUID } from 'node:crypto'

import { describe, expect, test } from 'vitest'

import { createProjectSchema, projectResponseSchema } from './project'

describe('createProjectSchema', () => {
  test('normalizes valid project input', () => {
    expect(createProjectSchema.parse({ name: ' Confetti ', prefix: ' cf ' })).toEqual({
      name: 'Confetti',
      prefix: 'CF'
    })
  })

  test.each([
    { name: ' ', prefix: 'CF' },
    { name: 'C'.repeat(101), prefix: 'CF' },
    { name: 'Confetti', prefix: 'C' },
    { name: 'Confetti', prefix: '2CF' },
    { name: 'Confetti', prefix: 'CF-1' },
    { name: 'Confetti', prefix: 'ABCDEFGHIJK' }
  ])('rejects invalid project input', (input) => {
    expect(createProjectSchema.safeParse(input).success).toBe(false)
  })

  test('rejects ownership supplied by a client', () => {
    expect(
      createProjectSchema.safeParse({ name: 'Confetti', prefix: 'CF', ownerId: randomUUID() })
        .success
    ).toBe(false)
  })
})

test('defines the public project response', () => {
  const response = projectResponseSchema.parse({
    id: randomUUID(),
    ownerId: randomUUID(),
    name: 'Confetti',
    prefix: 'CF',
    createdAt: '2026-11-19T12:00:00.000Z',
    updatedAt: '2026-11-19T12:00:00.000Z'
  })

  expect(response).toEqual({
    id: expect.any(String),
    name: 'Confetti',
    prefix: 'CF',
    createdAt: '2026-11-19T12:00:00.000Z',
    updatedAt: '2026-11-19T12:00:00.000Z'
  })
})
