<script lang="ts">
	import '../app.css';
	import { authStore } from '$lib/features/auth/store';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import Notifications from '$lib/core/notifications/organisms/Notifications.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { initI18n, createTranslationStore } from '$lib/core/i18n';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Initialize i18n on app startup
	onMount(async () => {
		await initI18n();
	});

	// Reactive translation for the loading message
	const validatingSessionMessage = createTranslationStore('loading.validatingSession');
</script>

<div class="min-h-screen bg-muted">
	{#if $authStore.isLoading && page.url.pathname !== base + '/login'}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-slate-600">{$validatingSessionMessage}</p>
			</div>
		</div>
	{:else}
		{@render children?.()}
	{/if}
	<Notifications />
</div>
