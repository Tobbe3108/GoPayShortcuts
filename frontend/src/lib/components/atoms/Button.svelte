<script lang="ts">
  // Standard, idiomatic Svelte Button component with slot support.
  // Use plain JS types for compatibility with the Svelte compiler in tests
  /** @typedef {'primary'|'secondary'|'danger'|'transparent'} Variant */
  /** @typedef {'sm'|'md'|'lg'|'icon'|''} Size */
  /** @typedef {'button'|'submit'|'reset'} BtnType */

  export let variant = 'primary';
  export let size = 'md';
  export let disabled = false;
  export let type = 'button';
  export let fullWidth = false;
  export let className = '';
  export let ariaLabel = '';
  export let onclick = undefined;
  export let onfocus = undefined;
  export let onblur = undefined;

  const variantClasses: Record<Variant, string> = {
    primary:
      'bg-primary text-white hover:bg-primary-hover focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2',
    secondary:
      'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary focus:outline-none focus:ring-2 focus:ring-offset-2',
    danger:
      'bg-danger text-white hover:bg-danger-hover focus:ring-danger focus:outline-none focus:ring-2 focus:ring-offset-2',
    transparent: 'bg-transparent text-primary disabled:bg-transparent'
  };

  const sizeClasses: Record<Size, string> = {
    sm: 'py-1 px-2 text-xs',
    md: 'py-2 px-3 text-sm',
    lg: 'py-2 px-4 text-lg',
    icon: 'p-0 text-base',
    '': 'p-0'
  };

  $: buttonClasses = [
    variantClasses[variant],
    sizeClasses[size],
    'rounded transition-opacity duration-150 ease-in-out disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
    disabled ? '' : 'cursor-pointer',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
</script>

<button
  type={type}
  disabled={disabled}
  class={`${buttonClasses} ${size === 'icon' || size === '' ? 'btn-touch-target' : ''}`}
  aria-label={ariaLabel}
  aria-disabled={disabled}
  tabindex={disabled ? -1 : 0}
  on:click={onclick}
  on:focus={onfocus}
  on:blur={onblur}
>
  <slot />
</button>

<style>
  /* Expand the interactive area without affecting layout by using an absolutely
     positioned, transparent pseudo-element. This preserves the visual layout
     while ensuring a minimum 44×44 touch target. */
  :global(.btn-touch-target) {
    position: relative;
    /* keep visual display as defined by sizeClasses */
  }

  :global(.btn-touch-target::after) {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    display: block;
    /* transparent background; pointer events go to the button (this pseudo-element
       is part of the button element) */
    background: transparent;
  }

  /* If buttons are adjacent, reduce the expanded hit area so the pseudo-element
     doesn't significantly overlap neighbors. This is a best-effort mitigation
     for tight clusters of icon buttons. */
  :global(.btn-touch-target + .btn-touch-target::after),
  :global(.btn-touch-target + .btn-touch-target) > :global(.btn-touch-target::after) {
    width: 36px;
    height: 36px;
  }

  /* For very tight clusters (3+), reduce further. */
  :global(.btn-touch-target + .btn-touch-target + .btn-touch-target::after) {
    width: 32px;
    height: 32px;
  }
</style>
