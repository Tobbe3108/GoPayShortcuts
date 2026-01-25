---
name: github-pages-deployment
description: Automated deployment of static sites to GitHub Pages using gh-pages CLI, base path configuration, domain routing, and CI/CD automation for SvelteKit and other static site generators
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers, devops
  domain: deployment-automation
  workflow: continuous-deployment
  updated: "2025-01"
  keywords: github-pages, static-site, deployment, ci-cd, sveltekit, gh-pages
---

## What I do

I guide automated deployment of static sites to GitHub Pages with production-ready patterns. I help you:

- **Deploy SvelteKit static apps** - Configure static export, optimize build output, and automate push to GitHub Pages
- **Configure base paths** - Handle subdirectory deployments (`/repo-name/`) with proper asset routing and SvelteKit config
- **Set up gh-pages automation** - Create npm scripts and GitHub Actions workflows for hands-free deployment
- **Manage custom domains** - Configure CNAME records, handle domain routing, and maintain DNS settings
- **Troubleshoot subpath 404s** - Diagnose and fix routing issues caused by base path misconfiguration
- **Implement CI/CD pipelines** - Automate build, test, and deploy workflows triggered by git events

## When to use me

Load this skill when:

- Deploying a SvelteKit `+page.svelte` app to GitHub Pages (org or project repo)
- Setting up `gh-pages` npm scripts in `package.json` for automated pushes
- Configuring base paths for deployments to `/repo-name/` subdirectories
- Handling custom domain CNAME records and GitHub Pages settings
- Debugging 404 errors on subpaths that work locally but fail in production
- Building GitHub Actions workflows to automate build + deploy on every push
- Migrating from manual deployment to automated CI/CD pipelines

## gh-pages CLI setup and configuration

### Installation and basic usage

Add `gh-pages` as a development dependency:

```bash
npm install --save-dev gh-pages
```

The gh-pages package publishes files from a local directory to the `gh-pages` branch on your repository:

```bash
npx gh-pages -d dist          # Publish dist/ to gh-pages branch
npx gh-pages -d build         # Publish build/ to gh-pages branch
npx gh-pages -d out           # Publish out/ to gh-pages branch
```

**Key flags**:

- `-d <directory>`: Source directory to publish (required)
- `-b <branch>`: Target branch (default: `gh-pages`)
- `-r <repo>`: Repository URL (auto-detected from git)
- `--remove`: Clean old files before deploy (useful for full rebuilds)
- `--dry-run`: Preview what would be published without making changes

### Common deployment patterns

**Pattern 1: Simple publish**

```bash
npm run build
npx gh-pages -d dist
```

**Pattern 2: Publish with cleanup (full rebuild)**

```bash
npm run build
npx gh-pages -d dist --remove
```

**Pattern 3: Publish with custom branch**

```bash
npm run build
npx gh-pages -d dist -b production  # Publish to production branch instead
```

## Base path handling (gh-pages subdirectory)

### The problem: Why base paths matter

When deploying to `https://username.github.io/repo-name/`, all assets are served from `/repo-name/` not `/`. Without proper configuration:

- Links break: `<a href="/about">` goes to `/about` (404) instead of `/repo-name/about`
- Styles fail: `<link rel="stylesheet" href="/styles.css">` breaks
- Routing fails: SPA routes stop working because the router expects `/` but gets `/repo-name/`

### SvelteKit static export with base path

**1. Configure `svelte.config.js`**

```javascript
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.BASE_PATH || ''  // Empty string for org site, '/repo-name' for project site
    }
  }
};
```

**2. Set base path for project repos**

Create `.env` or `.env.production`:

```bash
# For project sites (https://username.github.io/repo-name/)
BASE_PATH=/my-repo

# For org/user sites (https://username.github.io/)
BASE_PATH=
```

**3. Use in npm scripts**

```json
{
  "scripts": {
    "build": "vite build",
    "build:pages": "BASE_PATH=/my-repo vite build",
    "deploy": "npm run build:pages && gh-pages -d build"
  }
}
```

**4. Verify base path in routes**

With proper base path config, SvelteKit's `base` store automatically prepends the base path to all internal links:

```svelte
<script>
  import { base } from '$app/paths';
</script>

<!-- Automatically becomes /my-repo/about in deployed site -->
<a href="{base}/about">About</a>

<!-- Don't use {base} for external links -->
<a href="https://example.com">External</a>
```

### Gotcha: Static assets and import.meta.env.BASE_URL

Some asset loaders need explicit base path handling:

✅ **Correct** - SvelteKit handles this automatically:

```svelte
<img src="/logo.png" alt="Logo" />
<!-- Becomes /my-repo/logo.png when deployed -->
```

❌ **Wrong** - Hardcoded absolute paths:

```svelte
<img src="http://example.com/logo.png" alt="Logo" />
<!-- Won't update base path, may not work offline -->
```

## Automated deployment with npm scripts

### Basic npm script setup

Add to `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d build",
    "deploy:clean": "npm run build && gh-pages -d build --remove"
  }
}
```

