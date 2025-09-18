<!-- TODO: Use Atoms -->

<script lang="ts">
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
		<label class="text-slate-700 text-sm font-medium" for="location-select">{label}</label>
	{/if}
	<select
		id="location-select"
		class="px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-100 disabled:text-slate-400"
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
