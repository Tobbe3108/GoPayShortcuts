<script lang="ts">
	import { authStore } from '$lib/features/auth/store';
	import { navigationStore } from '$lib/features/navigation/store';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import WeekGridTemplate from '$lib/features/orders/templates/WeekGridTemplate.svelte';
	import DayViewTemplate from '$lib/features/orders/templates/DayViewTemplate.svelte';
	import { onMount } from 'svelte';

	let isMobile = $state(false);

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
		navigationStore.setDate(newDate);
	}

	function handleWeekChange(newWeekStart: Date) {
		// For week navigation, set currentDate to the start of the week
		navigationStore.setDate(newWeekStart);
	}


</script>

<MainLayout
	isAuthenticated={$authStore.isAuthenticated}
	onLogout={handleLogout}
	{isMobile}
	date={$navigationStore.currentDate}
	onDayChange={handleDayChange}
	onWeekChange={handleWeekChange}
>
	{#if isMobile}
		<DayViewTemplate date={$navigationStore.currentDate} collapsed={$navigationStore.collapsed} />
	{:else}
		<WeekGridTemplate date={$navigationStore.currentDate} />
	{/if}
</MainLayout>
