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
npm run allure:open       # open the generated report (starts a local server)
npm run allure:clean      # remove previous allure-results/allure-report
```

## Viewing the Allure report locally
**Never open `allure-report/index.html` by double-clicking it.** Browsers block the
`fetch()` calls Allure's report uses to load its data when opened as a `file://` URL,
which shows as a `Failed to fetch` / network error — the report isn't broken, it just
needs to be served over HTTP:
```
npm run allure:open
```
This starts a local static server and opens the report automatically.

## Sharing the report
This project publishes reports two ways — pick whichever fits:

### 1. GitHub Pages (recommended — permanent, always up to date, no size limit)
Every push to `main` (or manual run) automatically runs the tests, generates the Allure
report, and publishes it to GitHub Pages, replacing the previous report:

**https://naveenkumar-thangavel.github.io/PP_Smoke/**

Share this URL with anyone — no login, no download, no local setup required. See
`.github/workflows/playwright-report.yml` for the pipeline. Report history/trend
graphs (pass/fail over time) are preserved automatically across runs.

### 2. Single-file report (for quick, ad-hoc sharing outside GitHub)
```
npm run allure:generate:single   # outputs allure-report-single/index.html
```
Produces one self-contained `index.html` with everything inlined — works by double-click,
no server needed, and can be emailed/Slacked/uploaded directly. **Caveat:** if your run has
failures with screenshots/videos/traces attached, this file can become very large
(50–150+ MB) since attachments are base64-embedded. Best used for quick, mostly-passing
runs; for full runs with heavy attachments, prefer the GitHub Pages link above.

## Structure
- `pages/` – Page Object Model classes (`LoginPage`, `HomePage`, `UsersPage`)
- `tests/` – one spec file per page object
- `utils/env.js` – centralized `.env` access (credentials are never logged)
- `playwright.config.js` – screenshots/video/trace only on failure, Allure reporter

## Notes
- Login flow is detected dynamically at runtime (in-app email/password vs Microsoft SSO),
  no hard-coded waits are used — only Playwright web-first assertions/locator waits.
- The detected authentication path is recorded as an Allure annotation/step, never the credentials.
