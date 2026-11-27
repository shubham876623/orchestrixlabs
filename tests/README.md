# E2E Testing Suite

Comprehensive Playwright E2E tests for Orchestrix Labs website.

## Test Coverage

### Navigation Tests (`tests/e2e/navigation/pages.spec.ts`)
- ✅ Homepage loads successfully
- ✅ All navigation links work
- ✅ All pages load correctly (Services, Portfolio, About, Contact)

### Homepage Content Tests (`tests/e2e/features/homepage.spec.ts`)
- ✅ Hero section displays correct content
- ✅ 4-step workflow visible
- ✅ Case study cards render
- ✅ Founder section displays
- ✅ Paper theme colors are correct (#F8F9FA background)
- ✅ Cyan CTA buttons (#0891B2)

### Responsive Design Tests (`tests/e2e/features/responsive.spec.ts`)
- ✅ Mobile view (375x667)
- ✅ Tablet view (768x1024)
- ✅ Desktop view (1920x1080)

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### View test report
```bash
npm run test:e2e:report
```

### Run specific test file
```bash
npx playwright test tests/e2e/navigation/pages.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=mobile
```

## Test Structure

```
tests/
├── e2e/
│   ├── pages/
│   │   └── HomePage.ts          # Page Object Model
│   ├── navigation/
│   │   └── pages.spec.ts        # Navigation tests
│   └── features/
│       ├── homepage.spec.ts     # Homepage content tests
│       └── responsive.spec.ts   # Responsive design tests
└── README.md
```

## Page Object Model

The `HomePage` class (`tests/e2e/pages/HomePage.ts`) provides:
- Locators for all major UI elements
- Helper methods for navigation
- Color verification methods

## Artifacts

Test artifacts are saved to:
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: `playwright-report/screenshots/`
- **Videos**: `test-results/` (on failure)
- **Traces**: `test-results/` (on first retry)

## CI/CD Integration

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallel execution)
- Automatic artifact upload

## Configuration

See `playwright.config.ts` for:
- Base URL: `http://localhost:5174`
- Browsers: Chromium (desktop) + iPhone 12 (mobile)
- Timeouts: 10s action, 30s navigation
- Auto-start dev server if not running

## Flaky Test Management

If a test becomes flaky:

```typescript
test('flaky test', async ({ page }) => {
  test.fixme(true, 'Flaky - Issue #123')
  // test code...
})
```

Or skip in CI:

```typescript
test('conditional skip', async ({ page }) => {
  test.skip(process.env.CI, 'Flaky in CI - Issue #123')
  // test code...
})
```

## Best Practices

1. ✅ Always use Page Object Model
2. ✅ Wait for `networkidle` after navigation
3. ✅ Use `toBeVisible()` instead of checking counts
4. ✅ Take screenshots on important assertions
5. ✅ Test mobile + desktop views
6. ✅ Verify theme colors programmatically
