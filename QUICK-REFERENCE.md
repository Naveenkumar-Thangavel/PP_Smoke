# Quick Reference Card

Print this page or save it for easy access during setup.

---

## Critical URLs

```
GitHub Repository:
https://github.com/<username>/<repository-name>

GitHub Settings:
https://github.com/<username>/<repository-name>/settings

GitHub Actions:
https://github.com/<username>/<repository-name>/actions

GitHub Secrets:
https://github.com/<username>/<repository-name>/settings/secrets/actions

GitHub Pages Settings:
https://github.com/<username>/<repository-name>/settings/pages

GitHub Pages Report (AFTER setup):
https://<username>.github.io/<repository-name>/
```

---

## Setup Steps Summary

### Step 1: Enable GitHub Pages (2 minutes)
- Settings → Pages
- Source: GitHub Actions
- Save

### Step 2: Add Secrets (3 minutes)
- Settings → Secrets and variables → Actions
- New secret: `BASE_URL` = your app URL
- New secret: `LOGIN_EMAIL` = test email
- New secret: `LOGIN_PASSWORD` = test password

### Step 3: Commit Changes (5 minutes)
```bash
git add .
git commit -m "Setup GitHub Actions workflow"
git push origin main
```

### Step 4: Monitor Workflow (10 minutes)
- Go to Actions tab
- Watch workflow run
- Both jobs should complete with ✅

### Step 5: Access Report (1 minute)
- Navigate to: `https://<username>.github.io/<repo-name>/`
- View Allure dashboard

---

## The Three Secrets You Need

| Secret Name | Example | Notes |
|-------------|---------|-------|
| `BASE_URL` | `https://app.example.com` | Your application URL |
| `LOGIN_EMAIL` | `test@example.com` | Test user email |
| `LOGIN_PASSWORD` | `SecurePass123` | Test user password |

**Remember**: Secret names are CASE-SENSITIVE!

---

## Local Commands Cheat Sheet

```bash
# Setup
npm install
npx playwright install chromium
cp .env.example .env  # Then edit with your credentials

# Run
npm run test:smoke                    # Run tests only
npm run allure:generate               # Generate report only
npm run allure:open                   # Open report in browser
npm run test:smoke:report             # All three above in one command

# Debug
npx playwright test --debug           # Debug mode with inspector
npx playwright test --headed          # See browser while running

# Clean
npm run allure:clean                  # Remove results and reports
rm -rf node_modules && npm install    # Full reinstall
```

---

## GitHub Actions Workflow Status

### Green ✅ (Success)
- All jobs completed
- Tests ran successfully
- Report generated and deployed

### Yellow ⏳ (In Progress)
- Workflow still running
- Wait 5-10 minutes

### Red ❌ (Failed)
- Click on failed job
- Expand failed step
- Read error message
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## Report Access

### Your Report URL Pattern
```
https://<github-username>.github.io/<repository-name>/
```

### Examples
- GitHub User: `john-doe`, Repo: `PP_Smoke`
  → `https://john-doe.github.io/PP_Smoke/`

- GitHub User: `company`, Repo: `automation-tests`
  → `https://company.github.io/automation-tests/`

### First Access
- May take 1-2 minutes after deployment
- Wait if you see 404
- Hard refresh browser: `Ctrl+Shift+Delete`

---

## Files Created/Modified

| File | Status | Purpose |
|------|--------|---------|
| `.github/workflows/playwright-report.yml` | ✨ New | GitHub Actions workflow |
| `package.json` | ✏️ Modified | Added test:smoke:report script |
| `.env.example` | ✨ New | Environment template |
| `GITHUB-PAGES-SETUP.md` | ✨ New | Complete setup guide |
| `GITHUB-PAGES-CONFIG.md` | ✨ New | Detailed configuration guide |
| `TROUBLESHOOTING.md` | ✨ New | Common issues & solutions |
| `PROJECT-STRUCTURE.md` | ✨ New | File organization guide |
| `IMPLEMENTATION-CHECKLIST.md` | ✨ New | Step-by-step checklist |

---

## Workflow Triggers

| Trigger | When | Publishes Report? |
|---------|------|------------------|
| Push to main | `git push origin main` | ✅ Yes |
| Pull Request | Create PR to main | ❌ No |
| Manual | Actions tab → Run workflow | ✅ Yes (if main) |

---

## Environment Variables (.env)

**Create from template**:
```bash
cp .env.example .env
```

**Fill in**:
```
BASE_URL=https://your-app-url.com
LOGIN_EMAIL=your.test@email.com
LOGIN_PASSWORD=YourPassword123
```

**Keep safe**:
- ✅ Store locally only
- ❌ Never commit to Git
- ✅ Use GitHub Secrets for CI/CD
- ❌ Never put credentials in code

---

## Expected Workflow Execution Time

