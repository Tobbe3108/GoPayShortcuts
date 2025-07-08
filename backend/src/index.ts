import { fromHono } from "chanfana";
import { Hono } from "hono";

import { Login } from "./endpoints/login";
import { RequestOTP } from "./endpoints/requestOTP";
import { GetLocations } from "./endpoints/getLocations";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Global auth middleware for all /api routes
app.use("/api/*", async (c, next) => {
  const path = c.req.path;
  if (path === "/api/login" || path === "/api/request-otp") {
    await next();
    return;
  }

  let token = c.req.header("Authorization");
  if (!token?.startsWith("Bearer")) {
    return c.text("Missing or invalid Authorization header", 401);
  }

  await next();
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "GoPayBadEdition API",
      description: "API for GoPay Bad Edition that wraps GoPay's **** API",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Locations",
        description: "Endpoints related to locations",
      },
    ],
  },
});

openapi.registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Register OpenAPI endpoints
openapi.post("/api/request-otp", RequestOTP);
openapi.post("/api/login", Login);
openapi.get("/api/locations", GetLocations);

// Export the Hono app
export default app;
