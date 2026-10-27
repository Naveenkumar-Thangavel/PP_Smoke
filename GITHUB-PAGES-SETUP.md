# PowerPulse Smoke Tests

Playwright + JavaScript smoke-test framework (Page Object Model) for the PowerPulse web app with automated Allure report generation and GitHub Pages publishing.

## Setup

### Prerequisites
- Node.js 18+ (v20 recommended)
- npm or yarn
- Git

### Local Installation

```bash
# Clone the repository
git clone <repository-url>
cd PP_Smoke

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Create environment configuration
cp .env.example .env
# Fill in the following environment variables:
# BASE_URL=https://your-app-url.com
# LOGIN_EMAIL=your-test-email@example.com
# LOGIN_PASSWORD=your-test-password
```

## Running Tests

### Local Execution

```bash
# Run all smoke tests
npm run test:smoke

# Run tests and generate Allure report (then open it)
npm run test:smoke:report

# Generate Allure HTML report from existing allure-results
npm run allure:generate

# Open the generated report in browser
npm run allure:open

# Clean up previous test results and reports
npm run allure:clean
```

### GitHub Actions - Automated Execution

The workflow automatically runs on:
- **Push to main branch** - Runs full test suite and publishes report
- **Manual trigger** - Use GitHub Actions UI to run on-demand
- **Pull requests to main** - Runs tests (no report publication)

**Access the Report:**
- Navigate to: `https://<github-username>.github.io/<repository-name>/`
- Report contains:
  - Test results summary (passed/failed/skipped)
  - Detailed test execution timeline
  - Screenshots and videos on failure
  - Trace files for debugging
  - Historical trends

## Project Structure

```
PP_Smoke/
├── .github/
│   └── workflows/
│       └── playwright-report.yml      # GitHub Actions workflow
├── tests/
│   ├── auth.setup.js                  # Authentication setup (runs first)
│   ├── LoginPage.spec.js               # Login page tests
│   ├── HomePage.spec.js                # Home page tests
│   ├── UsersPage.spec.js               # Users page tests
│   └── Modules.spec.js                 # Modules page tests
├── pages/
│   ├── LoginPage.js                    # Login page object model
│   ├── HomePage.js                     # Home page object model
│   ├── UsersPage.js                    # Users page object model
│   └── ModulesPage.js                  # Modules page object model
├── utils/
│   ├── env.js                          # Environment variables
│   └── modules.js                      # Utility functions
├── playwright/
│   └── .auth/
│       └── user.json                   # Stored authentication state
├── allure-results/                     # Raw Allure test data (generated)
├── allure-report/                      # Generated HTML report
├── test-results/                       # Playwright test results
├── playwright.config.js                # Playwright configuration
├── package.json                        # Project dependencies & scripts
├── .env                                # Environment variables (git-ignored)
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

## Framework Features

### Test Structure
- **Page Object Model (POM)** - Clean separation of test logic and UI interactions
- **Authentication Setup** - Login flow runs once before all tests
- **Parallel Test Execution** - Tests can run in parallel (configured for sequential in config)
- **Smart Waits** - Web-first assertions with automatic waiting (no hard-coded delays)

### Test Execution
- **Screenshots** - Captured on failure only
- **Video Recording** - Recorded on failure only
- **Trace Files** - Retained on failure for debugging in Playwright Inspector
- **Retry Strategy** - No retries configured (can be adjusted per spec)
- **Timeout Configuration**:
  - Test timeout: 90 seconds
  - Expect timeout: 15 seconds
  - Action timeout: 20 seconds
  - Navigation timeout: 60 seconds

### Allure Reporting
- **Automatic Generation** - Reports generated after every test run
- **Rich Artifacts** - Screenshots, videos, and traces included
- **Test History** - Historical data and trends
- **Categorization** - Tests grouped by module/feature
- **Detailed Steps** - Step-by-step execution logs

### CI/CD Integration
- **GitHub Actions** - Automated testing on push/PR
- **GitHub Pages** - Automatic report publication
- **Artifact Retention** - Reports kept for 30 days
- **Caching** - npm modules cached for faster builds
- **Environment Secrets** - Secure credential management

## GitHub Setup Instructions

### 1. Enable GitHub Pages

1. Go to your GitHub repository settings
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - Click "Save"

> Note: The workflow will automatically handle GitHub Pages deployment. No manual configuration needed after this step.

### 2. Configure GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** and add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `BASE_URL` | Application URL | `https://app.example.com` |
| `LOGIN_EMAIL` | Test user email | `test@example.com` |
| `LOGIN_PASSWORD` | Test user password | `SecureP@ss123` |

