<script lang="ts">
	import { authStore } from '$lib/features/auth/store';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import WeekGridTemplate from '$lib/features/orders/templates/WeekGridTemplate.svelte';
	import DayViewTemplate from '$lib/features/orders/templates/DayViewTemplate.svelte';
	import { onMount } from 'svelte';

	let isMobile = $state(false);
	let currentDate = $state(new Date());

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
</script>

<MainLayout
	isAuthenticated={$authStore.isAuthenticated}
	onLogout={handleLogout}
	{isMobile}
	date={currentDate}
	onDayChange={handleDayChange}
	onWeekChange={handleWeekChange}
>
	{#if isMobile}
		<DayViewTemplate date={currentDate} />
	{:else}
		<WeekGridTemplate date={currentDate} />
	{/if}
</MainLayout>
