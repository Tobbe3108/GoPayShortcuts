import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Partially mock svelte store: keep real exports but override `get`
vi.mock('svelte/store', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, get: vi.fn() };
});

import { ApiClient } from './apiClient';
import { get } from 'svelte/store';

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes Authorization header when token present and returns parsed json', async () => {
    (get as unknown as vi.Mock).mockReturnValue({ token: 'abc123' });

    const mockResponse = { status: 200, ok: true, statusText: '', json: async () => ({ success: true }) } as any;
    vi.stubGlobal('fetch', vi.fn(async () => mockResponse));

    const client = new ApiClient('http://base');
    const res = await client.request('/path', 'POST', { a: 1 });

    expect(global.fetch).toHaveBeenCalled();
    const [[url, opts]] = (global.fetch as unknown as vi.Mock).mock.calls;
    expect(url).toBe('http://base/path');
    expect(opts.method).toBe('POST');
    expect(opts.headers.Authorization).toBe('Bearer abc123');
    expect(opts.body).toBe(JSON.stringify({ a: 1 }));
    expect(res).toEqual({ success: true });
  });

  it('returns empty object for 204 No Content', async () => {
    (get as unknown as vi.Mock).mockReturnValue({ token: undefined });
    const mockResponse = { status: 204, ok: true } as any;
    vi.stubGlobal('fetch', vi.fn(async () => mockResponse));

    const client = new ApiClient('http://base');
    const res = await client.request('/empty', 'GET');

    expect(res).toEqual({});
  });

  it('returns Error for non-ok responses', async () => {
    (get as unknown as vi.Mock).mockReturnValue({ token: undefined });
    const mockResponse = { status: 404, ok: false, statusText: 'Not Found' } as any;
    vi.stubGlobal('fetch', vi.fn(async () => mockResponse));

    const client = new ApiClient('http://base');
    const res = await client.request('/missing', 'GET');

    expect(res).toBeInstanceOf(Error);
    expect((res as Error).message).toBe('Not Found');
  });

  it('requestOTP wrapper calls request with correct payload', async () => {
    (get as unknown as vi.Mock).mockReturnValue({ token: 'tok' });
    const mockResponse = { status: 200, ok: true, statusText: '', json: async () => ({ otpSent: true }) } as any;
    vi.stubGlobal('fetch', vi.fn(async () => mockResponse));

    const client = new ApiClient('http://base');
    const res = await client.requestOTP('me@example.com');

    expect(global.fetch).toHaveBeenCalled();
    const [[url, opts]] = (global.fetch as unknown as vi.Mock).mock.calls;
    expect(url).toBe('http://base/request-otp');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toEqual({ email: 'me@example.com' });
    expect(res).toEqual({ otpSent: true });
  });
});
