import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, test } from 'vitest'

describe('application header', async () => {
  await setup({
    browser: true
  })

  test('opens the navigation and changes color mode', async () => {
    const page = await createPage('/')
    const wasDark = await page.locator('html').evaluate(
      element => element.classList.contains('dark')
    )

    await page.keyboard.press('j')
    await expect.poll(
      () => page.getByRole('link', { name: 'Home' }).isVisible()
    ).toBe(true)
    await page.getByRole('button', {
      name: wasDark ? 'Use light mode' : 'Use dark mode'
    }).click()

    await expect.poll(
      () => page.locator('html').evaluate(
        element => element.classList.contains('dark')
      )
    ).toBe(!wasDark)
  })

  test('filters navigation items', async () => {
    const page = await createPage('/')

    await page.keyboard.press('j')
    await page.getByPlaceholder('Filter navigation').fill('log')

    await expect.poll(
      () => page.getByRole('link', { name: 'Log in' }).isVisible()
    ).toBe(true)
    await expect.poll(
      () => page.getByRole('link', { name: 'Home' }).isVisible()
    ).toBe(false)
  })
})
