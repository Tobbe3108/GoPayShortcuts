<script lang="ts">
	import Notifications from '$lib/core/notifications/organisms/Notifications.svelte';
	import { notifications } from '$lib/core/notifications/notificationStore';
	import Button from '$lib/components/atoms/Button.svelte';

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
</main>
