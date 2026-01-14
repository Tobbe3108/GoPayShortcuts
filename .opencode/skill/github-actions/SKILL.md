---
name: github-actions
description: Comprehensive guide to using GitHub Actions for CI/CD workflows in the GoPayShortcuts project, including frontend deployment to GitHub Pages and backend deployment to Cloudflare Workers.
---

## What I Cover

This skill covers the full lifecycle of GitHub Actions workflows for the GoPayShortcuts project:

- **Workflow Configuration**: Setting up `.github/workflows/` directory and YAML files
- **Frontend Deployment**: Automated deployment of SvelteKit frontend to GitHub Pages
- **Backend Deployment**: Automated deployment of backend to Cloudflare Workers
- **CI/CD Pipelines**: Testing, linting, building, and releasing
- **Branch Protection**: Enforcing quality gates on pull requests
- **Secrets Management**: Secure handling of API keys and deployment tokens
- **Matrix Builds**: Testing across multiple Node.js versions and environments

## Common Patterns

### Frontend Deployment Workflow
```yaml
name: Deploy Frontend
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - run: npm run check
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

### Backend Deployment to Cloudflare Workers
```yaml
name: Deploy Backend
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Cloudflare Workers
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Testing Matrix
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run test
    - run: npm run lint
```

## Best Practices

- **Use Dependabot**: Automate dependency updates with scheduled workflows
- **Cache Dependencies**: Speed up builds with `actions/setup-node` caching
- **Conditional Deployments**: Only deploy on main branch pushes, not PRs
- **Security Scanning**: Integrate CodeQL or other security tools
- **Workflow Templates**: Create reusable workflow templates for consistency
- **Environment Secrets**: Store sensitive data in GitHub Secrets, never in code
- **Status Checks**: Require CI checks to pass before merging PRs
- **Manual Triggers**: Use `workflow_dispatch` for on-demand deployments
- **Concurrent Limits**: Set concurrency controls to prevent multiple deployments
- **Artifact Storage**: Use artifacts for build outputs and test reports

## Related Skills

- **sveltekit-development**: For building the frontend application deployed via GitHub Actions
- **cloudflare-workers**: For backend deployment and worker-specific configurations
- **vite**: For fast development builds and optimizations in CI
- **bun**: For alternative package management and runtime in workflows