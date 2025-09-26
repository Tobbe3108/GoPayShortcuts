<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import { addWeeks, startOfWeek, endOfWeek, getWeek, format } from 'date-fns';
	import { da } from 'date-fns/locale';
	import Icon from '../atoms/Icon.svelte';

	type weekNavigationProps = {
		date: Date;
		onWeekChange?: (weekStart: Date, weekEnd: Date) => void;
	};

	let { date, onWeekChange = undefined }: weekNavigationProps = $props();

	let weekOffset = $state(0);

	function getWeekStart() {
		return startOfWeek(addWeeks(date, weekOffset), { weekStartsOn: 1 });
	}

	function getWeekEnd() {
		return endOfWeek(addWeeks(date, weekOffset), { weekStartsOn: 1 });
	}

	function getWeekNumber() {
		return getWeek(getWeekStart(), { weekStartsOn: 1 });
	}

	function prevWeek() {
		weekOffset--;
		onWeekChange?.(getWeekStart(), getWeekEnd());
	}

	function nextWeek() {
		weekOffset++;
		onWeekChange?.(getWeekStart(), getWeekEnd());
	}

	const weekRange = $derived(
		`${format(getWeekStart(), 'd', { locale: da })}-${format(getWeekEnd(), 'd', { locale: da })} ${format(getWeekEnd(), 'MMM', { locale: da })}`
	);

	const isCurrentWeek = $derived(() => {
		const displayedStart = getWeekStart();
		const displayedEnd = getWeekEnd();
		return date >= displayedStart && date <= displayedEnd;
	});
</script>

<div class="flex justify-center" aria-label="Ugenavigation">
	<Button variant="transparent" ariaLabel="Forrige uge" onclick={prevWeek}>
		<Icon name="left"></Icon>
	</Button>
	<div class="flex flex-col items-center">
		<Label
			size="xl"
			variant="default"
			className="capitalize tracking-wide {isCurrentWeek() ? 'font-semibold' : ''}"
			>Uge {getWeekNumber()}</Label
		>
		<Label size="xs" variant="muted" className="capitalize">{weekRange}</Label>
	</div>
	<Button variant="transparent" ariaLabel="Næste uge" onclick={nextWeek}>
		<Icon name="right"></Icon>
	</Button>
</div>
