---
name: sveltekit-fullstack-development
description: Building full-stack web applications with SvelteKit 2.16, combining frontend components with backend routes and server-side logic
---

# SvelteKit Fullstack Development

## What I Cover

- Project structure and file-based routing
- +page.svelte for client components
- +page.ts for page load functions
- +server.ts for API endpoints
- +layout.svelte and +layout.ts for shared layouts
- Form actions and progressive enhancement
- Data loading and server-side rendering
- TypeScript integration and type safety
- Deployment and adapter configuration
- Environment variables and secrets

## Common Patterns

### Page with Load Function
```typescript
// +page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const response = await fetch(`/api/users/${params.id}`);
  
  if (!response.ok) {
    error(response.status, 'User not found');
  }
  
  const user = await response.json();
  
  return {
    user,
    title: `${user.name} - Profile`
  };
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  
  let { data }: { data: PageData } = $props();
</script>

<h1>{data.user.name}</h1>
<p>{data.user.email}</p>
```

### API Endpoint with Validation
```typescript
// +server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = CreateUserSchema.parse(body);
    
    // Create user in database
    const user = await createUser(validated);
    
    return json(user, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return json({ error: 'Invalid request' }, { status: 400 });
    }
    return json({ error: 'Server error' }, { status: 500 });
  }
};
```

### Form Action with Progressive Enhancement
```typescript
// +page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  login: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    
    try {
      const user = await authenticateUser(email, password);
      // Session handling
      throw redirect(303, '/dashboard');
    } catch (error) {
      return fail(401, { message: 'Invalid credentials' });
    }
  }
};
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { ActionData } from './$types';
  
  let { form }: { form?: ActionData } = $props();
</script>

<form method="POST" action="?/login">
  <input type="email" name="email" required />
  <input type="password" name="password" required />
  <button type="submit">Login</button>
  {#if form?.message}
    <p class="error">{form.message}</p>
  {/if}
</form>
```

### Shared Layout with Data
```typescript
// src/routes/+layout.ts
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  const navigation = await fetch('/api/navigation').then(r => r.json());
  
  return {
    navigation
  };
};
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import type { LayoutData } from './$types';
  
  let { data, children }: { 
    data: LayoutData;
    children: Snippet;
  } = $props();
</script>

<nav>
  {#each data.navigation as item}
    <a href={item.href}>{item.label}</a>
  {/each}
</nav>

<main>
  {@render children()}
</main>
```

### Protected Routes
```typescript
// src/routes/dashboard/+page.ts
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { session } = await parent();
  
  if (!session?.user) {
    throw redirect(303, '/login');
  }
  
  return {
    user: session.user
  };
};
```

## Best Practices

1. **Use load functions for data** - Fetch data on the server, send rendered HTML to client
2. **Validate all inputs** - Use Zod in both +server.ts and +page.server.ts
3. **Leverage TypeScript** - Import types from ./$types for full IDE support
4. **Implement error handling** - Use error() to display error pages
5. **Progressively enhance forms** - Support no-JavaScript and with-JavaScript modes
6. **Keep secrets server-side** - Never expose API keys in client code
7. **Use SvelteKit stores sparingly** - Prefer server data for most state
8. **Document API contracts** - Use JSDoc and TypeScript for endpoint documentation

## GoPayShortcuts Examples

### Page Structure
The project uses standard SvelteKit structure:
- frontend/src/routes/+page.ts for home page load
- frontend/src/routes/login/+page.ts for authentication
- frontend/src/routes/debug/* for development utilities

### API Client Pattern
frontend/src/lib/core/api/apiClient.ts provides:
- Centralized API communication
- Error handling and logging
- Request/response interceptors
- Type-safe API methods

### Authentication Flow
Uses protected routes pattern to control access to dashboard and other restricted pages.

### Component Integration
Atomic design components (Button, Card, Input) integrated throughout routes for consistent UI.

## Related Skills

- **Svelte Component Development** - Building UI components used in pages
- **Atomic Design Component Architecture** - Organizing components by hierarchy
- **TypeScript Strict Mode Patterns** - Type-safe SvelteKit development
- **Zod Schema Validation** - Validating forms and API data
