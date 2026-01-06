<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Button from '../atoms/Button.svelte';
	import DayNavigator from '../organisms/DayNavigator.svelte';
	import WeekNavigator from '../organisms/WeekNavigator.svelte';
	import { t } from '$lib/core/i18n';

	type MainLayoutProps = {
		onLogout?: () => void;
		isAuthenticated?: boolean;
		children?: any;
		isMobile?: boolean;
		date: Date;
		onDayChange?: (newDate: Date) => void;
		onWeekChange?: (newWeekStart: Date) => void;
	};

	let {
		onLogout = () => {},
		isAuthenticated = false,
		children,
		isMobile = false,
		date,
		onDayChange = undefined,
		onWeekChange = undefined
	}: MainLayoutProps = $props();

	function goToToday() {
		const today = new Date();
		if (isMobile) {
			onDayChange?.(today);
		} else {
			onWeekChange?.(today);
		}
	}
</script>

<div class="container max-w-[90vw] p-4 mx-auto">
	<div class="flex flex-row items-center">
		<div class="flex flex-1/3 justify-start">
			<button
				onclick={goToToday}
				class="cursor-pointer hover:opacity-75 transition-opacity"
				aria-label="Go to today"
				type="button"
			>
				<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-16 sm:h-28 w-auto" />
			</button>
		</div>
		<div class="flex flex-1/3 justify-center">
			{#if isMobile}
				<DayNavigator {date} {onDayChange} />
			{:else}
				<WeekNavigator {date} {onWeekChange} />
			{/if}
		</div>
		<div class="flex flex-1/3 justify-end">
			{#if isAuthenticated && page.url.pathname !== '/login'}
				<Button variant="primary" onclick={() => onLogout()}>
					{#snippet children()}
						{t('navigation.logout')}
					{/snippet}
				</Button>
			{/if}
		</div>
	</div>
	<div class="mt-6">{@render children?.()}</div>
</div>
