<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Direction = 'row' | 'column';

	interface Props {
		disabled?: boolean;
		locked?: boolean;
		showDelete?: boolean;
		direction?: Direction;
		onSave?: () => void;
		onCancel?: () => void;
		onDelete?: () => void;
	}

	let {
		disabled = false,
		locked = false,
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

	const iconSize = 17;
</script>

<div
	class={`flex ${direction === 'column' ? 'flex-col items-start' : 'flex-row items-center gap-x-2'}`}
>
	{#if locked}
		<Button variant="transparent" ariaLabel="Locked" disabled size="">
			<Icon name="lock" size={iconSize} ariaLabel="Locked" />
		</Button>
	{:else if !reveal}
		<Button variant="transparent" ariaLabel="Edit" {disabled} onclick={handleReveal} size="">
			{#snippet children()}
				<Icon name="edit" size={iconSize} ariaLabel="Edit" />
			{/snippet}
		</Button>
	{:else}
		<Button
			variant="transparent"
			ariaLabel="Save"
			{disabled}
			onclick={() => handleAction(onSave)}
			size=""
		>
			{#snippet children()}
				<Icon name="check" size={iconSize} ariaLabel="Save" className="text-success" />
			{/snippet}
		</Button>
		<Button
			variant="transparent"
			ariaLabel="Cancel"
			{disabled}
			onclick={() => handleAction(onCancel)}
			size=""
		>
			{#snippet children()}
				<Icon name="close" size={iconSize} ariaLabel="Cancel" />
			{/snippet}
		</Button>
		{#if showDelete}
			<Button
				variant="transparent"
				ariaLabel="Delete"
				{disabled}
				onclick={() => handleAction(onDelete)}
				size=""
			>
				{#snippet children()}
					<Icon name="delete" size={iconSize} ariaLabel="Delete" className="text-danger" />
				{/snippet}
			</Button>
		{/if}
	{/if}
</div>
