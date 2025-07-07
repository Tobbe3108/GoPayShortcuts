import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../types";
import { LoginResponse } from "../goPay/types";

export class Login extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    summary: "Login with one-time password (OTP)",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              otp: z.string().describe("One-time password (OTP)"),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns token on successful login",
        ...contentJson(
          z.object({
            token: Str(),
          })
        ),
      },
      ...InputValidationException.schema(),
      "500": {
        description: "Internal Server Error",
        ...contentJson(
          z.object({
            error: z.string(),
          })
        ),
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const client = createGoPayClient(c.env);
    const loginRes: LoginResponse = await client.login(data.body.otp);
    return { token: loginRes.authentication.token };
  }
}
