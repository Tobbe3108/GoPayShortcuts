---
name: zod-schema-validation
description: Runtime data validation using Zod 3.24 for type-safe input validation in both frontend and backend of GoPayShortcuts
---

# Zod Schema Validation

## What I Cover

- Schema definition and composition
- Basic validators (string, number, boolean, date, enum)
- Collections (array, object, record, map, set)
- Refinement and transformation
- Error handling and custom messages
- Type inference from schemas
- Async validation
- Integration with OpenAPI/Chanfana
- Form validation patterns
- Error reporting and UX

## Common Patterns

### Basic Schema Definition
```typescript
import { z } from 'zod';

// Simple schemas
const StringSchema = z.string().min(1).max(100);
const EmailSchema = z.string().email();
const NumberSchema = z.number().int().positive();
const BooleanSchema = z.boolean();

// Using schemas
type Email = z.infer<typeof EmailSchema>;
const email: Email = 'user@example.com'; // Type-safe

// Validation
const result = StringSchema.safeParse('hello');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.errors);
}
```

### Object Schemas
```typescript
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().min(0).max(150).optional(),
  role: z.enum(['admin', 'user', 'guest']),
  active: z.boolean().default(true)
});

// Type inference
type User = z.infer<typeof UserSchema>;

// Parsing with error handling
const user = UserSchema.parse({
  id: '123',
  name: 'John',
  email: 'john@example.com',
  role: 'user'
});

// Safe parsing (doesn't throw)
const result = UserSchema.safeParse(data);
if (!result.success) {
  console.error('Validation errors:', result.error.flatten());
}
```

### Arrays and Collections
```typescript
const TagSchema = z.array(z.string()).min(1).max(10);
type Tags = z.infer<typeof TagSchema>;

const RecordSchema = z.record(z.string(), z.number());
type Record = z.infer<typeof RecordSchema>;

// Array of objects
const UsersSchema = z.array(UserSchema);
type Users = z.infer<typeof UsersSchema>;

// Tuple (fixed-length array)
const CoordinateSchema = z.tuple([z.number(), z.number()]);
type Coordinate = z.infer<typeof CoordinateSchema>;
```

### Refinement and Custom Validation
```typescript
const PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain number');

// Custom validation with refine
const UserSchema = z.object({
  password: z.string(),
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }
);

// Async validation
const UsernameSchema = z.string()
  .min(3)
  .refine(
    async (username) => {
      const exists = await checkUsernameExists(username);
      return !exists;
    },
    { message: 'Username already taken' }
  );

// Transform data
const DateSchema = z.string()
  .transform((str) => new Date(str))
  .refine((date) => date > new Date(), {
    message: 'Date must be in the future'
  });
```

### Union Types and Discriminated Unions
```typescript
// Union type
const ResponseSchema = z.union([
  z.object({ status: z.literal('success'), data: z.any() }),
  z.object({ status: z.literal('error'), error: z.string() })
]);

// Discriminated union (better for type narrowing)
const ResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    data: z.object({ id: z.string(), name: z.string() })
  }),
  z.object({
    status: z.literal('error'),
    error: z.string()
  }),
  z.object({
    status: z.literal('loading')
  })
]);

type Response = z.infer<typeof ResponseSchema>;
```

### Integration with OpenAPI/Chanfana
```typescript
import { contentJson, Str } from 'chanfana';

// In endpoint schema
const LoginSchema = z.object({
  otp: z.string().describe('One-time password received via email')
});

// In OpenAPI response
{
  "200": {
    description: "Login successful",
    ...contentJson(
      z.object({
        token: Str({
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }).describe("JWT authentication token")
      })
    )
  }
}

// In route handler
async handle(c: AppContext) {
  const data = await this.getValidatedData<typeof this.schema>();
  // data.body is now type-safe and validated
  return { token: data.body.otp };
}
```

### Form Validation Pattern
```svelte
<!-- +page.svelte -->
<script lang="ts">
  import { z } from 'zod';

  const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    rememberMe: z.boolean().default(false)
  });

  type Form = z.infer<typeof FormSchema>;

  let formData: Partial<Form> = $state({});
  let errors: Record<string, string> = $state({});

  function validateField(name: keyof Form, value: any) {
    const fieldSchema = FormSchema.pick({ [name]: true });
    const result = fieldSchema.safeParse({ [name]: value });
    
    if (!result.success) {
      errors[name] = result.error.errors[0].message;
    } else {
      delete errors[name];
    }
  }

  async function handleSubmit() {
    const result = await FormSchema.parseAsync(formData);
    if (result.success) {
      await submitForm(result.data);
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <input
    type="email"
    value={formData.email || ''}
    onchange={(e) => validateField('email', e.target.value)}
  />
  {#if errors.email}
    <span class="error">{errors.email}</span>
  {/if}

  <input
    type="password"
    value={formData.password || ''}
    onchange={(e) => validateField('password', e.target.value)}
  />
  {#if errors.password}
    <span class="error">{errors.password}</span>
  {/if}
</form>
```

### Error Handling
```typescript
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive()
});

const result = schema.safeParse(input);

if (!result.success) {
  // Flattened errors for easy display
  const flattened = result.error.flatten();
  console.log(flattened.fieldErrors);
  // { name: ['Required'], email: ['Invalid email'], age: ['Must be positive'] }

  // Full error details
  result.error.errors.forEach(err => {
    console.log(`${err.path.join('.')}: ${err.message}`);
  });
}
```

## Best Practices

1. **Infer types from schemas** - Use z.infer<typeof Schema> for type safety
2. **Use safeParse** - Avoid throws in application code
3. **Provide custom messages** - Make error messages user-friendly
4. **Validate at boundaries** - Server endpoints and form inputs
5. **Reuse schemas** - Extract common validations
6. **Discriminate unions** - Use discriminatedUnion for better type narrowing
7. **Test validation logic** - Include schema tests in test suites
8. **Handle async validation** - For database lookups and API calls
9. **Transform data carefully** - Only transform when necessary
10. **Document validation rules** - Include messages in error descriptions

## GoPayShortcuts Examples

### Request Body Validation
The Login endpoint (backend/src/endpoints/auth/login.ts:19-24) uses:
```typescript
z.object({
  otp: z.string().describe("One-time password (OTP) received via email")
})
```

### OpenAPI Response Schemas
Response definitions use Zod schemas for both documentation and validation:
```typescript
z.object({
  token: Str({ example: "eyJ..." }).describe("JWT authentication token")
})
```

### Integration Pattern
Backend endpoints use getValidatedData<typeof this.schema>() which:
- Validates input against schema
- Returns type-safe data
- Provides error responses automatically

### Error Responses
Shared error schemas (Schemas.GoPayErrorResponse, Schemas.InternalServerError) use Zod for consistency across all endpoints.

## Related Skills

- **OpenAPI Endpoint Design** - Validation in API definitions
- **Cloudflare Workers Development** - Validation in Worker handlers
- **Hono Framework Backend** - Request validation in routes
- **TypeScript Strict Mode Patterns** - Type-safe validation results
