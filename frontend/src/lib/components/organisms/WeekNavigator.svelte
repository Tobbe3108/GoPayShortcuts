<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { addWeeks, startOfWeek, endOfWeek, getWeek, format } from 'date-fns';
	import { da, enUS } from 'date-fns/locale';
	import Icon from '../atoms/Icon.svelte';
	import { _, locale } from 'svelte-i18n';

	type weekNavigationProps = {
		date: Date;
		onWeekChange?: (newWeekStart: Date) => void;
	};

	let { date, onWeekChange = undefined }: weekNavigationProps = $props();

	const currentLocale = $derived($locale === 'en' ? enUS : da);
	const weekStart = $derived(() => startOfWeek(date, { weekStartsOn: 1 }));

	const weekEnd = $derived(() => endOfWeek(date, { weekStartsOn: 1 }));

	const weekNumber = $derived(() => getWeek(weekStart(), { weekStartsOn: 1 }));

	const weekRange = $derived(
		`${format(weekStart(), 'd', { locale: currentLocale })}-${format(weekEnd(), 'd', { locale: currentLocale })} ${format(weekEnd(), 'MMM', { locale: currentLocale })}`
	);

	const isCurrentWeek = $derived(() => {
		const displayedStart = weekStart();
		const displayedEnd = weekEnd();
		return date >= displayedStart && date <= displayedEnd;
	});

	function prevWeek() {
		onWeekChange?.(addWeeks(weekStart(), -1));
	}

	function nextWeek() {
		onWeekChange?.(addWeeks(weekStart(), 1));
	}
</script>

<div class="flex justify-center" aria-label={$_('navigation.week.label')}>
	<Button variant="transparent" ariaLabel={$_('navigation.week.previous')} onclick={prevWeek}>
		<Icon name="left"></Icon>
	</Button>
	<div class="flex flex-col items-center">
		<Label
			size="xxl"
			variant="default"
			className="capitalize tracking-wide {isCurrentWeek() ? 'font-semibold' : ''}"
			>{$_('navigation.week.weekPrefix')} {weekNumber()}</Label
		>
		<Label size="xs" variant="muted" className="capitalize">{weekRange}</Label>
	</div>
	<Button variant="transparent" ariaLabel={$_('navigation.week.next')} onclick={nextWeek}>
		<Icon name="right"></Icon>
	</Button>
</div>
