# Quick Troubleshooting Guide

## Before Running Tests

### ✅ Local Environment Check

```bash
# 1. Verify Node.js version
node --version  # Should be 18.0.0 or higher (20 recommended)

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Create .env file from example
cp .env.example .env
# Then edit .env with real credentials

# 5. Verify .env is git-ignored
cat .gitignore | grep "\.env"  # Should show ".env"

# 6. Test credentials work locally
npm run test:smoke
```

---

## Test Execution Issues

### Problem: "Tests fail with 'No such file or directory'"

```
Error: ENOENT: no such file or directory, open '.env'
```

**Fix**:
```bash
cp .env.example .env
# Edit .env with your credentials
```

---

### Problem: "Chromium not found"

```
Error: browserType.launch: Chromium is not installed
```

**Fix**:
```bash
npx playwright install chromium
# Or install all browsers
npx playwright install
```

---

### Problem: "Login fails with 403 Forbidden"

```
Error: Request failed (403) Unauthorized
```

**Fix**:
- Verify `LOGIN_EMAIL` is correct in `.env`
- Verify `LOGIN_PASSWORD` is correct in `.env`
- Verify `BASE_URL` is correct and accessible
- Test account credentials work in actual app
- Check if account is locked or needs MFA

---

### Problem: "Tests timeout"

```
Error: Timeout 90000ms exceeded during test execution
```

**Possible causes & fixes**:
1. Server is slow - increase timeout in `playwright.config.js`
2. Network issue - check internet connectivity
3. Selector not found - verify page structure hasn't changed
4. Login takes too long - test credentials or network

**To diagnose**:
```bash
# Run in debug mode to see what's happening
npx playwright test --debug

# Or in headed mode (see browser)
npx playwright test --headed
```

---

## Report Generation Issues

### Problem: "Allure report not generated"

```bash
# First check if allure-results has data
ls -la allure-results/

# If empty, tests didn't run properly
npm run test:smoke

# Then generate report
npm run allure:generate

# Open it
npm run allure:open
```

---

### Problem: "allure command not found"

```
Error: allure: command not found
```

**Fix**:
```bash
# Reinstall dependencies
npm install

# Verify allure-commandline is installed
npm list allure-commandline
```

---

## GitHub Actions Issues

### Problem: "Workflow won't run on push"

**Checklist**:
- ✅ `.github/workflows/playwright-report.yml` exists
- ✅ File is committed to `main` branch
- ✅ Branch name matches: `branches: [ main ]`
- ✅ Push is actually to `main` branch

**To fix**:
```bash
# Ensure workflow file is committed
git add .github/workflows/playwright-report.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

---

### Problem: "Workflow tests fail in GitHub but pass locally"

**Common causes**:

1. **Missing secrets**
   - Go to Settings → Secrets and variables → Actions
   - Verify all three secrets exist: `BASE_URL`, `LOGIN_EMAIL`, `LOGIN_PASSWORD`
   - Check secret values are correct (copy-paste)

2. **Environment differences**
   - Local tests work, but CI tests fail
   - Go to workflow run logs
   - Look for error messages in test output

**To debug**:
```yaml
# Temporarily add debug output to workflow:
- name: Debug Environment
  run: |
    echo "BASE_URL: ${{ secrets.BASE_URL }}"
    echo "LOGIN_EMAIL: ${{ secrets.LOGIN_EMAIL }}"
    # Note: LOGIN_PASSWORD won't print (masked)
    node --version
    npm --version
```

---

### Problem: "Test artifact not found"

```
Error: No files were found with the provided path
```

**Cause**: Tests failed to run completely

**To fix**:
1. Check test job logs
2. Look for actual test errors
3. Verify secrets are set correctly
4. Test locally first

---

### Problem: "GitHub Pages says 'Not Found' (404)"

**Checklist**:

1. GitHub Pages is enabled
   - Go to Settings → Pages
   - Verify Source is "GitHub Actions"

2. Wait for deployment
   - GitHub Pages takes 1-2 minutes to publish
   - Refresh page after 2 minutes

3. Verify correct URL
   - Format: `https://username.github.io/repo-name/`
   - Check username and repo name spelling
   - Lowercase only

4. Clear browser cache
   - Hard refresh: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete` Mac)
   - Then revisit URL

5. Check workflow logs
   - Go to Actions tab
   - Click on latest workflow
   - Scroll to "Deploy report" job
   - Look for errors

---

### Problem: "Workflow stuck 'In Progress'"

**Solutions**:

1. **Wait longer** - Usually completes in 5-10 minutes

2. **Manual cancel**:
   - Go to Actions tab
   - Click on stuck workflow
   - Click "Cancel workflow"
   - Manual re-trigger

3. **Check logs**:
   - Click on workflow
   - Expand each job
   - Look for where it's stuck

---

## Artifact & Report Issues

### Problem: "Report is blank or missing data"

**Check**:
```bash
# 1. Test execution
npm run test:smoke

