<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import WeekNavigator from '$lib/components/molecules/WeekNavigator.svelte';
	import { startOfWeek, endOfWeek, getWeek, addDays, format } from 'date-fns';
	import { ordersService } from '$lib/features/orders/ordersService';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import type { SimplifiedOrder } from '$lib/features/orders/models/SimplifiedOrder';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekStart = $state(startOfWeek(date, { weekStartsOn: 1 }));
	let weekEnd = $state(endOfWeek(date, { weekStartsOn: 1 }));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let orders: Record<string, Record<number, SimplifiedOrder[]>> = $state({});
	let tempOrders: Record<string, Record<number, SimplifiedOrder[]>> = $state({});

	$effect(() => {
		(async () => {
			orders = await ordersService.listOrders(weekStart, weekEnd).then((res) =>
				res.reduce(
					(acc, order) => {
						if (!acc[order.date]) acc[order.date] = {};
						if (!acc[order.date][order.kitchenId]) acc[order.date][order.kitchenId] = [];
						acc[order.date][order.kitchenId].push(order);
						return acc;
					},
					{} as Record<string, Record<string, SimplifiedOrder[]>>
				)
			);
		})();
	});

	function ordersByDay(list: Record<string, Record<number, SimplifiedOrder[]>>, date: Date) {
		const prDay = list[format(date, 'yyyy-MM-dd')] || {};
		return Object.values(prDay || {}).flat();
	}

	function handleOrderChange(newOrderState: SimplifiedOrder[] | undefined): void {
		if (newOrderState) {
			updateOrdersForKitchen(newOrderState, orders);
		}
	}

	function handleTempChange(newOrderState: SimplifiedOrder[] | undefined): void {
		if (newOrderState) {
			const first = newOrderState[0];
			delete tempOrders[first.date][first.kitchenId];
			updateOrdersForKitchen(newOrderState, orders);
		}
	}

	function handleCancel(
		date: string,
		kitchenId: number,
		list: Record<string, Record<number, SimplifiedOrder[]>>
	): void {
		delete list[date][kitchenId];
	}

	function updateOrdersForKitchen(
		orders: SimplifiedOrder[],
		list: Record<string, Record<number, SimplifiedOrder[]>>
	): void {
		const first = orders[0];
		if (!list[first.date]) list[first.date] = {};
		list[first.date][first.kitchenId] = orders;
	}
</script>

<div>
	<WeekNavigator
		{date}
		onWeekChange={(newStart, newEnd) => {
			weekStart = newStart;
			weekEnd = newEnd;
		}}
	/>

	<div class="grid grid-cols-5 gap-4">
		{#each weekDates as date}
			<div class="flex flex-col space-y-4">
				<DayHeader {date} />
				<TodaysMenu {date} />
				{#each ordersByDay(orders, date) as order}
					<OrderCard
						{order}
						isEditing={false}
						onOrderChange={handleOrderChange}
						onOrderCancel={(date, kitchenId) => handleCancel(date, kitchenId, orders)}
					/>
				{/each}
				{#each ordersByDay(tempOrders, date) as order}
					<OrderCard
						{order}
						isEditing={true}
						onOrderChange={handleTempChange}
						onOrderCancel={(date, kitchenId) => handleCancel(date, kitchenId, tempOrders)}
					/>
				{/each}
				<AddLocationCard
					{date}
					newOrder={(newOrder) => updateOrdersForKitchen([newOrder], tempOrders)}
					locationsWithOrders={[...ordersByDay(orders, date), ...ordersByDay(tempOrders, date)].map(
						(o) => o.kitchenId
					)}
				/>
			</div>
		{/each}
	</div>
</div>
