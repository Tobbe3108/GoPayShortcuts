# GoPay Bad Edition

A static Svelte webapp and Cloudflare Worker backend providing fast, user-friendly shortcuts to features from GoPay.

## Overview

- **Frontend:** Svelte + TypeScript, styled with Tailwind, static site, responsive, no backend dependencies, deployable to GitHub Pages.
- **Backend:** Cloudflare Worker (TypeScript, ES modules), provides API endpoints, integrates with GoPay/Meyers, secure and scalable.

## Structure

- `frontend/` — Svelte app (static, responsive, Azure-ready)
- `backend/` — Cloudflare Worker (API, integrations)
- `docs/` — HTTP call samples, API docs
- `static/` — Static assets (images, etc)

## Quick Start

### Frontend

```sh
cd frontend
bun install
bun run dev
```

### Backend

```sh
cd backend
npm install
npx wrangler dev
```

## License

See [LICENSE](./LICENSE)
