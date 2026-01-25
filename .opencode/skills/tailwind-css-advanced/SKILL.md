---
name: tailwind-css-advanced
description: Design and implement advanced Tailwind CSS 4 patterns for production applications, covering component theming, responsive design, and performance optimization in Svelte and SvelteKit
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers, senior-engineers
  domain: frontend-styling
  workflow: component-development
  updated: "2025-01"
  keywords: tailwind, css4, theming, design-systems, sveltekit, performance
---

## What I do

I help you leverage advanced Tailwind CSS 4 features to build production-grade styled components and design systems. I guide you through:

- **Mastering Tailwind CSS 4 syntax** - Use new language features (@layer, @apply, CSS variables) for powerful, maintainable stylesheets
- **Building scalable component systems** - Create reusable, theme-aware components with Tailwind in Svelte and SvelteKit
- **Implementing design systems** - Design token management, color scales, typography systems, and component variants using Tailwind's plugin system
- **Optimizing bundle size** - Apply tree-shaking, content pruning, and dynamic class strategies to reduce CSS bloat
- **Solving common gotchas** - Navigate specificity issues, responsive edge cases, class conflicts, and dark mode complications

## When to use me

Load this skill when:

- Building complex styled components with Tailwind in a Svelte or SvelteKit project
- Implementing a custom design system or design tokens with Tailwind
- Optimizing Tailwind CSS build size and performance for production
- Creating reusable component patterns with theme support (dark mode, brand colors, etc)
- Debugging responsive design issues or class specificity conflicts

## Tailwind CSS 4 Language Features

### @layer Directive

The `@layer` directive organizes custom CSS into Tailwind's cascade (base, components, utilities):

```css
@layer base {
  h1 {
    @apply text-4xl font-bold;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
}

@layer utilities {
  .skew-10deg {
    transform: skewY(10deg);
  }
}
```

**Key benefits**: Prevents CSS specificity conflicts, integrates cleanly with PurgeCSS, and maintains predictable cascade order.

### CSS Variables with Tailwind

Tailwind 4 simplifies CSS variable usage within utilities and custom classes:

```css
/* Define design tokens as CSS variables */
@layer base {
  :root {
    --color-primary: rgb(59 130 246);
    --color-secondary: rgb(139 92 246);
    --spacing-base: 1rem;
    --border-radius: 0.5rem;
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: rgb(37 99 235);
      --color-secondary: rgb(126 34 206);
    }
  }
}

@layer components {
  .card {
    @apply p-[var(--spacing-base)] rounded-[var(--border-radius)] 
           bg-white dark:bg-gray-900;
  }
}
```

**Use case**: Design tokens, theme switching, and dynamic theming without JavaScript overhead.

### @apply Best Practices

Use `@apply` sparingly; prefer composing Tailwind classes directly in markup:

✅ **Good** - Semantic component classes:

```svelte
<!-- SvelteKit component -->
<button class="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
  Click me
</button>

<!-- Extract to CSS only if used 3+ times -->
<style>
  :global(.btn-primary) {
    @apply px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors;
  }
</style>
```

❌ **Avoid** - Over-using @apply:

```css
/* Too many single-use @apply rules defeats Tailwind's purpose */
.title { @apply text-2xl font-bold; }
.text { @apply text-base text-gray-700; }
.spacing { @apply mb-4; }
```

## Component Design Patterns with Tailwind

### Pattern 1: Variant-Based Components

Use Tailwind with component logic to create flexible, composable components:

```svelte
<!-- Button.svelte -->
<script>
  export let variant = 'primary';
  export let size = 'md';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
</script>

<button class="rounded-lg font-medium transition-colors {variants[variant]} {sizes[size]}">
  <slot />
</button>
```

**Usage**:

```svelte
<Button variant="primary" size="lg">Save Changes</Button>
<Button variant="secondary" size="sm">Cancel</Button>
```

### Pattern 2: Compound Components with Slots

Build complex components from smaller parts:

```svelte
<!-- Card.svelte -->
<div class="rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
  <slot />
</div>

<!-- CardHeader.svelte -->
<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
  <slot />
</div>

<!-- CardContent.svelte -->
<div class="px-6 py-4">
  <slot />
</div>

<!-- CardFooter.svelte -->
<div class="px-6 py-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
  <slot />
</div>
```

**Usage**:

```svelte
<Card>
  <CardHeader>
    <h2 class="text-lg font-bold">Confirm Action</h2>
  </CardHeader>
  <CardContent>
    <p class="text-gray-600">Are you sure?</p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="danger">Confirm</Button>
  </CardFooter>
</Card>
```

