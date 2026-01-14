---
name: vite
description: Vite build tool configuration and usage for fast development and optimized production builds in SvelteKit projects with TypeScript and TailwindCSS integration
---

## What I Cover

This skill covers Vite configuration and usage in the GoPayShortcuts project, which uses Vite 6.x as the build tool for the SvelteKit frontend. Key areas include:

- Vite configuration setup with SvelteKit and TailwindCSS plugins
- Development server configuration including API proxying
- Build commands and optimization settings
- Hot Module Replacement (HMR) for fast development
- Production build and preview functionality
- Integration with TypeScript and static site generation

## Common Patterns

### Development Server
```bash
# Start development server with HMR
npm run dev  # or vite dev

# Server runs on http://localhost:5173 by default
# API requests to /api/* are proxied to http://localhost:8787
```

### Build Process
```bash
# Production build
npm run build  # or vite build

# Preview production build locally
npm run preview  # or vite preview
```

### Configuration Structure
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  }
});
```

## Best Practices

### Proxy Configuration
- Use Vite's proxy for API calls during development to avoid CORS issues
- Proxy `/api` routes to the backend server (Cloudflare Workers on port 8787)
- Enable `changeOrigin: true` for proper header forwarding

### Build Optimization
- Leverage Vite's native ES modules and tree-shaking for smaller bundles
- Use TailwindCSS v4's Vite plugin for optimized CSS processing
- Ensure TypeScript compilation happens during build via SvelteKit

### Development Workflow
- Use HMR for instant feedback on component changes
- Combine with SvelteKit's file-based routing for rapid prototyping
- Run `npm run check` regularly to catch TypeScript errors early

### Static Site Generation
- Configure SvelteKit with adapter-static for GitHub Pages deployment
- Set `NODE_ENV=production` during build for optimized output
- Use `gh-pages` for automated deployment from `build/` directory

## Related Skills

- **sveltekit-development**: Core SvelteKit framework usage, routing, and SSR
- **github-actions**: CI/CD pipelines for automated builds and deployments
- **bun**: Alternative runtime for build scripts (used in predeploy)