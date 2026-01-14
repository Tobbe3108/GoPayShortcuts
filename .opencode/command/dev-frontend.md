---
description: Start the development server for the frontend SvelteKit application
---

# dev-frontend

## Purpose
Start the local development server for the frontend application to enable live development, hot reloading, and testing of UI changes.

## What It Does
- Changes to the `frontend` directory
- Runs `bun run dev` to start the Vite development server
- Provides hot module replacement and live reloading during development
- Serves the SvelteKit application on the configured port (typically localhost:5173)

## Usage Examples
```bash
opencode dev-frontend
```

This command will:
1. Navigate to the frontend directory
2. Execute `bun run dev` which runs `vite dev`
3. Start the development server with HMR enabled

## Related Skills
- sveltekit-development: For SvelteKit framework patterns and routing
- vite: For build tooling and development server configuration
- bun: For package management and script execution

## Agents
- frontend-developer: Primary agent for implementing and maintaining frontend features