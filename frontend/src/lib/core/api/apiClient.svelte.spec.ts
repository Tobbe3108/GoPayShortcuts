import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock svelte/store before importing the ApiClient so module resolution succeeds
vi.mock('svelte/store', () => ({
  get: () => ({ token: null }),
}));

// Tests that need auth behaviour should mock the auth store explicitly using vi.mock in the test file
vi.mock('$lib/features/auth/store', () => ({
  authStore: {
    subscribe: (cb: any) => {
      cb({ token: null });
      return () => {};
    },
    requestOTP: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn()
  }
}));

let ApiClient: any;

describe('ApiClient.request', () => {
  let origFetch: any;

  beforeEach(async () => {
    // import the real implementation (ignore any hoisted module mocks)
    const mod = await vi.importActual('./apiClient');
    ApiClient = mod.ApiClient;
    origFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = origFetch;
    vi.restoreAllMocks();
  });

  it('parses JSON when response is ok', async () => {
    const client = new ApiClient('http://api');
    const payload = { hello: 'world' };
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload });

    const res = await client.request('/foo', 'GET');
    expect(res).toEqual(payload);
    expect((globalThis.fetch as any)).toHaveBeenCalledWith('http://api/foo', expect.any(Object));
  });

  it('returns {} for 204 No Content', async () => {
    const client = new ApiClient('http://api');
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });

    const res = await client.request('/empty', 'GET');
    expect(res).toEqual({});
  });

  it('returns Error when response not ok', async () => {
    const client = new ApiClient('http://api');
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, statusText: 'Bad' });

    const res = await client.request('/bad', 'GET');
    expect(res).toBeInstanceOf(Error);
  });

  it('adds Authorization header when token present', async () => {
    const client = new ApiClient('http://api');
    // spy on the private method to return a token
    vi.spyOn(client as any, 'getAuthToken').mockReturnValue('tok-123');

    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });

    await client.request('/auth', 'POST', { a: 1 });

    expect((globalThis.fetch as any)).toHaveBeenCalled();
    const call = (globalThis.fetch as any).mock.calls[0];
    const opts = call[1];
    expect(opts.headers.Authorization).toBe('Bearer tok-123');
  });
});
