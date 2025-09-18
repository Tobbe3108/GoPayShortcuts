<script lang="ts">
	import Label from './Label.svelte';
	interface LocationOption {
		id: string | number;
		name: string;
	}

	interface Props {
		label?: string;
		locations: LocationOption[];
		selectedId?: string | number;
		disabled?: boolean;
		onChange?: (id: string | number) => void;
	}

	let {
		label = 'Location',
		locations = [],
		selectedId = undefined,
		disabled = false,
		onChange = undefined
	}: Props = $props();

	function handleChange(event: Event) {
		const id = (event.target as HTMLSelectElement).value;
		onChange?.(id);
	}
</script>

<div class="flex flex-col space-y-1">
	{#if label}
		<Label forId={label}>{label}</Label>
	{/if}
	<select
		id={label}
		class="p-3 border rounded-md border-secondary focus:ring-primary focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:text-slate-400"
		bind:value={selectedId}
		{disabled}
		onchange={handleChange}
		aria-label={label}
	>
		<option value="" disabled selected={!selectedId}>Select a location</option>
		{#each locations as loc}
			<option value={loc.id} selected={loc.id === selectedId}>{loc.name}</option>
		{/each}
	</select>
</div>
