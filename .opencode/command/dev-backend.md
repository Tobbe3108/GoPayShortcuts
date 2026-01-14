---
description: "Command to start the backend development server for Cloudflare Workers"
---

# Purpose
Start the development environment for backend services using Cloudflare Workers, enabling local testing and debugging of serverless functions.

# What It Does
- Launches the Cloudflare Workers development server using `wrangler dev`
- Serves backend functions locally on a configurable port (default: 8787)
- Provides hot reloading for function changes during development
- Enables testing of backend APIs and integrations

# Usage Examples
```bash
# Start backend development server
opencode dev-backend

# Start with custom port
opencode dev-backend --port 3001

# Start with specific configuration
opencode dev-backend --config wrangler.toml
```

# Related Skills
- cloudflare-workers: Core skill for Workers development and deployment
- bun: May be used as runtime for faster development builds

# Related Agents
- backend-developer: Primary agent responsible for backend implementation and maintenance