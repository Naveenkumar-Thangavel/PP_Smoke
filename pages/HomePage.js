const { test, expect } = require('@playwright/test');

/**
 * Represents the authenticated shell: header, sidebar navigation and the
 * Summary Dashboard. Also owns logout since the header is shared app-wide.
 */
class HomePage {
  constructor(page) {
    this.page = page;

    this.dashboardHeading = page.getByRole('heading', { name: 'Summary Dashboard' });
    this.nav = page.getByRole('navigation', { name: 'Main navigation menu' });
    this.userProfileMenuBtn = page.getByRole('button', { name: 'User profile menu' });
    this.logoutBtn = page.getByRole('button', { name: 'Log Out' });
  }

  async expectLoaded() {
    await expect(this.dashboardHeading).toBeVisible();
  }

  /** Verifies the current page rendered without error (generic check, no 404). */
  async expectPageLoaded() {
    await expect(this.page.getByRole('heading', { name: '404' })).toHaveCount(0);
    await expect(this.page.locator('main')).toBeVisible();
  }

  async navigateToDirectItem(name) {
    await test.step(`Navigate to "${name}"`, async () => {
      await this.nav.getByRole('menuitem', { name }).click();
      await this.expectPageLoaded();
    });
  }

  async navigateToSubmenuItem(groupName, itemName) {
    await test.step(`Navigate to "${groupName}" > "${itemName}"`, async () => {
      const groupToggle = this.nav.getByRole('button', { name: groupName });
      if (!(await this.nav.getByRole('menuitem', { name: itemName }).isVisible().catch(() => false))) {
        await groupToggle.click();
      }
      await this.nav.getByRole('menuitem', { name: itemName }).click();
      await this.expectPageLoaded();
    });
  }

  async navigateToAdminUsers() {
    await this.navigateToSubmenuItem('Admin', 'Users');
  }

  async logout() {
    await test.step('Log out', async () => {
      await this.userProfileMenuBtn.click();
      await this.logoutBtn.click();
      // Confirm the "Are you sure you want to log out?" dialog.
      await this.page.getByRole('dialog', { name: 'Log Out' }).getByRole('button', { name: 'Log Out' }).click();
    });
  }
}

module.exports = { HomePage };
