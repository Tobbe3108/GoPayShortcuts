<script lang="ts">
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Direction = 'row' | 'column';

	interface Props {
		disabled?: boolean;
		showDelete?: boolean;
		direction?: Direction;
		onSave?: () => void;
		onCancel?: () => void;
		onDelete?: () => void;
	}

	let {
		disabled = false,
		showDelete = true,
		direction = 'row',
		onSave = undefined,
		onCancel = undefined,
		onDelete = undefined
	}: Props = $props();

	let reveal = $state(false);

	function handleReveal() {
		reveal = true;
	}

	function handleAction(action?: () => void) {
		reveal = false;
		action?.();
	}
</script>

<div class={`flex gap-2 ${direction === 'column' ? 'flex-col' : 'flex-row'}`}>
	{#if !reveal}
		<button
			class="p-2 rounded text-slate-700 hover:text-slate-800 disabled:opacity-50 flex items-center justify-center"
			onclick={handleReveal}
			{disabled}
			aria-label="Edit"
			type="button"
		>
			<Icon name="edit" size={22} ariaLabel="Edit" />
		</button>
	{:else}
		<button
			class="p-2 rounded text-slate-800 hover:text-slate-700 disabled:opacity-50 flex items-center justify-center"
			onclick={() => handleAction(onSave)}
			{disabled}
			aria-label="Save"
			type="button"
		>
			<Icon name="check" size={22} ariaLabel="Save" />
		</button>
		<button
			class="p-2 rounded text-slate-600 hover:text-slate-500 disabled:opacity-50 flex items-center justify-center"
			onclick={() => handleAction(onCancel)}
			{disabled}
			aria-label="Cancel"
			type="button"
		>
			<Icon name="close" size={22} ariaLabel="Cancel" />
		</button>
		{#if showDelete}
			<button
				class="p-2 rounded text-red-600 hover:text-red-700 disabled:opacity-50 flex items-center justify-center"
				onclick={() => handleAction(onDelete)}
				{disabled}
				aria-label="Delete"
				type="button"
			>
				<Icon name="delete" size={22} ariaLabel="Delete" />
			</button>
		{/if}
	{/if}
</div>
