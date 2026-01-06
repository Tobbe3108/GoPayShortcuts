---
description: Deploys backend to Cloudflare Workers - uses Wrangler CLI to deploy serverless functions
---

## Purpose

Deploys the backend API to Cloudflare Workers. This command builds and publishes your serverless backend to Cloudflare's global network for production use.

## What It Does

1. Navigates to the backend directory
2. Builds the backend code with Wrangler
3. Deploys to Cloudflare Workers using Wrangler CLI
4. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` authentication
5. Automatically triggered by GitHub Actions when changes push to main/master
6. Deployed URL: `https://gopaybadedition.tobbe3108.workers.dev/api`

## Usage Examples

```bash
# Deploy backend to Cloudflare Workers
cd backend && npm run deploy

# Deploy with GitHub Actions (automatic on push)
git add . && git commit -m "Deploy backend" && git push origin main

# Manual deploy with Wrangler (requires auth)
cd backend && npx wrangler deploy

# Check deployment status
cd backend && npx wrangler deployments list
```

## Related Skills

- [Wrangler CLI](../../skill/wrangler-cli.md) - Cloudflare Workers deployment tool
- [Cloudflare Workers](../../skill/cloudflare-workers.md) - Serverless computing platform
- [GitHub Actions Secrets](../../skill/github-actions-secrets.md) - Storing API tokens securely
- [Worker Configuration](../../skill/wrangler-toml.md) - wrangler.toml configuration for deployments
