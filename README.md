# PowerPulse Smoke Tests

Playwright + JavaScript smoke-test framework (Page Object Model) for the PowerPulse web app.

## Setup
```
npm install
npx playwright install chromium
cp .env.example .env   # fill in real credentials
```

## Run
```
npm run test:smoke        # run all smoke tests
npm run allure:generate   # generate Allure HTML report from allure-results
npm run allure:open       # open the generated report
npm run allure:clean      # remove previous allure-results/allure-report
```

## Structure
- `pages/` – Page Object Model classes (`LoginPage`, `HomePage`, `UsersPage`)
- `tests/` – one spec file per page object
- `utils/env.js` – centralized `.env` access (credentials are never logged)
- `playwright.config.js` – screenshots/video/trace only on failure, Allure reporter

## Notes
- Login flow is detected dynamically at runtime (in-app email/password vs Microsoft SSO),
  no hard-coded waits are used — only Playwright web-first assertions/locator waits.
- The detected authentication path is recorded as an Allure annotation/step, never the credentials.
