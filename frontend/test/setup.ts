// Frontend test setup - jsdom environment with Svelte support
// IMPORTANT: This setup blocks all real network requests to prevent accidental API calls

import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { readable } from 'svelte/store';
// We create and start an MSW server dynamically in beforeAll to avoid
// import-order and resolution issues across different environments.
let server: any = null;

// =============================================================================
// MSW (network mocking) and test isolation
// =============================================================================
// Use MSW server to handle HTTP requests in tests. When the server is active
// we allow fetch() to be called (MSW intercepts it). If a test needs to assert
// that no network calls are made, use vi.stubGlobal('fetch', ...) inside that
// test explicitly.
beforeAll(async () => {
  // Dynamically import MSW to avoid static resolution problems in certain
  // environments used by Vitest + Vite. Be defensive about import shapes:
  // some bundlers expose the API on the default export while others expose
  // it on the named exports. Normalize both shapes here.
  // Import with several fallbacks because `msw` uses conditional exports
  // and some bundlers (vite) may not resolve the 'msw/node' subpath.
  async function tryImports(candidates: string[]) {
    for (const c of candidates) {
      try {
        // eslint-disable-next-line no-await-in-loop
        return await import(c);
      } catch (e) {
        // try next
      }
    }
    return null;
  }

  let mswNode = await tryImports([
    'msw/node',
    'msw/lib/node/index.mjs',
    'msw/lib/node/index.js',
    'msw/node/index.mjs'
  ]);

  let mswPkg = await tryImports([
    'msw',
    'msw/lib/core/index.mjs',
    'msw/lib/core/index.js'
  ]);

  // As a last resort, use Node's createRequire to load CommonJS exports
  // directly. This bypasses Vite's ESM import analysis which can choke on
  // conditional exports like `msw/node`.
  if ((!mswNode || !mswPkg) && typeof process !== 'undefined') {
    try {
      const { createRequire } = await import('module');
      const req = createRequire(import.meta.url);
      if (!mswPkg) {
        // main package (may be CommonJS)
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // @ts-ignore - runtime require
        mswPkg = req('msw');
      }
      if (!mswNode) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        // @ts-ignore - runtime require
        mswNode = req('msw/node');
      }
    } catch (e) {
      // ignore - fallback handled below
    }
  }

  // Normalize exports: some environments expose APIs on the module namespace,
  // others under `default`. Try several fallbacks and accept a function as
  // a valid `setupServer` and an object with `.get` as a valid `rest`.
  const maybe = (m: any, key: string) => {
    if (!m) return undefined;
    if (m[key]) return m[key];
    if (m.default && m.default[key]) return m.default[key];
    if (m.default && typeof m.default === 'function' && key === 'setupServer') return m.default;
    if (typeof m === 'function' && key === 'setupServer') return m;
    return undefined;
  };

  const setupServer = maybe(mswNode, 'setupServer');
  const rest = maybe(mswPkg, 'rest');

  // Additional sanity: sometimes `msw` exposes `rest` on the default export
  // as the module itself (msw.default.rest) or as the module (msw.rest).
  const restCandidate = rest ?? (mswPkg ? (mswPkg.default ?? mswPkg) : undefined);
  const restIsValid = restCandidate && typeof restCandidate.get === 'function';

  // If MSW is not usable in this environment, fall back to a plain fetch
  // shim that uses our simple handler set. This keeps tests runnable
  // without depending on `msw/node` conditional exports resolution.
  const restApi = rest ?? restCandidate;
  if (!setupServer || !restIsValid) {
    // load plain handlers and stub global.fetch
    try {
      const handlersMod = await import('./msw/handlers');
      const plainFactory = handlersMod.createPlainHandlers;
      const plain = typeof plainFactory === 'function' ? plainFactory() : [];

      // simple fetch shim that routes requests to plain handlers
      vi.stubGlobal('fetch', async (input: any, init: any) => {
        const url = typeof input === 'string' ? input : input?.url?.toString?.() || String(input);
        const method = (init?.method || (input && input.method) || 'GET').toUpperCase();

        for (const h of plain) {
          if ((h.method || 'GET').toUpperCase() !== method) continue;
          try {
            if (h.match(url)) {
              const out = await h.respond({ url, method, body: init?.body });
              const body = out.body ?? null;
              return {
                ok: (out.status || 200) < 300,
                status: out.status || 200,
                json: async () => body,
                text: async () => JSON.stringify(body)
              } as any;
            }
          } catch (e) {
            return Promise.reject(e);
          }
        }

        // no handler matched
        return Promise.reject(new Error(`[TEST NETWORK ERROR] Unmocked request: ${method} ${url}`));
      });
    } catch (e) {
      // If even plain handlers can't be loaded, stub fetch to error to prevent real network calls
      vi.stubGlobal('fetch', async (_: any) => {
        return Promise.reject(new Error('[TEST NETWORK ERROR] network requests disabled in tests'));
      });
    }
    // No MSW server; continue with the rest of setup (localStorage, mocks)
    setupServer; // noop to satisfy linter
  }

  // If MSW is usable in this environment, load the MSW handlers and start
  // the server. Otherwise we already stubbed `fetch` above and should not
  // attempt to call MSW APIs.
  if (setupServer && restIsValid) {
    // Try to load centralized handlers written for the project. Handlers files
    // should export a `createHandlers(rest)` factory that returns an array of
    // MSW handlers. If that module is missing or errors, fall back to a
    // minimal default handler that returns an empty data array.
    let handlers: any[] = [];
    try {
      const handlersMod = await import('./msw/handlers');
      const factory = handlersMod.createHandlers ?? handlersMod.handlers ?? handlersMod.default;
      if (typeof factory === 'function') {
        handlers = factory(restApi);
      } else if (Array.isArray(factory)) {
        handlers = factory.map((h: any) => h);
      }
    } catch (err) {
      // If importing MSW handlers failed, try to use a plain (non-msw)
      // handler set that the handlers module may expose and adapt it to
      // MSW-style handlers.
      try {
        const handlersModAlt = await import('./msw/handlers');
        const plainFactory = handlersModAlt.createPlainHandlers;
        if (typeof plainFactory === 'function') {
          const plain = plainFactory();
          handlers = plain.map((h: any) => {
            const urlMatch = h.match;
            const method = (h.method || 'GET').toUpperCase();
            const restMethod = restApi[method.toLowerCase()];
            if (!restMethod) return null;
            return restMethod(
              'http://localhost:8787/api/*',
              async (req: any, res: any, ctx: any) => {
                const url = req.url.href || req.url.toString();
                if (!urlMatch(url)) return res(ctx.status(404));
                const out = await h.respond(req);
                return res(ctx.status(out.status || 200), ctx.json(out.body));
              }
            );
          }).filter(Boolean);
        }
      } catch (err2) {
        // fall back to a minimal handler
        handlers = [
          restApi.get('http://localhost:8787/api/*', (req: any, res: any, ctx: any) => {
            return res(ctx.status(200), ctx.json({ data: [] }));
          })
        ];
      }
    }

    server = setupServer(...handlers);
    server.listen({ onUnhandledRequest: 'error' });
  } else {
    // MSW not usable; tests rely on the fetch shim installed above.
    server = null;
  }

  // Provide a simple in-memory localStorage mock for tests and modules evaluated at import time
  const storage: Record<string, string> = {};
  const localStorageMock = {
    getItem: (k: string) => (k in storage ? storage[k] : null),
    setItem: (k: string, v: string) => { storage[k] = String(v); },
    removeItem: (k: string) => { delete storage[k]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
  };
  vi.stubGlobal('localStorage', localStorageMock);
  // Keep XMLHttpRequest blocked to surface code that uses it accidentally
  vi.stubGlobal('XMLHttpRequest', class {
    open() { throw new Error('[TEST ISOLATION ERROR] XMLHttpRequest blocked'); }
  });
});

