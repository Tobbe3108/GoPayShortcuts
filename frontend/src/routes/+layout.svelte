<script lang="ts">
	import '../app.css';
	import { authStore } from '$lib/stores/auth';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-slate-50">
	{#if $authStore.isLoading && $page.url.pathname !== base + '/login'}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-slate-600">Validating session...</p>
			</div>
		</div>
	{:else}
		<slot />
	{/if}

	<Notifications />
</div>
