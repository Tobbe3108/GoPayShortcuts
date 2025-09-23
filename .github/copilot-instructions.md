## GoPayShortcuts – AI Agent Quick Context

Purpose: Faster weekly meal ordering vs original GoPay app. Two parts: Svelte static frontend + Cloudflare Worker backend (TypeScript) that normalizes upstream GoPay + Meyers APIs.

### Architecture Snapshot

- Frontend (`frontend/`): Svelte + TypeScript + Tailwind, atomic structure (`lib/components/{atoms,molecules,organisms,templates}`), feature folders under `lib/features` & `routes/` for pages.
- Backend (`backend/`): Cloudflare Worker using Hono + Chanfana OpenAPI routes. Feature directories: `endpoints/{auth,locations,menu,orders,products}` plus shared utils under `endpoints/Shared` and `orders/shared`.
- Integration: Backend wraps external APIs; frontend never talks to GoPay directly. Token-based auth (Bearer) passed via `Authorization` header.

### Key Patterns

- Mock mode: If `env.USE_LOCAL_MOCK_CLIENTS === true` (see `backend/src/types.ts`) backend swaps real GoPay client with `client.mock.ts`.
- Order enrichment: Example in `listOrders.ts`—fetch list then hydrate details (`fetchValidOrderDetails`) -> simplified shape -> sorted.
- Price normalization: Always divide raw amounts using `formatAmount(amount, scale)` before exposing.
- Response contracts: Each endpoint declares a `schema` with zod + OpenAPI metadata; follow that for new endpoints.
- Frontend API access centralized in `lib/services/apiClient.ts`; add one method per backend route + shared error translation.

### Dev Workflow

Frontend:

```
cd frontend
bun install
bun run dev
```

Backend:

```
cd backend
npm install
npx wrangler dev
```

Build: `bun run build` (frontend) / `npx wrangler publish` (backend).

### Conventions

- Tailwind only (avoid custom CSS unless impossible with utilities).
- Store first: shared state (auth, notifications, future planner) lives in `lib/stores` or `lib/features/<feature>/store.ts`.
- Dates: Always ISO `YYYY-MM-DD` between layers (see `listOrders` query params).
- Keep transformation logic backend-side; frontend assumes already simplified domain objects.

### Adding a Backend Endpoint (Recipe)

1. Create file in appropriate `endpoints/<feature>/` dir extending `OpenAPIRoute`.
2. Define `schema` with tags, request (query/body), responses (zod). Reuse helpers in `Schemas`.
3. Acquire client via `createGoPayClient(c)` / `createMeyersClient`.
4. Normalize raw upstream -> minimal DTO. Set short cache header where safe.
5. Export and wire route in `index.ts` (Hono app).

### Common Pitfalls

- Missing Bearer prefix causes 401 (auth store sets header—reuse).
- Forgetting mock mode guard -> tests/future local offline flows break.
- Not stripping scale from monetary fields => inconsistent UI pricing.
- Divergent date boundaries (ensure inclusive week range).

### Key Reference Files

`frontend/src/lib/services/apiClient.ts`, `frontend/src/lib/stores/auth.ts`, `backend/src/index.ts`, `backend/src/types.ts`, `backend/src/endpoints/orders/listOrders.ts`, `backend/src/endpoints/Shared/productUtils.ts`.

### Agent Guidance

- Before refactoring, scan for feature folder analogs to mirror style.
- Prefer adding pure helpers in `Shared` or `orders/shared` vs embedding in handlers.
- Run `bun run check` (frontend) after TS-heavy changes; rely on Wrangler’s type context for backend.
- For new UI feature: scaffold atomic components; defer styling until logic stable.
- Keep instructions concise in PR diffs; avoid speculative patterns not used elsewhere.
