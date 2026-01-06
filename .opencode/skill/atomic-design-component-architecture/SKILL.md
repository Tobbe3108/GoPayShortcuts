---
name: atomic-design-component-architecture
description: Organizing UI components by atomic design principles using atoms, molecules, organisms, templates in GoPayShortcuts
---

# Atomic Design Component Architecture

## What I Cover

- Atomic design methodology (atoms, molecules, organisms, templates, pages)
- Component hierarchy and composition
- Naming conventions and file organization
- Reusability and component dependencies
- Props interface design for flexible components
- Snippet-based composition patterns
- Component documentation and usage
- Testing component interactions
- Style consistency across hierarchy

## Common Patterns

### Atoms (Basic Building Blocks)
```
frontend/src/lib/components/atoms/
├── Button.svelte
├── Card.svelte
├── Icon.svelte
├── Input.svelte
├── Label.svelte
└── Select.svelte
```

Atoms are the simplest, most reusable components:
```svelte
<!-- Button.svelte -->
<script lang="ts">
  type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
  };

  let { variant = 'primary', size = 'md', disabled = false, className = '', children } = $props();

  const styles: Record<string, string> = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-secondary text-white hover:bg-secondary-hover',
    danger: 'bg-danger text-white hover:bg-danger-hover'
  };
</script>

<button class={`${styles[variant]} ${className}`} {disabled}>
  {@render children?.()}
</button>
```

### Molecules (Combinations of Atoms)
```
frontend/src/lib/components/molecules/
├── FormField.svelte
├── DayHeader.svelte
└── Card.svelte (with body, header)
```

Molecules combine atoms with added functionality:
```svelte
<!-- FormField.svelte (Label + Input combination) -->
<script lang="ts">
  import Label from '../atoms/Label.svelte';
  import Input from '../atoms/Input.svelte';

  type FormFieldProps = {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    value?: string;
    onchange?: (value: string) => void;
  };

  let { label, name, placeholder, required = false, value = '', onchange } = $props();
</script>

<div class="form-field">
  <Label for={name}>{label}</Label>
  <Input
    {name}
    {placeholder}
    {required}
    {value}
    {onchange}
  />
</div>
```

### Organisms (Complex Components)
```
frontend/src/lib/components/organisms/
└── DayNavigator.svelte
```

Organisms combine molecules and atoms into complete sections:
```svelte
<!-- DayNavigator.svelte -->
<script lang="ts">
  import Button from '../atoms/Button.svelte';
  import DayHeader from '../molecules/DayHeader.svelte';

  type DayNavigatorProps = {
    currentDate: Date;
    onDateChange?: (date: Date) => void;
  };

  let { currentDate, onDateChange } = $props();
</script>

<div class="day-navigator">
  <Button onclick={() => onDateChange?.(getPreviousDay(currentDate))}>
    Previous
  </Button>
  <DayHeader date={currentDate} />
  <Button onclick={() => onDateChange?.(getNextDay(currentDate))}>
    Next
  </Button>
</div>
```

### Directory Structure
```
frontend/src/lib/components/
├── atoms/           # Basic elements
│   ├── Button.svelte
│   ├── Card.svelte
│   ├── Icon.svelte
│   ├── Input.svelte
│   ├── Label.svelte
│   ├── Quantity.svelte
│   └── Select.svelte
├── molecules/       # Combinations of atoms
│   ├── DayHeader.svelte
│   └── FormField.svelte
└── organisms/       # Complex combinations
    └── DayNavigator.svelte
```

### Props Interface Pattern
```svelte
<!-- Reusable, composable props -->
<script lang="ts">
  // Keep props minimal and focused
  type CardProps = {
    title?: string;
    className?: string;
    children?: Snippet;
  };

  let { title, className = '', children } = $props();
</script>

<div class={`card ${className}`}>
  {#if title}
    <h2>{title}</h2>
  {/if}
  {@render children?.()}
</div>
```

### Composition Over Inheritance
```svelte
<!-- Instead of subclassing, compose components -->
<script lang="ts">
  import Card from './atoms/Card.svelte';
  import Button from './atoms/Button.svelte';

  let { title, onSubmit } = $props();
</script>

<Card {title}>
  <form onsubmit={onSubmit}>
    <!-- Form content -->
    <Button type="submit">Submit</Button>
  </form>
</Card>
```

### Documenting Components
```typescript
/**
 * Button Component
 * @component
 * 
 * @param {ButtonProps} props - Component props
 * @param {'primary' | 'secondary' | 'danger'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disable the button
 * @param {Snippet} props.children - Button content
 * 
 * @example
 * ```svelte
 * <Button variant="primary" onclick={() => console.log('Clicked')}>
 *   Click me
 * </Button>
 * ```
 */
```

## Best Practices

1. **Start with atoms** - Build simple, reusable pieces first
2. **One concern per component** - Single responsibility principle
3. **Composition over inheritance** - Use snippet-based composition
4. **Keep props simple** - Don't over-engineer component interfaces
5. **Document component usage** - Include examples and prop descriptions
6. **Test at each level** - Atoms, molecules, and organisms separately
7. **Maintain consistent naming** - Use descriptive, intuitive names
8. **Avoid prop drilling** - Use stores or context when needed
9. **Keep styles consistent** - Use shared design tokens and Tailwind
10. **Review component dependencies** - Atoms shouldn't depend on molecules

## GoPayShortcuts Examples

### Atom Components
The project defines foundational atoms:
- Button.svelte - Styled with variants (primary, secondary, danger, transparent)
- Input.svelte - Form input field with customization
- Card.svelte - Container component
- Label.svelte - Form label
- Select.svelte - Dropdown selection
- Icon.svelte - Icon rendering
- Quantity.svelte - Number selection

### Molecule Components
Combines atoms into reusable UI patterns:
- FormField.svelte - Label + Input pairing
- DayHeader.svelte - Shows current day in navigator

### Organism Components
Complex, feature-specific components:
- DayNavigator.svelte - Day selection with previous/next navigation

### Styling Pattern
All components use:
- Tailwind CSS for utility-first styling
- Scoped CSS for component-specific styles
- Consistent color scheme (primary, secondary, danger)

### Props Documentation
Components like Button document all props with TypeScript interfaces, enabling IDE autocomplete and type checking.

## Related Skills

- **Svelte Component Development** - Component creation and reactivity
- **SvelteKit Fullstack Development** - Using atomic components in pages
- **Tailwind CSS Styling** - Styling components consistently
- **TypeScript Strict Mode Patterns** - Type-safe prop definitions
