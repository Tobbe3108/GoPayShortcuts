---
name: openapi-endpoint-design
description: Designing REST APIs with OpenAPI specifications using Chanfana and Hono for type-safe endpoint definitions in GoPayShortcuts
---

# OpenAPI Endpoint Design

## What I Cover

- OpenAPI 3.0 specification design
- Endpoint schema definition with Chanfana
- Request body validation and documentation
- Response type definition and examples
- Error handling and status codes
- Query parameters and path variables
- Authentication and authorization schemes
- Automatic API documentation generation

## Common Patterns

### Basic OpenAPI Route Structure
```typescript
import { OpenAPIRoute, Str, Bool, contentJson } from "chanfana";
import { z } from "zod";

export class GetUser extends OpenAPIRoute {
  schema = {
    tags: ["Users"],
    summary: "Get user by ID",
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string" },
        description: "User ID"
      }
    ],
    responses: {
      "200": {
        description: "Returns user details",
        ...contentJson(
          z.object({
            id: Str({ example: "123" }),
            name: Str({ example: "John Doe" }),
            email: Str({ example: "john@example.com" })
          })
        )
      },
      "404": {
        description: "User not found"
      }
    }
  };

  async handle(c: AppContext) {
    const { id } = c.req.param();
    // Implementation
  }
}
```

### Request Body Validation
```typescript
export class CreateUser extends OpenAPIRoute {
  schema = {
    tags: ["Users"],
    summary: "Create new user",
    request: {
      body: {
        ...contentJson(
          z.object({
            name: z.string().describe("User full name"),
            email: z.string().email().describe("Valid email address"),
            role: z.enum(["admin", "user"]).describe("User role")
          })
        )
      }
    },
    responses: {
      "201": {
        description: "User created successfully",
        ...contentJson(z.object({ id: Str() }))
      },
      "400": {
        description: "Invalid request data"
      }
    }
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    // Safe to use data.body with validated types
  }
}
```

### Error Response Handling
```typescript
export class Login extends OpenAPIRoute {
  schema = {
    tags: ["Auth"],
    request: {
      body: { ...contentJson(z.object({ otp: z.string() })) }
    },
    responses: {
      "200": {
        description: "Login successful",
        ...contentJson(z.object({ token: Str() }))
      },
      "401": {
        description: "Invalid OTP",
        ...contentJson(z.object({ error: Str() }))
      },
      ...InputValidationException.schema(),
      ...Schemas.InternalServerError()
    }
  };

  async handle(c: AppContext) {
    const data = await this.getValidatedData<typeof this.schema>();
    try {
      // Logic
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Authentication failed" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
```

### Shared Schemas Pattern
```typescript
export const Schemas = {
  GoPayErrorResponse: () => ({
    content: {
      "application/json": {
        schema: z.object({
          code: Str({ example: "AUTH_ERROR" }),
          message: Str({ example: "Authentication failed" })
        })
      }
    }
  }),
  
  InternalServerError: () => ({
    "500": {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({
            error: Str({ example: "Internal Server Error" })
          })
        }
      }
    }
  })
};
```

## Best Practices

1. **Define all responses explicitly** - Include success and all possible error cases
2. **Use descriptive tags** - Organize endpoints logically with tags (Auth, Users, Orders, etc.)
3. **Validate at the boundary** - Use Zod schemas to validate all inputs
4. **Document with examples** - Use example values in schema definitions
5. **Reuse common schemas** - Create shared error responses and common models
6. **Set appropriate status codes** - Use 201 for creation, 204 for no content, etc.
7. **Version your API** - Include API version in request headers or URL paths
8. **Cache strategically** - Set Cache-Control headers based on endpoint type

## GoPayShortcuts Examples

### Authentication Endpoints
The Login endpoint (backend/src/endpoints/auth/login.ts:1-65) demonstrates:
- OpenAPI schema with request body specification
- Zod validation of OTP input
- Detailed response schema with token example
- Error case documentation (401 Unauthorized)
- Response header control (Cache-Control: no-store)
- Use of Chanfana's contentJson helper

### Shared Schema Pattern
Uses Schemas.GoPayErrorResponse() and Schemas.InternalServerError() for DRY error definitions across endpoints.

### Request Validation
Calls getValidatedData<typeof this.schema>() to get type-safe, pre-validated request data.

## Related Skills

- **Cloudflare Workers Development** - Platform where endpoints run
- **Hono Framework Backend** - Routing and middleware framework
- **Zod Schema Validation** - Runtime validation of request/response data
- **TypeScript Strict Mode Patterns** - Ensuring type safety in API definitions
