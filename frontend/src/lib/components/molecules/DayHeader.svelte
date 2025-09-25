<script lang="ts">
	import { format } from 'date-fns';
	import { da } from 'date-fns/locale';
	import Label from '$lib/components/atoms/Label.svelte';

	let { date }: { date: Date } = $props();

	const dayName = $derived(format(date, 'EEEE', { locale: da }));
	const dateStr = $derived(format(date, 'd. MMMM', { locale: da }));
</script>

<div class="flex flex-col items-center py-2">
	<Label size="xxl" variant="default" className="capitalize tracking-wide">{dayName}</Label>
	<Label size="xs" variant="muted" className="capitalize">{dateStr}</Label>
</div>
