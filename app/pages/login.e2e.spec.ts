import { randomUUID } from 'node:crypto'
import { env } from 'node:process'
import { $fetch, createPage, setup } from '@nuxt/test-utils/e2e'
import { eq } from 'drizzle-orm'
import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { createDatabase } from '../../server/database'
import { user } from '../../server/database/schema/auth'

const databaseUrl = env.NUXT_DATABASE_URL

if (!databaseUrl) {
  throw new Error('NUXT_DATABASE_URL is required for E2E tests')
}

if (new URL(databaseUrl).pathname !== '/confetti_test') {
  throw new Error('E2E tests require the confetti_test database')
}

const database = createDatabase(databaseUrl)
let registeredEmail: string | undefined

afterEach(async () => {
  const email = registeredEmail
  registeredEmail = undefined

  if (email) {
    await database.delete(user).where(eq(user.email, email))
  }
})

afterAll(async () => {
  await database.$client.end()
})

describe('login page', async () => {
  await setup({
    browser: true
  })

  test('validates the login form', async () => {
    const page = await createPage('/login')

    await page.getByRole('button', {
      name: 'Log in'
    }).click()

    await expect.poll(
      () => page.getByText('Enter a valid email address.').isVisible()
    ).toBe(true)

    await expect.poll(
      () => page.getByText('Use at least 8 characters.').isVisible()
    ).toBe(true)
  })

  test('shows a generic error for invalid credentials', async () => {
    const page = await createPage('/login')

    await page.getByLabel('Email address').fill(`${randomUUID()}@example.com`)
    await page.getByLabel('Password').fill('incorrect-password')
    await page.getByRole('button', { name: 'Log in' }).click()

    await expect.poll(
      () => page.getByRole('alert').textContent()
    ).toContain('Incorrect email address or password.')

    expect(new URL(page.url()).pathname).toBe('/login')
  })

  test('logs in and starts a session', async () => {
    const page = await createPage('/login')
    const name = 'Confetti User'
    const email = `${randomUUID()}@example.com`
    const password = 'confetti-test-password'
    registeredEmail = email

    await $fetch('/api/auth/sign-up/email', {
      method: 'POST',
      body: {
        name,
        email,
        password
      }
    })

    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill(password)

    await page.getByRole('button', {
      name: 'Log in'
    }).click()

    await expect.poll(
      () => new URL(page.url()).pathname
    ).toBe('/')

    const session = await page.evaluate(async () => {
      const response = await fetch('/api/auth/get-session')
      return response.json()
    })

    expect(session).toMatchObject({
      user: {
        name,
        email
      }
    })

    await page.getByRole('button', { name: 'Open navigation' }).click()

    await expect.poll(
      () => page.getByRole('button', { name: 'Log out' }).isVisible()
    ).toBe(true)

    await page.getByRole('button', { name: 'Log out' }).click()

    await expect.poll(async () => {
      return page.evaluate(async () => {
        const response = await fetch('/api/auth/get-session')
        return response.json()
      })
    }).toBeNull()

    await expect.poll(() => new URL(page.url()).pathname).toBe('/login')

    await page.getByRole('button', { name: 'Open navigation' }).click()

    await expect.poll(
      () => page.getByRole('link', { name: 'Log in' }).isVisible()
    ).toBe(true)
  })
})
