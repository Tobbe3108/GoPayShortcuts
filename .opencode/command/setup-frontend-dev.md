---
description: Sets up frontend development environment - installs dependencies and starts Vite dev server
---

## Purpose

Prepares your local development environment for frontend development on the GoPayShortcuts project. This command installs all required dependencies and launches the Vite development server with hot module replacement.

## What It Does

1. Navigates to the frontend directory
2. Installs project dependencies using Bun package manager
3. Starts the Vite development server with live reloading
4. Server runs on `http://localhost:5173` (or next available port)
5. Any file changes automatically trigger hot reload in the browser

## Usage Examples

```bash
# Initial setup - install dependencies and start dev server
cd frontend && bun install && bun run dev

# Just install dependencies
cd frontend && bun install

# Start dev server (after dependencies are installed)
cd frontend && bun run dev

# Install and watch for type checking
cd frontend && bun install && bun run check:watch
```

## Related Skills

- [Vite Development Server](../../skill/vite-dev-server.md) - Frontend build tool and dev server
- [Bun Package Manager](../../skill/bun-package-manager.md) - JavaScript runtime and package manager
- [SvelteKit Framework](../../skill/sveltekit-framework.md) - Full-stack web framework used in frontend
