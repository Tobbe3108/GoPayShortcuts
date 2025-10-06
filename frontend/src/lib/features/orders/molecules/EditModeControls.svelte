<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Direction = 'row' | 'column';

	interface Props {
		isEditing?: boolean;
		disabled?: boolean;
		locked?: boolean;
		showDelete?: boolean;
		direction?: Direction;
		onEdit?: () => void;
		onSave?: () => void;
		onCancel?: () => void;
		onDelete?: () => void;
	}

	let {
		isEditing = false,
		disabled = false,
		locked = false,
		showDelete = true,
		direction = 'row',
		onEdit = undefined,
		onSave = undefined,
		onCancel = undefined,
		onDelete = undefined
	}: Props = $props();

	let editMode = $state(isEditing);

	function handleEdit() {
		editMode = true;
		onEdit?.();
	}

	function handleAction(action?: () => void) {
		action?.();
		editMode = false;
	}

	const iconSize = 17;
</script>

<div
	class={`flex ${direction === 'column' ? 'flex-col items-start' : 'flex-row items-center gap-x-2'}`}
>
	{#if locked}
		<Icon name="lock" size={iconSize} ariaLabel="Locked" className="text-muted-dark" />
	{:else if !editMode}
		<Button variant="transparent" ariaLabel="Edit" {disabled} onclick={handleEdit} size="">
			{#snippet children()}
				<Icon name="edit" size={iconSize} ariaLabel="Edit" />
			{/snippet}
		</Button>
	{:else}
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
	{/if}
</div>
