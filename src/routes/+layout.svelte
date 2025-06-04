<script lang="ts">
	import '../app.css';
	import authStore from '$lib/stores/authStore';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

</script>

<div class="min-h-screen bg-gray-50">
	<header class="bg-gradient-to-r from-emerald-400 to-blue-500 text-white p-4 shadow-md">
		<div class="container mx-auto flex items-center justify-between">
			<img src="/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
			{#if $authStore.user && $page.url.pathname !== '/login'}
				<button 
					on:click={() => { 
						$authStore.user = null; 
						$authStore.loading = false; 
						$authStore.error = null; 
						localStorage.removeItem('food_shortcuts_auth'); 
						goto('/login'); 
					}}
					class="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-red-500 rounded-lg shadow hover:bg-red-600"
				>
					Log ud
				</button>
			{/if}
		</div>
	</header>
	
	{#if $authStore.loading && $page.url.pathname !== '/login'}
		<div class="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div class="text-center">
				<LoadingSpinner size="w-12 h-12" />
				<p class="mt-4 text-gray-600">Validating session...</p>
			</div>
		</div>
	{:else}
		<slot />
	{/if}
</div>