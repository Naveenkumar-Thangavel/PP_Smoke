const { test, expect } = require('@playwright/test');

/**
 * Handles the dynamic login flow: in-app email/password OR Microsoft SSO redirect.
 * The actual path taken is decided at runtime based on what the app renders.
 */
class LoginPage {
  constructor(page) {
    this.page = page;

    // App login form
    this.emailInput = page.getByPlaceholder('name@company.com');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.continueWithEmailBtn = page.getByRole('button', { name: 'Continue with Email' });

    // Microsoft SSO form (login.microsoftonline.com)
    this.msEmailInput = page.getByRole('textbox', { name: /email|phone|skype/i });
    this.msPasswordInput = page.getByPlaceholder('Password');
    this.msNextBtn = page.getByRole('button', { name: 'Next' });
    this.msSignInBtn = page.getByRole('button', { name: 'Sign in' });
    this.msStaySignedInYesBtn = page.getByRole('button', { name: 'Yes' });
  }

  async goto() {
    await this.page.goto('/');
  }

  /**
   * Logs in dynamically: determines whether the domain uses in-app
   * email/password login or redirects to Microsoft SSO, then completes it.
   * Returns the authentication path taken (for Allure reporting only).
   */
  async login(email, password) {
    return test.step('Authenticate user', async () => {
      await test.step('Enter work email', async () => {
        await this.emailInput.fill(email);
        await this.emailInput.press('Tab'); // triggers domain check
      });

      const authPath = await test.step('Determine login flow dynamically', async () => {
        const outcome = await Promise.any([
          this.passwordInput.waitFor({ state: 'visible', timeout: 20_000 }).then(() => 'in-app'),
          this.page.waitForURL(/login\.microsoftonline\.com/, { timeout: 20_000 }).then(() => 'microsoft-sso'),
        ]).catch(() => 'unknown');
        return outcome;
      });

      if (authPath === 'in-app') {
        await test.step('Complete in-app email/password login', async () => {
          await this.passwordInput.fill(password);
          await this.continueWithEmailBtn.click();
        });
        return 'Email/Password (in-app)';
      }

      await test.step('Complete Microsoft SSO login', async () => {
        if (await this.msEmailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await this.msEmailInput.fill(email);
          await this.msNextBtn.click();
        }

        const passwordShown = await this.msPasswordInput
          .isVisible({ timeout: 15_000 })
          .catch(() => false);

        if (passwordShown) {
          await this.msPasswordInput.fill(password);
          await this.msSignInBtn.click();
        }

        // Optional "Stay signed in?" prompt
        if (await this.msStaySignedInYesBtn.isVisible({ timeout: 15_000 }).catch(() => false)) {
          await this.msStaySignedInYesBtn.click();
        }
      });

      return authPath === 'microsoft-sso' ? 'Microsoft SSO (no password shown)' : 'Unknown';
    });
  }

  /** Verifies login succeeded by checking the authenticated dashboard route. */
  async expectLoggedIn() {
    await test.step('Verify authenticated dashboard is reached', async () => {
      await this.page.waitForURL(/\/dashboard/, { timeout: 120_000 });
      await expect(this.page.getByRole('heading', { name: 'Summary Dashboard' })).toBeVisible({ timeout: 30_000 });
    });
  }

  /** Verifies the login form is displayed (used after logout). */
  async expectOnLoginPage() {
    await this.page.waitForURL(/\/login/, { timeout: 30_000 });
    await expect(this.emailInput).toBeVisible();
  }
}

module.exports = { LoginPage };
