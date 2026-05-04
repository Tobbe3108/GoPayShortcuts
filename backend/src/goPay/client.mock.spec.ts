import { describe, it, expect } from 'vitest';
import { GoPayClientMock } from './client.mock';

const clientFactory = () => new GoPayClientMock('http://api');

describe('GoPayClientMock', () => {
  it('getProducts returns menu with kitchen id and products', async () => {
    const client = clientFactory();
    const res = await client.getProducts(1234);
    expect(res.kitchen.id).toBe(1234);
    expect(res.menues?.[0]?.productGroups?.[0]?.products.length ?? 0).toBeGreaterThan(0);
  });

  it('payOrder stores order retrievable via getOrderDetails and can be deleted', async () => {
    const client = clientFactory();
    const deliveries = [
      {
        deliveryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        orderLines: [{ productId: 1, items: 1, buyerParty: 'PRIVATE' }],
      },
    ];

    const payResp = await client.payOrder(1111, 'w', deliveries as any);
    expect(payResp.orderId).toBeDefined();
    const id = payResp.orderId;

    const detail = await client.getOrderDetails(id);
    expect(detail.id).toBe(id);

    const del = await client.deleteOrder(id);
    expect(del.success).toBe(true);

    await expect(client.getOrderDetails(id)).rejects.toBeDefined();
  });

  it('listOrders filters by date range', async () => {
    const client = clientFactory();
    const today = new Date();
    const inDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString();
    const outDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10).toISOString();

    const r1 = await client.payOrder(2222, 'w', [
      { deliveryTime: inDate, orderLines: [{ productId: 1, items: 1, buyerParty: 'PRIVATE' }] },
    ] as any);
    const r2 = await client.payOrder(2222, 'w', [
      { deliveryTime: outDate, orderLines: [{ productId: 2, items: 1, buyerParty: 'PRIVATE' }] },
    ] as any);

    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      .toISOString()
      .slice(0, 10);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)
      .toISOString()
      .slice(0, 10);

    const list = await client.listOrders(start, end);
    expect(list.orders.some((o) => o.id === r1.orderId)).toBe(true);
    expect(list.orders.some((o) => o.id === r2.orderId)).toBe(false);
  });

  it('caches locations and products per kitchen id', async () => {
    const client = clientFactory();

    const loc1 = await client.getLocations();
    const loc2 = await client.getLocations();
    // should return same cached object reference
    expect(loc1).toBe(loc2);

    const p1 = await client.getProducts(5555);
    const p2 = await client.getProducts(5555);
    expect(p1).toBe(p2);
  });
});
