import {
  Bool,
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../types";

export class RequestOTP extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    summary: "Request a one-time password (OTP)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              email: Str({ example: "user@example.com", required: true }),
            }),
          },
        },
      },
    },
    responses: {
      "204": {
        description: "OTP request result",
      },
      ...InputValidationException.schema(),
      "500": {
        description: "Internal Server Error",
        ...contentJson(
          z.object({
            error: Str({ example: "An error occurred while requesting OTP" }),
          })
        ),
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const client = createGoPayClient(c.env);
    await client.requestOTP(data.body.email);
    return new Response(null, { status: 204 });
  }
}
