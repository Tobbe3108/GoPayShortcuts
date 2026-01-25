---
name: chanfana-openapi
description: Build type-safe REST APIs with Chanfana (OpenAPI framework), Hono.js, and Cloudflare Workers with automated Swagger documentation and request validation
license: MIT
compatibility: opencode
metadata:
  audience: backend-developers, full-stack-engineers
  domain: api-development
  workflow: cloudflare-workers
  updated: "2025-01"
  keywords: chanfana, openapi, hono, cloudflare-workers, typescript, zod, validation
---

## What I do

I guide you through building production-grade, type-safe REST APIs using Chanfana, Hono, and Cloudflare Workers. I help you:

- **Define OpenAPI specifications with decorators** - Use Chanfana's schema system to automatically generate Swagger docs with request/response types
- **Build Hono routes with Chanfana endpoints** - Create type-safe route handlers that validate requests and generate documentation automatically
- **Add Zod validation patterns** - Apply structured validation to query parameters, request bodies, and response types with full TypeScript inference
- **Generate Swagger documentation** - Automatically expose interactive API docs without manual OpenAPI YAML files
- **Implement error handling** - Use Chanfana's exception system for consistent error responses with proper HTTP status codes
- **Deploy to Cloudflare Workers** - Run your API at the edge with automatic request validation and documentation

## When to use me

Load this skill when:

- You're defining new API endpoints with OpenAPI specs in a Chanfana project
- You need to add request validation using Zod schemas with Chanfana
- You're building Hono middleware or route handlers on Cloudflare Workers
- You're troubleshooting Swagger documentation generation or endpoint registration
- You're implementing error handling and response types in Chanfana routes
- You need to set up bearer authentication or security schemes in your API
- You're integrating Hono middleware (CORS, caching, logging) with Chanfana endpoints

## Chanfana framework basics

**Chanfana** is an OpenAPI framework for Hono that automatically generates Swagger documentation from TypeScript class-based route handlers. It eliminates manual OpenAPI YAML files by inferring specs from your code.

### Core concepts

| Concept | Purpose | Example |
| --- | --- | --- |
| **OpenAPIRoute** | Base class for a route handler with OpenAPI metadata | `class Login extends OpenAPIRoute` |
| **schema** | Object defining request/response types and documentation | `schema = { tags, summary, request, responses }` |
| **handle()** | Async method that processes requests and returns responses | `async handle(c: Context)` |
| **getValidatedData()** | Extracts and validates request data against schema | `const data = await this.getValidatedData()` |
| **fromHono()** | Wraps Hono app to register routes with OpenAPI registry | `const openapi = fromHono(app, { schema })` |
| **registry** | Stores component definitions for reusable security/error schemas | `openapi.registry.registerComponent()` |

### Setup pattern

```typescript
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Create Hono app with Cloudflare Bindings
const app = new Hono<{ Bindings: Env }>();

// Add middleware
app.use("*", cors({ origin: ["http://localhost:5173"], ... }));

// Initialize Chanfana with OpenAPI metadata
const openapi = fromHono(app, {
  docs_url: "/", // Swagger UI endpoint
  schema: {
    info: {
      title: "My API",
      description: "API description",
      version: "1.0.0",
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Orders", description: "Order management" },
    ],
  },
});

// Register security schemes
openapi.registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Register routes (use openapi instead of app)
openapi.post("/api/login", Login);
openapi.get("/api/orders", ListOrders);

export default app;
```

## OpenAPI specification with Chanfana decorators

Chanfana uses a **schema object** inside each route class to define OpenAPI metadata. The schema is converted to Swagger documentation automatically.

### Schema structure

```typescript
export class Login extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],                           // Group in Swagger UI
    summary: "Login with OTP",                // Short description
    description: "Authenticates user with one-time password", // Optional detailed description
    
    request: {
      body: {
        // Define request body with Zod + contentJson helper
        ...contentJson(
          z.object({
            otp: z.string().describe("One-time password"),
            email: z.string().email(),
          })
        ),
      },
      query: z.object({
        // Query parameters
        redirect: z.string().optional(),
      }),
    },
    
    responses: {
      "200": {
        description: "Login successful",
        ...contentJson(
          z.object({
            token: z.string().describe("JWT token"),
          })
        ),
      },
      "401": {
        description: "Invalid OTP",
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
    // data.body and data.query are type-safe
    return { token: "..." };
  }
}
```

### Helper functions

