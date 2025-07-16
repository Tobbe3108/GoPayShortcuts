<script lang="ts">
	import { goto } from '$app/navigation';
	import authStore from '$lib/stores/authStore';
	import { requestOTP, verifyOTP } from '$lib/services/authService';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import type { PageData } from './$types';
	import { base } from '$app/paths';
	import { notifications } from '$lib/stores/notificationStore';

	const { data } = $props<{ data: PageData }>();

	let email = $state('');
	let otp = $state('');
	let isEmailStep = $state(true);

	$effect(() => {
		if ($authStore.user) {
			console.debug('User is authenticated, redirecting to home');
			goto(base + '/');
		}
	});
	async function handleEmailSubmit() {
		if (!email) {
			notifications.error('Email er påkrævet');
			return;
		}

		try {
			await requestOTP(email, data.fetch);
			isEmailStep = false;
			$authStore.error = null;
			console.debug('OTP requested successfully for email:', email);
		} catch (err) {
			console.debug('Error during OTP request:', err);
			if (err instanceof Error) {
				notifications.error(err.message);
			}
		}
	}

	async function handleOTPSubmit() {
		if (!otp) {
			notifications.error('Verifikationskode er påkrævet');
			return;
		}

		try {
			console.debug('Sending OTP for verification:', otp);
			await verifyOTP(otp, data.fetch);
		} catch (err) {
			console.debug('Error during OTP verification:', err);
			if (err instanceof Error) {
				notifications.error(err.message);
			}
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
		<div class="flex justify-center">
			<img src="{base}/GoPayBadEdition.png" alt="GoPay BAD Edition Logo" class="h-75 w-auto" />
		</div>
		{#if isEmailStep}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleEmailSubmit();
				}}
			>
				<div class="mb-4">
					<label for="email" class="block text-gray-700 text-sm font-medium mb-2"
						>Email adresse</label
					>
					<input						type="email"
						id="email"
						placeholder="Indtast din email"
						bind:value={email}
						class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
						required
					/>
				</div>				<button
					type="submit"
					disabled={$authStore.loading}
					class="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 disabled:opacity-50"
				>
					{#if $authStore.loading}
						<div class="flex justify-center items-center">
							<LoadingSpinner size="w-5 h-5" />
							<span class="ml-2">Sender...</span>
						</div>
					{:else}
						Fortsæt
					{/if}
				</button>
			</form>
		{:else}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleOTPSubmit();
				}}
			>
				<div class="mb-4">
					<label for="otp" class="block text-gray-700 text-sm font-medium mb-2"
						>Verifikationskode</label
					>
					<input						type="text"
						id="otp"
						placeholder="Indtast verifikationskode"
						bind:value={otp}
						class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-600"
						required
					/>
				</div>
				<div class="mb-4">					<button
						type="button"
						onclick={goBackToEmail}
						class="text-sm text-slate-700 hover:text-slate-900 hover:underline"
					>
						Tilbage til email
					</button>
				</div>				<button
					type="submit"
					disabled={$authStore.loading}
					class="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 disabled:opacity-50"
				>
					{#if $authStore.loading}
						<div class="flex justify-center items-center">
							<LoadingSpinner size="w-5 h-5" />
							<span class="ml-2">Verificerer...</span>
						</div>
					{:else}
						Log ind
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>
