---
description: Sets up backend development environment - installs dependencies and starts Wrangler dev server
---

## Purpose

Prepares your local development environment for backend development on the GoPayShortcuts project. This command installs all required dependencies and launches the Wrangler development server to run Cloudflare Workers locally.

## What It Does

1. Navigates to the backend directory
2. Installs project dependencies using npm
3. Starts the Wrangler development server
4. Simulates Cloudflare Workers environment locally
5. Allows testing of backend API endpoints without deployment

## Usage Examples

```bash
# Initial setup - install dependencies and start dev server
cd backend && npm install && npm run dev

# Just install dependencies
cd backend && npm install

# Start dev server (after dependencies are installed)
cd backend && npm run dev

# Alternative start command
cd backend && npm start
```

## Related Skills

- [Wrangler CLI](../../skill/wrangler-cli.md) - Cloudflare Workers development tool
- [Cloudflare Workers](../../skill/cloudflare-workers.md) - Serverless platform for backend API
- [TypeScript Configuration](../../skill/typescript-config.md) - Type safety for backend code
