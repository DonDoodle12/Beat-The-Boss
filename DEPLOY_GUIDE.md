# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

Open your terminal and run these commands:

```bash
cd /Users/kennethvillanueva/Desktop/airmax
git push origin main
```

### If you get an authentication error:

**Option A: Use Personal Access Token (Recommended)**
1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Beat-The-Boss"
4. Check the "repo" scope
5. Click "Generate token"
6. Copy the token
7. When prompted for password, paste the token instead

**Option B: Use SSH**
```bash
git remote set-url origin git@github.com:DonDoodle12/Beat-The-Boss.git
git push origin main
```

---

## Step 2: Enable GitHub Pages

1. Go to: **https://github.com/DonDoodle12/Beat-The-Boss**

2. Click **"Settings"** tab (top of page)

3. Click **"Pages"** in left sidebar

4. Under **"Build and deployment"**:
   - Source: Deploy from a branch
   - Branch: **main**
   - Folder: **/ (root)**

5. Click **"Save"**

6. Wait 1-2 minutes

7. Refresh the page - you'll see your live URL!

---

## Your Live Game URL:

```
https://dondoodle12.github.io/Beat-The-Boss/
```

---

## Troubleshooting

**Game doesn't load?**
- Check browser console (F12) for errors
- Make sure all files are committed and pushed
- Wait a few minutes - GitHub Pages can take 1-5 minutes

**Changes not showing?**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Wait for GitHub Pages to rebuild (1-2 minutes)

---

## Need Help?

If you get stuck, let me know which step you're on and what error you're seeing!

