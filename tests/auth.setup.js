const { test: setup } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { LoginPage } = require('../pages/LoginPage');
const { LOGIN_EMAIL, LOGIN_PASSWORD } = require('../utils/env');

const authFile = path.join(__dirname, '..', 'playwright', '.auth', 'user.json');

// Runs once; all other tests reuse this session via storageState instead of logging in per test.
setup('authenticate once and persist session', async ({ page }) => {
  // Generous headroom: a single failed/slow cold start here would fail every dependent test.
  setup.setTimeout(180_000);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(LOGIN_EMAIL, LOGIN_PASSWORD);
  await loginPage.expectLoggedIn();

  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
