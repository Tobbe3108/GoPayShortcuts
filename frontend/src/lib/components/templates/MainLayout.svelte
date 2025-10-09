<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import Button from '../atoms/Button.svelte';
	import DayNavigator from '../organisms/DayNavigator.svelte';
	import WeekNavigator from '../molecules/WeekNavigator.svelte';

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
</script>

<div class="container p-4 mx-auto">
	<div class="flex flex-row items-center">
		<div class="flex flex-1/3 justify-start">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
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
						Log ud
					{/snippet}
				</Button>
			{/if}
		</div>
	</div>
	<div class="mt-6">{@render children?.()}</div>
</div>
