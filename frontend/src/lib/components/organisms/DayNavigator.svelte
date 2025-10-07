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
		onDayChange?.(addDays(date, -1));
	}

	function nextDay() {
		onDayChange?.(addDays(date, 1));
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