# 2. Results directory
ls -la allure-results/
# Should have multiple .json files

# 3. Generate report
npm run allure:generate

# 4. Open report
npm run allure:open

# 5. Verify report exists
ls -la allure-report/index.html
```

---

### Problem: "Report loads but no test data"

**Cause**: `allure-results` was empty

**Fix**:
```bash
# Clean everything
npm run allure:clean

# Run tests
npm run test:smoke

# Generate report
npm run allure:generate

# Open report
npm run allure:open
```

---

## Secret Management Issues

### Problem: "Secrets not working in workflow"

**Check**:
1. Secret name matches exactly (case-sensitive)
   - ❌ `base_url` (wrong - lowercase)
   - ✅ `BASE_URL` (correct - uppercase)

2. Secret referenced correctly in workflow
   ```yaml
   env:
     MY_SECRET: ${{ secrets.MY_SECRET }}
   ```

3. Workflow was re-run after adding secret
   - New secrets don't apply to old runs
   - Must run workflow again after adding

---

### Problem: "Credentials appear in logs"

**Never do this**:
```bash
# WRONG - prints password!
echo "Password: ${{ secrets.PASSWORD }}"
```

**Do this instead**:
```bash
# RIGHT - masked automatically
run: npm run test:smoke  # Uses ${{ secrets.PASSWORD }} internally
```

---

## Performance Issues

### Problem: "Tests run slowly"

**Possible causes & solutions**:

| Issue | Solution |
|-------|----------|
| Too many tests | Reduce test scope or run parallel |
| Server is slow | Check server performance |
| Network latency | Check connection, try different browser |
| Screenshots/videos | Disable in playwright.config.js |
| Retries enabled | Set retries: 0 |

**To diagnose**:
```bash
# See execution times
npm run test:smoke

# Look for "spent X ms" in output
```

---

### Problem: "GitHub Actions job times out"

```
Job timeout exceeded: 30 minutes
```

**Fix**:
```yaml
# In workflow file, increase timeout:
test:
  name: Run Playwright Tests
  runs-on: ubuntu-latest
  timeout-minutes: 45  # Increase from 30
```

---

## Debugging Techniques

### Enable Playwright Debug Mode

```bash
# Run single test in debug mode
npx playwright test tests/LoginPage.spec.js --debug

# Opens Playwright Inspector - step through execution
# Use "Step" button to move one action at a time
```

---

### View Trace Files

```bash
# Traces are generated on test failure
# Open in Playwright Inspector:
npx playwright show-trace test-results/trace.zip
```

---

### Run Tests in Headed Mode

```bash
# See browser UI while tests run
npx playwright test --headed

# Headed + debug mode
npx playwright test --headed --debug
```

---

### Check Screenshots/Videos

After test failure:
1. Go to `test-results/` folder
2. Find test folder
3. Look for:
   - `test-failed-1.png` - screenshot
   - `video.webm` - video recording
   - `trace.zip` - execution trace

---

## Common Commands Quick Reference

```bash
# Setup
npm install
npx playwright install chromium

# Local Testing
npm run test:smoke              # Run tests
npm run allure:generate         # Generate report
npm run allure:open             # Open report
npm run test:smoke:report       # All 3 above in one command
npm run allure:clean            # Clean all results/reports

# Debugging
npx playwright test --debug     # Debug mode
npx playwright test --headed    # See browser
npx playwright test --headed --debug  # Both

# GitHub Actions
git add .github/workflows/playwright-report.yml
git commit -m "Add workflow"
git push origin main            # Triggers workflow

# Manual trigger
# Go to Actions tab → Select workflow → "Run workflow" button
```

---

## When Everything Fails

### Nuclear Option (Clean Everything)

```bash
# Remove everything
npm run allure:clean
rm -rf node_modules
rm -rf playwright/.cache
rm -rf playwright/.auth

# Reinstall everything
npm install
npx playwright install chromium

# Start fresh
npm run test:smoke
npm run allure:generate
npm run allure:open
```

---

### Still Not Working?

1. **Check logs carefully**
   - Copy entire error message
   - Search for it in docs
   - Look for line numbers

2. **Test each component**
   - Connectivity: Can you reach BASE_URL?
   - Login: Do credentials work in actual app?
   - Playwright: Does `npx playwright test` run?
   - Allure: Does `npm run allure:generate` work?

3. **Simplify**
   - Start with single test file
   - Use simple test without dependencies
   - Verify basic functionality

4. **Check documentation**
   - Playwright: https://playwright.dev
   - Allure: https://docs.qameta.io/allure/
   - GitHub Actions: https://docs.github.com/actions

---

**Need help?** Check the main [GITHUB-PAGES-SETUP.md](./GITHUB-PAGES-SETUP.md) for complete setup guide.
