<script lang="ts">    
    import { goto } from '$app/navigation';
    import authStore from '$lib/stores/authStore';
    import { requestOTP, verifyOTP } from '$lib/services/authService';
    import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
    import type { PageData } from './$types';
    
    const { data } = $props<{ data: PageData }>();
    
    let email = $state('');
    let otp = $state('');
    let isEmailStep = $state(true);

    $effect(() => {
        if ($authStore.user) {
            console.debug('User is authenticated, redirecting to home');
            goto('/');
        }
    });  

    async function handleEmailSubmit() {
        if (!email) {
            $authStore.error = 'Email is required';
            console.debug($authStore.error);
            return;
        }

        try {
            await requestOTP(email, data.fetch);
            isEmailStep = false;
            $authStore.error = null;
            console.debug('OTP requested successfully for email:', email);
        } catch (err) {
            console.debug('Error during OTP request:', err);
        }
    }

    async function handleOTPSubmit() {
        if (!otp) {
            $authStore.error = 'Verification code is required';
            console.debug($authStore.error);
            return;
        }

        try {
            console.debug('Sending OTP for verification:', otp);
            await verifyOTP(otp, data.fetch);
        } catch (err) {
            console.debug('Error during OTP verification:', err);
        }
    }    
    
    function goBackToEmail() {
        console.debug('Going back to email step');
        isEmailStep = true;
        $authStore.error = null;
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
        {#if $authStore.error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <span>{$authStore.error}</span>
            </div>
        {/if}        
        {#if isEmailStep}
            <form onsubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
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
                </div>                
                <button
                    type="submit"
                    disabled={$authStore.loading}
                    class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {#if $authStore.loading}
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
            <form onsubmit={(e) => { e.preventDefault(); handleOTPSubmit(); }}>
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
                </div>                
                <div class="mb-4">                    
                    <button type="button" onclick={goBackToEmail} class="text-sm text-blue-500 hover:underline">
                        Back to email
                    </button>
                </div>                
                <button
                    type="submit"
                    disabled={$authStore.loading}
                    class="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {#if $authStore.loading}
                        <div class="flex justify-center items-center">
                            <LoadingSpinner size="w-5 h-5" />
                            <span class="ml-2">Verifying...</span>
                        </div>
                    {:else}
                        Sign In
                    {/if}
                </button>
            </form>
        {/if}
    </div>
</div>
