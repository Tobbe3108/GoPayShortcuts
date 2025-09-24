<script lang="ts">
	import Notifications from '$lib/core/notifications/organisms/Notifications.svelte';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import Button from '$lib/components/atoms/Button.svelte';
	import OrderCard from '$lib/features/orders/organisms/OrderCard.svelte';
	import type { Order } from '$lib/features/orders/models/order';

	const mockOrder: Order = {
		date: '2025-09-22',
		kitchenId: 1,
		orderlines: [
			{ productId: 1, quantity: 2, price: 80 },
			{ productId: 2, quantity: 1, price: 60 }
		],
		cancelEnabled: true,
		id: 123,
		kitchenName: 'Test Kitchen',
		status: 'open',
		totalPrice: 220
	};

	function addTestNotification() {
		notifications.success('This is a test notification');
	}
</script>

<main class="p-6 space-y-6">
	<div class="mb-6 flex gap-4">
		<a href="/debug/atoms" class="text-blue-600 hover:underline">Atoms Debug</a>
		<a href="/debug/molecules" class="text-blue-600 hover:underline">Molecules Debug</a>
		<a href="/debug/organisms" class="text-blue-900 font-bold underline">Organisms Debug</a>
		<a href="/debug" class="text-blue-600 hover:underline">Main Debug</a>
	</div>

	<section>
		<Button onclick={addTestNotification}>Add Test Notification</Button>
		<Notifications />
	</section>

	<section>
		<h2 class="text-lg font-bold mb-2">OrderCard Demo</h2>
		<div class="max-w-md">
			<OrderCard order={mockOrder} />
		</div>
	</section>
</main>
