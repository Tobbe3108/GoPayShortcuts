---
applyTo: "backend/**"
---

# GoPayShortcuts Backend – AI Agent Instructions

This backend is a TypeScript Cloudflare Worker using Hono and Chanfana OpenAPI routes. It acts as a secure API gateway between the Svelte frontend and upstream GoPay/Meyers APIs, normalizing and exposing only the required endpoints. The backend never exposes upstream APIs directly to clients.

## Key Architecture & Patterns

- **Entrypoint:** `backend/src/index.ts` sets up the Hono app, applies CORS and global auth middleware, and registers all endpoint routes. Add new routes with `app.route("/api/feature", FeatureRoute)`.
- **Endpoints:** Feature folders under `src/endpoints/{auth,locations,menu,orders,products}`. Each endpoint is a class extending `OpenAPIRoute` with a static `schema` (zod + OpenAPI) and an async `handle` method.
- **Shared Utilities:** Common helpers (e.g., price formatting, DTO normalization) live in `endpoints/Shared/` and `orders/shared/`.
- **Mock Mode:** If `env.USE_LOCAL_MOCK_CLIENTS === true` (see `src/types.ts`), the backend uses `client.mock.ts` for upstream calls, enabling local/offline development.
- **DTO Normalization:** Always transform upstream data to minimal, frontend-ready DTOs. Example from `productUtils.ts`:
  ```ts
  return productGroup.products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatAmount(product.price?.amount, product.price?.scale),
  }));
  ```
- **Price Scaling:** Use `formatAmount(amount, scale)` to normalize all monetary values before returning them.
- **Date Handling:** Use ISO `YYYY-MM-DD` for all date fields between layers (see `listOrders.ts`).
- **Response Schemas:** Each endpoint defines a `schema` with zod and OpenAPI metadata. Example:
  ```ts
  export class Login extends OpenAPIRoute {
    schema = {
      tags: ["Auth"],
      summary: "Login with one-time password (OTP)",
      request: { body: { ...contentJson(z.object({ otp: z.string() })) } },
      responses: { "200": { ...contentJson(z.object({ token: z.string() })) } },
    };
  }
  ```
- **Authentication:** All endpoints (except login, request-otp, menu) require a Bearer token in the `Authorization` header. Global middleware enforces this:
  ```ts
  app.use("/api/*", async (c, next) => {
    let token = c.req.header("Authorization");
    if (!token?.startsWith("Bearer"))
      return c.text("Missing or invalid Authorization header", 401);
    await next();
  });
  ```
- **Error Handling:** Use try/catch and return normalized error responses. Use shared schemas for error responses (see `Schemas.InternalServerError`).
- **Upstream Integration:** Use `createGoPayClient(c)` or `createMeyersClient(c)` to acquire API clients, which auto-switch to mock mode if enabled.

## Developer Workflow

- Install: `npm install` (in `backend/`)
- Dev Server: `npx wrangler dev`
- Build/Deploy: `npx wrangler publish`
- Config: See `wrangler.jsonc` for environment variables and bindings.

## Adding an Endpoint (Recipe)

1. Create a file in `src/endpoints/<feature>/` extending `OpenAPIRoute`.
2. Define a zod schema for request/response using shared helpers from `Schemas.ts`.
3. Use `createGoPayClient(c)` or `createMeyersClient(c)` to call upstream APIs.
4. Normalize upstream data to DTOs, using helpers from `Shared/`.
5. Register the route in `src/index.ts`.

## References

- `backend/src/index.ts` – Hono app and route registration
- `backend/src/endpoints/Shared/` – Common helpers
- `backend/src/types.ts` – Env and mock mode
- `backend/README.md` – Project overview

## Common Pitfalls

- Not using `formatAmount` for prices (causes UI bugs)
- Forgetting to enable mock mode for local/offline dev
- Missing Bearer prefix in `Authorization` header
- Not normalizing upstream data (leaks raw API fields)