| Helper | Purpose | Example |
| --- | --- | --- |
| **contentJson()** | Wraps Zod schema as JSON request/response | `contentJson(z.object({ name: z.string() }))` |
| **Str()** | Shorthand for string field with metadata | `Str({ example: "2024-01-01", required: true })` |
| **Bool()** | Boolean field | `Bool({ example: true })` |
| **Num()** | Number field | `Num({ example: 42 })` |
| **describe()** | Add field documentation | `z.string().describe("User email address")` |

### Example: Complete endpoint with validation

```typescript
import {
  contentJson,
  InputValidationException,
  OpenAPIRoute,
  Str,
} from "chanfana";
import { z } from "zod";

export class GetOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "List orders for a date range",
    ...Schemas.BearerAuth(), // Reusable auth schema
    
    request: {
      query: z.object({
        start: Str({
          example: "2024-07-01",
          required: true,
          description: "Start date YYYY-MM-DD",
        }),
        end: Str({
          example: "2024-07-07",
          required: true,
          description: "End date YYYY-MM-DD",
        }),
      }),
    },
    
    responses: {
      200: {
        description: "Orders retrieved",
        ...contentJson(
          z.object({
            orders: z.array(
              z.object({
                id: z.number(),
                date: z.string(),
                total: z.number(),
              })
            ),
          })
        ),
      },
      401: {
        description: "Unauthorized",
        ...Schemas.GoPayErrorResponse(),
      },
      ...InputValidationException.schema(),
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    const { start, end } = data.query; // Validated, type-safe

    const orders = await fetchOrders(start, end);
    return { orders };
  }
}
```

## Hono routing and middleware with Chanfana

Chanfana integrates with Hono's routing and middleware system. Register routes via the OpenAPI object, and middleware works normally.

### Middleware patterns

**Global middleware** (runs before all routes):

```typescript
const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({ origin: ["http://localhost:5173"] }));
app.use("*", logger());

const openapi = fromHono(app, { ... });
```

**Path-specific middleware** (runs before matching routes):

```typescript
app.use("/api/*", async (c, next) => {
  // Auth middleware: skip public routes
  const path = c.req.path;
  if (path === "/api/login" || path === "/api/menu") {
    await next();
    return;
  }

  // Check authorization for protected routes
  const token = c.req.header("Authorization");
  if (!token?.startsWith("Bearer")) {
    return c.text("Unauthorized", 401);
  }

  await next();
});

const openapi = fromHono(app, { ... });
openapi.post("/api/login", Login);     // Public
openapi.get("/api/orders", ListOrders); // Protected by middleware
```

**Context binding** (pass data through middleware to handlers):

```typescript
type AppContext = HonoRequest & {
  Bindings: Env;
  Variables: {
    userId?: string;
    client?: GoPayClient;
  };
};

// Middleware
app.use("/api/*", async (c, next) => {
  c.set("userId", extractUserIdFromToken(c.req.header("Authorization")));
  c.set("client", createGoPayClient(c));
  await next();
});

// Handler accesses context variables
async handle(c: AppContext) {
  const userId = c.get("userId");
  const client = c.get("client");
  // ...
}
```

### Caching with middleware

```typescript
// In handler: set cache headers
async handle(c: AppContext) {
  c.res.headers.set(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1200"
  );
  return { data: "..." };
}

// Or: custom cache middleware
app.use("/api/public/*", async (c, next) => {
  await next();
  c.res.headers.set("Cache-Control", "public, max-age=3600");
});
```

## Zod validation patterns

Chanfana uses **Zod** for runtime type validation. Zod schemas in Chanfana have two benefits:
1. **Automatic documentation** - Descriptions become Swagger field docs
2. **Request validation** - Invalid requests are rejected before reaching your handler

### Basic validation

```typescript
import { z } from "zod";
import { contentJson, Str } from "chanfana";

// Simple string/number fields
const LoginSchema = z.object({
  otp: z.string().describe("One-time password"),
  email: z.string().email().describe("User email"),
});

// In schema
request: {
  body: { ...contentJson(LoginSchema) },
}
```

### Complex validation

```typescript
const OrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().min(1),
      price: z.number().positive(),
    })
  ).min(1, "At least one item required"),
  
  date: z.string().datetime().describe("ISO 8601 datetime"),
  
  instructions: z.string().optional(),
  
  // Enum validation
  priority: z.enum(["low", "medium", "high"]),
});
```

### Reusable validation schemas

Create a shared `Schemas.ts` file for reuse across endpoints:

