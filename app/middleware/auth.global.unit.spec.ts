import { beforeEach, expect, test, vi } from 'vitest'
import { authClient } from '../../lib/auth-client'

vi.mock('../../lib/auth-client', () => ({
  authClient: {
    useSession: vi.fn()
  }
}))

const navigateTo = vi.fn()
const useFetch = vi.fn()

vi.stubGlobal('defineNuxtRouteMiddleware', (middleware: unknown) => middleware)
vi.stubGlobal('navigateTo', navigateTo)
vi.stubGlobal('useFetch', useFetch)

const { default: authMiddleware } = await import('./auth.global')
const to = {
  path: '/',
  fullPath: '/'
} as Parameters<typeof authMiddleware>[0]
const from = {} as Parameters<typeof authMiddleware>[1]

beforeEach(() => {
  vi.mocked(authClient.useSession).mockReset()
  navigateTo.mockReset()
})

test('allows public navigation without loading a session', async () => {
  const publicRoute = {
    path: '/login',
    fullPath: '/login?redirect=/'
  } as Parameters<typeof authMiddleware>[0]

  await expect(authMiddleware(publicRoute, from)).resolves.toBeUndefined()
  expect(authClient.useSession).not.toHaveBeenCalled()
})

test('allows authenticated navigation', async () => {
  vi.mocked(authClient.useSession).mockReturnValue({
    data: { value: { user: { id: 'user-id' } } }
  } as never)

  await expect(authMiddleware(to, from)).resolves.toBeUndefined()
  expect(navigateTo).not.toHaveBeenCalled()
})

test('redirects anonymous navigation to login', async () => {
  vi.mocked(authClient.useSession).mockReturnValue({
    data: { value: null }
  } as never)

  await authMiddleware(to, from)

  expect(navigateTo).toHaveBeenCalledWith({
    path: '/login',
    query: { redirect: '/' }
  })
})
