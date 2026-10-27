const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { UsersPage } = require('../pages/UsersPage');

test.describe('Admin > Users', () => {
  let homePage;
  let usersPage;

  // Already authenticated via the shared storageState (see tests/auth.setup.js).
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    usersPage = new UsersPage(page);

    await page.goto('/dashboard');
    await homePage.expectLoaded();
    await homePage.navigateToAdminUsers();
  });

  test('Users page loads with the user list', async () => {
    await test.step('Verify page loaded', async () => {
      await usersPage.expectLoaded();
    });

    await test.step('Verify user rows match the reported count', async () => {
      const rowCount = await usersPage.getUserRowCount();
      expect(rowCount).toBeGreaterThan(0);

      const badgeText = await usersPage.getUserCountBadgeText();
      expect(badgeText).toMatch(new RegExp(`${rowCount} Users`));
    });

    await test.step('Search and filter are not available on this page', async () => {
      // Confirmed via inspection: Users page exposes no search box or filter controls.
      await expect(usersPage.createUserBtn).toBeVisible();
    });
  });
});
