import { expect, test, type Page } from '@playwright/test'

/** Dismiss the first-visit geolocation prompt when it appears. */
async function dismissLocationPromptIfPresent(page: Page) {
  const notNow = page.getByRole('button', { name: 'Not Now' })
  if (await notNow.isVisible().catch(() => false)) {
    await notNow.click()
  }
}

test.describe('smoke', () => {
  test('landing links to the app and engineering review', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Weather Forecast Application' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Application' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Engineering Review' })).toBeVisible()
  })

  test('opens the weather app from landing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'View Application' }).click()

    await expect(page).toHaveURL(/\/app\/?$/)
    await dismissLocationPromptIfPresent(page)
    await expect(page.getByText('No location selected')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search cities' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
  })

  test('opens engineering review and shows hero CTAs', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'View Engineering Review' }).click()

    await expect(page).toHaveURL(/\/artifacts\/?$/)
    await expect(page.getByRole('heading', { name: 'Weather App by Esmeralda' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Launch Application' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'GitHub Repository' }).first()).toBeVisible()
  })

  test('hero launch application navigates to the app', async ({ page }) => {
    await page.goto('/artifacts')

    await page.getByRole('button', { name: 'Launch Application' }).first().click()
    await expect(page).toHaveURL(/\/app\/?$/)
    await dismissLocationPromptIfPresent(page)
    await expect(page.getByText('No location selected')).toBeVisible()
  })

  test('artifacts navigation reaches starting point section', async ({ page }) => {
    await page.goto('/artifacts')

    const startingPoint = page.getByRole('button', { name: 'Starting Point' }).first()
    if (!(await startingPoint.isVisible())) {
      await page.getByRole('button', { name: 'Open navigation menu' }).click()
    }

    await page.getByRole('button', { name: 'Starting Point' }).first().click()
    await expect(page.locator('#uncertainty')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Starting Point' })).toBeVisible()
  })
})
