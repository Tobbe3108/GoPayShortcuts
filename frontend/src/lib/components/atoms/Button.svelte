<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let disabled: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth: boolean = false;
	export let className: string = '';
	export let ariaLabel: string = '';

	const variantClasses = {
		primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-600',
		secondary: 'bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
	};

	const sizeClasses = {
		sm: 'py-1 px-2 text-sm',
		md: 'py-2 px-4',
		lg: 'py-3 px-6 text-lg'
	};

	$: buttonClasses = [
		variantClasses[variant],
		sizeClasses[size],
		'font-bold rounded transition-opacity duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
		fullWidth ? 'w-full' : '',
		className
	].join(' ');
</script>

<button
	{type}
	{disabled}
	class={buttonClasses}
	aria-label={ariaLabel}
	aria-disabled={disabled}
	tabindex={disabled ? -1 : 0}
	on:click
>
	<slot />
</button>
