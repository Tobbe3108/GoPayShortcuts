<script lang="ts">
	type Variant = 'default' | 'error' | 'success' | 'muted';
	type LabelProps = {
		forId?: string;
		className?: string;
		variant?: Variant;
		children?: any;
	};

	let {
		forId = undefined,
		className = '',
		variant = 'default',
		children = $bindable(undefined)
	}: LabelProps = $props();

	const variantClasses: Record<Variant, string> = {
		default: 'text-primary',
		success: 'text-success',
		error: 'text-danger',
		muted: 'text-muted-dark'
	};
</script>

<label for={forId} class={`block text-sm font-medium mb-2 ${variantClasses[variant]} ${className}`}>
	{@render children?.()}
</label>
