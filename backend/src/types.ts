import type { Context } from "hono";
import { GoPayClient } from "./goPay/client";

export type AppContext = Context<{ Bindings: Env }>;

export interface Env extends Cloudflare.Env {
  GOPAY_API_URL?: string;
}

export const createGoPayClient = (env: Env): GoPayClient => {
  return new GoPayClient(env.GOPAY_API_URL);
};