> **Security Note**: Never commit `.env` file or credentials to Git. Use GitHub Secrets only.

### 3. Verify Repository Branch Settings

1. Go to **Settings** → **Branches**
2. Ensure `main` branch has the workflow configured
3. (Optional) Configure branch protection rules to require passing tests

## GitHub Pages Access

After successful workflow execution:

1. **Direct URL**: `https://<username>.github.io/<repo-name>/`
2. **From Repository**: 
   - Go to repository home page
   - Look for "Environments" section → "github-pages" → "View deployment"

Example: 
- GitHub User: `john-doe`
- Repository: `PP_Smoke`
- URL: `https://john-doe.github.io/PP_Smoke/`

## Workflow Details

### Jobs Overview

#### Job 1: `test` (Run Playwright Tests)
- **Triggers**: On push to main, PR to main, or manual dispatch
- **Steps**:
  1. Checkout repository code
  2. Setup Node.js 20 with npm caching
  3. Install npm dependencies
  4. Install Playwright browsers
  5. Run Playwright test suite
  6. Generate Allure report
  7. Upload artifacts (report, results)
  8. Check test status and fail if needed

#### Job 2: `deploy-report` (Deploy to GitHub Pages)
- **Triggers**: Only on main branch or manual dispatch (after test job)
- **Dependencies**: Waits for `test` job to complete
- **Steps**:
  1. Checkout repository
  2. Download Allure report artifact
  3. Verify report contents
  4. Configure GitHub Pages
  5. Upload report to Pages artifact
  6. Deploy to GitHub Pages
  7. Report final status

### Environment Variables

The workflow uses GitHub Secrets for sensitive data:

```yaml
env:
  BASE_URL: ${{ secrets.BASE_URL }}
  LOGIN_EMAIL: ${{ secrets.LOGIN_EMAIL }}
  LOGIN_PASSWORD: ${{ secrets.LOGIN_PASSWORD }}
```

These are injected into the test environment and passed to Playwright tests.

### Caching Strategy

- **npm packages** cached using `actions/setup-node@v4`
- **Cache key**: `node-lock-linux-20` (based on OS, Node version, and lock file)
- **Restored on**: Dependency changes or 7-day expiry

### Artifact Retention

| Artifact | Retention | Purpose |
|----------|-----------|---------|
| `allure-report` | 30 days | Final HTML report |
| `playwright-results` | 7 days | Test results JSON |

## Local Development Commands

### First-Time Setup
```bash
npm install
npx playwright install chromium
```

### Running Tests
```bash
# Run tests only
npm run test:smoke

# Run tests + generate + open report
npm run test:smoke:report

# Clean everything (results + report)
npm run allure:clean
```

### Just Report Operations
```bash
# Generate report from existing results
npm run allure:generate

# Open report in browser
npm run allure:open
```

### Advanced Options
```bash
# Run specific test file
npx playwright test tests/LoginPage.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run with specific project
npx playwright test --project=chromium

# Debug mode with inspector
npx playwright test --debug

# Update snapshots
npx playwright test --update-snapshots
```

## Troubleshooting

### Reports Not Appearing on GitHub Pages

**Issue**: Workflow completes but report URL returns 404

**Solutions**:
1. Verify GitHub Pages is enabled in repository Settings → Pages
2. Check workflow completion status: **Actions** tab
3. Ensure `allure-results` contains test data
4. Verify no errors in workflow logs
5. Wait 1-2 minutes for GitHub Pages to rebuild

