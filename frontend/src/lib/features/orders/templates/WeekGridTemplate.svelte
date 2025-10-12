<script lang="ts">
	import DayHeader from '$lib/components/molecules/DayHeader.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import AddLocationCard from '$lib/features/locations/molecules/AddLocationCard.svelte';
	import TodaysMenu from '$lib/features/menu/molecules/TodaysMenu.svelte';
	import {
		startOfWeek,
		endOfWeek,
		addDays,
		isPast,
		isToday,
		isFuture,
		startOfDay,
		format
	} from 'date-fns';
	import {
		listOrders,
		ordersByDay,
		handleOrderChange,
		handleCancel,
		updateOrderForKitchen,
		type TemplateOrder
	} from '$lib/features/orders/orderUtils';
	import Card from '$lib/components/atoms/Card.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import { fade } from 'svelte/transition';
	import defaultStore from '$lib/features/orders/defaultStore';
	import { notifications } from '$lib/core/notifications/notificationStore';

	type WeekGridProps = {
		date: Date;
	};

	let { date }: WeekGridProps = $props();

	let weekStart = $derived(startOfWeek(date, { weekStartsOn: 1 }));
	let weekEnd = $derived(endOfWeek(date, { weekStartsOn: 1 }));
	let weekDates = $derived(Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)));

	let orders: Record<string, TemplateOrder[]> = $state({});
	let loading = $state(true);

	$effect(() => {
		loading = true;
		listOrders(weekStart, weekEnd).then((listed) => {
			orders = listed;
			loading = false;
		});
	});
</script>

{#if !loading}
	<div class="grid grid-cols-5 gap-4">
		{#each weekDates as date}
			<div class="flex flex-col space-y-4">
				<DayHeader {date} />
				<TodaysMenu {date} />
				{#if isPast(date) && !isToday(date) && ordersByDay(orders, date).length === 0}
					<Card>
						<div transition:fade|local class="text-xs text-gray-400 text-center">
							Bestillinger kan ikke placeres for fortidige dage.
						</div>
					</Card>
				{/if}

				{#if isFuture(date) && ordersByDay(orders, date).length === 0}
					<Card>
						<div class="flex justify-center">
							<Button
								variant="transparent"
								size="sm"
								ariaLabel="Use default order"
								onclick={async () => {
									const def = await defaultStore.getDefault();
									if (!def) {
										notifications.info('No saved default order');
										return;
									}
									const cloned = { ...def, date: format(date, 'yyyy-MM-dd'), tempOrder: true };
									updateOrderForKitchen(orders, cloned);
								}}
							>
								<div class="text-xs text-gray-400 text-center">Use default order</div>
							</Button>
						</div>
					</Card>
				{/if}

				{#each ordersByDay(orders, date) as order (order.kitchenId)}
					<OrderCard
						{order}
						isEditing={order.tempOrder}
						onOrderChange={(newOrderState) => handleOrderChange(orders, newOrderState)}
						onOrderCancel={(date, kitchenId) => handleCancel(orders, date, kitchenId)}
					/>
				{/each}

				{#if isToday(date) || isFuture(date)}
					<AddLocationCard
						{date}
						newOrder={(newOrder) => updateOrderForKitchen(orders, { ...newOrder, tempOrder: true })}
						locationsWithOrders={[...ordersByDay(orders, date)].map((o) => o.kitchenId)}
					/>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<LoadingSpinner />
{/if}
