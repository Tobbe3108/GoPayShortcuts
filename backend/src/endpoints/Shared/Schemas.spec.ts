import { describe, it, expect } from 'vitest';
import { Schemas } from './Schemas';
import { z } from 'zod';

describe('Schemas', () => {
  it('OrderDetailsSchema accepts valid shape', () => {
    const schema = Schemas.OrderDetailsSchema();
    const valid = {
      id: 1,
      status: 'confirmed',
      deliveries: [
        { id: 2, deliveryTime: '2025-07-20T12:00:00', orderLines: [{ productId: 1, productName: 'x', price: 100, items: 1 }] },
      ],
      kitchen: { id: 3, name: 'k' },
      totalPrice: 100,
    };

    expect(() => schema.parse(valid)).not.toThrow();
  });

  it('ProductSchema rejects missing fields', () => {
    const schema = Schemas.ProductSchema();
    const invalid = { id: 1, name: 'a' };
    expect(() => schema.parse(invalid as any)).toThrow();
  });
});
