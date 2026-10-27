const { test } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { ModulePage } = require('../pages/ModulePage');
const MODULES = require('../utils/modules');

// One describe block per module so Allure results are grouped/recorded by module name.
for (const [moduleName, config] of Object.entries(MODULES)) {
  test.describe(moduleName, () => {
    let modulePage;

    // Already authenticated via the shared storageState (see tests/auth.setup.js).
    test.beforeEach(async ({ page }) => {
      const homePage = new HomePage(page);
      await page.goto('/dashboard');
      await homePage.expectLoaded();

      modulePage = new ModulePage(page, homePage, moduleName, config);
      await modulePage.navigate();
    });

    test(`${moduleName}: navigates and loads successfully`, async () => {
      await modulePage.expectLoaded();
    });

    if (config.search) {
      test(`${moduleName}: search returns and clears results`, async () => {
        await modulePage.search('a');
        await modulePage.clearSearch();
      });
    }

    if (config.filters) {
      for (const filterName of config.filters) {
        test(`${moduleName}: "${filterName}" filter selects and resets`, async () => {
          await modulePage.selectFilter(filterName);
          await modulePage.resetFilter(filterName);
        });
      }
    }
  });
}
