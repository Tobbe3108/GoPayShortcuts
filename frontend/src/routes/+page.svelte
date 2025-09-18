<script lang="ts">
	import { authStore } from '$lib/features/auth/store';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import MainLayout from '$lib/components/templates/MainLayout.svelte';
	import Card from '$lib/components/atoms/Card.svelte';

	function handleLogout() {
		authStore.logout();
		goto(base + '/login');
	}
</script>

<MainLayout isAuthenticated={$authStore.isAuthenticated} onLogout={handleLogout}>
	{#snippet children()}
		<Card>
			{#snippet children()}
				<h1 class="text-2xl font-bold text-slate-800 mb-4">GoPay Shortcuts</h1>
			{/snippet}
		</Card>
	{/snippet}
</MainLayout>
