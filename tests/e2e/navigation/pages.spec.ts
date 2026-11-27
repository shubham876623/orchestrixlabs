import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('Page Navigation', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Orchestrix Labs/)
    await expect(homePage.heroHeading).toBeVisible()
    await expect(homePage.heroHeading).toContainText(/AI integrations/)
  })

  test('should navigate to Services page', async ({ page }) => {
    await homePage.navigateToServices()
    await expect(page).toHaveURL(/\/services/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to Portfolio page', async ({ page }) => {
    await homePage.navigateToPortfolio()
    await expect(page).toHaveURL(/\/portfolio/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to About page', async ({ page }) => {
    await homePage.navigateToAbout()
    await expect(page).toHaveURL(/\/about/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to Contact page', async ({ page }) => {
    await homePage.navigateToContact()
    await expect(page).toHaveURL(/\/contact/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have all navigation links visible', async () => {
    await expect(homePage.navHome).toBeVisible()
    await expect(homePage.navServices).toBeVisible()
    await expect(homePage.navPortfolio).toBeVisible()
    await expect(homePage.navAbout).toBeVisible()
    await expect(homePage.navContact).toBeVisible()
    await expect(homePage.bookCallButton).toBeVisible()
  })
})
