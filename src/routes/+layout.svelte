<script lang="ts">
	import '../app.css';
	import authStore from '$lib/stores/authStore';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<div class="min-h-screen bg-slate-50">
	{#if $authStore.loading && $page.url.pathname !== base + '/login'}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-slate-600">Validating session...</p>
			</div>
		</div>
	{:else}
		<slot />
	{/if}
</div>