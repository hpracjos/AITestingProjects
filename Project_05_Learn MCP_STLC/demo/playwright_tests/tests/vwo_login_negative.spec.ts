import { test, expect } from '@playwright/test';

test.describe('VWO Negative Login Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Navigating to VWO Login page before each test
    await page.goto('https://app.vwo.com/#/login');
  });

  test('TC-001: Invalid Dummy Credentials Login', async ({ page }) => {
    await page.locator('#login-username').fill('invaliduser123@dummy.com');
    await page.locator('#login-password').fill('NotRealPassword!123');
    await page.locator('#js-login-btn').click();
    
    // Expecting the error text
    const errorMsg = page.locator('#js-notification-box-msg');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText(/email/i); 
  });

  test('TC-002: Blank Fields Submission', async ({ page }) => {
    // Leave fields blank and click login
    await page.locator('#js-login-btn').click();
    
    // Check if validation errors appear, or if JS notification box comes up
    const errorMsg = page.locator('#js-notification-box-msg');
    await expect(errorMsg).toBeVisible();
  });

  test('TC-003: Valid Email but Invalid Password', async ({ page }) => {
    await page.locator('#login-username').fill('contact@vwo.com');
    await page.locator('#login-password').fill('WrongPassword123');
    await page.locator('#js-login-btn').click();
    
    const errorMsg = page.locator('#js-notification-box-msg');
    await expect(errorMsg).toBeVisible();
  });

  test('TC-004: Invalid Login with Arabic Characters', async ({ page }) => {
    await page.locator('#login-username').fill('مرحبا@domain.com');
    await page.locator('#login-password').fill('password123');
    await page.locator('#js-login-btn').click();
    
    const errorMsg = page.locator('#js-notification-box-msg');
    await expect(errorMsg).toBeVisible();
  });

  test('TC-005: Invalid Login with Chinese Characters', async ({ page }) => {
    await page.locator('#login-username').fill('測試@domain.com');
    await page.locator('#login-password').fill('密碼123');
    await page.locator('#js-login-btn').click();
    
    const errorMsg = page.locator('#js-notification-box-msg');
    await expect(errorMsg).toBeVisible();
  });

});
