---
description: Deploys frontend to GitHub Pages - builds with Vite and triggers GitHub Actions workflow
---

## Purpose

Deploys the frontend application to GitHub Pages. This command builds the application for production and pushes changes to trigger the automated deployment workflow defined in `.github/workflows/deploy.yml`.

## What It Does

1. Navigates to the frontend directory
2. Builds the frontend with Vite in production mode
3. Uses `gh-pages` package to deploy the `build/` directory
4. Pushes changes to the repository (main/master branch)
5. GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically runs on push
6. Built artifacts are deployed to GitHub Pages with custom domain configuration

## Usage Examples

```bash
# Build and deploy frontend
cd frontend && npm run deploy

# Manual: Build only
cd frontend && NODE_ENV=production bun run build

# Manual: Deploy after building
cd frontend && gh-pages -d build -t

# Deploy via git (triggers GitHub Actions)
git add . && git commit -m "Deploy frontend" && git push origin main
```

## Related Skills

- [GitHub Pages Deployment](../../skill/github-pages.md) - GitHub's static site hosting
- [Vite Production Build](../../skill/vite-build.md) - Production optimization and bundling
- [GitHub Actions](../../skill/github-actions.md) - Automated deployment workflow
- [gh-pages Package](../../skill/gh-pages.md) - GitHub Pages deployment tool
