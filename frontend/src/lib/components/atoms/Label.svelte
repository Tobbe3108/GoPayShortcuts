<script lang="ts">
	let { forId, className = '', children } = $props();

	const labelClasses = ['block text-gray-700 text-sm font-medium mb-2', className].join(' ');
</script>

<label for={forId} class={labelClasses}>
	{@render children?.()}
</label>
