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
              date: z.string(),
              kitchenId: z.number(),
              orderlines: z.array(
                z.object({
                  productId: z.number(),
                  quantity: z.number(),
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
            results: z.array(
              z.object({
                placeOrder: z.any(),
                payOrder: z.any(),
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
