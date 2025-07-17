<script lang="ts">
	let { padding = 'p-6', className = '', children } = $props();

	const cardClasses = ['bg-white rounded-lg shadow-md', padding, className].join(' ');
</script>

<div class={cardClasses}>
	{@render children?.()}
</div>
