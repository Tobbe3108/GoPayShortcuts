## Agent Tool Usage Policy

Agents MUST aggressively use the following MCP servers and builtin tools for all relevant tasks:

- **GitButler MCP Server**: All Git management (diffs, branch updates, merges, reviews) must be performed via tool calls to the GitButler MCP server. Direct code or shell output is not permitted for Git operations.
- **Sequential Thinking MCP Server**: For any high-level implementation prompt, agents must break down the task using the Sequential Thinking MCP server before proceeding. This ensures structured, stepwise reasoning.
- **context7 MCP Server**: Agents must use the context7 MCP server to fetch up-to-date, relevant documentation for any library, framework, or API referenced in the task. Direct code generation without documentation retrieval is discouraged.
- **Builtin Tools**: Agents should use all available builtin tools for file edits, searches, error checks, and other actionable steps. Tool calls are preferred over direct output or reasoning.

### Tool Usage Recipes

1. **Git Operations**: Always call the GitButler MCP server for diffs, branch management, merges, and reviews. Example: `mcp_gitbutler_gitbutler_update_branches` for branch updates.
2. **Task Breakdown**: For complex or ambiguous prompts, invoke the Sequential Thinking MCP server to generate a stepwise plan before any code or context action.
3. **Documentation Retrieval**: Use context7 MCP server to fetch documentation before implementing or refactoring code involving external libraries.
4. **File and Workspace Actions**: Use builtin tools for file edits, searches, error checks, and other workspace actions. Avoid direct code output unless tool calls are exhausted or unavailable.

### Enforcement

Agents must justify any deviation from tool/MCP usage. Preference is always given to tool calls for reliability, traceability, and context alignment.

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
