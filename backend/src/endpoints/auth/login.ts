import {
  Bool,
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";
import { type AppContext, createGoPayClient } from "../../types";
import { Schemas } from "../Shared/Schemas";

export class Login extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    summary: "Login with one-time password (OTP)",
    request: {
      body: {
        ...contentJson(
          z.object({
            otp: z.string().describe("One-time password (OTP)"),
          })
        ),
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
      "401": {
        description: "Unauthorized",
        ...contentJson(
          z.object({
            status: Str(),
            details: Str(),
            displayMessage: Str(),
            isUserMessage: Bool(),
          })
        ),
      },
      ...Schemas.InternalServerError(),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const client = createGoPayClient(c);

    const response = await client.login(data.body.otp);
    if (response instanceof Response) return response; // Error responses

    return {
      token: response.authentication.token,
    } as LoginResponse;
  }
}

type LoginResponse = {
  token: string;
};