### Pattern 3: Dynamic Class Composition

Use helper functions for complex conditional styles:

```svelte
<!-- Badge.svelte -->
<script>
  export let status = 'default';
  
  function getBadgeClasses(status) {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    
    const variants = {
      default: `${base} bg-gray-100 text-gray-800`,
      success: `${base} bg-green-100 text-green-800`,
      warning: `${base} bg-yellow-100 text-yellow-800`,
      error: `${base} bg-red-100 text-red-800`,
      info: `${base} bg-blue-100 text-blue-800`,
    };
    
    return variants[status] || variants.default;
  }
</script>

<span class={getBadgeClasses(status)}>
  <slot />
</span>
```

## Theming and Design Systems

### CSS Variable-Based Design Tokens

Define a centralized token system as CSS variables:

```css
/* src/styles/tokens.css */
@layer base {
  :root {
    /* Colors */
    --color-primary: 59 130 246;       /* Blue */
    --color-secondary: 139 92 246;     /* Purple */
    --color-success: 34 197 94;        /* Green */
    --color-warning: 251 146 60;       /* Orange */
    --color-error: 239 68 68;          /* Red */
    
    /* Semantic colors */
    --color-bg-primary: 255 255 255;
    --color-bg-secondary: 249 250 251;
    --color-text-primary: 15 23 42;
    --color-text-secondary: 100 116 139;
    
    /* Spacing scale */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    
    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    
    /* Typography */
    --font-sans: system-ui, -apple-system, sans-serif;
    --font-mono: ui-monospace, monospace;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
  }
  
  /* Dark mode overrides */
  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: 37 99 235;
      --color-bg-primary: 15 23 42;
      --color-bg-secondary: 30 41 59;
      --color-text-primary: 248 250 252;
      --color-text-secondary: 148 163 184;
    }
  }
}
```

### Tailwind Config with Design Tokens

Extend Tailwind to use your design tokens:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-base)',
        lg: 'var(--font-size-lg)',
      },
    },
  },
};
```

### Dark Mode Implementation

Enable dark mode with class strategy for maximum control:

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  // ... rest of config
};
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  
  let isDark = false;
  
  onMount(() => {
    // Check user preference or stored preference
    const stored = localStorage.getItem('theme');
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = stored ? stored === 'dark' : preferred;
    updateTheme();
  });
  
  function toggleTheme() {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateTheme();
  }
  
  function updateTheme() {
    document.documentElement.classList.toggle('dark', isDark);
  }
</script>

<button on:click={toggleTheme}>
  {isDark ? '🌙 Dark' : '☀️ Light'}
</button>

<slot />
```

**Dark mode utilities in components**:

```svelte
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content adapts to theme
</div>
```

## Performance Optimization

### Strategy 1: Content Pruning Configuration

Configure PurgeCSS to remove unused styles:

```javascript
// tailwind.config.js
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,svelte}',
    './src/**/*.md',  // If using MDX
  ],
  // Safelist for dynamic classes (use sparingly)
  safelist: [
    {
      pattern: /^(bg|text)-(red|green|blue|yellow)-(100|500|900)$/,
    },
  ],
};
```

### Strategy 2: Avoid Dynamic Class Generation

❌ **Bad** - Classes generated at runtime:

```svelte
<!-- DON'T DO THIS - won't be purged -->
<div class={`bg-${color}-500 text-${size}`}>
  Content
</div>
```

✅ **Good** - Use fixed class variants:

```svelte
<script>
  export let color = 'blue';
  export let size = 'md';
  
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };
</script>

<div class="{colorClasses[color]} {sizeClasses[size]}">
  Content
</div>
```

### Strategy 3: CSS-in-JS vs Inline Classes

For Svelte component styles, prefer inline Tailwind classes over CSS-in-JS:

✅ **Preferred** - Inline Tailwind:

```svelte
<button class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
  Click
</button>
```

❌ **Use only when necessary** - Scoped styles:

```svelte
<button class="btn">Click</button>

<style>
  .btn {
    @apply px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors;
  }
</style>
```

**Rationale**: Inline classes are purged more reliably by PurgeCSS; scoped styles may not be detected.

### Strategy 4: Bundle Analysis

Check your final CSS size:

```bash
# In your SvelteKit project
npm run build

# Check output CSS
ls -lh build/_app/immutable/assets/
```

Target: < 50KB gzipped for typical project. If larger:

1. Run PurgeCSS check: `npm run build -- --analyze`
2. Review safelist rules (remove unused patterns)
3. Check for unused utility plugins