```typescript
// backend/src/endpoints/Shared/Schemas.ts
import { contentJson, Str } from "chanfana";
import { z } from "zod";

export class Schemas {
  static BearerAuth() {
    return {
      security: [{ bearerAuth: [] }],
    };
  }

  static GoPayErrorResponse() {
    return {
      "401": {
        description: "GoPay authentication error",
        ...contentJson(
          z.object({
            error: z.string(),
            code: z.number(),
          })
        ),
      },
      "500": {
        description: "GoPay server error",
        ...contentJson(
          z.object({
            error: z.string(),
            message: z.string(),
          })
        ),
      },
    };
  }

  static InternalServerError() {
    return {
      "500": {
        description: "Internal server error",
        ...contentJson(
          z.object({
            error: z.string(),
          })
        ),
      },
    };
  }
}

// Usage in endpoints
export class ListOrders extends OpenAPIRoute {
  schema = {
    tags: ["Orders"],
    summary: "Get orders",
    ...Schemas.BearerAuth(),
    responses: {
      200: { ... },
      ...Schemas.GoPayErrorResponse(),
      ...Schemas.InternalServerError(),
    },
  };
}
```

### Validation with examples

```typescript
const ProductSchema = z.object({
  id: z.number().describe("Product ID"),
  name: Str({
    example: "Margherita Pizza",
    description: "Product name",
  }),
  price: z.number().describe("Price in USD"),
  category: z.enum(["pizza", "pasta", "salad"]).describe("Product category"),
});
```

## Error handling and response types

Chanfana provides exception classes for standard HTTP error responses. Return them from handlers to send error responses.

### Built-in exception classes

| Exception | HTTP Status | Usage |
| --- | --- | --- |
| **InputValidationException** | 400 | Invalid request body/query |
| **AuthenticationException** | 401 | Missing/invalid credentials |
| **AuthorizationException** | 403 | User lacks permission |
| **NotFound** | 404 | Resource doesn't exist |
| **MethodNotAllowed** | 405 | Wrong HTTP method |

### Using exceptions

```typescript
import {
  InputValidationException,
  AuthenticationException,
  OpenAPIRoute,
} from "chanfana";

export class Login extends OpenAPIRoute {
  schema = {
    // ... schema definition
    responses: {
      "200": { ... },
      ...InputValidationException.schema(), // Include in docs
      "401": {
        description: "Invalid OTP",
        ...contentJson(z.object({ error: z.string() })),
      },
    },
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    
    // Validation errors are thrown automatically before reaching handler
    const response = await client.login(data.body.otp);
    
    if (!response.success) {
      // Return custom error
      return c.json(
        { error: "Invalid OTP provided" },
        { status: 401 }
      );
    }

    return { token: response.token };
  }
}
```

### Custom error responses

```typescript
async handle(c: AppContext) {
  const data = await this.getValidatedData<typeof this.schema>();
  
  const order = await fetchOrder(data.path.orderId);
  if (!order) {
    return c.json(
      { error: `Order ${data.path.orderId} not found` },
      { status: 404 }
    );
  }

  if (order.status === "cancelled") {
    return c.json(
      { error: "Order is cancelled and cannot be modified" },
      { status: 409 }
    );
  }

  return { order };
}
```

### Response type inference

Always return plain objects (or type-safe responses) from handlers. Chanfana serializes to JSON:

```typescript
// ✅ Good: plain object
async handle(c: AppContext) {
  return { 
    token: "...",
    expiresIn: 3600,
  };
}

// ✅ Good: with type safety
type LoginResponse = {
  token: string;
  expiresIn: number;
};

async handle(c: AppContext) {
  return {
    token: "...",
    expiresIn: 3600,
  } as LoginResponse;
}

// ❌ Bad: explicit JSON stringify (handled automatically)
return c.json({ token: "..." });
```

## Request/response documentation

Chanfana automatically generates Swagger documentation from your schema. Use descriptions, examples, and metadata to create clear API docs.

### Field documentation

```typescript
const schema = {
  request: {
    body: contentJson(
      z.object({
        otp: z
          .string()
          .describe("One-time password sent to user email")
          .min(6)
          .max(6),
        
        // Example values shown in Swagger
        email: Str({
          example: "user@example.com",
          description: "User email address",
        }),
      })
    ),
  },
};
```

### Response documentation

```typescript
responses: {
  "200": {
    description: "Authentication successful, returns JWT token for API access",
    ...contentJson(
      z.object({
        token: Str({
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          description: "JWT authentication token, valid for 24 hours",
        }),
        expiresIn: z.number().describe("Token expiration in seconds"),
      })
    ),
  },
  "401": {
    description: "OTP is invalid or expired",
    ...contentJson(
      z.object({
        error: z.string().describe("Error message"),
      })
    ),
  },
},
```

### Route documentation

