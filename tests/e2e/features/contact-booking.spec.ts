import { test, expect } from '@playwright/test'

test.describe('Book — Cal.com scheduling', () => {
  test('dedicated /book page shows Cal embed', async ({ page }) => {
    await page.goto('/book')
    await expect(page).toHaveURL(/\/book/)
    const section = page.locator('#book')
    await expect(section).toBeVisible()
    const iframe = section.locator('iframe[title*="Cal"]')
    await expect(iframe).toBeVisible()
    await expect(iframe).toHaveAttribute('loading', 'lazy')
    const src = await iframe.getAttribute('src')
    expect(src).toContain('cal.com')
    expect(src).toContain('embed=true')
  })

  test('nav Book a call goes to /book not contact', async ({ page }) => {
    await page.goto('/')
    const width = page.viewportSize()?.width ?? 1280
    if (width < 768) {
      await page.getByRole('button', { name: /open menu/i }).click()
      await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Book a call' }).click()
    } else {
      await page.locator('header a[href="/book"]').click()
    }
    await expect(page).toHaveURL(/\/book$/)
    await expect(page.locator('#book')).toBeVisible()
  })

  test('book page shows secure meeting embed when configured', async ({ page }) => {
    await page.goto('/book')
    const secure = page.locator('#book-secure')
    await expect(secure).toBeVisible()
    await expect(secure.getByRole('heading', { name: /confidential meeting/i })).toBeVisible()
    const iframe = secure.locator('iframe[title*="Cal"]')
    await expect(iframe).toBeVisible()
    const src = await iframe.getAttribute('src')
    expect(src).toContain('secret')
  })

  test('contact page has form before find-us map', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('#find-us')).toBeVisible()
    await expect(page.locator('#book')).toHaveCount(0)
    const formBeforeMap = await page.evaluate(() => {
      const form = document.querySelector('form')
      const findUs = document.getElementById('find-us')
      if (!form || !findUs) return false
      return Boolean(form.compareDocumentPosition(findUs) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    expect(formBeforeMap).toBe(true)
  })
})