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
                subject: "Breakfast",
                name: "Mock omelette",
                description: "A delicious mock omelette.",
                price: {
                  amount: 5000,
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
              {
                id: 2,
                subject: "Lunch",
                name: "Mock Sandwich",
                description: "A delicious mock sandwich.",
                price: {
                  amount: 1000,
                  scale: 2,
                  currency: "DKK",
                  formatted: "10.00 DKK",
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
                subject: "Beverage",
                name: "Mock soda",
                description: "A delicious mock soda.",
                price: {
                  amount: 100,
                  scale: 2,
                  currency: "DKK",
                  formatted: "1.00 DKK",
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
            name: "Other",
            products: [],
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

  private orders: DetailedOrder[] = [
    {
      displayName: "GoPay #1000001",
      id: 1000001,
      orderType: "LUNCH",
      organizers: [{ name: "Test User" }],
      price: {
        amount: 8600,
        scale: 2,
        currency: "DKK",
        formatted: "DKK 86.00",
      },
      shopChannel: "-",
      uid: "mock-uid-1",
      created: new Date(Date.now()).toISOString(),
      deliveries: [
        {
          id: 2000001,
          deliveryType: "PICK_UP",
          type: "PICK_UP",
          deliveryTime: new Date(Date.now()).toISOString(),
          orderNote: "",
          orderLines: [
            {
              id: 2100001,
              items: 1,
              itemPrice: {
                amount: 1700,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 17.00",
              },
              price: {
                amount: 1700,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 17.00",
              },
              productId: 30001,
              name: "Morgenmad",
              buyerParty: "PRIVATE",
            },
            {
              id: 2100002,
              items: 1,
              itemPrice: {
                amount: 1500,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 15.00",
              },
              price: {
                amount: 1500,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 15.00",
              },
              productId: 30002,
              name: "Frokost",
              buyerParty: "PRIVATE",
            },
            {
              id: 2100003,
              items: 1,
              itemPrice: {
                amount: 500,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 5.00",
              },
              price: {
                amount: 500,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 5.00",
              },
              productId: 30003,
              name: "Læskedrik",
              buyerParty: "PRIVATE",
            },
          ],
          price: {
            amount: 3700,
            scale: 2,
            currency: "DKK",
            formatted: "DKK 37.00",
          },
          cancelOrder: {
            cancelEnable: false,
            shortMessage: "Order cancellation has been exceeded",
            message: "You must cancel your order no later than 09:00.",
          },
          cancelEnable: false,
        },
      ],
      receipt: {},
      buyerCustomerParty: {
        name: "Test Company",
        streetName: "Test Street",
        streetNumber: "1",
        postalCode: "1000",
        city: "Test City",
        vatnumber: "00000000",
      },
      accountingCustomerParty: {
        id: 9999,
      },
      sellerSupplierParty: {
        id: 8888,
        name: "Test Company",
      },
      customer: {
        id: 7777,
        displayName: "Test User",
        userGroupId: 1,
      },
      paymentDetails: {
        method: "PAYROLL_DEDUCTION",
        isOnlinePayment: false,
        isCaptured: false,
        created: new Date(Date.now() - 86400000).toISOString(),
        toBePaidAsPrivate: {
          amount: 3700,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 37.00",
        },
        toBePaidAsCompany: {
          amount: 0,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 0.00",
        },
        card: {},
        acquirerId: 0,
        webShopId: 1,
        accounting: {
          dimensions: [],
          costCenter: "",
        },
        status: "INVOICED",
        channel: {
          type: "mobile_app",
        },
      },
      kitchen: {
        id: 5555,
        name: "Test Kitchen",
        phoneNumber: "",
        email: "",
        streetName: "Test Street 1",
        streetNumber: "0",
        postalCode: "1000",
        city: "Test City",
        webshop: {
          id: 1,
          name: "Test Webshop",
          uid: "mock-webshop-uid-1",
          demoMode: false,
        },
        vatnumber: "00000000",
      },
      webshop: {
        id: 1,
        name: "Test Webshop",
        uid: "mock-webshop-uid-1",
        demoMode: false,
      },
      permaLink: "https://mock/orders/mock-uid-1",
      test: false,
      isMasterOrder: false,
    },
    {
      displayName: "GoPay #1000002",
      id: 1000002,
      orderType: "LUNCH",
      organizers: [{ name: "Test User" }],
      price: {
        amount: 9200,
        scale: 2,
        currency: "DKK",
        formatted: "DKK 92.00",
      },
      shopChannel: "-",
      uid: "mock-uid-2",
      created: new Date(Date.now() - 1 * 86400000).toISOString(),
      deliveries: [
        {
          id: 2000002,
          deliveryType: "PICK_UP",
          type: "PICK_UP",
          deliveryTime: new Date(Date.now() - 1 * 86400000).toISOString(),
          orderNote: "",
          orderLines: [
            {
              id: 2100004,
              items: 1,
              itemPrice: {
                amount: 1800,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 18.00",
              },
              price: {
                amount: 1800,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 18.00",
              },
              productId: 30004,
              name: "Brunch",
              buyerParty: "PRIVATE",
            },
            {
              id: 2100005,
              items: 1,
              itemPrice: {
                amount: 1600,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 16.00",
              },
              price: {
                amount: 1600,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 16.00",
              },
              productId: 30005,
              name: "Afternoon Snack",
              buyerParty: "PRIVATE",
            },
          ],
          price: {
            amount: 3400,
            scale: 2,
            currency: "DKK",
            formatted: "DKK 34.00",
          },
          cancelOrder: {
            cancelEnable: false,
            shortMessage: "Order cancellation has been exceeded",
            message: "You must cancel your order no later than 09:00.",
          },
          cancelEnable: false,
        },
      ],
      receipt: {},
      buyerCustomerParty: {
        name: "Test Company",
        streetName: "Test Street",
        streetNumber: "1",
        postalCode: "1000",
        city: "Test City",
        vatnumber: "00000000",
      },
      accountingCustomerParty: {
        id: 9999,
      },
      sellerSupplierParty: {
        id: 8888,
        name: "Test Company",
      },
      customer: {
        id: 7777,
        displayName: "Test User",
        userGroupId: 1,
      },
      paymentDetails: {
        method: "PAYROLL_DEDUCTION",
        isOnlinePayment: false,
        isCaptured: false,
        created: new Date(Date.now() - 2 * 86400000).toISOString(),
        toBePaidAsPrivate: {
          amount: 3400,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 34.00",
        },
        toBePaidAsCompany: {
          amount: 0,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 0.00",
        },
        card: {},
        acquirerId: 0,
        webShopId: 1,
        accounting: {
          dimensions: [],
          costCenter: "",
        },
        status: "INVOICED",
        channel: {
          type: "mobile_app",
        },
      },
      kitchen: {
        id: 5555,
        name: "Test Kitchen",
        phoneNumber: "",
        email: "",
        streetName: "Test Street 1",
        streetNumber: "0",
        postalCode: "1000",
        city: "Test City",
        webshop: {
          id: 1,
          name: "Test Webshop",
          uid: "mock-webshop-uid-1",
          demoMode: false,
        },
        vatnumber: "00000000",
      },
      webshop: {
        id: 1,
        name: "Test Webshop",
        uid: "mock-webshop-uid-1",
        demoMode: false,
      },
      permaLink: "https://mock/orders/mock-uid-2",
      test: false,
      isMasterOrder: false,
    },
    {
      displayName: "GoPay #1000003",
      id: 1000003,
      orderType: "LUNCH",
      organizers: [{ name: "Test User" }],
      price: {
        amount: 8800,
        scale: 2,
        currency: "DKK",
        formatted: "DKK 88.00",
      },
      shopChannel: "-",
      uid: "mock-uid-3",
      created: new Date(Date.now() - 2 * 86400000).toISOString(),
      deliveries: [
        {
          id: 2000003,
          deliveryType: "PICK_UP",
          type: "PICK_UP",
          deliveryTime: new Date(Date.now() - 2 * 86400000).toISOString(),
          orderNote: "",
          orderLines: [
            {
              id: 2100006,
              items: 1,
              itemPrice: {
                amount: 1900,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 19.00",
              },
              price: {
                amount: 1900,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 19.00",
              },
              productId: 30006,
              name: "Dinner",
              buyerParty: "PRIVATE",
            },
            {
              id: 2100007,
              items: 1,
              itemPrice: {
                amount: 1600,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 16.00",
              },
              price: {
                amount: 1600,
                scale: 2,
                currency: "DKK",
                formatted: "DKK 16.00",
              },
              productId: 30007,
              name: "Evening Snack",
              buyerParty: "PRIVATE",
            },
          ],
          price: {
            amount: 3500,
            scale: 2,
            currency: "DKK",
            formatted: "DKK 35.00",
          },
          cancelOrder: {
            cancelEnable: false,
            shortMessage: "Order cancellation has been exceeded",
            message: "You must cancel your order no later than 09:00.",
          },
          cancelEnable: false,
        },
      ],
      receipt: {},
      buyerCustomerParty: {
        name: "Test Company",
        streetName: "Test Street",
        streetNumber: "1",
        postalCode: "1000",
        city: "Test City",
        vatnumber: "00000000",
      },
      accountingCustomerParty: {
        id: 9999,
      },
      sellerSupplierParty: {
        id: 8888,
        name: "Test Company",
      },
      customer: {
        id: 7777,
        displayName: "Test User",
        userGroupId: 1,
      },
      paymentDetails: {
        method: "PAYROLL_DEDUCTION",
        isOnlinePayment: false,
        isCaptured: false,
        created: new Date(Date.now() - 3 * 86400000).toISOString(),
        toBePaidAsPrivate: {
          amount: 3500,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 35.00",
        },
        toBePaidAsCompany: {
          amount: 0,
          scale: 2,
          currency: "DKK",
          formatted: "DKK 0.00",
        },
        card: {},
        acquirerId: 0,
        webShopId: 1,
        accounting: {
          dimensions: [],
          costCenter: "",
        },
        status: "INVOICED",
        channel: {
          type: "mobile_app",
        },
      },
      kitchen: {
        id: 5555,
        name: "Test Kitchen",
        phoneNumber: "",
        email: "",
        streetName: "Test Street 1",
        streetNumber: "0",
        postalCode: "1000",
        city: "Test City",
        webshop: {
          id: 1,
          name: "Test Webshop",
          uid: "mock-webshop-uid-1",
          demoMode: false,
        },
        vatnumber: "00000000",
      },
      webshop: {
        id: 1,
        name: "Test Webshop",
        uid: "mock-webshop-uid-1",
        demoMode: false,
      },
      permaLink: "https://mock/orders/mock-uid-3",
      test: false,
      isMasterOrder: false,
    },
  ];

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
