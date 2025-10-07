<script lang="ts">
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '../atoms/Icon.svelte';
	import { addDays } from 'date-fns';
	import DayHeader from '../molecules/DayHeader.svelte';

	type dayNavigationProps = {
		date: Date;
		onDayChange?: (newDate: Date) => void;
	};

	let { date, onDayChange = undefined }: dayNavigationProps = $props();

	function prevDay() {
		let newDate = addDays(date, -1);
		// If Saturday (6), go to Friday; if Sunday (0), go to Friday
		while (newDate.getDay() === 0 || newDate.getDay() === 6) {
			newDate = addDays(newDate, -1);
		}
		onDayChange?.(newDate);
	}

	function nextDay() {
		let newDate = addDays(date, 1);
		// If Saturday (6), go to Monday; if Sunday (0), go to Monday
		while (newDate.getDay() === 0 || newDate.getDay() === 6) {
			newDate = addDays(newDate, 1);
		}
		onDayChange?.(newDate);
	}
</script>

<div class="flex justify-center" aria-label="Dagnavigation">
	<Button variant="transparent" ariaLabel="Forrige dag" onclick={prevDay}>
		<Icon name="left"></Icon>
	</Button>
	<DayHeader {date} />
	<Button variant="transparent" ariaLabel="Næste dag" onclick={nextDay}>
		<Icon name="right"></Icon>
	</Button>
</div>
