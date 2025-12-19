import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { Login } from "./endpoints/auth/login";
import { RequestOTP } from "./endpoints/auth/requestOTP";
import { GetLocations } from "./endpoints/locations/getLocations";
import { ListOrders } from "./endpoints/orders/listOrders";
import { PatchOrdersState } from "./endpoints/orders/updateDay";
// import { CancelOrders } from "./endpoints/orders/cancelOrders";
// import { AddOrder } from "./endpoints/orders/addOrder";
import { GetProducts } from "./endpoints/products/getProducts";
import { GetMenu } from "./endpoints/menu/getMenu";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use(
  "*",
  cors({
    // Allow local dev and GitHub Pages
    origin: [
      "http://localhost:5173",
      "https://tobbe3108.github.io/GoPayShortcuts",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: true,
  })
);

// Global auth middleware for all /api routes
app.use("/api/*", async (c, next) => {
  const path = c.req.path;
  if (
    path === "/api/login" ||
    path === "/api/request-otp" ||
    path === "/api/menu"
  ) {
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
      {
        name: "Products",
        description: "Endpoints related to products",
      },
      {
        name: "Orders",
        description: "Endpoints related to orders",
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
openapi.get("/api/products", GetProducts);
openapi.get("/api/menu", GetMenu);

openapi.get("/api/orders", ListOrders);
// openapi.post("/api/orders", AddOrder);
openapi.patch("/api/orders", PatchOrdersState);
// openapi.delete("/api/orders", CancelOrders);

// Export the Hono app
export default app;
