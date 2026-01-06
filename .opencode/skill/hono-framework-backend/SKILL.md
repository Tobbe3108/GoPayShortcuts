---
name: hono-framework-backend
description: Building HTTP backend services with Hono 4.9 framework on Cloudflare Workers with routing, middleware, and context management
---

# Hono Framework Backend

## What I Cover

- Hono application setup and initialization
- Route definition and HTTP methods (GET, POST, PUT, DELETE)
- Middleware for logging, authentication, error handling
- Context object and request/response handling
- Type-safe routing with TypeScript
- Parameter extraction (path, query, body)
- Error handling and status codes
- Combining Hono with Chanfana for OpenAPI routes
- Testing Hono applications

## Common Patterns

### Basic Hono Application
```typescript
import { Hono } from 'hono';

type Env = {
  Bindings: {
    API_KEY: string;
    DB: D1Database;
  }
};

const app = new Hono<Env>();

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// Get item by ID
app.get('/items/:id', async (c) => {
  const id = c.req.param('id');
  const item = await getItem(id);
  
  if (!item) {
    return c.json({ error: 'Not found' }, 404);
  }
  
  return c.json(item);
});

// Create item
app.post('/items', async (c) => {
  const body = await c.req.json();
  const item = await createItem(body);
  return c.json(item, 201);
});

export default app;
```

### Middleware for Cross-Cutting Concerns
```typescript
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

const app = new Hono();

// Logging middleware
app.use(logger());

// CORS middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

// Custom authentication middleware
app.use('/api/*', async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const user = await verifyToken(token);
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});
```

### Route Grouping with Sub-applications
```typescript
import { Hono } from 'hono';

const authRoutes = new Hono();
authRoutes.post('/login', async (c) => {
  // Login logic
});
authRoutes.post('/logout', async (c) => {
  // Logout logic
});

const userRoutes = new Hono();
userRoutes.get('/:id', async (c) => {
  // Get user
});
userRoutes.put('/:id', async (c) => {
  // Update user
});

const app = new Hono();
app.route('/auth', authRoutes);
app.route('/users', userRoutes);

// Routes: /auth/login, /auth/logout, /users/:id, etc.
```

### Error Handling Pattern
```typescript
app.onError((error, c) => {
  console.error('Application error:', error);
  
  if (error instanceof ValidationError) {
    return c.json(
      { error: 'Validation failed', details: error.details },
      400
    );
  }
  
  if (error instanceof NotFoundError) {
    return c.json({ error: 'Resource not found' }, 404);
  }
  
  return c.json({ error: 'Internal server error' }, 500);
});

// Custom error classes
class ValidationError extends Error {
  constructor(public details: Record<string, string>) {
    super('Validation failed');
  }
}
```

### Context Utilities
```typescript
type AppContext = {
  Bindings: {
    API_KEY: string;
    DB: D1Database;
  };
  Variables: {
    user?: { id: string; email: string };
    requestId?: string;
  };
};

const app = new Hono<AppContext>();

// Set context variables
app.use(async (c, next) => {
  c.set('requestId', crypto.randomUUID());
  await next();
});

// Use context in handlers
app.get('/profile', (c) => {
  const user = c.get('user');
  const requestId = c.get('requestId');
  
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  return c.json({ user, requestId });
});
```

### Integration with Chanfana for OpenAPI
```typescript
import { Hono } from 'hono';
import { OpenAPIRoute } from 'chanfana';

class GetUser extends OpenAPIRoute {
  schema = {
    tags: ['Users'],
    summary: 'Get user by ID',
    parameters: [/* ... */],
    responses: { /* ... */ }
  };
  
  async handle(c) {
    // Implementation
  }
}

const app = new Hono();

// Register OpenAPI route
app.route('/users', new GetUser());

export default app;
```

## Best Practices

1. **Use typed contexts** - Define Env and Variables types for type safety
2. **Apply middleware at correct level** - Global vs. route-specific
3. **Validate all inputs** - Use Zod or similar for request validation
4. **Set appropriate status codes** - 200, 201, 204, 400, 401, 404, 500, etc.
5. **Handle errors consistently** - Use onError handler for global error handling
6. **Use sub-applications** - Organize routes by feature/domain
7. **Log strategically** - Log errors and important operations
8. **Cache when possible** - Set Cache-Control headers for static data
9. **Limit payload size** - Prevent resource exhaustion
10. **Version your API** - Include version in routes or headers

## GoPayShortcuts Examples

### OpenAPI Route Definition
The backend uses Hono with OpenAPI routes via Chanfana. The Login endpoint (backend/src/endpoints/auth/login.ts) shows:
- Class-based route definition extending OpenAPIRoute
- Schema definition with request/response types
- Type-safe context handling
- Error case documentation

### Route Organization
Backend structure follows feature-based organization:
- backend/src/endpoints/auth/ for authentication
- backend/src/endpoints/locations/ for location data
- backend/src/endpoints/orders/ for order management

### Context Pattern
Routes access typed context (AppContext) with:
- Cloudflare environment bindings
- Request validation helpers
- Response header control

### Validation Integration
All routes use Zod schemas for input validation through Chanfana's getValidatedData pattern.

## Related Skills

- **Cloudflare Workers Development** - Platform for Hono deployment
- **OpenAPI Endpoint Design** - Defining routes with OpenAPI specs
- **Zod Schema Validation** - Validating request data
- **TypeScript Strict Mode Patterns** - Type-safe Hono applications