**Check logs**:
```bash
# View workflow run details
# GitHub → Actions → Latest workflow run → Scroll to "Deploy Report" section
```

### Tests Failing Locally but Passing in CI

**Issue**: Environment variables not set

**Solution**:
```bash
# Create .env file (git-ignored)
cp .env.example .env

# Fill in your credentials
BASE_URL=https://your-url.com
LOGIN_EMAIL=your-email@example.com
LOGIN_PASSWORD=your-password
```

### Authentication Issues

**Issue**: Login.setup.js fails

**Verify**:
- `LOGIN_EMAIL` and `LOGIN_PASSWORD` are correct
- Account has access to test environment
- Two-factor authentication is disabled (if applicable)
- Credentials are stored in GitHub Secrets, not in code

### Allure Report Not Generated

**Issue**: Test runs but no report appears

**Solutions**:
1. Verify `allure-results` directory exists and has data:
   ```bash
   ls -la allure-results/
   ```

2. Check Allure command line is installed:
   ```bash
   npx allure --version
   ```

3. Manually generate report:
   ```bash
   npm run allure:clean
   npm run test:smoke
   npm run allure:generate
   ```

### Workflow Cancellation

**Issue**: New push cancels previous workflow

**Expected Behavior**: Yes - concurrency group prevents duplicate runs
- Only the latest push runs
- Previous workflow is cancelled
- This saves CI/CD resources

**To disable**: Remove `concurrency` section from workflow file

## Performance Optimization

### Current Configuration
- **Workers**: 1 (sequential execution)
- **Retries**: 0 (no automatic retries)
- **Parallel**: Disabled (fullyParallel: false)

### Recommended Adjustments

**For Faster Execution** (if tests are independent):
```javascript
// In playwright.config.js
fullyParallel: true,
workers: 4,  // or match your CPU cores
```

**For Stability** (if tests sometimes fail randomly):
```javascript
// In playwright.config.js
retries: 2,  // Retry failed tests up to 2 times
```

## Best Practices

### Test Development
- ✅ Use Page Object Model for all page interactions
- ✅ Keep tests independent (no test-to-test dependencies)
- ✅ Use descriptive test names: `test('should successfully login with valid credentials')`
- ✅ Use web-first assertions: `await expect(locator).toBeVisible()`
- ✅ Avoid hard-coded waits: `page.waitForTimeout(5000)` ❌

### CI/CD
- ✅ Use GitHub Secrets for all credentials
- ✅ Run tests on every push to main
- ✅ Review Allure reports after each run
- ✅ Monitor test trend/flakiness
- ✅ Update tests when UI changes

### Debugging
- Use `--debug` flag to run with Playwright Inspector
- Review screenshots/videos from failed tests
- Check trace files in Playwright Inspector
- Use `page.pause()` for step-by-step execution

## Integration with GitHub

### Required Permissions
The workflow uses minimal permissions:
- `pages: write` - Publish to GitHub Pages
- `id-token: write` - OIDC token for Pages deployment
- `contents: read` - Access repository code

### Branch Strategy
- **Main branch**: Tests run automatically, report published
- **Feature branches**: Tests run on PR (no publication)
- **Custom branches**: Tests don't run (modify workflow if needed)

## Support & Resources

### Documentation Links
- [Playwright Documentation](https://playwright.dev)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

### Common Issues Quick Links
- Playwright Debugging: `npx playwright test --debug`
- View Trace: Download from artifact → Open in Playwright Inspector
- Update Test Snapshots: `npx playwright test --update-snapshots`

## Version Information

- **Playwright**: ^1.64.1
- **Allure Playwright**: ^2.15.1
- **Allure CLI**: ^2.46.1
- **Node.js**: 20 (in CI) / 18+ (local)

## Contributing

When adding new tests:

1. Create new test spec in `tests/` folder
2. Create corresponding page object in `pages/` folder
3. Use existing page objects as reference
4. Run locally: `npm run test:smoke:report`
5. Verify Allure report generates successfully
6. Push to trigger CI workflow

## License

ISC

---

**Last Updated**: October 2026
**Maintained by**: QA Automation Team
