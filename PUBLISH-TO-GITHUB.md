# How to Publish to GitHub & Enable GitHub Pages

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `PP_Smoke` (or your preferred name)
3. Description: `Playwright Automation Framework with Allure Reports`
4. Choose: Public (for free GitHub Pages)
5. Click **Create repository**

---

## Step 2: Initialize Git & Push Code

### Open PowerShell/Terminal in PP_Smoke folder:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Playwright automation framework with GitHub Actions"

# Add remote repository (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/john-doe/PP_Smoke.git
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your repository: https://github.com/YOUR_USERNAME/YOUR_REPO
2. Click **Settings** (top right)
3. Left sidebar: Click **Pages**
4. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
   - Click **Save**

---

## Step 4: Add Repository Secrets

1. In Repository Settings, go to **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

| Name | Value | Example |
|------|-------|---------|
| `BASE_URL` | Your app URL | `https://your-app.com` |
| `LOGIN_EMAIL` | Test user email | `test@example.com` |
| `LOGIN_PASSWORD` | Test password | `TestPassword123` |

---

## Step 5: Verify Everything Works

1. Go to **Actions** tab in your repository
2. You should see the workflow running
3. Wait for both jobs to complete (10-15 minutes)
4. Once complete, your report is available at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

**Example:**
```
https://john-doe.github.io/PP_Smoke/
```

---

## Step 6: Run Tests Manually (Optional)

To manually trigger the workflow:

1. Go to **Actions** tab
2. Select **"Playwright Tests & Allure Report"**
3. Click **"Run workflow"** button
4. Wait for completion
5. Access report at your GitHub Pages URL

---

## Quick Commands Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main

# For future pushes (after code changes)
git add .
git commit -m "Your message"
git push origin main
```

---

## Verify Your Setup

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] 3 secrets added (BASE_URL, LOGIN_EMAIL, LOGIN_PASSWORD)
- [ ] Workflow ran successfully (Actions tab shows ✅)
- [ ] Report accessible at GitHub Pages URL

---

**Your report will be available at:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

After every push to main branch, the workflow will:
1. Run your tests
2. Generate Allure report
3. Publish to GitHub Pages (1-2 min)
4. Report updates automatically
