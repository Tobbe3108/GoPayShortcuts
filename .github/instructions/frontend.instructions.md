---
applyTo: "frontend/**"
---

# GoPayShortcuts Frontend – AI Agent Instructions

## Overview

The GoPayShortcuts frontend is a static Svelte + TypeScript + Tailwind webapp, designed for rapid, maintainable development. It uses atomic design, feature-based folders, and a strict separation from backend logic. All backend communication is via a centralized API client; the frontend never talks directly to GoPay or Meyers APIs.

## Architecture & Structure

- **Atomic Components**: Located in `src/lib/components/{atoms,molecules,organisms,templates}`
  - _Atoms_: Basic UI (e.g., `Button.svelte`, `Input.svelte`, `Label.svelte`, `Card.svelte`, `Icon.svelte`, `Quantity.svelte`, `Select.svelte`)
  - _Molecules_: Small UI groups (e.g., `FormField.svelte`)
  - _Organisms_: Complex UI (e.g., `AuthForm.svelte`, `OrderCard.svelte`)
  - _Templates_: Page layouts (e.g., `MainLayout.svelte`, `LoginLayout.svelte`)
- **Feature Folders**: Domain logic, state, and services in `src/lib/features/<feature>` (e.g., `auth`, `orders`, `menu`, `products`, `locations`).
- **Routing**: SvelteKit pages in `src/routes/` (e.g., `/login`, `/orders`).

## API & Data Flow

- **API Access**: All backend calls go through `src/lib/core/api/apiClient.ts`. Add new methods here for new endpoints. Never call GoPay/Meyers APIs directly.
- **Auth**: Auth state is managed in `features/auth/store.ts` and injected into API requests. Token is persisted via store logic, not direct localStorage use.
- **Error Handling**: Centralized in the API client and surfaced to the UI via the notification store (`core/notifications/notificationStore.ts`).
- **Data Shape**: Frontend expects backend-normalized, minimal domain objects (e.g., prices already formatted, dates as ISO `YYYY-MM-DD`). No transformation logic in the UI.

## State Management

- **Store-First**: Shared state lives in `lib/features/<feature>/store.ts` (e.g., `authStore`). Use Svelte stores for all cross-component state. Only persist state via store logic.

## Styling & UI

- **Tailwind Only**: All styling uses Tailwind classes. Avoid custom CSS unless impossible with utilities.
- **Responsive**: Mobile-first, with desktop layouts using flex/grid.
- **Atomic Usage Example**:
  ```svelte
  <Button variant="primary" onclick={saveOrder}>Save</Button>
  <FormField id="email" label="Email" bind:value={email} />
  <Quantity value={qty} onChange={setQty} />
  ```

## Developer Workflow

- **Always install packages in the correct folder:**
  - Run `bun install` **only in the `frontend/` folder**. Never run it in the project root.
- Start dev server: `bun run dev`
- Build for production: `bun run build`
- Type check: `bun run check`

## Conventions & Patterns

- **Dates**: Always use ISO `YYYY-MM-DD` between layers.
- **No transformation in UI**: All data shaping/normalization is backend-side.
- **Auth**: Token is stored in `authStore` and injected into API requests.
- **Error Handling**: Use notification store for user-facing errors.
- **Adding API Methods**: Extend `apiClient.ts` and update feature stores/services as needed.

## Integration Points

- **Authentication**: Managed in `features/auth/store.ts` and used throughout the app. Login flow is handled in `routes/login/+page.svelte` and `AuthForm.svelte`.
- **Notifications**: Use `core/notifications/notificationStore.ts` for all user-facing messages and errors.
- **Environment Variables**: Set in `.env` files and imported via `core/config/environment.ts`.

## Examples

- **Atomic Component Usage**:
  ```svelte
  <Button variant="primary" onclick={saveOrder}>Save</Button>
  <FormField id="email" label="Email" bind:value={email} />
  <Quantity value={qty} onChange={setQty} />
  ```
- **Feature Folder Structure**:
  - `features/auth/`: Auth logic, store, and UI
  - `features/orders/`: Order logic, store, and UI

## Key Files & Directories

- `src/lib/components/` – Atomic UI components
- `src/lib/features/` – Feature logic, stores, and services
- `src/lib/core/api/apiClient.ts` – Centralized API client
- `src/lib/core/notifications/notificationStore.ts` – Notification store
- `src/routes/` – SvelteKit page routing

---

If any pattern or integration is unclear, consult the feature folder or atomic component for concrete examples. Document only discoverable patterns, not aspirational practices.

- `src/lib/features/` – Feature logic, stores, and models
- `src/lib/core/api/apiClient.ts` – Centralized API client
- `src/lib/features/auth/store.ts` – Auth state management
- `src/routes/` – SvelteKit page routing

## Unique Patterns

- **No direct GoPay/Meyers API calls**: Always use backend endpoints via API client.
- **Atomic + Feature hybrid**: UI is atomic, logic is feature-based.
- **Store-driven auth and notifications**: All global state via Svelte stores.
