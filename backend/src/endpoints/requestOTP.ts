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
      "404": {
        description: "Not Found",
        ...contentJson(
          z.object({
            status: Str(),
            details: Str(),
            displayMessage: Str(),
            isUserMessage: Bool(),
          })
        ),
      },
      ...InputValidationException.schema(),
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const client = createGoPayClient(c);

    var response = await client.requestOTP(data.body.email);
    if (response instanceof Response) return response; // Error responses

    return new Response(null, { status: 204 });
  }
}
