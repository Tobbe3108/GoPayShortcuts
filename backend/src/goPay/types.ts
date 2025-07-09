// Authentication Types
export interface RequestOTPRequest {
  username: string;
}

export interface RequestOTPResponse {
  authentication: {
    token: string;
    type: string;
  };
  authenticationResult: {
    type: string;
    action: string;
    message: string;
  };
  serviceResponse: {
    isUserMessage: boolean;
  };
}

export interface LoginRequest {
  type: string;
  value: string;
}

export interface User {
  id: number;
  username: string;
  userTypeId: number;
  userType: string;
  userGroupId: number;
  companyId: number;
  uid: string;
  companyAuthenticationType: string;
}

export interface LoginResponse {
  user: User;
  authentication: {
    token: string;
  };
  authenticationResult: {
    type: string;
    action: string;
    message: string;
  };
  authenticationByType: {
    type: string;
    value: string;
  };
}

// Location Types
export interface Address {
  id: number;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface Webshop {
  id: number;
  name: string;
  uid: string;
  demoMode: boolean;
}

export interface BrandingDetails {
  imageUrl: string;
}

export interface Kitchen {
  id: number;
  uid: string;
  name: string;
  address: Address;
  webshops: Webshop[];
  brandingDetails: BrandingDetails;
  sellerSupplierParty?: string;
}

export interface Location {
  id: number;
  name: string;
  kitchens: Kitchen[];
}

// Order Types
export interface Price {
  amount: number;
  scale: number;
  currency: string;
  formatted: string;
}

export interface Delivery {
  id: number;
  deliveryType: string;
  type: string;
  deliveryTime: string;
  price: Price;
  cancelEnable: boolean;
}

export interface Organizer {
  name: string;
}

export interface Order {
  displayName: string;
  id: number;
  orderType: string;
  organizers: Organizer[];
  deliveries: Delivery[];
  price: Price;
}

export interface ListOrdersResponse {
  orders: Order[];
}

export interface OrderLine {
  productId: number;
  items: number;
  buyerParty: string;
}

export interface DeliveryLocation {
  name: string;
}

export interface OrderDelivery {
  deliveryLocation: DeliveryLocation;
  deliveryTime: string;
  orderLines: OrderLine[];
}

export interface PlaceOrderRequest {
  deliveries: OrderDelivery[];
}

export interface PaymentMethod {
  value: string;
  translationKey: string;
  showSalesConditions: boolean;
  icon: {
    type: string;
    url: string;
  };
}

export interface PlaceOrderResponse {
  salesConditionsUrl: string;
  currencyCodes: string[];
  paymentMethods: PaymentMethod[];
  userAccountBalance: Price;
}

export interface PayOrderRequest {
  paymentMethod: string;
  acceptedSalesConditions: boolean;
}

export interface PayOrderResponse {
  orderId: number;
  status: string;
}

export interface DeleteOrderResponse {
  success: boolean;
}

// Detailed Order Types
export interface DetailedOrderOrderLine extends OrderLine {
  id: number;
  itemPrice: Price;
  price: Price;
  name: string;
}

export interface DetailedOrderDelivery extends Delivery {
  orderNote?: string;
  orderLines: DetailedOrderOrderLine[];
  cancelOrder?: {
    cancelEnable: boolean;
    shortMessage?: string;
    message?: string;
  };
}

export interface DetailedOrder extends Order {
  shopChannel: string;
  uid: string;
  creditNoteDetails?: {
    creditNoteOrderIds?: number[];
    originalOrderId?: number;
  };
  deliveries: DetailedOrderDelivery[];
  receipt?: Record<string, unknown>;
  buyerCustomerParty?: {
    name: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    vatnumber: string;
  };
  accountingCustomerParty?: {
    id: number;
  };
  sellerSupplierParty?: {
    id: number;
    name: string;
  };
  customer?: {
    id: number;
    displayName: string;
    userGroupId: number;
  };
  paymentDetails?: {
    method: string;
    isOnlinePayment: boolean;
    isCaptured: boolean;
    created: string;
    toBePaidAsPrivate: Price;
    toBePaidAsCompany: Price;
    card?: Record<string, unknown>;
    acquirerId: number;
    webShopId: number;
    accounting: {
      dimensions: unknown[];
      costCenter: string;
    };
    status: string;
    channel: {
      type: string;
    };
  };
  kitchen?: {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
    webshop: Webshop;
    vatnumber: string;
  };
  webshop?: Webshop;
  permaLink?: string;
  test?: boolean;
  created?: string;
  isMasterOrder?: boolean;
}

export interface GetOrderDetailsResponse {
  orders: DetailedOrder[];
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: any;
}
