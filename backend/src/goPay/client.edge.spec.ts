import { describe, it, expect, vi } from 'vitest';
import { GoPayClient } from './client';

describe('GoPayClient edge cases', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getOrderDetails returns undefined when orders array is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ orders: [] }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }) as any
      ) as any
    );

    const client = new GoPayClient('https://api');
    const res = await client.getOrderDetails(123);
    expect(res).toBeUndefined();
  });

  it('requestOTP throws ApiError when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network'); }) as any);
    const client = new GoPayClient('https://api');
    await expect(client.requestOTP('u@e')).rejects.toMatchObject({ statusCode: 500 });
  });
});
