import { mock, when, instance } from "ts-mockito";
import { fa, faker } from "@faker-js/faker";
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
  KitchenSummary,
  Price,
  User,
  Webshop,
  BrandingDetails,
  Address,
  Kitchen,
  Organizer,
} from "./types";
import { isAfter, isWithinInterval, parseISO, isToday } from "date-fns";

// Global caches for mock data
let _locations: Location[] | null = null;
let _kitchens: Record<number, Kitchen> = {};
let _productsByKitchen: Record<number, ProductsResponse> = {};
let _ordersByKitchen: Record<number, Record<number, DetailedOrder>> = {};

export class GoPayClientMock {
  apiUrl: string;
  token: string | null = null;

  constructor(apiUrl: string, token?: string) {
    this.apiUrl = apiUrl;
    if (token) this.token = token;
  }

  async requestOTP(email: string): Promise<RequestOTPResponse> {
    return {
      authentication: {
        token: faker.string.uuid(),
        type: "OTP",
      },
      authenticationResult: {
        type: "ACTIVATION_CODE",
        action: "LOGIN",
        message: "OTP sent",
      },
      serviceResponse: {
        isUserMessage: true,
      },
    };
  }

  async login(otp: string): Promise<LoginResponse> {
    return {
      user: fakeUser(),
      authentication: {
        token: faker.string.uuid(),
      },
      authenticationResult: {
        type: "ACTIVATION_CODE",
        action: "LOGIN",
        message: "Login successful",
      },
      authenticationByType: {
        type: "ACTIVATION_CODE",
        value: otp,
      },
    };
  }

  async getLocations(): Promise<Location[]> {
    if (!_locations) {
      _locations = Array.from({ length: 3 }, () => ({
        id: faker.number.int({ min: 1000, max: 9999 }),
        name: faker.location.city(),
        kitchens: [fakeKitchen()],
      }));
    }
    return _locations;
  }

  async getProducts(kitchenId: number): Promise<ProductsResponse> {
    if (!_productsByKitchen[kitchenId]) {
      _productsByKitchen[kitchenId] = {
        menues: [
          {
            date: faker.date.future().toISOString().slice(0, 10),
            displayDate: faker.date.future().toISOString().slice(0, 10),
            productGroups: [
              {
                id: faker.number.int(),
                name: faker.commerce.department(),
                products: Array.from({ length: 3 }, () => ({
                  id: faker.number.int(),
                  subject: faker.commerce.productName(),
                  name: faker.commerce.productName(),
                  description: faker.commerce.productDescription(),
                  price: fakePrice(),
                  imageUrl: faker.image.urlPicsumPhotos(),
                  orderDetails: {
                    availability: { isAvailable: true },
                  },
                  userDetails: {
                    favoriteType: "none",
                    canFavorite: true,
                  },
                  productType: "food",
                  kitchen: fakeKitchenSummary(kitchenId),
                  cardDetails: {
                    imageUrl: faker.image.urlPicsumPhotos(),
                    cardColor: faker.color.rgb(),
                  },
                })),
              },
            ],
          },
        ],
        kitchen: fakeKitchenSummary(kitchenId),
      };
    }
    return _productsByKitchen[kitchenId];
  }

  async listOrders(
    startDate: string,
    endDate: string
  ): Promise<ListOrdersResponse> {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    let orders: DetailedOrder[] = [];
    for (const kitchenOrders of Object.values(_ordersByKitchen)) {
      orders = orders.concat(Object.values(kitchenOrders));
    }

    const filtered = orders.filter((order) =>
      order.deliveries.some((delivery) => {
        const deliveryDate = parseISO(delivery.deliveryTime);
        return isWithinInterval(deliveryDate, { start, end });
      })
    );

    return {
      orders: filtered.map((order) => ({
        displayName: order.displayName,
        id: order.id,
        orderType: order.orderType,
        organizers: order.organizers,
        deliveries: order.deliveries,
        price: order.price,
      })),
    };
  }

  async placeOrder(
    kitchenId: number,
    deliveries: OrderDelivery[]
  ): Promise<PlaceOrderResponse> {
    return {
      salesConditionsUrl: faker.internet.url(),
      currencyCodes: ["DKK"],
      paymentMethods: [
        {
          value: "PAYROLL_DEDUCTION",
          translationKey: "payroll",
          showSalesConditions: false,
          icon: {
            type: "svg",
            url: faker.image.urlPicsumPhotos(),
          },
        },
      ],
      userAccountBalance: fakePrice(),
    };
  }

