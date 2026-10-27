const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD } = require('../utils/env');

test.describe('Login', () => {
  // Override the project's shared storageState so this spec always starts unauthenticated.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('user can authenticate and reach the dashboard via the dynamically detected login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Launch the application', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(BASE_URL);
    });

    const authPath = await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);

    // Record which path was used without logging any credentials/tokens.
    test.info().annotations.push({ type: 'auth-path', description: authPath });

    await loginPage.expectLoggedIn();
  });
});
