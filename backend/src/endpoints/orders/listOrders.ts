import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { DetailedOrder, Order } from "../../goPay/types";
import { fetchOrderDetails, filterOrders } from "./shared/ordersUtils";

export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get all orders for a specific time period with details",
    ...Schemas.BearerAuth(),
    request: {
      query: z.object({
        start: Str({ example: "2024-07-01", required: true }),
        end: Str({ example: "2024-07-07", required: true }),
      }),
    },
    responses: {
      200: {
        description: "List of detailed orders for the week",
        ...contentJson(
          z.object({
            orders: z.array(
              z.object({
                order: z.any(), // Could be refined to match GetOrderDetailsResponse
              })
            ),
          })
        ),
      },
      ...InputValidationException.schema(),
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const client = createGoPayClient(c);

    const data = await this.getValidatedData<typeof this.schema>();
    const { start, end } = data.query;

    const ordersResp = await client.listOrders(start, end);
    if (ordersResp instanceof Response) return ordersResp; // Error responses

    const details = await fetchOrderDetails(ordersResp.orders, client);
    const filteredOrders = filterOrders(details);
    const groups = aggregateOrderLines(filteredOrders);
    const orders = convertGroupRecordsToArray(groups);

    return { orders: orders } as ListOrdersResponse;
  }
}

function aggregateOrderLines(
  details: DetailedOrder[]
): Record<string, Record<number, SimplifiedOrder>> {
  const groups: Record<string, Record<number, SimplifiedOrder>> = {};

  for (const order of details) {
    const delivery = order.deliveries?.[0];
    const date = delivery?.deliveryTime?.slice(0, 10) || "unknown";
    const kitchenId = order.kitchen?.id || NaN;

    for (const delivery of order.deliveries || []) {
      for (const deliveryOrderLine of delivery.orderLines || []) {
        const orderLine = initGroup(
          groups,
          date,
          kitchenId,
          deliveryOrderLine.productId
        );
        orderLine.quantity += deliveryOrderLine.items;
        orderLine.price += formatAmount(
          deliveryOrderLine.price?.amount,
          deliveryOrderLine.price?.scale
        );
      }

      if (!delivery.cancelOrder?.cancelEnable) {
        groups[date][kitchenId].cancelEnabled = false;
      }
    }
  }
  return groups;

  function initGroup(
    grouped: Record<string, Record<number, SimplifiedOrder>>,
    date: string,
    kitchenId: number,
    productId: number
  ): OrderLine {
    if (!grouped[date]) grouped[date] = {};
    if (!grouped[date][kitchenId]) {
      grouped[date][kitchenId] = {
        date,
        kitchenId: kitchenId,
        orderlines: [],
        cancelEnabled: true,
      };
    }

    let existingOrderLine = grouped[date][kitchenId].orderlines.find(
      (ol) => ol.productId === productId
    );

    if (!existingOrderLine) {
      existingOrderLine = {
        productId,
        quantity: 0,
        price: 0,
      };
      grouped[date][kitchenId].orderlines.push(existingOrderLine);
    }
    return existingOrderLine;
  }

  function formatAmount(amount: number, scale: number): number {
    return amount / Math.pow(10, scale);
  }
}

function convertGroupRecordsToArray(
  groups: Record<string, Record<number, SimplifiedOrder>>
): SimplifiedOrder[] {
  const simplifiedOrders: SimplifiedOrder[] = [];
  for (const date of Object.keys(groups)) {
    for (const location of Object.keys(groups[date])) {
      simplifiedOrders.push(groups[date][location]);
    }
  }
  return simplifiedOrders.sort((a, b) => {
    return new Date(a.date).getDate() - new Date(b.date).getDate();
  });
}

type ListOrdersResponse = {
  orders: SimplifiedOrder[];
};

type SimplifiedOrder = {
  date: string;
  kitchenId: number;
  orderlines: OrderLine[];
  cancelEnabled: boolean;
};

type OrderLine = {
  productId: number;
  quantity: number;
  price: number;
};
