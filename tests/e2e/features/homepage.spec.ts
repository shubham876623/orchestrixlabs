import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage'

test.describe('Homepage Content', () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goto()
  })

  test('should display hero section with correct content', async ({ page }) => {
    await expect(homePage.heroHeading).toContainText('AI integrations')
    await expect(homePage.heroHeading).toContainText('production')
    await expect(homePage.ctaButton).toBeVisible()
    await expect(homePage.ctaButton).toContainText(/Book/)
    
    // Take screenshot of hero section
    await page.screenshot({ 
      path: 'playwright-report/screenshots/hero-section.png',
      fullPage: false 
    })
  })

  test('should display 4-step workflow', async ({ page }) => {
    // Check all 4 workflow steps are visible in the workflow section
    await expect(page.locator('text=Discovery').first()).toBeVisible()
    await expect(page.locator('text=Architecture').first()).toBeVisible()
    await expect(page.locator('text=Development').first()).toBeVisible()
    await expect(page.locator('text=Deploy').first()).toBeVisible()
  })

  test('should display case study cards', async ({ page }) => {
    // Scroll to case studies section
    await page.locator('text=/Case Studies|Recent Work/i').scrollIntoViewIfNeeded()
    
    // Check that at least 1 case study card is visible
    const cardCount = await homePage.caseStudyCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should display founder section', async ({ page }) => {
    // Scroll to founder section
    await page.locator('text=/Founder|CEO|Shubham/i').first().scrollIntoViewIfNeeded()
    
    await expect(page.locator('text=Shubham Saini')).toBeVisible()
    await expect(page.locator('text=Founder & CEO')).toBeVisible()
  })

  test('should have correct paper theme colors', async ({ page }) => {
    const bgColor = await homePage.getBackgroundColor()
    
    // Paper background should be rgb(248, 249, 250) which is #F8F9FA
    expect(bgColor).toBe('rgb(248, 249, 250)')
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'playwright-report/screenshots/theme-colors.png',
      fullPage: true 
    })
  })

  test('CTA buttons should have cyan color', async ({ page }) => {
    const buttonColor = await homePage.ctaButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // Primary buttons use cyan-hover (#0E7490 → rgb(14, 116, 144))
    expect(buttonColor).toBe('rgb(14, 116, 144)')
  })
})
