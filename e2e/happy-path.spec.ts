import { expect, test, type Page } from '@playwright/test'

import { MOCK_AIR_QUALITY, MOCK_FORECAST, MOCK_GEOCODING } from './fixtures/openMeteo'

/** Dismiss the first-visit geolocation prompt when it appears. */
async function dismissLocationPromptIfPresent(page: Page) {
  const notNow = page.getByRole('button', { name: 'Not Now' })
  if (await notNow.isVisible().catch(() => false)) {
    await notNow.click()
  }
}

async function mockOpenMeteoApis(page: Page) {
  await page.route('**/geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_GEOCODING),
    })
  })

  await page.route('**/api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_FORECAST),
    })
  })

  await page.route('**/air-quality-api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_AIR_QUALITY),
    })
  })
}

test.describe('happy path', () => {
  test('search → forecast → favorite → favorites list', async ({ page }) => {
    await mockOpenMeteoApis(page)

    await page.goto('/app')
    await dismissLocationPromptIfPresent(page)

    await page.getByRole('button', { name: 'Search cities' }).click()
    await expect(page).toHaveURL(/\/app\/search/)

    await page.getByPlaceholder('Search for a city...').fill('London')
    await expect(page.getByRole('button', { name: /London/ })).toBeVisible()
    await page.getByRole('button', { name: /London/ }).click()

    await expect(page).toHaveURL(/\/app\/?$/)
    await dismissLocationPromptIfPresent(page)
    await expect(page.getByRole('heading', { name: 'London' })).toBeVisible()
    // Hero renders the number and degree glyph as sibling text nodes ("8" + "°").
    await expect(page.getByText('8', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Add to favorites' }).click()
    await expect(page.getByRole('button', { name: 'Remove from favorites' })).toBeVisible()

    await page.getByRole('link', { name: 'Favorites' }).click()
    await expect(page).toHaveURL(/\/app\/favorites/)
    await expect(page.getByText('London')).toBeVisible()
    await expect(page.getByText('No favorites yet')).toHaveCount(0)
  })
})
