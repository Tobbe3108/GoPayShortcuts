import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchOrderIdsForPeriod, fetchOrderDetailsChunk } from './ordersClient';
import { apiClient } from './apiClient';

describe('ordersClient', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchOrderIdsForPeriod returns data on success', async () => {
    const start = new Date('2026-03-10');
    const end = new Date('2026-03-12');
    vi.spyOn(apiClient, 'fetchOrderIdsForPeriod' as any).mockResolvedValue({ orders: [{ id: 1 }] } as any);

    const res = await fetchOrderIdsForPeriod(start, end);
    expect(res).toEqual({ orders: [{ id: 1 }] });
  });

  it('fetchOrderIdsForPeriod returns Error when apiClient returns Error', async () => {
    const start = new Date('2026-03-10');
    const end = new Date('2026-03-12');
    const err = new Error('net');
    vi.spyOn(apiClient, 'fetchOrderIdsForPeriod' as any).mockResolvedValue(err as any);

    const res = await fetchOrderIdsForPeriod(start, end);
    expect(res).toBe(err);
  });

  it('fetchOrderDetailsChunk posts orderIds and returns data', async () => {
    const ids = [1, 2, 3];
    vi.spyOn(apiClient, 'request' as any).mockResolvedValue({ orders: [{ id: 1 }] } as any);

    const res = await fetchOrderDetailsChunk(ids);
    expect(res).toEqual({ orders: [{ id: 1 }] });
    expect((apiClient.request as unknown as vi.Mock).mock.calls[0][0]).toBe('/orders');
  });

  it('fetchOrderDetailsChunk forwards Error responses', async () => {
    const ids = [1];
    const err = new Error('chunk-failed');
    vi.spyOn(apiClient, 'request' as any).mockResolvedValue(err as any);

    const res = await fetchOrderDetailsChunk(ids);
    expect(res).toBe(err);
  });
});
