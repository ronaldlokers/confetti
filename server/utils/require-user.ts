import { createError, type RequestEvent } from 'nuxt/server'
import { auth } from '../../lib/auth'

export async function requireUser(event: RequestEvent) {
  const session = await auth.api.getSession({ headers: event.req.headers })

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return session.user
}
