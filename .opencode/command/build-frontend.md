---
description: "Build the frontend application for production deployment"
---

## Purpose

Builds the frontend SvelteKit application into optimized production bundles ready for deployment.

## What It Does

- Compiles Svelte components and TypeScript code using Vite
- Generates static assets and bundles in the `build` directory
- Applies production optimizations including minification, tree-shaking, and code splitting
- Prepares the application for deployment to hosting platforms

## Usage Examples

```bash
# From the frontend directory
cd frontend && bun run build

# Using bun directly for production build
cd frontend && NODE_ENV=production bun run build

# Check build output
ls -la frontend/build/
```

## Related Skills

- sveltekit-development (SvelteKit framework and component compilation)
- vite (build tooling and asset bundling)
- bun (JavaScript runtime for executing the build process)

## Related Agents

- frontend-developer (primary agent for frontend development tasks)