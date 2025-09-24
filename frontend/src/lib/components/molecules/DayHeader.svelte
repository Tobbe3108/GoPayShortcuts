<script lang="ts">
	import { format } from 'date-fns';
	import { da } from 'date-fns/locale';
	import Label from '$lib/components/atoms/Label.svelte';
	import { capitalize } from '$lib/core/utils/stringUtils';

	let { date }: { date: Date } = $props();

	const dayName = $derived(capitalize(format(date, 'EEEE', { locale: da })));
	const dateStr = $derived(
		`${format(date, 'd', { locale: da })}. ${capitalize(format(date, 'MMMM', { locale: da }))}`
	);
</script>

<div class="flex flex-col items-center py-2">
	<Label size="xxl" variant="default">{dayName}</Label>
	<Label size="xs" variant="muted">{dateStr}</Label>
</div>