  async payOrder(
    kitchenId: number,
    webshopUId: string,
    deliveries: OrderDelivery[]
  ): Promise<PayOrderResponse> {
    const detailedOrder: DetailedOrder = {
      displayName: faker.commerce.productName(),
      id: faker.number.int(),
      orderType: "LUNCH",
      organizers: [fakeOrganizer()],
      deliveries: deliveries.map((d) => ({
        id: faker.number.int(),
        deliveryType: "STANDARD",
        type: "LUNCH",
        deliveryTime: d.deliveryTime,
        price: fakePrice(),
        cancelEnable:
          isToday(parseISO(d.deliveryTime)) ||
          isAfter(parseISO(d.deliveryTime), new Date()),
        orderLines: d.orderLines.map((ol) => ({
          id: faker.number.int(),
          productId: ol.productId,
          items: ol.items,
          buyerParty: ol.buyerParty,
          itemPrice: fakePrice(),
          price: fakePrice(),
          name: faker.commerce.productName(),
        })),
        cancelOrder: {
          cancelEnable:
            isToday(parseISO(d.deliveryTime)) ||
            isAfter(parseISO(d.deliveryTime), new Date()),
          shortMessage: faker.lorem.word(3),
          message: faker.lorem.sentence(),
        },
      })),
      kitchen: {
        ...fakeKitchen(kitchenId),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        streetName: faker.location.street(),
        streetNumber: faker.string.numeric(2),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        webshop: undefined,
        vatnumber: "",
      },
      price: fakePrice(),
      shopChannel: "web",
      uid: faker.string.uuid(),
    };

    if (!_ordersByKitchen[kitchenId]) {
      _ordersByKitchen[kitchenId] = {};
    }
    _ordersByKitchen[kitchenId][detailedOrder.id] = detailedOrder;

    return {
      orderId: detailedOrder.id,
      status: "PAID",
    };
  }

  async getOrderDetails(orderId: number): Promise<DetailedOrder> {
    for (const kitchenOrders of Object.values(_ordersByKitchen)) {
      if (kitchenOrders[orderId]) {
        return kitchenOrders[orderId];
      }
    }
    throw { statusCode: 404, message: `Order ${orderId} not found` };
  }

  async deleteOrder(orderId: number): Promise<DeleteOrderResponse> {
    for (const kitchenId in _ordersByKitchen) {
      if (_ordersByKitchen[kitchenId][orderId]) {
        delete _ordersByKitchen[kitchenId][orderId];
        return { success: true };
      }
    }
    return { success: false };
  }
}

function fakeKitchenSummary(id?: number): KitchenSummary {
  const kitchen = fakeKitchen(id);
  return {
    id: kitchen.id,
    name: kitchen.name,
    streetName: kitchen.address.streetName,
    streetNumber: kitchen.address.streetNumber,
    postalCode: kitchen.address.postalCode,
    webshop: kitchen.webshops[0],
    brandingDetails: kitchen.brandingDetails,
  };
}

function fakePrice(): Price {
  const amount = faker.number.int({ min: 1000, max: 10000 });
  return {
    amount,
    scale: 2,
    currency: "DKK",
    formatted: `kr. ${amount / 100}`,
  };
}

function fakeUser(): User {
  return {
    id: faker.number.int(),
    username: faker.internet.username(),
    userTypeId: 1,
    userType: "employee",
    userGroupId: 1,
    companyId: 1,
    uid: faker.string.uuid(),
    companyAuthenticationType: "OTP",
  };
}

function fakeWebshop(): Webshop {
  return {
    id: faker.number.int(),
    name: faker.company.name(),
    uid: faker.string.uuid(),
    demoMode: false,
  };
}

function fakeBrandingDetails(): BrandingDetails {
  return {
    imageUrl: faker.image.urlPicsumPhotos(),
  };
}

function fakeAddress(): Address {
  return {
    id: faker.number.int(),
    streetName: faker.location.street(),
    streetNumber: faker.string.numeric(2),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    country: faker.location.country(),
  };
}

function fakeKitchen(id?: number): Kitchen {
  const kitchen = {
    id: id ?? faker.number.int({ min: 1000, max: 9999 }),
    uid: faker.string.uuid(),
    name: faker.commerce.department(),
    address: fakeAddress(),
    webshops: [fakeWebshop()],
    brandingDetails: fakeBrandingDetails(),
    sellerSupplierParty: undefined,
  };

  if (!_kitchens[kitchen.id]) _kitchens = {};
  _kitchens[kitchen.id] = kitchen;
  return kitchen;
}

function fakeOrganizer(): Organizer {
  return { name: faker.person.fullName() };
}

export const goPayClientMockInstance = instance(mock(GoPayClientMock));
