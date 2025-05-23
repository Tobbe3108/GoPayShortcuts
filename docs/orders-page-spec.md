# Workday Orders Page - Design Specification

## Overview

A responsive page displaying 5 cards representing each workday (Monday to Friday) with order information and action controls per day. Users can view, place, modify, cancel orders, and set default orders. This page should be served on the root path (`/`) of the application after the user has logged in.

## Components Structure

### Main Page Component

- **Page Container**: Main container with header displaying user info and logout button
- **Cards Container**: Flex/Grid layout with 5 day cards
- **Location Selector**: Dropdown for selecting the delivery location (kitchen is automatically determined from the selected location)

### DayCard Component

- **Props**:
  - `date: Date` - The date for this workday
  - `currentOrders: Order[]` - Current orders for this date (if any)
  - `locations: Location[]` - Available delivery locations (each location has an associated kitchen)
  - `selectedLocation: Location` - Currently selected location (kitchen is derived from this)

- **State**:
  - `isLoading: boolean` - Loading state for API operations
  - `orderItems: OrderItem[]` - Items selected for ordering

### OrderItem Component

- Used in the card for showing/selecting order items
- **Props**:
  - `item: OrderItemData` - Item data including ID, name, quantity
  - `editable: boolean` - Whether the item can be edited
  - `onChange: (item: OrderItemData) => void` - Change handler

### LocationSelector Component

- Dropdown for selecting delivery location
- **Props**:
  - `locations: Location[]` - Available locations (each location has an associated kitchen)
  - `selectedLocation: Location` - Currently selected location
  - `onChange: (location: Location) => void` - Change handler for when location changes

## Data Models

### Order

```typescript
interface Order {
  id: string;
  deliveryTime: string;
  deliveryLocation: Location;
  orderLines: OrderLine[];
  kitchen: Kitchen;
}

interface OrderLine {
  productId: number;
  items: number; // quantity
  buyerParty: string; // const "PRIVATE"
}

interface Location {
  name: string;
  kitchen: Kitchen;
  // Any other location properties
}

interface Kitchen {
  id: number;
  name: string;
}

interface OrderItemData {
  id: number; // productId
  name: string;
  quantity: number;
  type: 'breakfast' | 'lunch' | 'soda';
}

interface DayOrderState {
  date: Date;
  hasOrder: boolean;
  order?: Order;
  location: Location;
  kitchen: Kitchen;
  breakfast: number;
  lunch: number;
  soda: number;
}
```

## Services

### LocationService

- `getLocations()`: Fetches available locations and kitchens from API endpoint `/api/organization/company/user/locations`

### OrderService

- `getOrdersForWeek()`: Fetches orders for the entire week
- `placeOrder(order: Order)`: Places a new order
- `cancelOrder(orderId: string)`: Cancels an existing order

### LocalStorageService

- `saveDefaultOrder(orderItems: OrderItemData[], location: Location)`: Saves default order preferences including location (kitchen is part of location) and item quantities to local storage
- `getDefaultOrder()`: Retrieves saved default order preferences from local storage for prefilling order forms

## UI States for Each Card

### No Order State

- Shows empty state with quantity selectors for breakfast, lunch, and soda
- Location selector dropdown (kitchen is automatically determined from the selected location)
- "Order" button (primary action)
- Default order values (location and quantities) are automatically prefilled if available and no order exists for that day

### Has Order State

- Displays current order details (kitchen, location, ordered items with quantities)
- "Cancel Order" button (destructive action)
- Optional "Save as Default" button

### Loading State

- Shows spinner while API operations are in progress

## Card Layout

1. **Header**:
   - Day name (Monday, Tuesday, etc.)
   - Date (May 27, etc.)
   - Status indicator (Has order/No order)

2. **Content Area**:
   - Location selector display (kitchen is shown based on selected location)
   - Order items (with quantity controls if in edit mode)

3. **Actions Area**:
   - Primary action button (Order/Cancel)
   - Secondary actions (Save as Default, Use Default)

## Responsive Behavior

- Desktop: Cards displayed in a row or grid (depending on screen size)
- Tablet: 2-3 cards per row
- Mobile: Single column layout, full-width cards

## Interactions

1. **Selecting Location**:
   - Choose location from dropdown
   - Location data (which includes associated kitchen) is fetched from `/api/organization/company/user/locations` endpoint
   - Kitchen is automatically determined based on the selected location

2. **Placing an Order**:
   - Select location from the dropdown (kitchen is automatically determined)
   - Set quantities for breakfast, lunch, and soda
   - Click "Order" button → validate → API call → update card to "Has Order" state

3. **Cancelling an Order**:
   - Click "Cancel Order" → confirm dialog → API call → update card to "No Order" state

4. **Default Order Behavior**:
   - Default order values (location with its associated kitchen, breakfast, lunch, soda quantities) are automatically prefilled when no order exists for a specific day
   - Each day card shows the prefilled default values without requiring additional user action

5. **Saving Default**:
   - Configure order → click "Save as Default" → store in local storage (not sent to API)
   - Default order is a local concept specific to this app, not stored in or retrieved from the API

## API Integration

### Data Fetching and Default Order Handling

- On page load, fetch all locations/kitchens and orders for the week from the API
- Also retrieve saved default order data from local storage (default order is stored locally, not in the API)
- For days without existing orders, automatically prefill forms with default order data (location, breakfast, lunch, soda quantities) from local storage

### Order Operations

- Use the food order and food pay endpoints for placing orders
- Each order needs:
  - Kitchen ID (selected from locations API)
  - Delivery location
  - Delivery time (specific date)
  - Order lines (products with quantities)

## Error Handling & Edge Cases

- Handle API errors with appropriate error messages
- Account for weekends/holidays (disable ordering)
- Handle cases where orders can't be modified after certain times
- Account for different available products at different locations

## Performance Considerations

- Batch API requests where possible
- Implement optimistic UI updates before API confirmation
