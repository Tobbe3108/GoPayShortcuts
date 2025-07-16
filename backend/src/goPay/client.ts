import {
  RequestOTPRequest,
  RequestOTPResponse,
  LoginRequest,
  LoginResponse,
  Location,
  ListOrdersResponse,
  PlaceOrderRequest,
  PlaceOrderResponse,
  PayOrderRequest,
  PayOrderResponse,
  DeleteOrderResponse,
  GetOrderDetailsResponse,
  ApiError,
  OrderDelivery,
  DetailedOrder,
  ProductsResponse,
} from "./types";

export class GoPayClient {
  private apiUrl: string;
  private token: string | null = null;

  constructor(apiUrl: string, token?: string) {
    this.apiUrl = apiUrl;
    if (token) {
      this.token = token;
    }
  }

  private getHeaders(): HeadersInit {
    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
      Origin: "https://prod.facilitynet.dk",
      "X-Client-Type": "mobile-web",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    if (this.token) {
      headers["x-api-key"] = this.token;
    }

    return headers;
  }

  private async gatherResponse<T>(response: Response) {
    const { headers } = response;
    const contentType = headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    } else if (contentType.includes("application/text")) {
      return (await response.text()) as T;
    } else if (contentType.includes("text/html")) {
      return (await response.text()) as T;
    } else {
      return (await response.text()) as T;
    }
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
    body?: any
  ): Promise<T | Response> {
    const url: string = `${this.apiUrl}${endpoint}`;

    options = {
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) return response;

      const result = await this.gatherResponse<T>(response);
      return result;
    } catch (error) {
      console.error("API request failed:", error);

      throw {
        statusCode: 500,
        message: (error as Error).message || "Internal Server Error",
        error,
      } as ApiError;
    }
  }

  async requestOTP(email: string): Promise<RequestOTPResponse | Response> {
    const request: RequestOTPRequest = {
      username: email,
    };

    const response = await this.request<RequestOTPResponse>(
      "/authenticate/username",
      {
        method: "POST",
        cache: "no-store",
      },
      request
    );

    return response;
  }

  async login(otp: string): Promise<LoginResponse | Response> {
    const request: LoginRequest = {
      type: "ACTIVATION_CODE",
      value: otp,
    };

    const response = await this.request<LoginResponse>(
      "/authenticate/byType",
      {
        method: "POST",
        cache: "no-store",
      },
      request
    );

    return response;
  }

  async getLocations(): Promise<Location[] | Response> {
    let response = await this.request<Location[]>(
      "/organization/company/user/locations",
      {
        cf: {
          cacheTtlByStatus: {
            "200-299": 86400 * 30, // 30 days
          },
        },
      }
    );

    return response;
  }

  async getProducts(kitchenId: number): Promise<ProductsResponse | Response> {
    const endpoint = `/suppliers/kitchens/${kitchenId}/menues/catering?date=${
      new Date().toISOString().split("T")[0]
    }`;

    const response = await this.request<ProductsResponse>(endpoint, {
      cf: {
        cacheTtlByStatus: {
          "200-299": 86400 * 30, // 30 days
        },
      },
    });

    return response;
  }

  async listOrders(
    startDate: string,
    endDate: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<ListOrdersResponse | Response> {
    const response = await this.request<ListOrdersResponse>(
      `/orders?offset=${offset}&limit=${limit}&orderType=LUNCH&deliveredStartDate=${startDate}&deliveredEndDate=${endDate}`
    );

    return response;
  }

  async placeOrder(
    kitchenId: number,
    deliveries: OrderDelivery[]
  ): Promise<PlaceOrderResponse | Response> {
    const request: PlaceOrderRequest = {
      deliveries: deliveries,
    };

    const response = await this.request<PlaceOrderResponse>(
      `/suppliers/kitchens/${kitchenId}/payment/paymentDetails/catering`,
      {
        method: "POST",
      },
      request
    );

    return response;
  }

  async payOrder(
    kitchenId: number,
    webshopUId: string,
    deliveries: OrderDelivery[]
  ): Promise<PayOrderResponse | Response> {
    const request: PayOrderRequest = {
      kitchen: { id: kitchenId },
      webshop: { uid: webshopUId },
      payment: {
        method: "PAYROLL_DEDUCTION",
      },
      orderNote: "",
      deliveries: deliveries,
    };

    const response = await this.request<PayOrderResponse>(
      `/orders/catering`,
      {
        method: "POST",
      },
      request
    );

    return response;
  }

  async getOrderDetails(orderId: number): Promise<DetailedOrder | Response> {
    const response = await this.request<GetOrderDetailsResponse>(
      `/orders/${orderId}`
    );

    if (response instanceof Response) return response;
    return response.orders[0];
  }

  async deleteOrder(orderId: number): Promise<DeleteOrderResponse | Response> {
    const response = await this.request<DeleteOrderResponse>(
      `/orders/${orderId}`,
      {
        method: "DELETE",
      }
    );

    return response;
  }
}
