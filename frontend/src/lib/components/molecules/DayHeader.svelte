 <script lang="ts">
	import { format, isToday } from 'date-fns';
	import { da, enUS } from 'date-fns/locale';
	import { locale } from 'svelte-i18n';
	import Label from '$lib/components/atoms/Label.svelte';

	let { date }: { date: Date } = $props();

	const currentLocale = $derived($locale === 'en' ? enUS : da);
	const dayName = $derived(format(date, 'EEEE', { locale: currentLocale }));
	const dateStr = $derived(format(date, 'd. MMMM', { locale: currentLocale }));
</script>

<div class="flex flex-col items-center py-2 whitespace-nowrap">
	<Label
		size="xl"
		variant="default"
		className="capitalize tracking-wide {isToday(date) ? 'font-semibold' : ''}">{dayName}</Label
	>
	<Label size="xs" variant="muted" className="capitalize">{dateStr}</Label>
</div>
