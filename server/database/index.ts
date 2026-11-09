import { drizzle } from 'drizzle-orm/node-postgres'

let database: ReturnType<typeof drizzle> | undefined

export function createDatabase(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error('NUXT_DATABASE_URL is required')
  }

  return drizzle(databaseUrl)
}

export function useDatabase() {
  if (database) {
    return database
  }

  database = createDatabase(useRuntimeConfig().databaseUrl)

  return database
}
