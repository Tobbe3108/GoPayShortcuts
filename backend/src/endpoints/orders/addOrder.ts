import { OpenAPIRoute, contentJson, InputValidationException } from "chanfana";
import { z } from "zod";
import { createGoPayClient, AppContext } from "../../types";
import { Schemas } from "../Shared/Schemas";
import {
  createAndPayOrder,
  ProductQuantity,
} from "../orders/shared/ordersUtils";

export class AddOrder extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Add and pay for one or more orders",
    ...Schemas.BearerAuth(),
    request: {
      body: {
        ...contentJson(
          z.object({
            order: z.object({
              date: z.string().describe("Order date in YYYY-MM-DD format"),
              kitchenId: z
                .number()
                .describe(
                  "ID of the kitchen where the order will be delivered"
                ),
              orderlines: z.array(
                z.object({
                  productId: z.number().describe("ID of the product to order"),
                  quantity: z
                    .number()
                    .min(1)
                    .describe("Quantity of the product to order"),
                })
              ),
            }),
          })
        ),
      },
    },
    responses: {
      200: {
        description: "Order(s) placed and paid successfully",
        ...contentJson(
          z.object({
            success: z.boolean(),
            orderId: z.number().optional(),
            results: z
              .array(
                z.object({
                  placeOrder: z
                    .object({
                      id: z.number(),
                      status: z.string(),
                    })
                    .optional(),
                  payOrder: z
                    .object({
                      id: z.number(),
                      status: z.string(),
                    })
                    .optional(),
                })
              )
              .optional(),
          })
        ),
      },
      401: {
        description: "Unauthorized",
        ...Schemas.GoPayErrorResponse(),
      },
      400: {
        description: "Bad Request",
        ...contentJson(
          z.object({
            error: z.string(),
            details: z.string().optional(),
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
    const order = data.body.order;

    const products = order.orderlines.map(
      (ol) =>
        ({
          productId: ol.productId,
          quantity: ol.quantity,
        } as ProductQuantity)
    );

    const result = await createAndPayOrder(
      client,
      order.kitchenId,
      order.date,
      products
    );

    if (result instanceof Response) return result;
    return { success: true };
  }
}