afterEach(() => {
  if (server) server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  if (server) server.close();
});

// =============================================================================
// SvelteKit Module Mocks
// =============================================================================
vi.mock('$app/environment', () => ({
  browser: true,
  dev: false,
  building: false,
  version: 'test'
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn(),
  invalidate: vi.fn(),
  invalidateAll: vi.fn(),
  preloadData: vi.fn(),
  preloadCode: vi.fn(),
  onNavigate: vi.fn(),
  pushState: vi.fn(),
  replaceState: vi.fn(),
  disableScrollHandling: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: readable({
    url: new URL('http://localhost'),
    params: {},
    route: { id: '/' },
    status: 200,
    error: null,
    data: {},
    state: {},
    form: null
  }),
  navigating: readable(null),
  updated: {
    check: vi.fn(),
    subscribe: readable(false).subscribe
  }
}));

vi.mock('$env/dynamic/public', () => ({
  env: {
    PUBLIC_API_BASE_URL: 'http://localhost:8787/api'
  }
}));

vi.mock('$env/static/public', () => ({
  PUBLIC_API_BASE_URL: 'http://localhost:8787/api'
}));

// Mock svelte-i18n to provide a simple translation store for tests
vi.mock('svelte-i18n', () => {
  const { readable } = require('svelte/store');
  // provide `_` as a readable store whose value is a translate function
  const translate = (id: string) => id;
  const _store = readable(translate);

  return {
    // components use $_('id') where $_ is the unwrapped value of `_` (a function)
    _: _store,
    // minimal locale store
    locale: readable('en'),
  };
});

// Note: do NOT mock '$lib/core/api/apiClient' globally here — many unit tests
// exercise its real implementation and expect to import the real ApiClient.
// Tests that need to avoid network calls should mock the specific service
// modules (e.g. productsService, menuService) or stub global.fetch in-test.