| Step | Time | Status |
|------|------|--------|
| Checkout code | 30s | ⚡ Fast |
| Setup Node.js | 1m | ⚡ Fast |
| Install dependencies | 2m | 🔧 Variable |
| Install browsers | 2m | 🔧 Variable |
| Run tests | 3m | 🔧 Variable |
| Generate report | 30s | ⚡ Fast |
| Deploy to Pages | 2m | 🔧 Variable |
| **Total** | **10-15 min** | |

---

## Troubleshooting Quick Lookup

### "Workflow won't run"
→ Workflow file in `.github/workflows/` on main branch?
→ Check Actions tab

### "Secrets error"
→ Settings → Secrets → Add BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD
→ Secret names case-sensitive!

### "Tests fail in CI but pass locally"
→ Check .env file locally
→ Verify secrets match local values
→ Check test logs in GitHub Actions

### "Report shows 404"
→ GitHub Pages enabled in Settings → Pages?
→ Wait 2-3 minutes and refresh
→ Check workflow logs for report generation errors

### "Can't access secrets page"
→ Go to: Settings → Secrets and variables → Actions
→ Need admin permissions on repository

---

## Important Reminders

✅ **DO**
- ✅ Test locally first: `npm run test:smoke`
- ✅ Store credentials in .env (local) or GitHub Secrets (CI)
- ✅ Keep `.env` out of Git (.gitignore protects it)
- ✅ Use case-sensitive secret names exactly as shown
- ✅ Wait for workflow to complete before accessing report
- ✅ Hard refresh browser if report shows 404

❌ **DON'T**
- ❌ Commit `.env` file to Git
- ❌ Put credentials in workflow files
- ❌ Use production credentials for testing
- ❌ Share secrets in PRs or issues
- ❌ Modify secret names or add extra characters

---

## Getting Help

| Problem | File to Read |
|---------|-------------|
| How do I set up? | [IMPLEMENTATION-CHECKLIST.md](./IMPLEMENTATION-CHECKLIST.md) |
| GitHub Pages won't work | [GITHUB-PAGES-CONFIG.md](./GITHUB-PAGES-CONFIG.md) |
| Tests are failing | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| File organization? | [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) |
| General questions | [README.md](./README.md) |
| Detailed setup guide | [GITHUB-PAGES-SETUP.md](./GITHUB-PAGES-SETUP.md) |

---

## Command Line Essentials

```bash
# Git operations
git status              # See what changed
git add .              # Stage all changes
git commit -m "msg"    # Commit with message
git push origin main   # Push to GitHub
git log --oneline      # View commit history

# Node/npm
node --version         # Check Node.js version (should be 18+)
npm --version          # Check npm version
npm install            # Install dependencies
npm run <script>       # Run npm script from package.json

# Playwright
npx playwright install chromium     # Install browsers
npx playwright test                 # Run tests
npx playwright test --debug         # Debug mode
npx playwright test --headed        # See browser

# Allure
npm run allure:generate             # Generate report
npm run allure:open                 # Open report
npm run allure:clean                # Clean results/report
```

---

## Success Indicators

✅ **You'll know it's working when**:
1. ✅ Workflow runs automatically on push
2. ✅ Both jobs complete with green checkmarks
3. ✅ Report accessible at GitHub Pages URL
4. ✅ Report shows test results and metrics
5. ✅ No credentials visible anywhere
6. ✅ Team can access reports

---

## One-Page Implementation

1. **Enable GitHub Pages** (Settings → Pages → Source: GitHub Actions)
2. **Add 3 Secrets** (Settings → Secrets → Add BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD)
3. **Commit Files** (`git add . && git commit -m "msg" && git push origin main`)
4. **Wait for Workflow** (Go to Actions tab, watch 2 jobs complete)
5. **Access Report** (Navigate to `https://username.github.io/repo-name/`)
6. **Done!** 🎉

---

## Real Example

**Your GitHub Details**:
- Username: `john-doe`
- Repository: `PP_Smoke`

**Your Report URL**:
```
https://john-doe.github.io/PP_Smoke/
```

**Your Secrets** (go to Settings → Secrets):
- `BASE_URL` = `https://app.example.com`
- `LOGIN_EMAIL` = `john.test@example.com`
- `LOGIN_PASSWORD` = `MyPassword123!`

**Your Workflow** (in Actions tab):
- Name: "Playwright Tests & Allure Report"
- Status: ✅ Success
- Duration: ~10-15 minutes

---

## Monthly Maintenance

- [ ] Review test metrics in Allure dashboard
- [ ] Check for failed tests and investigate
- [ ] Update credentials if changed
- [ ] Verify GitHub Actions still working
- [ ] Keep Playwright/Allure packages updated: `npm update`

---

## Emergency: Reset Everything

```bash
# Start fresh
rm -rf node_modules allure-results allure-report test-results
npm install
npx playwright install chromium
cp .env.example .env  # Edit this with credentials
npm run test:smoke
npm run allure:generate
npm run allure:open
```

---

**Print Date**: October 26, 2026
**Valid For**: October 2026 - January 2027
**Next Review**: January 2027

---

Questions? See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or check full guides in repository.
