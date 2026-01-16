---
name: tailwindcss-4
description: TailwindCSS v4 development guide with CSS-first configuration, @theme directive, and SvelteKit integration for modern web development
---

## What I Cover

This skill provides comprehensive guidance for using TailwindCSS v4 in the GoPayShortcuts project, which uses the latest version optimized for performance and flexibility. Key areas include:

- **CSS-first configuration** with the `@theme` directive replacing JavaScript config files
- **Vite plugin integration** for fast builds and hot reloading
- **Custom design tokens** using CSS custom properties and registered properties
- **Modern CSS features** including cascade layers, `color-mix()`, and `@property`
- **Responsive design patterns** with mobile-first utility classes
- **Component integration** with Svelte 5 runes and atomic design principles
- **Performance optimization** techniques for large-scale applications
- **Migration strategies** from earlier TailwindCSS versions

## Common Patterns

### CSS-First Configuration
```css
/* src/app.css */
@import 'tailwindcss';

@theme {
  /* Custom color palette using CSS custom properties */
  --color-primary: var(--color-slate-800);
  --color-primary-hover: var(--color-slate-700);
  --color-primary-on: white;
  
  /* Semantic color aliases */
  --color-success: var(--color-green-600);
  --color-danger: var(--color-red-600);
  
  /* Custom spacing scale */
  --spacing-section: 2rem;
  --spacing-card: 1.5rem;
}
```

### Vite Plugin Setup
```typescript
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  // No PostCSS configuration needed
});
```

### Component Styling with Svelte 5
```svelte
<!-- Atoms/Button.svelte -->
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
  
  let { variant = 'primary', size = 'md' }: Props = $props();
</script>

<button 
  class="rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  class:text-sm={size === 'sm'}
  class:text-base={size === 'md'}
  class:text-lg={size === 'lg'}
  class:px-3={size === 'sm'}
  class:px-4={size === 'md'}
  class:px-6={size === 'lg'}
  class:py-1.5={size === 'sm'}
  class:py-2={size === 'md'}
  class:py-3={size === 'lg'}
  class:bg-primary={variant === 'primary'}
  class:hover:bg-primary-hover={variant === 'primary'}
  class:text-primary-on={variant === 'primary'}
  class:bg-secondary={variant === 'secondary'}
  class:hover:bg-secondary-hover={variant === 'secondary'}
  class:bg-danger={variant === 'danger'}
  class:hover:bg-danger-hover={variant === 'danger'}
  class:focus:ring-primary={variant === 'primary'}
  class:focus:ring-secondary={variant === 'secondary'}
  class:focus:ring-danger={variant === 'danger'}
>
  <slot />
</button>
```

### Responsive Design Patterns
```svelte
<!-- Organisms/OrderCard.svelte -->
<div class="bg-muted rounded-lg p-card shadow-sm">
  <!-- Mobile-first: single column on small screens -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="md:col-span-2">
      <h3 class="text-lg font-semibold text-primary mb-2">
        Order #{order.id}
      </h3>
      <p class="text-muted-dark text-sm">
        {order.customer}
      </p>
    </div>
    
    <!-- Stack on mobile, align right on larger screens -->
    <div class="flex flex-col sm:flex-row md:flex-col gap-2 md:items-end">
      <span class="text-2xl font-bold text-success">
        ${order.total}
      </span>
      <span class="text-sm text-muted-dark">
        {order.status}
      </span>
    </div>
  </div>
</div>
```

### Dark Mode with CSS Variables
```css
/* src/app.css */
@import 'tailwindcss';

@theme {
  --color-primary: light-dark(var(--color-slate-800), var(--color-slate-200));
  --color-primary-hover: light-dark(var(--color-slate-700), var(--color-slate-300));
  --color-primary-on: light-dark(white, var(--color-slate-900));
  
  --color-background: light-dark(white, var(--color-slate-900));
  --color-surface: light-dark(var(--color-slate-50), var(--color-slate-800));
}
```

### Utility-First Component Patterns
```svelte
<!-- Molecules/FormField.svelte -->
<script lang="ts">
  interface Props {
    label: string;
    error?: string;
    required?: boolean;
  }
  
  let { label, error, required = false }: Props = $props();
</script>

<div class="space-y-1">
  <label class="block text-sm font-medium text-primary">
    {label}
    {#if required}
      <span class="text-danger ml-1">*</span>
    {/if}
  </label>
  
  <div class="relative">
    <slot />
  </div>
  
  {#if error}
    <p class="text-sm text-danger mt-1">
      {error}
    </p>
  {/if}
</div>
```

## Best Practices

### CSS-First Configuration
- Use the `@theme` directive instead of `tailwind.config.js`
- Define semantic color names (primary, secondary, success, danger)
- Create consistent spacing tokens (--spacing-section, --spacing-card)
- Leverage CSS custom properties for dynamic theming

### Performance Optimization
- Enable JIT mode automatically in v4 for faster builds
- Use `@layer` directives to control cascade order
- Minimize custom CSS in favor of utility classes
- Leverage `color-mix()` for semantic color variations

### Component Architecture
- Follow atomic design: atoms → molecules → organisms → templates
- Use semantic class names for component variants
- Combine utility classes with component-specific styles
- Implement proper focus states and accessibility

### Responsive Design
- Mobile-first approach with `sm:`, `md:`, `lg:` prefixes
- Use container queries for component-based responsive behavior
- Test designs across different viewport sizes
- Consider touch targets and mobile interaction patterns

### SvelteKit Integration
- Import TailwindCSS in `src/app.css` (not individual components)
- Use Svelte 5 runes for reactive state management
- Leverage SvelteKit's data loading for dynamic styling
- Optimize bundle size with tree-shaking

### Development Workflow
- Use browser dev tools for utility class inspection
- Enable TailwindCSS IntelliSense in your editor
- Run `npm run check` to validate TypeScript and styles
- Use `npm run build` to test production optimization

### Migration from v3
- Remove `tailwind.config.js` and PostCSS configuration
- Convert JavaScript theme configuration to `@theme` directive
- Update import statements to use `@import 'tailwindcss'`
- Replace deprecated utilities with v4 equivalents

## Related Skills

- **vite**: Build tool and development server used with TailwindCSS v4
- **sveltekit-development**: Core SvelteKit framework with TailwindCSS integration
- **svelte5-development**: Svelte 5 runes and reactive patterns with utility classes
- **frontend-design**: UI/UX design patterns and component libraries</content>
<parameter name="filePath">.opencode/skill/tailwindcss-4/SKILL.md