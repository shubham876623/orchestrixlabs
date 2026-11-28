import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const homePage = new HomePage(page)
    await homePage.goto()
    
    // Check that content is visible
    await expect(homePage.heroHeading).toBeVisible({ timeout: 10000 })
    await expect(homePage.logo).toBeVisible()
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'playwright-report/screenshots/mobile-view.png',
      fullPage: true 
    })
  })

  test('should display correctly on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
    const homePage = new HomePage(page)
    await homePage.goto()
    
    await expect(homePage.heroHeading).toBeVisible()
    await expect(homePage.ctaButton).toBeVisible()
    
    // Take tablet screenshot
    await page.screenshot({ 
      path: 'playwright-report/screenshots/tablet-view.png',
      fullPage: true 
    })
  })

  test('should display correctly on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    const homePage = new HomePage(page)
    await homePage.goto()
    
    await expect(homePage.heroHeading).toBeVisible()
    await expect(homePage.workflowSteps.first()).toBeVisible()
    
    // Take desktop screenshot
    await page.screenshot({ 
      path: 'playwright-report/screenshots/desktop-view.png',
      fullPage: true 
    })
  })
})
