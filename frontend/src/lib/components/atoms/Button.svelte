<script lang="ts">
	type Variant = 'primary' | 'secondary' | 'danger';
	type Size = 'sm' | 'md' | 'lg';
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
		primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-600',
		secondary: 'bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'py-1 px-2 text-sm',
		md: 'py-2 px-4',
		lg: 'py-3 px-6 text-lg'
	};

	let buttonClasses = $derived(
		[
			variantClasses[variant as Variant],
			sizeClasses[size as Size],
			'font-bold rounded transition-opacity duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
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
