---
name: typescript-strict-mode-patterns
description: Writing type-safe TypeScript code with strict mode enabled across frontend and backend using advanced patterns and best practices
---

# TypeScript Strict Mode Patterns

## What I Cover

- strict mode compilation configuration
- Type inference and explicit annotations
- Null/undefined handling with non-null assertions
- Type guards and narrowing
- Generic constraints and utility types
- Interface vs Type discrimination
- Discriminated unions and exhaustiveness checking
- Advanced type patterns and techniques
- Strict null checking practices
- Function overloading for flexibility

## Common Patterns

### Strict Null Checking
```typescript
// With strict null checks enabled, null/undefined must be explicit

// Bad: null not handled
function getValue(): string {
  return null; // Error: Type 'null' is not assignable to type 'string'
}

// Good: Optional type
function getValue(): string | null {
  return null;
}

// Good: Required handling
const value = getValue();
if (value !== null) {
  console.log(value.toUpperCase());
}

// Good: Non-null assertion (when you're sure)
const value = getValue()!;
console.log(value.toUpperCase());
```

### Type Guards for Narrowing
```typescript
interface Button {
  type: 'button';
  onClick: () => void;
}

interface Link {
  type: 'link';
  href: string;
}

type Component = Button | Link;

function handleComponent(comp: Component) {
  // Type guard narrows the type
  if (comp.type === 'button') {
    comp.onClick(); // ✓ Knows onClick exists
  } else {
    // comp is now known to be Link
    window.location.href = comp.href; // ✓ Knows href exists
  }
}

// Custom type guard function
function isButton(comp: Component): comp is Button {
  return comp.type === 'button';
}

if (isButton(component)) {
  component.onClick();
}
```

### Discriminated Unions
```typescript
type Result<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

function handleResult<T>(result: Result<T>) {
  switch (result.status) {
    case 'success':
      return result.data; // ✓ Type is T
    case 'error':
      return new Error(result.error); // ✓ Has error property
    case 'loading':
      return null; // ✓ No data or error property
  }
}
```

### Generic Constraints
```typescript
// Constraint: T must have a 'length' property
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('hello'); // ✓ strings have length
getLength([1, 2, 3]); // ✓ arrays have length
getLength(123); // ✗ numbers don't have length

// Constraint: T must be a key of U
function getProperty<T, U extends Record<string, any>>(obj: U, key: T & keyof U) {
  return obj[key];
}

const user = { name: 'John', age: 30 };
getProperty(user, 'name'); // ✓
getProperty(user, 'email'); // ✗ email is not a key of user
```

### Exhaustiveness Checking
```typescript
type Status = 'pending' | 'success' | 'error';

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting...';
    case 'success':
      return 'Done!';
    case 'error':
      return 'Failed!';
    default:
      // If you add a new Status value and forget to handle it,
      // TypeScript will error here
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
```

### Utility Types for Type Safety
```typescript
// Record: ensure all keys are handled
type Variant = 'primary' | 'secondary' | 'danger';
const styles: Record<Variant, string> = {
  primary: 'bg-blue',
  secondary: 'bg-gray',
  danger: 'bg-red'
  // Forgetting any key causes TypeScript error
};

// Pick: subset of properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Partial: make properties optional
type UserUpdate = Partial<User>;

// Readonly: prevent mutation
type ReadonlyUser = Readonly<User>;

// ReturnType: extract function return type
type ApiResponse = ReturnType<typeof fetchUser>;
```

### Function Overloading
```typescript
function formatDate(date: Date): string;
function formatDate(date: Date, format: string): string;
function formatDate(date: Date, format?: string): string {
  return format 
    ? date.toLocaleDateString('en-US', { year: 'numeric' })
    : date.toLocaleDateString();
}

formatDate(new Date()); // ✓
formatDate(new Date(), 'YYYY-MM-DD'); // ✓
```

## Best Practices

1. **Enable strict mode** - Set `"strict": true` in tsconfig.json
2. **Avoid any type** - Use unknown and type guards instead
3. **Use const assertions** - For literal types: `as const`
4. **Explicit return types** - Document function contracts
5. **Discriminate unions properly** - Use literal types for discrimination
6. **Type props interfaces** - Always define component props with interfaces
7. **Use readonly where possible** - Prevent accidental mutations
8. **Extract types for reuse** - Define shared types in type files
9. **Leverage inference** - Let TypeScript infer types when obvious
10. **Test exhaustiveness** - Use never type to catch missing cases

## GoPayShortcuts Examples

### Component Props Typing
Button.svelte (frontend/src/lib/components/atoms/Button.svelte:1-18) defines:
```typescript
type Variant = 'primary' | 'secondary' | 'danger' | 'transparent';
type Size = 'sm' | 'md' | 'lg' | '';
type ButtonProps = {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  // ... other props
};
```

### Discriminated Union for Responses
Login endpoint (backend/src/endpoints/auth/login.ts:53-58) returns:
```typescript
if (response instanceof Response) return response; // Error case
return { token: response.authentication.token }; // Success case
```

### Record Type for Variants
Button uses Record<Variant, string> for variant styles (frontend/src/lib/components/atoms/Button.svelte:33-41):
```typescript
const variantClasses: Record<Variant, string> = {
  primary: '...',
  secondary: '...',
  danger: '...',
  transparent: '...'
};
```

### Environment Typing
Backend workers define typed Env interfaces for all bindings and configuration.

## Related Skills

- **Svelte Component Development** - Typing component props with strict mode
- **SvelteKit Fullstack Development** - Type-safe routes and server functions
- **Zod Schema Validation** - Runtime type checking to complement TypeScript
- **Cloudflare Workers Development** - Typing worker environments and bindings