Run with:

```bash
npm run deploy         # Standard deployment (preserves old files)
npm run deploy:clean   # Full rebuild (removes old files first)
```

### Advanced: Multi-environment deployment

```json
{
  "scripts": {
    "build": "vite build",
    "build:prod": "BASE_PATH=/my-repo vite build",
    "build:staging": "BASE_PATH=/my-repo-staging vite build",
    "deploy:prod": "npm run build:prod && gh-pages -d build -b gh-pages",
    "deploy:staging": "npm run build:staging && gh-pages -d build -b staging",
    "deploy:local": "npm run build && gh-pages -d build --dry-run"
  }
}
```

### Deployment checklist

Before running `npm run deploy`:

- [ ] All tests pass: `npm test`
- [ ] Build succeeds locally: `npm run build`
- [ ] No uncommitted git changes (gh-pages reads git config)
- [ ] Remote is set: `git remote -v` shows origin
- [ ] Have push permission to repo

## GitHub Actions integration

### Basic workflow: Build and deploy on push

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build static site
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: example.com  # Optional: for custom domains
```

### Advanced workflow: Conditional deployment

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build static site
        env:
          BASE_PATH: ${{ github.ref == 'refs/heads/main' && '/my-repo' || '/my-repo-dev' }}
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Using peaceiris/actions-gh-pages

The `peaceiris/actions-gh-pages@v3` action handles gh-pages branch management automatically:

```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}  # Automatic token from GitHub
    publish_dir: ./build                        # Directory to publish
    cname: example.com                          # Optional: custom domain
    keep_files: true                            # Don't delete old files
    allow_empty_commit: false                   # Don't create empty commits
```

**Why use peaceiris over `gh-pages` npm package**:

- ✅ No need to set git config in CI
- ✅ Handles authentication automatically via GitHub token
- ✅ Works without `node_modules` (pre-built action)
- ✅ Cleaner git history (proper commit messages)

## Custom domain configuration

### Step-by-step: Set up custom domain

**1. Update GitHub Pages settings**

In repo settings → Pages → Custom domain:

- Enter domain: `example.com`
- GitHub creates a `CNAME` file in gh-pages branch

**2. Configure DNS records**

For `example.com` (apex domain):

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

For `www.example.com` (subdomain):

```
Type    Name    Value
CNAME   www     username.github.io
```

Or to alias apex to GitHub Pages:

```
Type    Name    Value
ALIAS   @       username.github.io
ANAME   @       username.github.io
```

**3. Add CNAME to deployment**

Make sure GitHub Actions or local deployment includes the CNAME file. With `peaceiris/actions-gh-pages`:

```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./build
    cname: example.com  # Automatically creates CNAME file
```

Or manually in your build output:

```bash
echo "example.com" > build/CNAME
gh-pages -d build
```

### Troubleshooting DNS propagation

After setting up custom domain, check status:

```bash
# Verify A records point to GitHub
dig example.com

# Should resolve to 185.199.108.153 or 185.199.109.153
```

**Common issues**:

| Problem                | Cause                  | Solution                           |
| ---------------------- | ---------------------- | ---------------------------------- |
| Domain shows 404       | DNS not propagated     | Wait 24 hours, check `dig example.com` |
| HTTPS not working      | Certificate not issued | Remove custom domain, re-add it    |
| Subdomains (like www)  | CNAME not configured   | Add CNAME record for www subdomain |

## Troubleshooting common issues

### Issue 1: 404 on subpaths in production

**Symptom**: Pages work locally but return 404 in production (e.g., `/about` returns 404 but `/` works)

**Root cause**: SPA routing not configured properly for GitHub Pages

**Solution**:

1. **Ensure SvelteKit static adapter is configured**

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/my-repo'  // Set for project repos
    }
  }
};
```

2. **Verify `+page.js` for each route**

Every route needs a `+page.js` or `+page.svelte`:

```
src/routes/
├── +page.svelte          # /
├── about/
│   └── +page.svelte      # /about
└── contact/
    └── +page.svelte      # /contact
```

3. **Build and test locally**

```bash
npm run build
npm run preview  # Test production build
```

4. **Check deployed files**

Visit `https://username.github.io/repo-name/` and verify all routes load.

### Issue 2: Assets not loading (broken images/styles)

**Symptom**: CSS and images don't load; 404 errors in browser console

**Root cause**: Assets using absolute paths instead of relative paths

**Solution**:

```svelte
<!-- ❌ Wrong - hardcoded absolute path -->
<img src="/logo.png" alt="Logo" />
<link rel="stylesheet" href="/styles.css" />

<!-- ✅ Correct - relative path (SvelteKit handles base path) -->
<img src="/logo.png" alt="Logo" />
<link rel="stylesheet" href="/styles.css" />

<!-- Or explicitly use base path -->
<script>
  import { base } from '$app/paths';
</script>
<img src="{base}/logo.png" alt="Logo" />
```

### Issue 3: GitHub Actions deployment fails

