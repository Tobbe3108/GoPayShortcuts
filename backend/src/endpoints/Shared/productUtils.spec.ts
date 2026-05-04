import { describe, it, expect } from 'vitest';
import { extractProducts } from './productUtils';

const makeProduct = (id: number, name: string, amount?: number, scale?: number) => ({
  id,
  name,
  price: amount !== undefined ? { amount, scale } : undefined,
});

describe('extractProducts', () => {
  it('returns empty when no menues', () => {
    expect(extractProducts({} as any)).toEqual([]);
  });

  it('filters by product group names and maps price', () => {
    const response: any = {
      menues: [
        {
          productGroups: [
            { name: 'Kantinemad', products: [makeProduct(1, 'A', 100, 2)] },
            { name: 'Other', products: [makeProduct(2, 'B', 200, 2)] },
          ],
        },
      ],
    };

    const result = extractProducts(response);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('A');
  });

  it('returns empty when menu has no productGroups', () => {
    const response: any = { menues: [{ productGroups: [] }] };
    expect(extractProducts(response)).toEqual([]);
  });

  it('includes products from Gæster group as well', () => {
    const response: any = {
      menues: [
        {
          productGroups: [
            { name: 'Gæster', products: [makeProduct(3, 'Guest', 250, 2)] },
            { name: 'Other', products: [makeProduct(4, 'C', 300, 2)] },
          ],
        },
      ],
    };

    const result = extractProducts(response);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
    expect(result[0].name).toBe('Guest');
  });

  it('defaults to 0 for products without price information', () => {
    const response: any = {
      menues: [
        {
          productGroups: [
            { name: 'Kantinemad', products: [makeProduct(5, 'NoPrice')] },
          ],
        },
      ],
    };

    const result = extractProducts(response);
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(0);
  });

  it('combines products from multiple matching groups', () => {
    const response: any = {
      menues: [
        {
          productGroups: [
            { name: 'Kantinemad', products: [makeProduct(6, 'K1', 100, 2)] },
            { name: 'Gæster', products: [makeProduct(7, 'G1', 200, 2)] },
          ],
        },
      ],
    };

    const result = extractProducts(response);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.id).sort()).toEqual([6, 7]);
  });

  it('only inspects the first menu and returns empty if it has no productGroups', () => {
    const response: any = {
      menues: [
        { productGroups: [] },
        { productGroups: [{ name: 'Kantinemad', products: [makeProduct(8, 'Later', 100, 2)] }] },
      ],
    };

    const result = extractProducts(response);
    expect(result).toEqual([]);
  });
});
