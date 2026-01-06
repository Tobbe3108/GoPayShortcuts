---
name: cloudflare-workers-development
description: Building serverless applications on Cloudflare Workers platform with TypeScript, Hono, and Wrangler for scalable backend services
---

# Cloudflare Workers Development

## What I Cover

- Setting up Cloudflare Workers projects with Wrangler
- TypeScript configuration and type generation
- Environment variables and secrets management
- Request/response handling with Workers runtime
- Cloudflare bindings (KV, D1, Durable Objects)
- Deployment and monitoring
- Testing Workers locally and in production
- Performance optimization and edge computing patterns

## Common Patterns

### Basic Worker Handler
```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not Found', { status: 404 });
  }
};
```

### Type-Safe Environment Configuration
```typescript
interface Env {
  API_KEY: string;
  KV_STORE: KVNamespace;
  D1_DATABASE: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiKey = env.API_KEY;
    // Use environment bindings
  }
};
```

### Error Handling Pattern
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const response = await processRequest(request, env);
      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
```

### Middleware Pattern
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function withCors(response: Response): Response {
  const corsResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    corsResponse.headers.set(key, value);
  });
  return corsResponse;
}
```

## Best Practices

1. **Use Wrangler for project management** - Let Wrangler handle builds, types, and deployments
2. **Type your Env interface** - Document all environment bindings for type safety
3. **Handle errors gracefully** - Always catch and log errors appropriately
4. **Implement request validation** - Validate incoming data before processing
5. **Minimize execution time** - Workers charge by CPU milliseconds
6. **Use KV for caching** - Cache expensive operations in Cloudflare KV
7. **Deploy frequently** - Use CI/CD to deploy changes automatically
8. **Monitor with logs** - Use Wrangler tail to debug production issues

## GoPayShortcuts Examples

### OpenAPI-Driven Workers
The backend (backend/package.json) uses:
- Hono 4.9.7 for routing and middleware
- Chanfana 2.6.3 for OpenAPI route definitions
- Zod 3.24.1 for request validation
- Environment binding configuration in wrangler.toml

### Authentication Endpoint Pattern
Endpoints like Login (backend/src/endpoints/auth/login.ts) show:
- OpenAPIRoute class-based structure
- Zod schema validation for inputs
- Type-safe context handling (AppContext)
- Proper HTTP headers (Cache-Control: no-store)

### Deployment Strategy
Uses wrangler deploy to push workers to Cloudflare edge globally.

## Related Skills

- **Hono Framework Backend** - HTTP framework running on Workers
- **OpenAPI Endpoint Design** - Defining APIs with OpenAPI specifications
- **Zod Schema Validation** - Runtime validation in Workers
- **TypeScript Strict Mode Patterns** - Type-safe Workers development