**Symptom**: Workflow runs but deployment step fails

**Root causes and solutions**:

| Error | Cause | Solution |
| --- | --- | --- |
| `fatal: could not read Username` | Git auth failed | Ensure `github_token` is set in action |
| `build directory not found` | Wrong publish_dir | Verify directory exists: `ls -la build` |
| `ENOENT: no such file` | Build didn't run | Check npm ci and build steps run successfully |
| `Permission denied` | No write access | Check repo permissions, token scopes |

**Debug checklist**:

```yaml
- name: Debug - List build output
  if: always()
  run: |
    echo "Current directory:"
    pwd
    echo "Build directory contents:"
    ls -la build/

- name: Debug - Check build files
  if: always()
  run: find build -type f | head -20
```

### Issue 4: Base path breaks internal links

**Symptom**: Links work with `https://username.github.io/my-repo/about` but not `https://username.github.io/my-repo/`

**Root cause**: Base path not included in route links

**Solution**:

Use SvelteKit's `base` path helper:

```svelte
<script>
  import { base } from '$app/paths';
</script>

<!-- ✅ Correct -->
<a href="{base}/about">About</a>
<a href="{base}/contact">Contact</a>

<!-- ❌ Wrong -->
<a href="/about">About</a>
<a href="/contact">Contact</a>
```

For navigation with SvelteKit goto:

```javascript
import { goto } from '$app/navigation';

async function navigate() {
  await goto('/about');  // SvelteKit automatically includes base path
}
```

## Best practices for SvelteKit static export

### 1. Pre-render routes explicitly

Use `+page.js` or `+layout.js` to ensure all routes are pre-rendered:

```javascript
// src/routes/[slug]/+page.js
export async function load({ params }) {
  return {
    slug: params.slug
  };
}

export const prerender = true;  // Pre-render this route
```

For dynamic routes with limited entries:

```javascript
// src/routes/blog/[slug]/+page.js
export async function load({ params }) {
  const post = await getPost(params.slug);
  return { post };
}

export async function entries() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export const prerender = true;
```

### 2. Optimize static assets

```javascript
// svelte.config.js
export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/my-repo'
    },
    // Optimize assets
    vitePlugin: {
      ssr: true
    }
  }
};
```

### 3. Minify and compress builds

```json
{
  "scripts": {
    "build": "vite build --mode production",
    "compress": "gzip -r build -k && brotli -r build -k"
  }
}
```

### 4. Use environment variables safely

Store deployment-specific config in environment:

```bash
# .env.local (never commit)
PUBLIC_API_URL=http://localhost:5173/api

# .env.production
PUBLIC_API_URL=https://api.example.com
```

In components:

```svelte
<script>
  const apiUrl = import.meta.env.PUBLIC_API_URL;
</script>
```

### 5. Validate before deploying

**Pre-deployment checklist**:

```bash
# Run tests
npm test

# Build production version
npm run build

# Preview locally
npm run preview

# Check for broken links
npx broken-link-checker http://localhost:5173

# Finally deploy
npm run deploy
```

### 6. Monitor after deployment

```yaml
# .github/workflows/deploy.yml (add after deployment)
- name: Check deployed site
  run: |
    curl -f https://example.com/ || exit 1
    curl -f https://example.com/about || exit 1
    curl -f https://example.com/contact || exit 1
```

## Common deployment patterns

### Pattern 1: Org/User site (https://username.github.io/)

```javascript
// svelte.config.js
export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: ''  // No base path for org site
    }
  }
};
```

Deploy to master/main branch of `username.github.io` repo.

### Pattern 2: Project site (https://username.github.io/repo-name/)

```javascript
// svelte.config.js
export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/repo-name'
    }
  }
};
```

Deploy to gh-pages branch of `repo-name` repo.

### Pattern 3: Multiple environments (staging + production)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

env:
  BASE_PATH_PROD: /my-app
  BASE_PATH_DEV: /my-app-dev

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm test

      - name: Build production
        if: github.ref == 'refs/heads/main'
        env:
          BASE_PATH: ${{ env.BASE_PATH_PROD }}
        run: npm run build

      - name: Build staging
        if: github.ref == 'refs/heads/develop'
        env:
          BASE_PATH: ${{ env.BASE_PATH_DEV }}
        run: npm run build

      - uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: example.com

      - uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/develop'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          destination_dir: staging
```

## Reference

**Official documentation**:

- [SvelteKit adapter-static](https://kit.svelte.dev/docs/adapter-static)
- [SvelteKit paths configuration](https://kit.svelte.dev/docs/configuration#paths)
- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [gh-pages npm package](https://www.npmjs.com/package/gh-pages)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)

**Related skills**:

- [github-actions-templates](../github-actions-templates/SKILL.md) - General GitHub Actions patterns
- [sveltekit-structure](../sveltekit-structure/SKILL.md) - SvelteKit project organization
- [deployment-pipeline-design](../deployment-pipeline-design/SKILL.md) - General CI/CD patterns
