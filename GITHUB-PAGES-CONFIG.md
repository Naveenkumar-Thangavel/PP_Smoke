# GitHub Pages & GitHub Actions Setup Guide

Complete step-by-step guide to enable Allure report publishing to GitHub Pages.

## Prerequisites

- GitHub repository created
- Repository is public (free GitHub Pages) or private (GitHub Pro required)
- Admin access to repository settings

---

## Step 1: Enable GitHub Pages

### Via GitHub Web UI

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click **Settings** (top right)
   - Left sidebar: Click **Pages**

2. **Configure Build Source**
   - Under "Build and deployment" section:
   - **Source**: Select **"GitHub Actions"** (from dropdown)
   - Click **Save**

3. **Verify Setup**
   - Wait for page to refresh
   - You should see: "GitHub Pages is currently being built from the GitHub Actions workflow..."

### Via GitHub CLI

```bash
# If using GitHub CLI
gh repo edit <repo-name> --enable-pages --pages-source github-actions
```

---

## Step 2: Configure GitHub Secrets

### Add Repository Secrets for Test Credentials

1. **Navigate to Secrets Settings**
   - Go to repository: **Settings**
   - Left sidebar: **Secrets and variables** → **Actions**

2. **Add Each Secret**
   - Click **"New repository secret"** button
   - Fill in the form:

#### Secret 1: BASE_URL
- **Name**: `BASE_URL`
- **Secret**: `https://your-application-url.com`
- Click **Add secret**

#### Secret 2: LOGIN_EMAIL
- **Name**: `LOGIN_EMAIL`
- **Secret**: `test.user@example.com`
- Click **Add secret**

#### Secret 3: LOGIN_PASSWORD
- **Name**: `LOGIN_PASSWORD`
- **Secret**: `YourSecurePassword123`
- Click **Add secret**

### After Adding Secrets

You should see all three listed:
```
✓ BASE_URL
✓ LOGIN_EMAIL
✓ LOGIN_PASSWORD
```

---

## Step 3: Verify Workflow File

### File Location
- Path: `.github/workflows/playwright-report.yml`
- This file should already exist in your repository

### Key Workflow Components

```yaml
# Triggers workflow
on:
  push:
    branches: [ main ]
  workflow_dispatch:

# Permissions for Pages deployment
permissions:
  contents: read
  pages: write
  id-token: write
```

### Verify Secrets Usage

The workflow uses secrets in the "Run Playwright Tests" step:

```yaml
- name: Run Playwright Tests
  env:
    BASE_URL: ${{ secrets.BASE_URL }}
    LOGIN_EMAIL: ${{ secrets.LOGIN_EMAIL }}
    LOGIN_PASSWORD: ${{ secrets.LOGIN_PASSWORD }}
  run: npm run test:smoke
```

---

## Step 4: Test the Setup

### Trigger Workflow Manually

1. **Navigate to Actions Tab**
   - Go to repository
   - Click **Actions** (top menu)

2. **Select Workflow**
   - Left sidebar: **"Playwright Tests & Allure Report"**

3. **Trigger Manually**
   - Click **"Run workflow"** button
   - Keep branch as **main**
   - Click **"Run workflow"** (green button)

4. **Monitor Execution**
   - Workflow should start running
   - Click on the latest run to see logs
   - Wait for completion (~5-10 minutes)

### Check Job Completion

**When Successful:**
- ✅ `test` job completes
- ✅ `deploy-report` job completes
- ✅ All steps show green checkmarks

**When Failed:**
- ❌ See red error marks
- Click step to expand and view error logs
- Check "Common Issues" section below

---

## Step 5: Access Your Report

### GitHub Pages URL

After successful deployment, your report is available at:

```
https://<github-username>.github.io/<repository-name>/
```

### Example URLs

- User: `john-doe`, Repo: `PP_Smoke`
  → `https://john-doe.github.io/PP_Smoke/`

- User: `acme-corp`, Repo: `automation-tests`
  → `https://acme-corp.github.io/automation-tests/`

### Finding Your URL

1. **In Repository**
   - Go to **Actions** tab
   - Click latest workflow run
   - Scroll to "Deploy Report" job
   - Final step shows: "Report URL: [your-url]"

2. **In Repository Settings**
   - Go to **Settings** → **Pages**
   - Shows "Your site is published at: https://..."

3. **From Workflow Logs**
   - Search logs for: "Report successfully deployed"
   - URL will be displayed

---

## Step 6: Set Up GitHub Pages Custom Domain (Optional)

### If You Have a Custom Domain

1. **Go to Settings → Pages**
2. Under "Custom domain":
   - Enter your domain name
   - Click **Save**
3. DNS configuration required (see GitHub docs)

---

## Step 7: Configure Branch Protection (Recommended)

### Require Tests Before Merge

1. **Go to Settings → Branches**
2. Click **Add rule** under "Branch protection rules"
3. Configure:
   - Branch name pattern: `main`
   - ✅ Require status checks before merging
   - ✅ Require latest commit approval
4. Click **Create**

---

## Verification Checklist

After completing setup, verify:

- [ ] GitHub Pages enabled in Settings → Pages
- [ ] Source set to "GitHub Actions"
- [ ] All three secrets added (BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD)
- [ ] Workflow file exists: `.github/workflows/playwright-report.yml`
- [ ] Workflow ran successfully at least once
- [ ] Report accessible at GitHub Pages URL
- [ ] Report contains test results (not just empty page)

