<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from '$lib/components/atoms/Button.svelte';
	import Icon from '$lib/components/atoms/Icon.svelte';
	import Label from '$lib/components/atoms/Label.svelte';
	import type { Notification } from '../notificationStore';

	let {
		notification,
		onClose
	}: {
		notification: Notification;
		onClose: (id: string) => void;
	} = $props();
</script>

<div
	class="p-3 rounded-lg shadow-lg text-primary"
	class:bg-green-100={notification.type === 'success'}
	class:bg-yellow-100={notification.type === 'warning'}
	class:bg-red-100={notification.type === 'error'}
	class:bg-muted={notification.type === 'info'}
	class:text-muted-dark={notification.type === 'info'}
	transition:fly={{ y: 20, duration: 300 }}
>
	<div class="flex items-center justify-between">
		{#if notification.message}
			<div class="flex grow">
				<Label size="sm">{notification.message}</Label>
			</div>
		{/if}

		{#if notification.action}
			<div class="flex grow">
				<Button
					variant="transparent"
					size="sm"
					className="opacity-80 hover:opacity-100 hover:underline rounded"
					ariaLabel={notification.actionLabel ?? 'Action'}
					onclick={() => {
						notification.action?.(notification.id);
						onClose(notification.id);
					}}
				>
					<span class="sr-only">{notification.actionLabel ?? 'Action'}</span>
					<span aria-hidden="true">{notification.actionLabel ?? 'Action'}</span>
				</Button>
			</div>
		{/if}

		<div class="flex flex-wrap">
			<Button
				variant="transparent"
				size="sm"
				className="opacity-70 hover:opacity-100"
				ariaLabel="Close notification"
				onclick={() => onClose(notification.id)}
			>
				<Icon name="close" size={18} ariaLabel="close" />
			</Button>
		</div>
	</div>
</div>
