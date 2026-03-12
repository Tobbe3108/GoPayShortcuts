import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductsService } from './productsService';

const mockGetProducts = vi.fn();
vi.mock('$lib/core/api/apiClient', () => ({
  apiClient: { getProducts: (...args: any[]) => mockGetProducts(...args) },
}));

const mockNotifyError = vi.fn();
vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: (...args: any[]) => mockNotifyError(...args) },
}));

describe('ProductsService (extra cases)', () => {
  beforeEach(() => {
    mockGetProducts.mockReset();
    mockNotifyError.mockReset();
  });

  it('throws when apiClient returns Error object', async () => {
    mockGetProducts.mockResolvedValue(new Error('bad'));
    await expect(ProductsService.getProducts(1)).rejects.toBeInstanceOf(Error);
    expect(mockNotifyError).toHaveBeenCalled();
  });

  it('passes along query parameters', async () => {
    const fake = [{ id: 2 }];
    mockGetProducts.mockResolvedValue(fake);
    const out = await ProductsService.getProducts(10);
    expect(out).toEqual(fake);
    expect(mockGetProducts).toHaveBeenCalledWith(10);
  });
});