---

## Common Issues & Solutions

### Issue: "GitHub Pages settings not found"

**Solution**: 
- Repository might be private and you don't have GitHub Pro
- Upgrade to GitHub Pro for private repo Pages
- Or make repository public (Settings → Danger Zone → Make public)

### Issue: "Workflow won't run"

**Solution**:
- Workflow file must be in `main` branch
- Push `.github/workflows/playwright-report.yml` to main
- Manual trigger might need repository dispatch permission

### Issue: "Tests fail - Missing credentials"

**Solution**:
- Verify secrets are added correctly
- Secret names are case-sensitive: `BASE_URL`, not `base_url`
- Test values work locally first
- Use `echo ${{ secrets.BASE_URL }}` in workflow (will show as `***` for security)

### Issue: "404 Page Not Found" on GitHub Pages URL

**Solution**:
- Wait 1-2 minutes after deployment
- Verify report generated successfully (check workflow logs)
- Clear browser cache: `Ctrl+Shift+Delete`
- Verify correct URL format: `https://username.github.io/repo-name/`
- Check Settings → Pages to verify publication source

### Issue: "Report is blank / incomplete"

**Solution**:
- Tests might not have run properly
- Check `test` job logs in workflow
- Verify `allure-results` has data
- Run locally: `npm run test:smoke` first
- Check for environment variable issues

### Issue: "Permission denied" in workflow

**Solution**:
```yaml
# Check permissions in workflow:
permissions:
  contents: read
  pages: write
  id-token: write
```
- Ensure these are set correctly
- Go to Settings → Actions → General
- Verify "Read and write permissions" is set

### Issue: "Artifact not found" error

**Solution**:
- Tests might be failing completely
- Check test output for actual errors
- Verify all dependencies installed
- Run locally first: `npm install && npx playwright install`

---

## Workflow Triggers Explained

### Automatic Trigger (on push)

```yaml
on:
  push:
    branches: [ main ]
```

- Runs when you push to `main` branch
- Example: `git push origin main`
- Automatic test execution and report publish

### Pull Request Trigger (no publish)

```yaml
  pull_request:
    branches: [ main ]
```

- Runs when PR is created/updated against `main`
- Tests run but report is NOT published to Pages
- Good for checking PRs before merge

### Manual Trigger (workflow_dispatch)

```yaml
  workflow_dispatch:
```

- Run from GitHub Actions UI anytime
- No push required
- Useful for on-demand testing

---

## Security Best Practices

### ✅ DO

- Store credentials in GitHub Secrets only
- Use masked secrets (shown as `***` in logs)
- Rotate credentials regularly
- Use test account (not production)
- Enable branch protection rules
- Review workflow logs for sensitive data

### ❌ DON'T

- Commit `.env` file to Git
- Hard-code credentials in workflow
- Use production credentials
- Share secrets in PRs or issues
- Print secrets in workflow logs
- Use the same password everywhere

### Secret Management

```bash
# WRONG - Don't do this!
echo "password=MyPassword123" >> .env
git add .env
git push

# RIGHT - Use GitHub Secrets
# 1. Add to GitHub Secrets UI
# 2. Reference in workflow: ${{ secrets.PASSWORD }}
# 3. .env is .gitignored
```

---

## Troubleshooting Workflow

### View Workflow Logs

1. Go to repository **Actions** tab
2. Click on latest workflow run
3. Click on failing job
4. Expand failed step to see error
5. Look for keywords: `Error`, `Failed`, `Warning`

### Common Workflow Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Not found` | Secret not added | Add to Settings → Secrets |
| `Permission denied` | Wrong permissions | Check `permissions` section |
| `Could not find artifact` | Test failed | Check test logs |
| `Deploy failed` | Pages not enabled | Enable in Settings → Pages |
| `404 Not Found` | Wrong URL | Check Pages URL format |

### Enable Debug Logging

```yaml
# Add to workflow step:
- name: Run Tests
  run: npm run test:smoke
  env:
    DEBUG: pw:api  # Enables Playwright debug logs
```

---

## GitHub Actions Monitoring

### Recommended Setup

1. **Star Notifications**
   - Get notified of workflow failures
   - Settings → Notifications → Workflows

2. **Branch Protection**
   - Require passing checks before merge
   - Settings → Branches → Branch protection rules

3. **Environment Protection**
   - For multi-environment setup
   - Settings → Environments

---

## Advanced Configuration

### Modify Trigger Branch

Change workflow to run on different branch:

```yaml
on:
  push:
    branches: [ main, develop ]  # Add develop branch
```

### Modify Retention Period

Change artifact retention from 30 to 60 days:

```yaml
- name: Upload Allure Report as Artifact
  uses: actions/upload-artifact@v4
  with:
    name: allure-report
    path: allure-report/
    retention-days: 60  # Changed from 30
```

### Add Scheduled Runs

Run tests on schedule (e.g., daily):

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
```

---

## Support

For issues:

1. Check GitHub Actions logs (Actions tab)
2. Verify secrets are added correctly
3. Test locally first: `npm run test:smoke`
4. Check Playwright browser installation
5. Review this guide for your specific issue

---

**Last Updated**: October 2026
