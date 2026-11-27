import { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly logo: Locator
  readonly navHome: Locator
  readonly navServices: Locator
  readonly navPortfolio: Locator
  readonly navAbout: Locator
  readonly navContact: Locator
  readonly bookCallButton: Locator
  readonly heroHeading: Locator
  readonly ctaButton: Locator
  readonly workflowSteps: Locator
  readonly caseStudyCards: Locator

  constructor(page: Page) {
    this.page = page
    
    // Navigation - target nav element specifically
    const nav = page.locator('nav').first()
    this.logo = page.locator('a[href="/"]').first()
    this.navHome = nav.locator('a[href="/"]', { hasText: 'Home' })
    this.navServices = nav.locator('a[href="/services"]').first()
    this.navPortfolio = nav.locator('a[href="/portfolio"]').first()
    this.navAbout = nav.locator('a[href="/about"]').first()
    this.navContact = nav.locator('a[href="/contact"]').first()
    this.bookCallButton = page.locator('header a', { hasText: 'Book a call' }).first()
    
    // Hero Section
    this.heroHeading = page.locator('h1').first()
    this.ctaButton = page.locator('section').first().locator('a', { hasText: /Book a.*call/i }).first()
    
    // Content Sections
    this.workflowSteps = page.locator('text=/Discovery|Architecture|Development|Deploy/')
    this.caseStudyCards = page.locator('article')
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToServices() {
    await this.navServices.click()
    await this.page.waitForURL('**/services')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToPortfolio() {
    await this.navPortfolio.click()
    await this.page.waitForURL('**/portfolio')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToAbout() {
    await this.navAbout.click()
    await this.page.waitForURL('**/about')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToContact() {
    await this.navContact.click()
    await this.page.waitForURL('**/contact')
    await this.page.waitForLoadState('networkidle')
  }

  async getBackgroundColor() {
    return await this.page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })
  }

  async getHeadingColor() {
    return await this.heroHeading.evaluate((el) => {
      return window.getComputedStyle(el).color
    })
  }
}
