import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsService } from './productsService';

vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: vi.fn() }
}));

import { notifications } from '$lib/core/notifications/notificationStore';
import { apiClient } from '$lib/core/api/apiClient';

describe('ProductsService', () => {
  beforeEach(() => {
    // preserve hoisted top-level mocks and only clear per-test mock state
    vi.clearAllMocks();
  });

  it('returns products on success', async () => {
    vi.spyOn(apiClient, 'getProducts').mockResolvedValue([{ id: 1, name: 'Burger' }] as any);
    const res = await ProductsService.getProducts(5);
    expect(res).toEqual([{ id: 1, name: 'Burger' }]);
  });

  it('notifies and throws on Error', async () => {
    const err = new Error('nope');
    vi.spyOn(apiClient, 'getProducts').mockResolvedValue(err as any);
    await expect(ProductsService.getProducts(5)).rejects.toBe(err);
    expect((notifications as any).error).toHaveBeenCalled();
  });
});
