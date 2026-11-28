import { test, expect } from '@playwright/test'

test.describe('Contact — Find us map', () => {
  test('shows find-us section with map iframe', async ({ page }) => {
    await page.goto('/contact')
    const section = page.locator('#find-us')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { name: /find us/i })).toBeVisible()
    const iframe = section.locator('iframe[title*="Google Maps"]')
    await expect(iframe).toBeVisible()
    await expect(iframe).toHaveAttribute('loading', 'lazy')
  })

  test('footer address and Instagram use canonical URLs', async ({ page }) => {
    await page.goto('/')
    const addressLink = page.locator('footer a[href*="maps.google"]')
    await expect(addressLink).toBeVisible()
    await expect(addressLink).toContainText(/Mohali/)
    const instagram = page.locator('footer a[aria-label="Instagram"]')
    await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/orchestrixlabs')
  })
})