// Centralized MSW handlers for common external APIs used in tests.
// We export a factory `createHandlers(rest)` to avoid importing `msw`
// at module top-level (this prevents import-order problems in some
// Vitest+Vite environments). The setup file will call this factory
// once `rest` is available.
export function createHandlers(rest: any) {
  return [
    // Auth: request OTP
    rest.post('http://localhost:8787/api/auth/request-otp', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ success: true }));
    }),

    // Auth: login (returns token + user)
    rest.post('http://localhost:8787/api/auth/login', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ token: 'test-token', user: { id: 'u1', name: 'Test User' } }));
    }),

    // Products list
    rest.get('http://localhost:8787/api/products', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ data: [ { id: 'p1', name: 'Coffee', price: 29 } ] }));
    }),

    // Locations list
    rest.get('http://localhost:8787/api/locations', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ data: [ { id: 'l1', name: 'Main' } ] }));
    }),

    // Menu
    rest.get('http://localhost:8787/api/menu', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ data: [ { id: 'm1', title: 'Breakfast', items: [] } ] }));
    }),

    // Orders: list
    rest.get('http://localhost:8787/api/orders', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ data: [] }));
    }),

    // Orders: create
    rest.post('http://localhost:8787/api/orders', (req: any, res: any, ctx: any) => {
      const id = 'ord-' + Math.random().toString(36).slice(2, 8);
      return res(ctx.status(201), ctx.json({ id, status: 'created' }));
    }),

    // Orders: pay
    rest.post('http://localhost:8787/api/orders/:id/pay', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ status: 'paid' }));
    }),

    // Fallback for other API patterns: return empty data
    rest.get('http://localhost:8787/api/*', (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ data: [] }));
    }),
  ];
}

// Backward-compat: some callers import `handlers` directly.
export const handlers = (rest: any) => createHandlers(rest);

// Plain (non-msw) handlers for environments where MSW cannot be used.
// Each handler is { method, match: (url: string) => boolean, respond: async (req) => { status, body } }
export function createPlainHandlers() {
  return [
    {
      method: 'POST',
      match: (url: string) => url.endsWith('/auth/request-otp'),
      respond: async (req: { url: string; method: string; body?: any }) => ({ status: 200, body: { success: true } })
    },
    {
      method: 'POST',
      match: (url: string) => url.endsWith('/auth/login'),
      respond: async (req: any) => ({ status: 200, body: { token: 'test-token', user: { id: 'u1', name: 'Test User' } } })
    },
    {
      method: 'GET',
      match: (url: string) => url.includes('/products'),
      respond: async () => ({ status: 200, body: { data: [{ id: 'p1', name: 'Coffee', price: 29 }] } })
    },
    {
      method: 'GET',
      match: (url: string) => url.includes('/locations'),
      respond: async () => ({ status: 200, body: { data: [{ id: 'l1', name: 'Main' }] } })
    },
    {
      method: 'GET',
      match: (url: string) => url.includes('/menu'),
      respond: async () => ({ status: 200, body: { data: [{ id: 'm1', title: 'Breakfast', items: [] }] } })
    },
    {
      method: 'GET',
      match: (url: string) => url.includes('/orders'),
      respond: async () => ({ status: 200, body: { data: [] } })
    },
    {
      method: 'POST',
      match: (url: string) => url.includes('/orders') && !/\/pay$/.test(url),
      respond: async () => ({ status: 201, body: { id: 'ord-1', status: 'created' } })
    },
    {
      method: 'POST',
      match: (url: string) => /\/orders\/.+\/pay$/.test(url),
      respond: async () => ({ status: 200, body: { status: 'paid' } })
    },
    // fallback
    {
      method: 'GET',
      match: (url: string) => url.includes('/api'),
      respond: async () => ({ status: 200, body: { data: [] } })
    }
  ];
}
