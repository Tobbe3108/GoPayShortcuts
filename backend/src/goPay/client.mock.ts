import { GoPayClient } from "./client";
import {
  RequestOTPResponse,
  LoginResponse,
  Location,
  ListOrdersResponse,
  PlaceOrderResponse,
  PayOrderResponse,
  DeleteOrderResponse,
  OrderDelivery,
  DetailedOrder,
  ProductsResponse,
} from "./types";

export class GoPayClientMock extends GoPayClient {
  private static nextOrderId = 1;
  private static nextUserId = 1;
  private static token = "mock-token";
  private static user = {
    id: GoPayClientMock.nextUserId++,
    username: "mock@user.com",
    userTypeId: 1,
    userType: "mock",
    userGroupId: 1,
    companyId: 1,
    uid: "mock-uid",
    companyAuthenticationType: "mock",
  };

  private static locations: Location[] = [
    {
      id: 1,
      name: "Mock Location",
      kitchens: [
        {
          id: 1,
          uid: "kitchen-1",
          name: "Mock Kitchen",
          address: {
            id: 1,
            streetName: "Mock St",
            streetNumber: "1",
            postalCode: "12345",
            city: "Mock City",
            country: "Mockland",
          },
          webshops: [
            { id: 1, name: "Mock Webshop", uid: "webshop-1", demoMode: false },
          ],
          brandingDetails: { imageUrl: "" },
        },
      ],
    },
    {
      id: 2,
      name: "Another Mock Location",
      kitchens: [
        {
          id: 2,
          uid: "kitchen-2",
          name: "Another Mock Kitchen",
          address: {
            id: 2,
            streetName: "Another St",
            streetNumber: "2",
            postalCode: "54321",
            city: "Another City",
            country: "Anotherland",
          },
          webshops: [
            {
              id: 2,
              name: "Another Mock Webshop",
              uid: "webshop-2",
              demoMode: false,
            },
          ],
          brandingDetails: { imageUrl: "" },
        },
      ],
    },
    {
      id: 3,
      name: "Third Mock Location",
      kitchens: [
        {
          id: 3,
          uid: "kitchen-3",
          name: "Third Mock Kitchen",
          address: {
            id: 3,
            streetName: "Third St",
            streetNumber: "3",
            postalCode: "67890",
            city: "Third City",
            country: "Thirdland",
          },
          webshops: [
            {
              id: 3,
              name: "Third Mock Webshop",
              uid: "webshop-3",
              demoMode: false,
            },
          ],
          brandingDetails: { imageUrl: "" },
        },
      ],
    },
  ];

  private static products: ProductsResponse = {
    menues: [
      {
        date: new Date().toISOString().split("T")[0],
        displayDate: "Today",
        productGroups: [
          {
            id: 1,
            name: "Main",
            products: [
              {
                id: 1,
                subject: "Lunch",
                name: "Mock Sandwich",
                description: "A delicious mock sandwich.",
                price: {
                  amount: 50,
                  scale: 2,
                  currency: "DKK",
                  formatted: "50.00 DKK",
                },
                imageUrl: "",
                orderDetails: { availability: { isAvailable: true } },
                userDetails: { favoriteType: "none", canFavorite: false },
                productType: "food",
                kitchen: {
                  id: 1,
                  name: "Mock Kitchen",
                  streetName: "Mock St",
                  streetNumber: "1",
                  postalCode: "12345",
                  webshop: {
                    id: 1,
                    name: "Mock Webshop",
                    uid: "webshop-1",
                    demoMode: false,
                  },
                  brandingDetails: { imageUrl: "" },
                },
                cardDetails: { imageUrl: "", cardColor: "#fff" },
              },
            ],
          },
          {
            id: 2,
            name: "Mock Dessert",
            description: "A delicious mock dessert.",
            price: {
              amount: 30,
              scale: 2,
              currency: "DKK",
              formatted: "30.00 DKK",
            },
            imageUrl: "",
            orderDetails: { availability: { isAvailable: true } },
            userDetails: { favoriteType: "none", canFavorite: false },
            productType: "food",
            kitchen: {
              id: 1,
              name: "Mock Kitchen",
              streetName: "Mock St",
              streetNumber: "1",
              postalCode: "12345",
              webshop: {
                id: 1,
                name: "Mock Webshop",
                uid: "webshop-1",
                demoMode: false,
              },
              brandingDetails: { imageUrl: "" },
            },
            cardDetails: { imageUrl: "", cardColor: "#fff" },
          },
          {
            id: 3,
            name: "Mock Beverage",
            description: "A refreshing mock beverage.",
            price: {
              amount: 20,
              scale: 2,
              currency: "DKK",
              formatted: "20.00 DKK",
            },
            imageUrl: "",
            orderDetails: { availability: { isAvailable: true } },
            userDetails: { favoriteType: "none", canFavorite: false },
            productType: "beverage",
            kitchen: {
              id: 1,
              name: "Mock Kitchen",
              streetName: "Mock St",
              streetNumber: "1",
              postalCode: "12345",
              webshop: {
                id: 1,
                name: "Mock Webshop",
                uid: "webshop-1",
                demoMode: false,
              },
              brandingDetails: { imageUrl: "" },
            },
            cardDetails: { imageUrl: "", cardColor: "#fff" },
          },
        ],
      },
    ],
    kitchen: {
      id: 1,
      name: "Mock Kitchen",
      streetName: "Mock St",
      streetNumber: "1",
      postalCode: "12345",
      webshop: {
        id: 1,
        name: "Mock Webshop",
        uid: "webshop-1",
        demoMode: false,
      },
      brandingDetails: { imageUrl: "" },
    },
  };

