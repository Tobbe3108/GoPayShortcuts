<script lang="ts">
	export let forId;
	export let className = '';

	const labelClasses = ['block text-gray-700 text-sm font-medium mb-2', className].join(' ');
</script>

<label for={forId} class={labelClasses}>
	<slot />
</label>