## Integration with Svelte and SvelteKit

### SvelteKit Setup

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
  kit: {
    adapter: adapter(),
  },
};
```

```bash
# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### PostCSS Configuration

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Import Tailwind in App Layout

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom layers */
@layer base {
  body {
    @apply bg-gray-50 dark:bg-gray-950;
  }
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
</script>

<slot />
```

## Common Gotchas and Solutions

### Gotcha 1: Class Specificity Issues

**Problem**: Inline Tailwind styles don't override component styles.

```svelte
<!-- This doesn't work as expected -->
<div class="bg-white" style="background-color: blue;">
  Background is blue, not white
</div>
```

**Solution**: Use Tailwind's `!important` modifier or adjust source order:

```svelte
<!-- Force Tailwind utility -->
<div class="!bg-white" style="background-color: blue;">
  Background is white (! overrides inline styles)
</div>

<!-- Or restructure to avoid inline styles -->
<div class="bg-white">
  Content
</div>
```

### Gotcha 2: Responsive Classes with Dynamic Content

**Problem**: Responsive breakpoints don't work with dynamic class strings.

```svelte
<!-- This won't work - class string is built at runtime -->
<div class={`${isMobile ? 'w-full' : 'w-1/2'}`}>
  Content
</div>
```

**Solution**: Use explicit class variants for each breakpoint:

```svelte
<div class="w-full md:w-1/2 lg:w-1/3">
  Content responds properly
</div>

<!-- Or use conditional Tailwind classes -->
<div class={isMobile ? 'w-full' : 'w-1/2 lg:w-1/3'}>
  Content
</div>
```

### Gotcha 3: Dark Mode Not Applying

**Problem**: Dark mode classes not working despite `darkMode: 'class'` config.

**Solution**: Ensure `dark` class is on document root:

```svelte
<script>
  onMount(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  });
</script>

<!-- All dark mode classes now work -->
<div class="bg-white dark:bg-gray-900">
  Responds to dark mode
</div>
```

### Gotcha 4: Third-Party Component Styles Conflict

**Problem**: Third-party UI library styles conflict with Tailwind.

**Solution**: Use CSS layers to control cascade order:

```css
/* src/app.css */
@layer reset, base, theme, utilities, third-party;

@layer third-party {
  /* Third-party styles here have lowest specificity */
  @import 'external-ui-library/styles.css';
}
```

### Gotcha 5: Arbitrary Values with Spaces

**Problem**: Arbitrary values with spaces are rejected.

```svelte
<!-- This fails - spaces break the parser -->
<div class="w-[calc(100% - 2rem)]">
  Width calculation
</div>
```

**Solution**: Escape the space or use variable naming:

```svelte
<!-- Use underscore or define in config -->
<div class="w-[calc(100%_-_2rem)]">
  Works now
</div>

<!-- Or extend config -->
<!-- In tailwind.config.js -->
<div class="w-calc-full-minus-2">
  Defined in config
</div>
```

## Common Patterns Reference

| Pattern                   | Use Case                                 | Example                                              |
| ------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **Variant Components**    | Reusable buttons, badges, cards          | `<Button variant="primary" size="lg" />`            |
| **Compound Components**   | Complex multi-part UI (Card, Dialog)     | `<Card><CardHeader /><CardContent /></Card>`        |
| **CSS Variables Tokens**  | Theme switching, design systems          | `bg-[var(--color-primary)]`                         |
| **Dark Mode Utilities**   | Light/dark theme support                 | `dark:bg-gray-900 dark:text-white`                  |
| **Dynamic Class Lookup**  | Status badges, state indicators          | `colorMap[status]` with fixed class values          |
| **@apply for Abstractions** | Reusable CSS rules (3+ uses)             | `.btn { @apply px-4 py-2 rounded; }`                |
| **Arbitrary Values**      | One-off custom values                    | `w-[27px] h-[33px]`                                 |
| **Responsive Prefixes**   | Mobile-first responsive design           | `w-full md:w-1/2 lg:w-1/3`                         |

## Reference

**Official documentation**:
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Tailwind CSS Plugin API](https://tailwindcss.com/docs/plugins)

**Related skills**:
- **frontend-design**: Create production-grade frontend interfaces with high design quality
- **software-architecture**: Quality-focused design principles applicable to component systems

**Recommended tools**:
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - VS Code extension for class autocompletion
- [Headless UI](https://headlessui.com/) - Unstyled, accessible components for Tailwind
- [daisyUI](https://daisyui.com/) - Component library built on Tailwind
