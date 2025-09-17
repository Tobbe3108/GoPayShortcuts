# GoPayShortcuts - AI Agent Instructions

## Project Overview

GoPayShortcuts is a system that provides streamlined alternatives to the official GoPay food ordering application. The project consists of:

- **Frontend**: A responsive Svelte app with TypeScript, Tailwind CSS, atomic design components
- **Backend**: A Cloudflare Worker API that wraps and enhances the GoPay API

The system helps users interact with food ordering functionality (menus, products, orders) more efficiently than the original app.

## Architecture

### Frontend (Svelte)

- Single-page application using Svelte with TypeScript
- Atomic design component structure (atoms, molecules, organisms, templates, pages)
- Client-side state management with Svelte stores
- Protected routes requiring authentication
- Built to be hosted as a static site on Azure Static Web Apps

### Backend (Cloudflare Worker)

- API endpoints exposed via a Hono app with OpenAPI documentation
- Integration with both the GoPay API and Meyers API
- Bearer token authentication with middleware for protected routes
- Organized in a feature-based structure (auth, locations, orders, products)

## Key Integration Points

1. **Authentication Flow**:

   - Frontend requests OTP via `authStore.requestOTP(email)`
   - Backend forwards to GoPay API, returning JWT token
   - Token stored in localStorage and included in all subsequent API calls

2. **API Service Pattern**:

   - Frontend uses typed API client (`apiClient.ts`) with method-per-endpoint pattern
   - Backend endpoints use standardized response formats with proper error handling
   - Custom API error handling with user-friendly messages

3. **Data Flow**:
   - API types defined in both frontend and backend for type safety
   - Backend processes and transforms external API responses for frontend consumption
   - Common data models shared between frontend components via stores

## Development Workflow

1. **Frontend Development**:

   ```sh
   cd frontend
   bun install
   bun run dev
   ```

2. **Backend Development**:

   ```sh
   cd backend
   npm install
   npx wrangler dev
   ```

3. **Build & Deploy**:
   - Frontend: `cd frontend && bun run build`
   - Backend: `cd backend && npx wrangler publish`

## Coding Conventions

### Frontend

- Self-documenting code with minimal comments
- Tailwind for all styling (no custom CSS unless necessary)
- Component props for configuration instead of multiple similar components
- Svelte stores for shared state (auth, notifications)
- All API types defined in `lib/types/api.ts`
- Follow atomic design methodology for UI components:
  - Atoms: Basic building blocks (buttons, inputs, icons)
  - Molecules: Simple groups of UI elements functioning together (form fields with labels, search bars)
  - Organisms: Complex UI components composed of molecules and atoms (navigation bars, product cards)
  - Templates: Page layouts without specific content
  - Pages: Specific instances of templates with real content

### Backend

- Structured error handling with consistent response formats
- Feature-based organization of endpoints
- Shared utilities in dedicated folders (priceUtils, productUtils)
- OpenAPI documentation for all endpoints
- Caching strategies for appropriate endpoints (e.g., locations, products)

## Common Pitfalls

1. Authentication token handling (ensure proper Bearer format)
2. Date formatting consistency between frontend and backend (YYYY-MM-DD)
3. Error handling across API boundaries requires careful attention
4. Local development requires `USE_LOCAL_MOCK_CLIENTS` flag for working without live API access

## Key Files to Know

- `frontend/src/lib/services/apiClient.ts`: Core frontend-backend integration
- `backend/src/index.ts`: API routes and middleware configuration
- `backend/src/goPay/client.ts`: External GoPay API integration
- `frontend/src/lib/stores/auth.ts`: Authentication state management
- `backend/src/endpoints/orders/listOrders.ts`: Example of complex endpoint logic

## AI Tool Usage Guidelines

When working with this codebase, use the following tools and approaches:

- **Use TODO Tool**: Break down larger tasks into smaller, manageable steps using the TODO tool to keep track of progress
- **Type Checking**: Run `bun run check` after major changes to verify TypeScript types are correct
