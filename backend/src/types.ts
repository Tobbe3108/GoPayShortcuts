import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";
import { GoPayClient } from "./goPay/client";

export type AppContext = Context<{ Bindings: Env }>;

export interface Env extends Cloudflare.Env {
  GOPAY_API_URL?: string;
}

export const Task = z.object({
	name: Str({ example: "lorem" }),
	slug: Str(),
	description: Str({ required: false }),
	completed: z.boolean().default(false),
	due_date: DateTime(),
});

export const createGoPayClient = (env: Env): GoPayClient => {
  return new GoPayClient(env.GOPAY_API_URL);
};