<script lang="ts">
	import { authStore } from '$lib/stores/auth';
	import { notifications } from '$lib/stores/notificationStore';
	import LoginLayout from '$lib/components/templates/LoginLayout.svelte';
	import AuthForm from '$lib/components/organisms/AuthForm.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	let email = '';
	let otp = '';
	let isEmailStep = true;

	async function handleEmailSubmit(emailValue: string): Promise<void> {
		if (!emailValue) {
			notifications.error('Email er påkrævet');
			return;
		}

		try {
			await authStore.requestOTP(emailValue);
			isEmailStep = false;
			console.debug('OTP requested successfully for email:', emailValue);
		} catch (err) {
			console.debug('Error during OTP request:', err);
			if (err instanceof Error) {
				notifications.error(err.message);
			}
		}
	}

	async function handleOTPSubmit(otpValue: string): Promise<void> {
		if (!otpValue) {
			notifications.error('Verifikationskode er påkrævet');
			return;
		}

		try {
			await authStore.login(otpValue);
			console.debug('Login successful!');
			goto(base || '/');
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
		bind:email
		bind:otp
		isLoading={$authStore.isLoading}
		onEmailSubmit={handleEmailSubmit}
		onOtpSubmit={handleOTPSubmit}
		onBackToEmail={goBackToEmail}
	/>
</LoginLayout>
