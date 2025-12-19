<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { addWeeks, startOfWeek, endOfWeek, getWeek, format } from 'date-fns';
	import { da } from 'date-fns/locale';
	import Icon from '../atoms/Icon.svelte';

	type weekNavigationProps = {
		date: Date;
		onWeekChange?: (newWeekStart: Date) => void;
	};

	let { date, onWeekChange = undefined }: weekNavigationProps = $props();

	const weekStart = $derived(() => startOfWeek(date, { weekStartsOn: 1 }));

	const weekEnd = $derived(() => endOfWeek(date, { weekStartsOn: 1 }));

	const weekNumber = $derived(() => getWeek(weekStart(), { weekStartsOn: 1 }));

	const weekRange = $derived(
		`${format(weekStart(), 'd', { locale: da })}-${format(weekEnd(), 'd', { locale: da })} ${format(weekEnd(), 'MMM', { locale: da })}`
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

<div class="flex justify-center" aria-label="Ugenavigation">
	<Button variant="transparent" ariaLabel="Forrige uge" onclick={prevWeek}>
		<Icon name="left"></Icon>
	</Button>
	<div class="flex flex-col items-center">
		<Label
			size="xxl"
			variant="default"
			className="capitalize tracking-wide {isCurrentWeek() ? 'font-semibold' : ''}"
			>Uge {weekNumber()}</Label
		>
		<Label size="xs" variant="muted" className="capitalize">{weekRange}</Label>
	</div>
	<Button variant="transparent" ariaLabel="Næste uge" onclick={nextWeek}>
		<Icon name="right"></Icon>
	</Button>
</div>
