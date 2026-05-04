import { describe, it, expect } from 'vitest';
import { Schemas } from './Schemas';

describe('Schemas edge cases', () => {
  it('OrderDetailsSchema rejects when totalPrice is string', () => {
    const schema = Schemas.OrderDetailsSchema();
    const invalid = {
      id: 1,
      status: 'confirmed',
      deliveries: [
        { id: 2, deliveryTime: '2025-07-20T12:00:00', orderLines: [{ productId: 1, productName: 'x', price: 100, items: 1 }] },
      ],
      kitchen: { id: 3, name: 'k' },
      totalPrice: '100',
    } as any;

    expect(() => schema.parse(invalid)).toThrow();
  });

  it('LocationSchema requires kitchenId', () => {
    const schema = Schemas.LocationSchema();
    expect(() => schema.parse({ name: 'A' } as any)).toThrow();
  });
});
