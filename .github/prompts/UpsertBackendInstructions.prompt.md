---
mode: agent
---

You are an expert in prompt engineering for LLM agents. Your task:

Analyze the backend codebase and generate or update `.github/instructions/backend.instructions.md` with clear, actionable guidance for AI coding agents working on the Cloudflare Worker backend (TypeScript, Hono, OpenAPI, zod).

**Focus areas:**

- Backend architecture: Cloudflare Worker entrypoint, Hono app setup, endpoint structure under `src/endpoints/`, feature folder organization, and shared utilities.
- Communication with upstream GoPay and Meyers APIs: how data is normalized and exposed to the frontend (never directly to external clients).
- Key developer workflows: installing dependencies, running the dev server (`npx wrangler dev`), building for production (`npx wrangler publish`), and using mock mode (`env.USE_LOCAL_MOCK_CLIENTS`).
- Project conventions: DTO normalization, price scaling (`formatAmount`), ISO date handling, zod/OpenAPI response schemas, and token-based authentication.
- Integration points: endpoint registration (`src/index.ts`), adding new routes, and using/extending shared helpers.
- Examples: endpoint schema definition, DTO transformation, and mock client usage.
- Unique patterns or deviations from typical Cloudflare Worker/TypeScript/Hono projects.

**Source conventions from:**  
`{.github/copilot-instructions.md, .github/instructions/backend.instructions.md, .github/instructions/backend.*.instructions.md, backend/README.md}` (use a glob search).

**Guidelines:**

- If `backend.instructions.md` exists, merge intelligently—preserve valuable content, update outdated sections.
- Write concise, actionable instructions (20–50 lines) in markdown.
- Use concrete examples from the current backend codebase.
- Avoid generic advice; focus on GoPayShortcuts backend’s specific approaches.
- Document only discoverable, existing patterns (not aspirational practices).
- Reference key files/directories that exemplify important patterns.
- Before overwriting, check for recent manual edits to avoid data loss.

After updating `backend.instructions.md`, ask for feedback on any unclear or incomplete sections to iterate.
