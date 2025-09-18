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
		default: 'text-gray-700',
		error: 'text-red-600',
		success: 'text-green-600',
		muted: 'text-gray-400'
	};
</script>

<label for={forId} class={`block text-sm font-medium mb-2 ${variantClasses[variant]} ${className}`}>
	{@render children?.()}
</label>
