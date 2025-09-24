<script lang="ts">
	import { format } from 'date-fns';
	import { da } from 'date-fns/locale';
	import Label from '$lib/components/atoms/Label.svelte';

	let { date }: { date: Date } = $props();

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
	const dayName = $derived(capitalize(format(date, 'EEEE', { locale: da })));
	const dateStr = $derived(
		`${format(date, 'd', { locale: da })}. ${capitalize(format(date, 'MMMM', { locale: da }))}`
	);
</script>

<div class="flex flex-col items-center py-2">
	<Label className="text-xl font-semibold text-slate-800" variant="default">{dayName}</Label>
	<Label className="text-sm text-slate-500" variant="muted">{dateStr}</Label>
</div>
