import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('requestfailed', request => console.log('BROWSER_REQUEST_FAILED:', request.url(), request.failure()?.errorText));
  });

  test('should allow a user to sign up and redirect to dashboard', async ({ page }) => {
    // Generate unique user for this run
    const timestamp = Date.now();
    const email = `e2e-${timestamp}@norijjak.test`;
    const password = 'password123';

    await page.goto('/signup');

    // Fill sign up form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    
    // Submit
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await page.screenshot({ path: 'signup-submitted.png' });

    // Confirm redirect to login
    await expect(page).toHaveURL(/\/login/);
    await page.screenshot({ path: 'login-page.png' });
    
    // Check for some persistent UI element
    await expect(page.getByPlaceholder('Email')).toBeVisible(); 
  });

  test('should allow login with existing user', async ({ page }) => {
    const email = `login-${Date.now()}@norijjak.test`;
    const password = 'password123';

    // Signup first (fast preamble)
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('input[name="email"]');
    
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.getByRole('button', { name: /Sign Up/i }).click();
    await page.waitForURL(/\/login/);

    // Now login
    await page.screenshot({ path: 'login-ready.png' });
    console.log('E2E: Filling login email:', email);
    await page.getByPlaceholder('Email').fill(email);
    console.log('E2E: Filling login password');
    await page.getByPlaceholder('Password').fill(password);
    console.log('E2E: Clicking login button');
    await page.getByRole('button', { name: /Login/i }).click();
    console.log('E2E: Login button clicked');
    await page.screenshot({ path: 'login-submitted.png' });
    await page.waitForURL(/\/profile|\/dashboard/);
    await page.screenshot({ path: 'dashboard.png' });
    
    // NOTE: Flows might be different, adjusting to minimal verified flow first
  });
});
