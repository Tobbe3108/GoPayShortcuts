import { contentJson, Str } from "chanfana";
import { z } from "zod";

export class Schemas {
  static InternalServerError() {
    return {
      "500": {
        description: "Internal Server Error",
        ...contentJson(
          z.object({
            message: Str({ example: "Internal Server Error" }),
            error: z.any(),
          })
        ),
      },
    };
  }

  static BearerAuth() {
    return {
      security: [{ bearerAuth: [] }],
    };
  }

  static GoPayErrorResponse() {
    return contentJson(
      z.object({
        status: Str({ example: "error" }),
        details: Str({ example: "Detailed error message" }),
        displayMessage: Str({ example: "User-friendly error message" }),
        isUserMessage: z.boolean(),
      })
    );
  }

  static OrderDetailsSchema() {
    return z.object({
      id: z.number(),
      status: Str({ example: "confirmed" }),
      deliveries: z.array(
        z.object({
          id: z.number(),
          deliveryTime: Str({ example: "2025-07-20T12:00:00" }),
          orderLines: z.array(
            z.object({
              productId: z.number(),
              productName: Str(),
              price: z.number(),
              items: z.number(),
            })
          ),
          cancelOrder: z
            .object({
              cancelEnable: z.boolean(),
              cancelBeforeDate: z.string().optional(),
            })
            .optional(),
        })
      ),
      kitchen: z.object({
        id: z.number(),
        name: Str(),
      }),
      totalPrice: z.number(),
    });
  }

  static LocationSchema() {
    return z.object({
      kitchenId: z.number(),
      name: Str({ example: "Downtown Office" }),
    });
  }

  static ProductSchema() {
    return z.object({
      id: z.number(),
      name: Str({ example: "Chicken Salad" }),
      description: Str({ example: "Fresh salad with grilled chicken" }),
      price: z.number(),
      category: Str({ example: "Salads" }),
    });
  }

  static MenuItemSchema() {
    return z.object({
      name: Str({ example: "Pasta Carbonara" }),
      category: Str({ example: "Main Courses" }),
      allergens: z.array(Str({ example: "gluten" })),
    });
  }
}
