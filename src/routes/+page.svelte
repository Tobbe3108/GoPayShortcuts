<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth, logout } from '$lib/services/authService';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

    function handleLogout() {
        logout();
        goto('/login');
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold">Food Shortcuts</h1>
        {#if $auth.user}
            <div class="flex items-center">
                <span class="mr-4 text-gray-600">{$auth.user.email}</span>
                <button 
                    onclick={handleLogout}
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
