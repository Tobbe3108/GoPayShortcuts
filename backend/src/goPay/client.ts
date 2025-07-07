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
  private headers: HeadersInit;
  private token: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
    this.headers = {
      "content-type": "application/json",
      Accept: "*/*",
      Origin: "https://prod.facilitynet.dk",
      "X-Client-Type": "mobile-web",
    };
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
    const headers = { ...this.headers };

    if (this.token) {
      headers["x-api-key"] = this.token;
    }

    return headers;
  }

  /**
   * Generic method to handle API requests
   */
  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: any
  ): Promise<T> {
    const url: string = `${this.apiUrl}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error: ApiError = {
          statusCode: response.status,
          message: response.statusText,
        };

        try {
          const errorBody = await response.json();
          error.error = errorBody;
        } catch (e) {
          // Ignore parsing errors for error responses
        }

        throw error;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("API request failed:", error);

      if ((error as ApiError).statusCode) {
        throw error;
      }

      throw {
        statusCode: 500,
        message: "Network error",
        error,
      } as ApiError;
    }
  }

  // Authentication Methods

  /**
   * Request a one-time password to be sent to the user's email
   */
  async requestOTP(email: string): Promise<RequestOTPResponse> {
    const request: RequestOTPRequest = {
      username: email,
    };

    const response = await this.request<RequestOTPResponse>(
      "/authenticate/username",
      "POST",
      request
    );

    return response;
  }

  /**
   * Login with activation code
   */
  async login(otp: string): Promise<LoginResponse> {
    const request: LoginRequest = {
      type: "ACTIVATION_CODE",
      value: otp,
    };

    const response = await this.request<LoginResponse>(
      "/authenticate/byType",
      "POST",
      request
    );

    return response;
  }

  // Location Methods

  /**
   * Get user's available locations
   */
  async getLocations(): Promise<Location[]> {
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
  ): Promise<ListOrdersResponse> {
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
  ): Promise<PlaceOrderResponse> {
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
  ): Promise<PayOrderResponse> {
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
  async getOrderDetails(orderId: number): Promise<GetOrderDetailsResponse> {
    const response = await this.request<GetOrderDetailsResponse>(
      `/orders/${orderId}`,
      "GET"
    );

    return response;
  }

  /**
   * Delete/Cancel an order
   */
  async deleteOrder(orderId: number): Promise<DeleteOrderResponse> {
    const response = await this.request<DeleteOrderResponse>(
      `/orders/${orderId}`,
      "DELETE"
    );

    return response;
  }
}
