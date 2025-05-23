<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authStore } from '$lib/stores/authStore';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    let user = null;
    let isLoading = true;

    onMount(() => {
        // Initialize the auth store
        authStore.initialize();

        // Subscribe to auth changes
        const unsubscribe = authStore.subscribe((state) => {
            user = state.user;
            isLoading = state.loading;
            if (!user && !isLoading) {
                goto('/login');
            }
        });

        return unsubscribe;
    });

    function handleLogout() {
        authStore.logoutUser();
        goto('/login');
    }
</script>

{#if isLoading}
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <LoadingSpinner size="w-12 h-12" />
            <p class="mt-4 text-gray-600">Loading your account...</p>
        </div>
    </div>
{:else}
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-semibold">Food Shortcuts</h1>
            {#if user}
                <div class="flex items-center">
                    <span class="mr-4 text-gray-600">{user.email}</span>
                    <button 
                        on:click={handleLogout}
                        class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm"
                    >
                        Logout
                    </button>
                </div>
            {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-lg font-medium mb-4">Shortcuts</h2>
                <p class="text-gray-600">Shortcut features will be implemented here.</p>
            </div>
        </div>
    </div>
{/if}