```typescript
schema = {
  tags: ["Orders"],
  summary: "Get all orders for a date range",
  description: `
    Retrieves all orders between start and end dates.
    Requires Bearer token authentication.
    Orders are grouped by date and location.
  `,
  ...Schemas.BearerAuth(),
};
```

## Integration with Cloudflare Workers

Chanfana is designed for Cloudflare Workers. Leverage Workers features in your API.

### Environment variables (Bindings)

```typescript
// wrangler.toml
[env.production]
vars = { ENV = "production" }

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "abc123"

[env.production.env]
GOPAY_API_KEY = "secret"
```

```typescript
// Type Cloudflare bindings
type Env = {
  GOPAY_API_KEY: string;
  CACHE: KVNamespace;
  Environment: "production" | "development";
};

const app = new Hono<{ Bindings: Env }>();

async handle(c: AppContext) {
  const apiKey = c.env.GOPAY_API_KEY;
  const cached = await c.env.CACHE.get("orders");
  // ...
}
```

### Deploy to Cloudflare

```bash
# Build backend
cd backend
npm run build

# Deploy with wrangler
npx wrangler deploy --env production
```

### Example: Complete GoPayShortcuts pattern

```typescript
// backend/src/index.ts
import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

// CORS for frontend
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://tobbe3108.github.io"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Auth middleware
app.use("/api/*", async (c, next) => {
  if (["/api/login", "/api/request-otp", "/api/menu"].includes(c.req.path)) {
    await next();
    return;
  }

  const token = c.req.header("Authorization");
  if (!token?.startsWith("Bearer")) {
    return c.text("Unauthorized", 401);
  }

  await next();
});

// OpenAPI setup
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "GoPay API",
      description: "REST API for order management",
      version: "1.0.0",
    },
    tags: [
      { name: "Auth", description: "Authentication" },
      { name: "Orders", description: "Order management" },
    ],
  },
});

openapi.registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Routes
openapi.post("/api/login", Login);
openapi.get("/api/orders", ListOrders);
openapi.patch("/api/orders", PatchOrdersState);

export default app;
```

## Common patterns

### Pattern: Query parameter validation

```typescript
request: {
  query: z.object({
    start: Str({
      example: "2024-07-01",
      required: true,
      description: "Start date in YYYY-MM-DD format",
    }),
    end: Str({
      example: "2024-07-07",
      required: true,
      description: "End date in YYYY-MM-DD format",
    }),
    limit: z.number().int().min(1).max(100).optional(),
  }),
}
```

### Pattern: Nested object validation

```typescript
request: {
  body: contentJson(
    z.object({
      order: z.object({
        date: z.string().datetime(),
        items: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().positive(),
          })
        ),
      }),
    })
  ),
}
```

### Pattern: Multiple response types

```typescript
responses: {
  "200": {
    description: "Success",
    ...contentJson(z.object({ success: z.literal(true), data: z.any() })),
  },
  "400": {
    description: "Validation error",
    ...contentJson(z.object({ error: z.string() })),
  },
  ...InputValidationException.schema(),
  ...Schemas.InternalServerError(),
}
```

### Pattern: Reusable error responses

```typescript
// Shared schema
export class Schemas {
  static async handle(c: Context) {
    return {
      "500": {
        description: "Server error",
        ...contentJson(
          z.object({
            error: z.string(),
            requestId: z.string().uuid().optional(),
          })
        ),
      },
    };
  }
}
```

## Troubleshooting

| Problem | Cause | Solution |
| --- | --- | --- |
| **Endpoint not in Swagger** | Route not registered via `openapi.post/get/patch` | Use `openapi.*` methods instead of `app.*` |
| **Validation always passes** | Zod schema not connected to Chanfana | Use `contentJson(z.object(...))` in request/responses |
| **Type safety lost in handler** | Not using `getValidatedData<typeof this.schema>()` | Import helper and use in handle() |
| **Request body ignored** | Missing `...contentJson()` wrapper | Wrap Zod object: `contentJson(z.object({...}))` |
| **Swagger docs empty** | Missing OpenAPI metadata | Add `tags`, `summary`, `request`, `responses` to schema |
| **Bearer auth not working** | Security scheme not registered | Call `openapi.registry.registerComponent("securitySchemes", ...)` |
| **Middleware not running** | Registered after route registration | Add all middleware before `fromHono()` |

## Reference

- **Chanfana docs**: https://github.com/cloudflare/chanfana
- **Hono docs**: https://hono.dev/
- **Zod validation**: https://zod.dev/
- **OpenAPI 3.0**: https://swagger.io/specification/
- **Related skills**: [hono-cloudflare](../hono-cloudflare/SKILL.md), [hono-routing](../hono-routing/SKILL.md)
