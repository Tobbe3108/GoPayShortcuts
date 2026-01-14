---
description: Deploy the frontend application to production hosting service like GitHub Pages.
---

# Purpose

This command automates the deployment of the frontend application built with SvelteKit and Vite to a production hosting environment, ensuring a streamlined release process.

# What It Does

1. Builds the frontend application using Vite
2. Deploys the built files to GitHub Pages using GitHub Actions
3. Handles versioning and asset optimization automatically

# Usage Examples

```bash
# Deploy to GitHub Pages
deploy-frontend
```

This will trigger a GitHub Action workflow that builds the project and deploys to the gh-pages branch.

# Related Skills

- vite: For building the frontend application
- github-actions: For automated deployment pipeline
- sveltekit-development: For SvelteKit-specific build configurations

# Relies On

This command relies on the deployment-specialist agent for handling deployment configurations and the frontend-developer agent for build setup.