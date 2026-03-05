<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';

	type Direction = 'row' | 'column';

	interface Props {
		isEditing?: boolean;
		disabled?: boolean;
		locked?: boolean;
		appendOnly?: boolean;
		showDelete?: boolean;
		direction?: Direction;
		onEdit?: () => void;
		onSave?: () => void;
		onCancel?: () => void;
		onDelete?: () => void;
		// optional default toggle action (used by OrderCard to toggle "save as default")
		onToggleDefault?: () => void;
		isDefault?: boolean;
		showDefaultToggle?: boolean;
	}

	let {
		isEditing = false,
		disabled = false,
		locked = false,
		appendOnly = false,
		showDelete = true,
		direction = 'row',
		onEdit = undefined,
		onSave = undefined,
		onCancel = undefined,
		onDelete = undefined,
		onToggleDefault = undefined,
		isDefault = false,
		showDefaultToggle = false
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

	function handleToggleDefault() {
		onToggleDefault?.();
		// do not change editMode when toggling default
	}

	const iconSize = 17;
</script>

<div
	class={`flex ${direction === 'column' ? 'flex-col items-start' : 'flex-row items-center gap-x-2'}`}
>
	{#if locked && !appendOnly}
		<Icon name="lock" size={iconSize} ariaLabel="Locked" className="text-muted-dark" />
	{:else if !editMode}
		<Button variant="transparent" ariaLabel="Edit" {disabled} onclick={handleEdit} size="">
			{#snippet children()}
				<Icon name="edit" size={iconSize} ariaLabel="Edit" />
			{/snippet}
		</Button>
	{:else}
		{#if showDefaultToggle}
        <Button
                variant="transparent"
                ariaLabel="Toggle default"
                {disabled}
                onclick={handleToggleDefault}
                size=""
            >
                {#snippet children()}
                    {#if isDefault}
                        <span class={`inline-block align-middle text-yellow-500`} style={`width:${iconSize}px;height:${iconSize}px;`}>
                            <svg class="w-full h-full" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </span>
                    {:else}
                        <span class={`inline-block align-middle text-gray-400 hover:text-yellow-500`} style={`width:${iconSize}px;height:${iconSize}px;`}>
                            <svg class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </span>
                    {/if}
                {/snippet}
            </Button>
		{/if}

		{#if showDelete && !appendOnly}
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
