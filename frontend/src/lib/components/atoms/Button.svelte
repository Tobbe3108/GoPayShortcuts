<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'danger' | 'transparent';
	type Size = 'sm' | 'md' | 'lg' | 'icon' | '';
	type BtnType = 'button' | 'submit' | 'reset';
	type ButtonProps = {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		type?: BtnType;
		fullWidth?: boolean;
		className?: string;
		ariaLabel?: string;
		children?: any;
		onclick?: (e: MouseEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
	};

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		fullWidth = false,
		className = '',
		ariaLabel = '',
		children = $bindable(undefined),
		onclick = undefined,
		onfocus = undefined,
		onblur = undefined
	}: ButtonProps = $props();

	const variantClasses: Record<Variant, string> = {
		primary:
			'bg-primary text-white hover:bg-primary-hover focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2',
		secondary:
			'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary focus:outline-none focus:ring-2 focus:ring-offset-2',
		danger:
			'bg-danger text-white hover:bg-danger-hover focus:ring-danger focus:outline-none focus:ring-2 focus:ring-offset-2',
		transparent: 'bg-transparent text-primary disabled:bg-transparent'
	};

	/* visual sizing classes */
	const sizeClasses: Record<Size, string> = {
		sm: 'py-1 px-2 text-xs',
		md: 'py-2 px-3 text-sm',
		lg: 'py-2 px-4 text-lg',
		icon: 'p-0 text-base', /* visually small; touch-target handled separately */
		'': 'p-0' /* legacy: still allowed */
	};

	let buttonClasses = $derived(
		[
			variantClasses[variant as Variant],
			sizeClasses[size as Size],
			'rounded transition-opacity duration-150 ease-in-out disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
			disabled ? '' : 'cursor-pointer',
			fullWidth ? 'w-full' : '',
			className
		].join(' ')
	);
</script>

<button
    {type}
    {disabled}
    class={`${buttonClasses} ${size === 'icon' || size === '' ? 'btn-touch-target' : ''}`}
    aria-label={ariaLabel}
    aria-disabled={disabled}
    tabindex={disabled ? -1 : 0}
    {onclick}
    {onfocus}
    {onblur}
>
    {@render children?.()}
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
