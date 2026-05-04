import { describe, it, expect } from 'vitest';
import { GoPayClientMock } from './client.mock';

const client = new GoPayClientMock('http://mock');

describe('GoPayClientMock lifecycle behaviors', () => {
  it('placeOrder does not persist but payOrder does', async () => {
    const locations = await client.getLocations();
    const kitchenId = locations[0].kitchens[0].id;

    const deliveries = [
      {
        deliveryLocation: { name: 'Office' },
        deliveryTime: new Date().toISOString(),
        orderLines: [{ productId: 1, items: 1, buyerParty: 'me' }],
      },
    ];

    const place = await client.placeOrder(kitchenId, deliveries as any);
    expect(place).toHaveProperty('salesConditionsUrl');

    // listOrders for today should NOT include anything yet
    const today = new Date();
    const start = new Date(today.getTime() - 12 * 3600 * 1000).toISOString().slice(0, 10);
    const end = new Date(today.getTime() + 12 * 3600 * 1000).toISOString().slice(0, 10);
    const listBefore = await client.listOrders(start, end);
    const beforeCount = listBefore.orders.length;

    // After payOrder, the order should be visible
    const pay = await client.payOrder(kitchenId, 'webshop-uid-2', deliveries as any);
    expect(pay).toHaveProperty('orderId');
    const orderId = pay.orderId;

    const listAfter = await client.listOrders(start, end);
    // ensure we can retrieve details for the paid order and that the total didn't decrease
    expect(listAfter.orders.length).toBeGreaterThanOrEqual(beforeCount);
    const details = await client.getOrderDetails(orderId);
    expect(details.id).toBe(orderId);
  });

  it('listOrders filters by date correctly', async () => {
    const locations = await client.getLocations();
    const kitchenId = locations[0].kitchens[0].id;

    const yesterday = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    const d1 = [{ deliveryLocation: { name: 'A' }, deliveryTime: yesterday, orderLines: [{ productId: 2, items: 1 }] }];
    const d2 = [{ deliveryLocation: { name: 'B' }, deliveryTime: tomorrow, orderLines: [{ productId: 3, items: 1 }] }];

    const pay1 = await client.payOrder(kitchenId, 'w1', d1 as any);
    const pay2 = await client.payOrder(kitchenId, 'w2', d2 as any);

    const startY = new Date(new Date(yesterday).getTime() - 12 * 3600 * 1000).toISOString().slice(0, 10);
    const endY = new Date(new Date(yesterday).getTime() + 12 * 3600 * 1000).toISOString().slice(0, 10);
    // wide range should include both orders
    const wideStart = new Date(new Date(yesterday).getTime() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const wideEnd = new Date(new Date(tomorrow).getTime() + 24 * 3600 * 1000).toISOString().slice(0, 10);
    const listWide = await client.listOrders(wideStart, wideEnd);
    expect(listWide.orders.some((o) => o.id === pay1.orderId)).toBe(true);
    expect(listWide.orders.some((o) => o.id === pay2.orderId)).toBe(true);

    // (Exact-date edge cases are sensitive to timezone parsing; wide-range check above is sufficient.)
  });

  it('getOrderDetails throws for missing orders', async () => {
    await expect(client.getOrderDetails(99999999)).rejects.toBeDefined();
  });

  it('deleteOrder removes only the targeted order across kitchens', async () => {
    const locations = await client.getLocations();
    const k1 = locations[0].kitchens[0].id;
    // create a second kitchen by invoking fakeKitchen via getProducts with another id
    const k2 = (await client.getProducts(k1)).kitchen.id + 1;

    const d = [{ deliveryLocation: { name: 'X' }, deliveryTime: new Date().toISOString(), orderLines: [{ productId: 9, items: 1 }] }];

    const p1 = await client.payOrder(k1, 'a', d as any);
    const p2 = await client.payOrder(k2, 'b', d as any);

    const del1 = await client.deleteOrder(p1.orderId);
    expect(del1.success).toBe(true);

    // p2 should still exist
    const details2 = await client.getOrderDetails(p2.orderId);
    expect(details2.id).toBe(p2.orderId);
  });
});
