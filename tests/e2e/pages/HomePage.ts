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
  readonly navDrawer: Locator

  constructor(page: Page) {
    this.page = page

    this.logo = page.locator('a[href="/"]').first()
    this.navDrawer = page.getByRole('navigation', { name: 'Mobile' })
    this.navHome = page.locator('header a[href="/"]', { hasText: /^Home$/ })
    this.navServices = page.locator('header a[href="/services"]', { hasText: 'Services' })
    this.navPortfolio = page.locator('header a[href="/portfolio"]', { hasText: 'Portfolio' })
    this.navAbout = page.locator('header a[href="/about"]', { hasText: 'About' })
    this.navContact = page.locator('header a[href="/contact"]', { hasText: 'Contact' })
    this.bookCallButton = page.locator('header a[href="/book"]')
    
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

  /** Desktop nav is hidden below `md`; open the drawer so link locators work on mobile projects. */
  async openMobileNavIfNeeded() {
    const width = this.page.viewportSize()?.width ?? 1280
    if (width >= 768) return
    await this.page.getByRole('button', { name: /open menu/i }).click()
    await this.navDrawer.getByRole('link', { name: 'Services' }).waitFor({ state: 'visible' })
  }

  private async clickNavLink(name: string, href: string) {
    await this.openMobileNavIfNeeded()
    const width = this.page.viewportSize()?.width ?? 1280
    if (width < 768) {
      await this.navDrawer.getByRole('link', { name }).click()
      return
    }
    await this.page.locator(`header nav a[href="${href}"]`, { hasText: name }).click()
  }

  async navigateToServices() {
    await this.clickNavLink('Services', '/services')
    await this.page.waitForURL('**/services')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToPortfolio() {
    await this.clickNavLink('Portfolio', '/portfolio')
    await this.page.waitForURL('**/portfolio')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToAbout() {
    await this.clickNavLink('About', '/about')
    await this.page.waitForURL('**/about')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToContact() {
    await this.clickNavLink('Contact', '/contact')
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
