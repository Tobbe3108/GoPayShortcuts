import type { Context } from "hono";
import { GoPayClient } from "./goPay/client";
import { GoPayClientMock } from "./goPay/client.mock";
import { MeyersClient } from "./meyers/client";

export type AppContext = Context<{ Bindings: Env }>;

export const createMeyersClient = (context: AppContext): MeyersClient => {
  const apiUrl = context.env.MEYERS_API_URL;
  return new MeyersClient(apiUrl);
};

export const createGoPayClient = (context: AppContext): GoPayClient => {
  const apiUrl = context.env.GOPAY_API_URL;
  const header = context.req.header("Authorization");
  if (header && header.startsWith("Bearer ")) {
    var token = context.req
      .header("Authorization")
      .replace("Bearer", "")
      .trim();
  }

  if (context.env.USE_LOCAL_MOCK_CLIENTS === true) {
    return new GoPayClientMock(apiUrl, token);
  }
  return new GoPayClient(apiUrl, token);
};
