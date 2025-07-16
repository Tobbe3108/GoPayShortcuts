<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<div class="container p-4 mx-auto">
	<div class="container mx-auto flex items-center justify-between mb-8">
		<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-28 w-auto" />
		{#if $authStore.isAuthenticated && $page.url.pathname !== '/login'}
			<button
				onclick={() => {
					authStore.logout();
					goto(base + '/login');
				}}
				class="px-4 py-2 font-semibold text-white transition duration-150 ease-in-out bg-slate-800 rounded-lg shadow hover:bg-slate-700"
			>
				Log ud
			</button>
		{/if}
	</div>

	<!-- Main content section -->
	<div class="bg-white rounded-lg shadow-md p-6">
		<h1 class="text-2xl font-bold text-slate-800 mb-4">GoPay Shortcuts</h1>
	</div>
</div>
