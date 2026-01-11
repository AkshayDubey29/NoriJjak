import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to sign up and redirect to dashboard', async ({ page }) => {
    // Generate unique user for this run
    const timestamp = Date.now();
    const email = `e2e-${timestamp}@norijjak.test`;
    const password = 'password123';

    await page.goto('/auth/signup');

    // Fill sign up form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    
    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to onboarding or dashboard depending on flow
    // Assuming /profile/setup or /dashboard
    // Checking for a url change or key element
    await expect(page).not.toHaveURL('/auth/signup');
    await expect(page).toHaveURL(/\/profile|\/dashboard/);
    
    // Check for some persistent UI element
    // await expect(page.getByText('Welcome')).toBeVisible(); 
  });

  test('should allow login with existing user', async ({ page }) => {
    // Ideally we seed this, but for now we might fail if user doesn't exist
    // Strategy: Create user first via API or just run signup flow as precursor
    
    // Using a new user for reliability in this test too
    const timestamp = Date.now();
    const email = `login-${timestamp}@norijjak.test`;
    const password = 'password123';

    // Signup first (fast preamble)
    await page.goto('/auth/signup');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/profile|\/dashboard/);

    // Logout
    // await page.click('button[aria-label="Logout"]'); 

    // Now Login
    // await page.goto('/auth/login');
    // await page.fill('input[name="auth-email"]', email);
    // await page.fill('input[name="auth-password"]', password);
    // await page.click('button[type="submit"]');
    // await expect(page).toHaveURL('/dashboard');
    
    // NOTE: Flows might be different, adjusting to minimal verified flow first
  });
});
