<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import WeekNavigator from '$lib/components/molecules/WeekNavigator.svelte';
	import { startOfWeek, endOfWeek, getWeek, addDays, format } from 'date-fns';
	import { ordersService } from '$lib/features/orders/ordersService';
	import type { Order } from '$lib/features/orders/models/order';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekNumber = $state(getWeek(date));
	let weekStart = $derived(startOfWeek(weekNumber));
	let weekEnd = $derived(endOfWeek(weekNumber));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let orders: Order[] = $state([]);
	$effect(() => async () => (orders = await ordersService.listOrders(weekStart, weekEnd)));

	function ordersByDay(date: Date) {
		return orders.filter((o) => o.date === format(date, 'yyyy-MM-dd'));
	}
</script>

<div>
	<WeekNavigator
		{date}
		onWeekChange={(newWeek) => {
			weekNumber = newWeek;
		}}
	/>

	<!-- <div class="grid grid-cols-5 gap-4">
		{#each weekDates as date}
			<div class="flex flex-col space-y-4">
				<DayHeader {date} />
				{#each ordersByDay(date) as order}
					<OrderCard {order} onOrderChange={() => {}} />
				{/each}
				<AddLocationCard
					newOrder={(order) => {}}
					locationsWithOrders={ordersByDay(date).map((o) => o.kitchenId)}
				/>
			</div>
		{/each}
	</div> -->
</div>
