---
name: cloudflare-workers
description: Comprehensive development guide for Cloudflare Workers using Hono framework, TypeScript, and Wrangler deployment, tailored for the GoPayShortcuts project with examples of routing, middleware, edge computing, and KV storage integration.
---

# What I Cover

- Setting up Cloudflare Workers with Hono framework and TypeScript
- Creating RESTful APIs with Hono routing
- Implementing middleware for authentication, CORS, and logging
- Using Cloudflare KV for data storage and caching
- Managing environment variables and bindings
- Deployment and testing with Wrangler CLI
- Error handling and performance optimization for edge functions
- Integration patterns with frontend applications like SvelteKit

# Common Patterns

## Basic Hono App Structure
```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/health', (c) => c.json({ status: 'ok' }))

export default app
```

## Routing with Parameters
```typescript
app.get('/api/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ userId: id })
})
```

## Middleware Usage
```typescript
app.use('*', async (c, next) => {
  console.log(`${c.req.method} ${c.req.path}`)
  await next()
})
```

## KV Storage Operations
```typescript
app.get('/api/data/:key', async (c) => {
  const key = c.req.param('key')
  const value = await c.env.KV.get(key)
  return c.json({ key, value })
})
```

# Best Practices

- Keep Worker functions under 1MB and execution time under 10 seconds
- Use TypeScript for type safety and better developer experience
- Implement proper error handling with try/catch blocks
- Test locally using `wrangler dev` before deploying
- Use environment variables for configuration, not hardcoded values
- Monitor performance with Cloudflare Analytics
- Cache frequently accessed data in KV to reduce latency
- Use middleware sparingly to avoid increasing cold start times

# Related Skills

- sveltekit-development: For building frontend applications that consume Worker APIs
- vite: For build tooling and development server
- github-actions: For automated deployment pipelines
- bun: For faster JavaScript runtime alternatives