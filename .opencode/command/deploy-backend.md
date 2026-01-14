---
description: Deploy the backend application to the production environment using Cloudflare Workers
---

# Purpose

To automate the deployment of the backend application, ensuring it is built, tested, and deployed to the cloud infrastructure.

# What It Does

- Builds the backend code using the appropriate build tool (e.g., bun for Bun runtime)
- Runs any necessary tests
- Deploys to Cloudflare Workers using wrangler
- Optionally triggers GitHub Actions for CI/CD pipeline

# Usage Examples

opencode deploy-backend

This command can be run after development to push changes to production.

# Related Skills

- cloudflare-workers: For deploying to Cloudflare infrastructure
- github-actions: For automated deployment pipelines
- bun: For building and running the backend if using Bun

It relies on the backend-developer agent for development and deployment-specialist agent for deployment configuration.