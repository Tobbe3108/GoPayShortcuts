<script lang="ts">
	export let forId: string | undefined = undefined;
	export let className: string = '';
	export let variant: 'default' | 'error' | 'success' | 'muted' = 'default';

	const variantClasses: Record<typeof variant, string> = {
		default: 'text-gray-700',
		error: 'text-red-600',
		success: 'text-green-600',
		muted: 'text-gray-400'
	};
</script>

TODO: Convert to runes mode

<label for={forId} class={`block text-sm font-medium mb-2 ${variantClasses[variant]} ${className}`}>
	<slot />
</label>
