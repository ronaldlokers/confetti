import type { RequestEvent } from 'nuxt/server'
import { beforeEach, expect, test, vi } from 'vitest'
import { auth } from '../../lib/auth'
import { requireUser } from './require-user'

vi.mock('../../lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn()
    }
  }
}))

const getSession = vi.mocked(auth.api.getSession)
const headers = new Headers({ cookie: 'session=value' })
const event = {
  req: { headers }
} as unknown as RequestEvent

beforeEach(() => {
  getSession.mockReset()
})

test('rejects anonymous requests', async () => {
  getSession.mockResolvedValue(null)

  await expect(requireUser(event)).rejects.toMatchObject({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  })
})

test('returns the authenticated user', async () => {
  const user = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  getSession.mockResolvedValue({ user } as never)

  await expect(requireUser(event)).resolves.toEqual(user)
  expect(getSession).toHaveBeenCalledWith({ headers })
})
