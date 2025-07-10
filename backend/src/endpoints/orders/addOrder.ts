import { OpenAPIRoute, contentJson, InputValidationException } from "chanfana";
import { z } from "zod";
import { createGoPayClient, AppContext } from "../../types";
import { Schemas } from "../Shared/Schemas";
import { OrderDelivery } from "../../goPay/types";
import { GoPayClient } from "../../goPay/client";

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

    const deliveryLocation = await getDeliveryLocation(client, order.kitchenId);
    if (deliveryLocation instanceof Response) return deliveryLocation;

    const deliveries: OrderDelivery[] = [
      {
        deliveryLocation: { name: deliveryLocation.name },
        deliveryTime: `${order.date}T00:00:00.000+02:00`,
        orderLines: order.orderlines.map((ol) => ({
          productId: ol.productId,
          items: ol.quantity,
          buyerParty: "PRIVATE",
        })),
      },
    ];

    const orderResponse = await client.placeOrder(
      deliveryLocation.kitchenId,
      deliveries
    );
    if (orderResponse instanceof Response) return orderResponse;

    const paymentResponse = await client.payOrder(
      deliveryLocation.kitchenId,
      deliveryLocation.webshopUid,
      deliveries
    );
    if (paymentResponse instanceof Response) return paymentResponse;

    return { success: true };
  }
}
async function getDeliveryLocation(
  client: GoPayClient,
  kitchenId?: number
): Promise<DeliveryLocation | Response> {
  const locationsResponse = await client.getLocations();
  if (locationsResponse instanceof Response) return locationsResponse;

  const location = locationsResponse.find((location) =>
    location.kitchens.find((kitchen) => kitchen.id === kitchenId)
  );
  const deliveryLocation = {
    name: location?.name,
    kitchenId: location?.kitchens[0].id,
    webshopUid: location?.kitchens[0].webshops[0].uid,
  };
  return deliveryLocation;
}

type DeliveryLocation = {
  name: string;
  kitchenId: number;
  webshopUid: string;
};
