const { test, expect } = require('@playwright/test');

/**
 * Generic, data-driven page object for any sidebar module (see utils/modules.js).
 * Reused across all modules to avoid one bespoke page-object class per page.
 */
class ModulePage {
  constructor(page, homePage, name, config) {
    this.page = page;
    this.homePage = homePage;
    this.name = name;
    this.config = config;
  }

  async navigate() {
    await test.step(`[${this.name}] Navigate`, async () => {
      if (this.config.group) {
        await this.homePage.navigateToSubmenuItem(this.config.group, this.config.item);
      } else {
        await this.homePage.navigateToDirectItem(this.config.item);
      }
    });
  }

  async expectLoaded() {
    await test.step(`[${this.name}] Verify page loaded`, async () => {
      await expect(this.page.getByRole('heading', { name: '404' })).toHaveCount(0);
      if (this.config.heading) {
        await expect(this.page.getByText(this.config.heading).first()).toBeVisible();
      }
    });
  }

  searchBox() {
    return this.page.getByPlaceholder(this.config.search);
  }

  async search(term) {
    await test.step(`[${this.name}] Search for "${term}"`, async () => {
      await this.searchBox().fill(term);
    });
  }

  async clearSearch() {
    await test.step(`[${this.name}] Clear search`, async () => {
      await this.searchBox().fill('');
    });
  }

  filterControl(filterName) {
    // Filters are either custom ARIA comboboxes (accessible by name) or plain
    // <select> elements preceded by a label/span containing the filter text
    // (which may carry a leading icon/emoji, so match by "contains" not exact).
    const byRole = this.page.getByRole('combobox', { name: filterName });
    const byAdjacentText = this.page.locator(
      `xpath=//*[self::label or self::span][contains(normalize-space(.), "${filterName}")]/following-sibling::select[1]`
    );
    return byRole.or(byAdjacentText);
  }

  /** Selects a non-default option in either a native <select> or an ARIA combobox/listbox. */
  async selectFilter(filterName) {
    await test.step(`[${this.name}] Select "${filterName}" filter option`, async () => {
      const control = this.filterControl(filterName);
      const tagName = await control.evaluate((el) => el.tagName).catch(() => '');

      if (tagName === 'SELECT') {
        const options = await control.locator('option').allTextContents();
        const nonDefault = options.find((o) => o.trim() && !/^all/i.test(o.trim()));
        if (nonDefault) await control.selectOption({ label: nonDefault });
        return;
      }

      await control.click();
      const options = this.page.getByRole('listbox').getByRole('option');
      const count = await options.count();
      for (let i = 0; i < count; i++) {
        const text = (await options.nth(i).textContent()) || '';
        if (text.trim() && !/^all/i.test(text.trim())) {
          await options.nth(i).click();
          return;
        }
      }
      if (count) await options.first().click();
    });
  }

  /** Resets a filter back to its "All" default. */
  async resetFilter(filterName) {
    await test.step(`[${this.name}] Reset "${filterName}" filter`, async () => {
      const control = this.filterControl(filterName);
      const tagName = await control.evaluate((el) => el.tagName).catch(() => '');

      if (tagName === 'SELECT') {
        const options = await control.locator('option').allTextContents();
        const def = options.find((o) => /^all/i.test(o.trim()));
        if (def) await control.selectOption({ label: def });
        return;
      }

      await control.click();
      const allOption = this.page.getByRole('listbox').getByRole('option').filter({ hasText: /^all/i }).first();
      if (await allOption.count()) {
        await allOption.click();
      } else {
        await this.page.keyboard.press('Escape');
      }
    });
  }
}

module.exports = { ModulePage };
