<script lang="ts">
	// Button variants
	type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg';

	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'md';
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let fullWidth = false;
	export let className = '';

	// Classes for each variant
	const variantClasses = {
		primary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-600',
		secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
		outline:
			'bg-transparent text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		ghost:
			'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400'
	};

	// Classes for each size
	const sizeClasses = {
		sm: 'py-1 px-2 text-sm',
		md: 'py-2 px-4',
		lg: 'py-3 px-6 text-lg'
	};

	// Build the classes
	const buttonClasses = [
		variantClasses[variant],
		sizeClasses[size],
		'font-medium rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
		fullWidth ? 'w-full' : '',
		className
	].join(' ');
</script>

<button {type} {disabled} class={buttonClasses} on:click>
	<slot />
</button>
