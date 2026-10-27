const { test, expect } = require('@playwright/test');

/** Admin > Users page: lists application users. No search/filter controls exist on this page. */
class UsersPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Users' });
    this.createUserBtn = page.getByRole('button', { name: 'Create User' });
    this.userCountBadge = page.getByText(/\d+ Users/);
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.table).toBeVisible();
  }

  async getUserRowCount() {
    return this.rows.count();
  }

  async getUserCountBadgeText() {
    return this.userCountBadge.textContent();
  }
}

module.exports = { UsersPage };
