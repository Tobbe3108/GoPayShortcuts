<script lang="ts">    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { authStore } from '$lib/stores/authStore';
    import { requestOTP, verifyOTP } from '$lib/services/auth';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
    
    export let data;
    const { fetch: pageFetch } = data;

    let email = '';
    let otp = '';
    let isEmailStep = true;
    let isSubmitting = false;
    let error = '';

    onMount(() => {
        // Check if already logged in
        const unsubscribe = authStore.subscribe(state => {
            if (state.user) {
                goto('/');
            }
        });

        return unsubscribe;
    });    async function handleEmailSubmit() {
        if (!email) {
            error = 'Email is required';
            return;
        }

        try {
            isSubmitting = true;
            await requestOTP(email, pageFetch);
            // Store email temporarily to associate with the token later
            localStorage.setItem('temp_email', email);
            isEmailStep = false;
            error = '';
        } catch (err) {
            error = 'Failed to send verification code. Please try again.';
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    }    async function handleOTPSubmit() {
        if (!otp) {
            error = 'Verification code is required';
            return;
        }

        try {
            isSubmitting = true;
            const user = await verifyOTP(otp, pageFetch);
            authStore.setUser(user);
            goto('/');
        } catch (err) {
            error = 'Invalid verification code. Please try again.';
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    }

    function goBackToEmail() {
        isEmailStep = true;
        error = '';
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div class="text-center mb-8">
            <h1 class="text-2xl font-semibold text-gray-800">Food Shortcuts</h1>
            <p class="text-gray-600 mt-2">
                {isEmailStep ? 'Sign in to your account' : 'Enter verification code'}
            </p>
        </div>

        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span>{error}</span>
            </div>
        {/if}

        {#if isEmailStep}
            <form on:submit|preventDefault={handleEmailSubmit}>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        bind:value={email}
                        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {#if isSubmitting}
                        <div class="flex justify-center items-center">
                            <LoadingSpinner size="w-5 h-5" />
                            <span class="ml-2">Sending...</span>
                        </div>
                    {:else}
                        Continue
                    {/if}
                </button>
            </form>
        {:else}
            <form on:submit|preventDefault={handleOTPSubmit}>
                <div class="mb-4">
                    <label for="otp" class="block text-gray-700 text-sm font-medium mb-2">Verification Code</label>
                    <input
                        type="text"
                        id="otp"
                        placeholder="Enter verification code"
                        bind:value={otp}
                        class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 mb-3"
                >
                    {#if isSubmitting}
                        <div class="flex justify-center items-center">
                            <LoadingSpinner size="w-5 h-5" />
                            <span class="ml-2">Verifying...</span>
                        </div>
                    {:else}
                        Sign In
                    {/if}
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    on:click={goBackToEmail}
                    class="w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50"
                >
                    Back to Email
                </button>
            </form>
        {/if}
    </div>
</div>
