# GitHub Pages Deployment Guide

## Prerequisites
- GitHub account
- Git installed locally
- Node.js 18+ installed

## Setup Steps

### 1. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `acm-user-interface`
3. Make it public (required for GitHub Pages)
4. Don't initialize with README (we already have one)

### 2. Connect Local Repository to GitHub
```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/acm-user-interface.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Save the settings

### 4. Deploy
The GitHub Actions workflow will automatically deploy your site when you push to the main branch.

Your site will be available at: `https://YOUR_USERNAME.github.io/acm-user-interface`

## Manual Deployment (Alternative)
If you prefer manual deployment:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

## Features Included
- ✅ Automatic deployment on push to main
- ✅ Build optimization for production
- ✅ GitHub Pages compatible routing
- ✅ Professional README with live demo link
- ✅ TypeScript compilation
- ✅ PatternFly design system integration

## Troubleshooting
- If deployment fails, check the Actions tab in your GitHub repository
- Ensure all TypeScript errors are resolved before pushing
- Make sure the repository is public for GitHub Pages