  private orders: DetailedOrder[] = [];

  async requestOTP(email: string): Promise<RequestOTPResponse> {
    return {
      authentication: { token: GoPayClientMock.token, type: "mock" },
      authenticationResult: {
        type: "mock",
        action: "otp",
        message: "OTP sent",
      },
      serviceResponse: { isUserMessage: true },
    };
  }

  async login(otp: string): Promise<LoginResponse> {
    return {
      user: GoPayClientMock.user,
      authentication: { token: GoPayClientMock.token },
      authenticationResult: {
        type: "mock",
        action: "login",
        message: "Login successful",
      },
      authenticationByType: { type: "mock", value: otp },
    };
  }

  async getLocations(): Promise<Location[]> {
    return GoPayClientMock.locations;
  }

  async getProducts(kitchenId: number): Promise<ProductsResponse> {
    return GoPayClientMock.products;
  }

  async listOrders(
    startDate: string,
    endDate: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<ListOrdersResponse> {
    const filtered = this.orders.filter((o) => {
      if (!o.created) return true;
      const created = new Date(o.created).getTime();
      return (
        created >= new Date(startDate).getTime() &&
        created <= new Date(endDate).getTime()
      );
    });
    return { orders: filtered.slice(offset, offset + limit) };
  }

  async placeOrder(
    kitchenId: number,
    deliveries: OrderDelivery[]
  ): Promise<PlaceOrderResponse> {
    const orderId = GoPayClientMock.nextOrderId++;
    const now = new Date().toISOString();
    const order: DetailedOrder = {
      displayName: `Order #${orderId}`,
      id: orderId,
      orderType: "LUNCH",
      organizers: [{ name: GoPayClientMock.user.username }],
      price: { amount: 50, scale: 2, currency: "DKK", formatted: "50.00 DKK" },
      shopChannel: "mock",
      uid: `order-${orderId}`,
      created: now,
      deliveries: deliveries.map((d, i) => ({
        id: i + 1,
        deliveryType: "mock",
        type: "mock",
        deliveryTime: d.deliveryTime,
        price: {
          amount: 50,
          scale: 2,
          currency: "DKK",
          formatted: "50.00 DKK",
        },
        cancelEnable: true,
        orderLines: d.orderLines.map((ol, j) => ({
          ...ol,
          id: j + 1,
          itemPrice: {
            amount: 50,
            scale: 2,
            currency: "DKK",
            formatted: "50.00 DKK",
          },
          price: {
            amount: 50,
            scale: 2,
            currency: "DKK",
            formatted: "50.00 DKK",
          },
          name: "Mock Sandwich",
        })),
      })),
    };
    this.orders.push(order);
    return {
      salesConditionsUrl: "https://mock/terms",
      currencyCodes: ["DKK"],
      paymentMethods: [
        {
          value: "PAYROLL_DEDUCTION",
          translationKey: "payroll",
          showSalesConditions: false,
          icon: { type: "", url: "" },
        },
      ],
      userAccountBalance: {
        amount: 1000,
        scale: 2,
        currency: "DKK",
        formatted: "1000.00 DKK",
      },
    };
  }

  async payOrder(
    kitchenId: number,
    webshopUId: string,
    deliveries: OrderDelivery[]
  ): Promise<PayOrderResponse> {
    // Find the latest order and mark as paid
    const order = this.orders[this.orders.length - 1];
    if (order) {
      order.price = {
        amount: 50,
        scale: 2,
        currency: "DKK",
        formatted: "50.00 DKK",
      };
    }
    return { orderId: order?.id ?? 0, status: "PAID" };
  }

  async getOrderDetails(orderId: number): Promise<DetailedOrder | Response> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
    return order;
  }

  async deleteOrder(orderId: number): Promise<DeleteOrderResponse> {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      this.orders.splice(idx, 1);
      return { success: true };
    }
    return { success: false };
  }
}
