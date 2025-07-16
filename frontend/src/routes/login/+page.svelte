<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth';
	import { base } from '$app/paths';
	import { notifications } from '$lib/stores/notificationStore';
	import LoginLayout from '$lib/components/templates/LoginLayout.svelte';
	import AuthForm from '$lib/components/organisms/AuthForm.svelte';
	import type { FormSubmitEvent } from '$lib/types/api';

	let email = '';
	let otp = '';
	let isEmailStep = true;

	$: if ($authStore.isAuthenticated) {
		console.debug('User is authenticated, redirecting to home');
		goto(base + '/');
	}

	interface EmailSubmitDetail {
		email: string;
	}

	interface OTPSubmitDetail {
		otp: string;
	}

	async function handleEmailSubmit(event: FormSubmitEvent<EmailSubmitDetail>): Promise<void> {
		const { email } = event.detail;

		if (!email) {
			notifications.error('Email er påkrævet');
			return;
		}

		try {
			await authStore.requestOTP(email);
			isEmailStep = false;
			console.debug('OTP requested successfully for email:', email);
		} catch (err) {
			console.debug('Error during OTP request:', err);
			if (err instanceof Error) {
				notifications.error(err.message);
			}
		}
	}

	async function handleOTPSubmit(event: FormSubmitEvent<OTPSubmitDetail>): Promise<void> {
		const { otp } = event.detail;

		if (!otp) {
			notifications.error('Verifikationskode er påkrævet');
			return;
		}

		try {
			console.debug('Sending OTP for verification:', otp);
			await authStore.login(otp);
		} catch (err) {
			console.debug('Error during OTP verification:', err);
			if (err instanceof Error) {
				notifications.error(err.message);
			}
		}
	}

	function goBackToEmail(): void {
		console.debug('Going back to email step');
		isEmailStep = true;
		authStore.clearError();
	}
</script>

<LoginLayout>
	<AuthForm
		{isEmailStep}
		{email}
		{otp}
		isLoading={$authStore.isLoading}
		on:emailSubmit={handleEmailSubmit}
		on:otpSubmit={handleOTPSubmit}
		on:backToEmail={goBackToEmail}
	/>
</LoginLayout>
