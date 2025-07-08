import {
  Bool,
  contentJson,
  InputValidationException,
  Obj,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../types";
import { Schemas } from "./Shared/Schemas";

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
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const client = createGoPayClient(c.env);

    var response = await client.requestOTP(data.body.email);
    if (response instanceof Response) return response;

    return new Response(null, { status: 204 });
  }
}
