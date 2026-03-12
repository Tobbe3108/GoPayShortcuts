import { describe, it, expect, vi } from 'vitest';
import { MeyersClient } from './client';

describe('MeyersClient error handling', () => {
  it('returns Response when fetch is not ok', async () => {
    const apiUrl = 'https://meyers.err';

    vi.stubGlobal('fetch', async () => ({ ok: false, status: 500, statusText: 'ERR' } as any));

    const client = new MeyersClient(apiUrl);
    const res = await client.getMenu();

    // The client should return the Response-like object unchanged when not ok
    expect((res as any).ok).toBe(false);
    expect((res as any).status).toBe(500);
  });

  it('sends expected headers and body in the POST', async () => {
    const apiUrl = 'https://meyers.post';
    const stub = vi.fn(async (_url: string, options?: any) => {
      expect(_url).toBe(`${apiUrl}/internal/load/frontend`);
      // verify method and JSON body shape
      expect(options.method).toBe('POST');
      const body = JSON.parse(options.body);
      expect(body).toHaveProperty('schoolId');
      expect(options.headers['Content-Type']).toBe('application/json');

      return { ok: true, json: async () => ({}) } as any;
    });

    vi.stubGlobal('fetch', stub as any);

    const client = new MeyersClient(apiUrl);
    await client.getMenu();
    expect(stub).toHaveBeenCalled();
  });
});
