import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoPayClient } from './client';

describe('GoPayClient.listOrders pagination', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('aggregates multiple pages when pagination nextLink contains offset', async () => {
    const apiUrl = 'https://gopay.test';
    const page1 = {
      orders: [{ id: 1 }],
      pagination: { nextLink: { href: '/orders?offset=50&limit=50' } },
    };
    const page2 = {
      orders: [{ id: 2 }],
    };

    // stub fetch to return page1 then page2 using real Response objects
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(page1), { status: 200, headers: { 'content-type': 'application/json' } }) as any)
      .mockResolvedValueOnce(new Response(JSON.stringify(page2), { status: 200, headers: { 'content-type': 'application/json' } }) as any);

    vi.stubGlobal('fetch', fetchMock as any);

    const client = new GoPayClient(apiUrl);
    const result = await client.listOrders('2023-01-01', '2023-01-31');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.orders.map((o: any) => o.id)).toEqual([1, 2]);
  });

  it('returns early when non-ok response is encountered', async () => {
    const apiUrl = 'https://gopay.test';
    // return an actual non-ok Response so the code sees an instanceof Response
    vi.stubGlobal('fetch', async () => new Response('error', { status: 500, headers: { 'content-type': 'text/plain' } }) as any);

    const client = new GoPayClient(apiUrl);
    const response = await client.listOrders('2023-01-01', '2023-01-31');

    // Should return a Response-like object (not throw)
    expect((response as any).ok).toBe(false);
  });
});
