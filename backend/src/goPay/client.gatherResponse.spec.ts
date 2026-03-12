import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoPayClient } from './client';

describe('GoPayClient.gatherResponse text branches', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('parses application/text as text', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('PLAIN TEXT', { status: 200, headers: { 'content-type': 'application/text' } })) as any);
    const client = new GoPayClient('https://api', 't');
    const res = await client.requestOTP('u@e');
    expect(res).toBe('PLAIN TEXT');
  });

  it('parses text/html as text', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>ok</html>', { status: 200, headers: { 'content-type': 'text/html' } })) as any);
    const client = new GoPayClient('https://api', 't');
    const res = await client.requestOTP('u@e');
    expect(res).toBe('<html>ok</html>');
  });

  it('falls back to text when content-type missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('NO HEADER', { status: 200 })) as any);
    const client = new GoPayClient('https://api', 't');
    const res = await client.requestOTP('u@e');
    expect(res).toBe('NO HEADER');
  });

  it('includes x-api-key header when token provided', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) => {
      // echo back headers so we can inspect
      const headers = (init && (init as any).headers) || {};
      return new Response(JSON.stringify({ headers }), { status: 200, headers: { 'content-type': 'application/json' } });
    }) as any);

    const client = new GoPayClient('https://api', 'my-token');
    const res: any = await client.requestOTP('u@e');
    // depending on HeadersInit shape, header keys may be lowercased
    const sent = res.headers;
    // support both Map-like and plain object
    if (sent.get) {
      expect(sent.get('x-api-key') || sent.get('x-api-key'.toLowerCase())).toBe('my-token');
    } else {
      // plain object
      expect(sent['x-api-key'] || sent['x-api-key'.toLowerCase()]).toBe('my-token');
    }
  });
});
