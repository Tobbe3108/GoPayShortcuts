---
name: bun
description: Comprehensive guidance for using Bun as a fast, modern JavaScript runtime and package manager in frontend development projects like GoPayShortcuts, covering installation, dependency management, script execution, and integration with build tools.
---

## What I Cover

- Bun installation and environment setup
- Package management commands (bun install, bun add, bun remove, bun update)
- Script execution with bun run (e.g., bun run dev, bun run build)
- Lockfile management with bun.lockb
- Runtime features and performance optimizations
- Integration with frontend frameworks like SvelteKit and Vite
- Migration from npm/yarn to Bun

## Common Patterns

### Package Installation
```bash
# Install all dependencies
bun install

# Add a new dependency
bun add lodash-es

# Add a dev dependency
bun add -D @types/node

# Remove a package
bun remove axios
```

### Script Execution
```bash
# Development server
bun run dev

# Production build
bun run build

# Run tests
bun run test
```

### Project-Specific Examples in GoPayShortcuts
- Use `bun run build` in the predeploy script for production builds with Vite
- Combine with SvelteKit sync for type checking: `bun run check`
- Format code with Prettier: `bun run format`

## Best Practices

- Always commit `bun.lockb` to version control for reproducible installs
- Use Bun's native TypeScript support for faster development
- Leverage Bun's speed for CI/CD pipelines to reduce build times
- Ensure Node.js compatibility when using Bun-specific features
- Use `bun run` instead of `npm run` for better performance
- Keep Bun updated to the latest version for security and performance

## Related Skills

- sveltekit-development: For building SvelteKit applications with Bun
- vite: For fast frontend builds using Bun as package manager
- frontend-developer: General frontend development practices
- github-actions: For CI/CD pipelines using Bun