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
} from "./types";

export class GoPayClient {
  private apiUrl: string;
  private token: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Sets the authentication token for subsequent requests
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Creates headers for requests, including authentication token if available
   */
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

  /**
   * Generic method to handle API requests
   */
  private async request<T>(
    endpoint: string,
    method: string,
    body?: any,
    options?: RequestInit
  ): Promise<T | Response> {
    const url: string = `${this.apiUrl}${endpoint}`;

    options = {
      ...options,
      method,
      headers: this.getHeaders(),
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

  // Authentication Methods

  /**
   * Request a one-time password to be sent to the user's email
   */
  async requestOTP(email: string): Promise<RequestOTPResponse | Response> {
    const request: RequestOTPRequest = {
      username: email,
    };

    const response = await this.request<RequestOTPResponse>(
      "/authenticate/username",
      "POST",
      request,
      { cache: "no-store" }
    );

    return response;
  }

  /**
   * Login with activation code
   */
  async login(otp: number): Promise<LoginResponse | Response> {
    const request: LoginRequest = {
      type: "ACTIVATION_CODE",
      value: otp.toString(),
    };

    const response = await this.request<LoginResponse>(
      "/authenticate/byType",
      "POST",
      request,
      { cache: "no-store" }
    );

    return response;
  }

  // Location Methods

  /**
   * Get user's available locations
   */
  async getLocations(): Promise<T | Response> {
    const response = await this.request<Location[]>(
      "/organization/company/user/locations",
      "GET"
    );

    return response;
  }

  // Order Methods

  /**
   * Get a list of orders for a specific date range
   */
  async listOrders(
    startDate: string,
    endDate: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<ListOrdersResponse | Response> {
    const response = await this.request<ListOrdersResponse>(
      `/orders?offset=${offset}&limit=${limit}&orderType=LUNCH&deliveredStartDate=${startDate}&deliveredEndDate=${endDate}`,
      "GET"
    );

    return response;
  }

  /**
   * Place a new order
   */
  async placeOrder(
    kitchenId: number,
    deliveries: OrderDelivery[]
  ): Promise<PlaceOrderResponse | Response> {
    const request: PlaceOrderRequest = {
      deliveries: deliveries,
    };

    const response = await this.request<PlaceOrderResponse>(
      `/suppliers/kitchens/${kitchenId}/payment/paymentDetails/catering`,
      "POST",
      request
    );

    return response;
  }

  /**
   * Pay for an order
   */
  async payOrder(
    orderId: number,
    paymentMethod: string,
    acceptedSalesConditions: boolean
  ): Promise<PayOrderResponse | Response> {
    const request: PayOrderRequest = {
      paymentMethod: paymentMethod,
      acceptedSalesConditions: acceptedSalesConditions,
    };

    const response = await this.request<PayOrderResponse>(
      `/orders/${orderId}/pay`,
      "POST",
      request
    );

    return response;
  }

  /**
   * Get details for a specific order
   */
  async getOrderDetails(
    orderId: number
  ): Promise<GetOrderDetailsResponse | Response> {
    const response = await this.request<GetOrderDetailsResponse>(
      `/orders/${orderId}`,
      "GET"
    );

    return response;
  }

  /**
   * Delete/Cancel an order
   */
  async deleteOrder(orderId: number): Promise<DeleteOrderResponse | Response> {
    const response = await this.request<DeleteOrderResponse>(
      `/orders/${orderId}`,
      "DELETE"
    );

    return response;
  }
}
