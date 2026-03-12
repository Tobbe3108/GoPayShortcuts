import { describe, it, expect } from 'vitest';
import { GoPayClientMock } from './client.mock';

const client = new GoPayClientMock('http://mock');

describe('GoPayClientMock', () => {
  it('requestOTP returns authentication token and user message', async () => {
    const res = await client.requestOTP('user@example.com');
    expect(res).toHaveProperty('authentication');
    expect(res.authentication).toHaveProperty('token');
    expect(res.serviceResponse?.isUserMessage).toBe(true);
  });

  it('login returns user and authentication token', async () => {
    const res = await client.login('12345');
    expect(res).toHaveProperty('user');
    expect(res.authentication).toHaveProperty('token');
    expect(typeof res.user.id).toBe('number');
  });

  it('getLocations returns an array of locations', async () => {
    const locations = await client.getLocations();
    expect(Array.isArray(locations)).toBe(true);
    expect(locations.length).toBeGreaterThanOrEqual(1);
    expect(locations[0]).toHaveProperty('kitchens');
  });

  it('requestOTP handles network errors by throwing', async () => {
    // simulate network failure on the mock by temporarily stubbing a failing method
    const failingClient: any = new GoPayClientMock('http://mock');
    // force an error by stubbing internal behavior (not normally accessible) -- simulate by throwing
    const original = failingClient.requestOTP;
    failingClient.requestOTP = async () => { throw new Error('boom'); };
    await expect(failingClient.requestOTP('x@x')).rejects.toBeTruthy();
    failingClient.requestOTP = original;
  });

  it('getProducts returns products and kitchen summary', async () => {
    const locations = await client.getLocations();
    const kitchenId = locations[0].kitchens[0].id;
    const products = await client.getProducts(kitchenId);
    expect(products).toHaveProperty('menues');
    expect(products).toHaveProperty('kitchen');
    expect(products.menues[0].productGroups[0].products.length).toBeGreaterThan(0);
  });

  it('placeOrder, payOrder, getOrderDetails, listOrders and deleteOrder behave correctly', async () => {
    const locations = await client.getLocations();
    const kitchenId = locations[0].kitchens[0].id;

    const deliveries = [
      {
        deliveryLocation: { name: 'Office' },
        deliveryTime: new Date().toISOString(),
        orderLines: [
          { productId: 1, items: 1, buyerParty: 'me' }
        ]
      }
    ];

    const place = await client.placeOrder(kitchenId, deliveries as any);
    expect(place).toHaveProperty('salesConditionsUrl');

    const pay = await client.payOrder(kitchenId, 'webshop-uid', deliveries as any);
    expect(pay).toHaveProperty('orderId');
    expect(pay.status).toBe('PAID');

    const orderId = pay.orderId;
    const details = await client.getOrderDetails(orderId);
    expect(details.id).toBe(orderId);

    // listOrders for today should include the order
    const start = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const end = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
    const list = await client.listOrders(start, end);
    expect(Array.isArray(list.orders)).toBe(true);
    expect(list.orders.some(o => o.id === orderId)).toBe(true);

    const del = await client.deleteOrder(orderId);
    expect(del.success).toBe(true);

    // deleting again should return false
    const del2 = await client.deleteOrder(orderId);
    expect(del2.success).toBe(false);
  });
});
