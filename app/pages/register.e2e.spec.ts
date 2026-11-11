/// <reference types="node" />
import { randomUUID } from 'node:crypto'
import { env } from 'node:process'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { eq } from 'drizzle-orm'
import { afterAll, afterEach, describe, expect, test } from 'vitest'
import { createDatabase } from '../../server/database'
import { user } from '../../server/database/schema'

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

describe('registration page', async () => {
  await setup({
    browser: true
  })

  test('validates the registration form', async () => {
    const page = await createPage('/register')

    await page.getByRole('button', {
      name: 'Create account'
    }).click()

    await expect.poll(
      () => page.getByText('Enter your name.').isVisible()
    ).toBe(true)

    await expect.poll(
      () => page.getByText('Enter a valid email address.').isVisible()
    ).toBe(true)

    await expect.poll(
      () => page.getByText('Use at least 8 characters.').isVisible()
    ).toBe(true)
  })

  test('registers and starts a session', async () => {
    const page = await createPage('/register')
    const name = 'Confetti Tester'
    const email = `${randomUUID()}@example.com`
    registeredEmail = email

    await page.getByLabel('Name').fill(name)
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill('confetti-test-password')

    await page.getByRole('button', {
      name: 'Create account'
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
  })

  test('shows a generic error for an existing email address', async () => {
    const page = await createPage('/register')
    const email = `${randomUUID()}@example.com`
    registeredEmail = email

    await page.getByLabel('Name').fill('Confetti Tester')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill('confetti-test-password')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect.poll(
      () => new URL(page.url()).pathname
    ).toBe('/')

    await page.goto(new URL('/register', page.url()).href)
    await page.getByLabel('Name').fill('Another Tester')
    await page.getByLabel('Email address').fill(email)
    await page.getByLabel('Password').fill('another-test-password')
    await page.getByRole('button', { name: 'Create account' }).click()

    await expect.poll(
      () => page.getByRole('alert').textContent()
    ).toContain('We couldn\'t create your account.')
  })
})
