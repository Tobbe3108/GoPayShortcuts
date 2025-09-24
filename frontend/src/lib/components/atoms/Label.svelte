<script lang="ts">
	type Variant = 'default' | 'error' | 'success' | 'muted';
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
	type LabelProps = {
		forId?: string;
		className?: string;
		variant?: Variant;
		size?: Size;
		children?: any;
	};

	let {
		forId = undefined,
		className = '',
		variant = 'default',
		size = 'sm',
		children = $bindable(undefined)
	}: LabelProps = $props();

	const variantClasses: Record<Variant, string> = {
		default: 'text-primary',
		success: 'text-success',
		error: 'text-danger',
		muted: 'text-muted-dark'
	};

	const sizeClasses: Record<Size, string> = {
		xs: 'text-xs',
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl',
		xxl: 'text-2xl'
	};
</script>

<label
	for={forId}
	class={`block font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
>
	{@render children?.()}
</label>
