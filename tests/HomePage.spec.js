const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');

test.describe('Home / Dashboard', () => {
  let loginPage;
  let homePage;

  // Already authenticated via the shared storageState (see tests/auth.setup.js).
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto('/dashboard');
    await homePage.expectLoaded();
  });

  test('dashboard shows key navigation and summary widgets', async ({ page }) => {
    await homePage.expectLoaded();
    await expect(homePage.nav).toBeVisible();
    await expect(page.getByRole('button', { name: /^Workspaces/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Reports/ })).toBeVisible();
  });

  test('user can log out', async () => {
    await homePage.logout();
    await loginPage.expectOnLoginPage();
  });
});
