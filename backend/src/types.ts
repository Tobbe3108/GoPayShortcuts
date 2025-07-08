import type { Context } from "hono";
import { GoPayClient } from "./goPay/client";

export type AppContext = Context<{ Bindings: Env }>;

export const createGoPayClient = (context: AppContext): GoPayClient => {
  return new GoPayClient(
    context.env.GOPAY_API_URL,
    context.req.header("Authorization").replace("Bearer", "").trim()
  );
};
