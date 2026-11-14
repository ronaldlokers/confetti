import { authClient } from '../../lib/auth-client'

export default defineNuxtRouteMiddleware(async (to) => {
  if (['/login', '/register'].includes(to.path)) return

  const { data: session } = await authClient.useSession(useFetch)
  if (!session.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
