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

  test('should have all navigation links visible', async ({ page }, testInfo) => {
  const isMobile = testInfo.project.name === 'mobile'
    if (isMobile) {
      await homePage.openMobileNavIfNeeded()
      await expect(homePage.navDrawer.getByRole('link', { name: 'Home' })).toBeVisible()
      await expect(homePage.navDrawer.getByRole('link', { name: 'Services' })).toBeVisible()
      await expect(homePage.navDrawer.getByRole('link', { name: 'Portfolio' })).toBeVisible()
      await expect(homePage.navDrawer.getByRole('link', { name: 'About' })).toBeVisible()
      await expect(homePage.navDrawer.getByRole('link', { name: 'Contact' })).toBeVisible()
    } else {
      await expect(homePage.navServices.first()).toBeVisible()
      await expect(homePage.navPortfolio.first()).toBeVisible()
      await expect(homePage.navAbout.first()).toBeVisible()
      await expect(homePage.navContact.first()).toBeVisible()
    }
    if (isMobile) {
      await expect(homePage.ctaButton).toBeVisible()
    } else {
      await expect(homePage.bookCallButton.filter({ hasText: 'Book a call' })).toBeVisible()
    }
  })
})
