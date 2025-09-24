<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'danger' | 'transparent';
	type Size = 'sm' | 'md' | 'lg' | '';
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

	const sizeClasses: Record<Size, string> = {
		sm: 'py-1 px-2 text-xs',
		md: 'py-2 px-3 text-sm',
		lg: 'py-2 px-4 text-lg',
		'': 'p-0'
	};

	let buttonClasses = $derived(
		[
			variantClasses[variant as Variant],
			sizeClasses[size as Size],
			'font-bold rounded transition-opacity duration-150 ease-in-out disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
			!disabled ? 'cursor-pointer' : '',
			fullWidth ? 'w-full' : '',
			className
		].join(' ')
	);
</script>

<button
	{type}
	{disabled}
	class={buttonClasses}
	aria-label={ariaLabel}
	aria-disabled={disabled}
	tabindex={disabled ? -1 : 0}
	{onclick}
	{onfocus}
	{onblur}
>
	{@render children?.()}
</button>
