<script lang="ts">
	import { authStore } from '$lib/features/auth/store';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import WeekGridTemplate from '$lib/features/orders/templates/WeekGridTemplate.svelte';
	import DayViewTemplate from '$lib/features/orders/templates/DayViewTemplate.svelte';
	import { onMount } from 'svelte';
	import { addDays } from 'date-fns';
	import type { SwipeCustomEvent } from 'svelte-gestures';

	let isMobile = $state(false);
	let currentDate = $state(new Date());
	let collapsed = $state(true);

	onMount(() => {
		const mq = window.matchMedia('(max-width: 1023px)');
		isMobile = mq.matches;
		mq.addEventListener('change', (e) => {
			isMobile = e.matches;
		});
	});

	function handleLogout() {
		authStore.logout();
		goto(base + '/login');
	}

	function handleDayChange(newDate: Date) {
		currentDate = newDate;
	}

	function handleWeekChange(newWeekStart: Date) {
		// For week navigation, set currentDate to the start of the week
		currentDate = newWeekStart;
	}

	function handleSwipe(event: SwipeCustomEvent) {
		if (!isMobile) return;

		const { direction } = event.detail;

		if (direction === 'left') {
			// Swipe left: next day
			let newDate = addDays(currentDate, 1);
			while (newDate.getDay() === 0 || newDate.getDay() === 6) {
				newDate = addDays(newDate, 1);
			}
			currentDate = newDate;
		} else if (direction === 'right') {
			// Swipe right: previous day
			let newDate = addDays(currentDate, -1);
			while (newDate.getDay() === 0 || newDate.getDay() === 6) {
				newDate = addDays(newDate, -1);
			}
			currentDate = newDate;
		} else if (direction === 'top') {
			// Swipe up: collapse TodaysMenu
			collapsed = true;
		} else if (direction === 'bottom') {
			// Swipe down: expand TodaysMenu
			collapsed = false;
		}
	}
</script>

<MainLayout
	isAuthenticated={$authStore.isAuthenticated}
	onLogout={handleLogout}
	{isMobile}
	date={currentDate}
	onDayChange={handleDayChange}
	onWeekChange={handleWeekChange}
	onSwipe={handleSwipe}
>
	{#if isMobile}
		<DayViewTemplate date={currentDate} {collapsed} />
	{:else}
		<WeekGridTemplate date={currentDate} />
	{/if}
</MainLayout>
