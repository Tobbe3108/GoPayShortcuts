<script lang="ts">
	export let padding = 'p-6';
	export let className = '';

	const cardClasses = ['bg-white rounded-lg shadow-md', padding, className].join(' ');
</script>

<div class={cardClasses}>
	<slot />
</div>
