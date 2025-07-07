import { fromHono } from "chanfana";
import { Hono } from "hono";

import { Login } from "./endpoints/login";
import { RequestOTP } from "./endpoints/requestOTP";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints
openapi.post("/api/request-otp", RequestOTP);
openapi.post("/api/login", Login);

openapi.get("/api/test", async (c) => {
  const response = await fetch(
    "https://prod.facilitynet.dk/api/authenticate/username",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Origin: "https://prod.facilitynet.dk",
        "X-Client-Type": "mobile-web",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "tolau@energinet.dk" }),
    }
  );

  const json = await response.json();

  return c.json({ response: response.status, data: json });
});

// Export the Hono app
export default app;
