---
name: svelte-component-development
description: Building reactive UI components with Svelte 5 featuring runes, snippets, and event handling patterns as demonstrated in GoPayShortcuts
---

# Svelte Component Development

## What I Cover

- Building reactive components using Svelte 5 runes ($state, $derived, $effect)
- Component props and two-way binding with $bindable
- Snippet-based composition and render functions
- TypeScript prop typing with strict interfaces
- Event handling and DOM lifecycle
- Styling with scoped CSS and Tailwind integration
- Accessibility attributes and ARIA properties

## Common Patterns

### Basic Component with Props
```svelte
<script lang="ts">
  type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    className?: string;
  };

  let { variant = 'primary', disabled = false, className = '', children }: ButtonProps = $props();
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-secondary text-white',
    danger: 'bg-danger text-white'
  };
</script>

<button class={`${variantClasses[variant]} ${className}`} {disabled}>
  {@render children?.()}
</button>
```

### Reactive Derived Values
```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
  let isEven = $derived(count % 2 === 0);
</script>

<p>Count: {count}, Doubled: {doubled}, Even: {isEven}</p>
```

### Event Handlers with TypeScript
```svelte
<script lang="ts">
  let onclick = $props<{ onclick?: (e: MouseEvent) => void }>();
  
  function handleClick(e: MouseEvent) {
    console.log('Clicked at', e.clientX, e.clientY);
    onclick?.(e);
  }
</script>

<button {onclick}>Click me</button>
```

### Using Snippets for Complex Children
```svelte
<script lang="ts">
  let { content } = $props<{
    content: Snippet;
  }>();
</script>

<div class="card">
  {@render content()}
</div>
```

## Best Practices

1. **Type all props explicitly** - Use TypeScript interfaces to document and enforce prop contracts
2. **Use $derived for computed values** - Avoid manual reactivity tracking for derived state
3. **Leverage $effect sparingly** - Only use for side effects that can't be expressed with $derived
4. **Implement proper accessibility** - Include aria-label, aria-disabled, and semantic HTML
5. **Keep components focused** - Single responsibility principle applies to Svelte components
6. **Use snippets over slots** - Modern Svelte 5 prefers snippets for better type safety
7. **Separate data from presentation** - Use Svelte stores for shared state, props for local configuration

## GoPayShortcuts Examples

### Button Component Pattern
The Button.svelte component (frontend/src/lib/components/atoms/Button.svelte:1-75) demonstrates:
- Complete prop typing with union types
- Computed classes with $derived
- Multiple variant support via record types
- Accessibility attributes (aria-label, aria-disabled, tabindex)
- Event handler forwarding (onclick, onfocus, onblur)

### Snippet Usage
Components like DayNavigator.svelte show modern snippet-based composition instead of slot-based patterns.

## Related Skills

- **Atomic Design Component Architecture** - Structuring components by size and responsibility
- **SvelteKit Fullstack Development** - Integrating components into full-stack applications
- **Tailwind CSS Styling** - CSS utility framework used throughout GoPayShortcuts components
- **TypeScript Strict Mode Patterns** - Enforcing type safety in component props
