<script lang="ts">
	import FormField from '../molecules/FormField.svelte';
	import Button from '../atoms/Button.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	export let isEmailStep = true;
	export let email = '';
	export let otp = '';
	export let isLoading = false;

	// Callback props to replace event dispatching
	export let onEmailSubmit: (email: string) => void = () => {};
	export let onOtpSubmit: (otp: string) => void = () => {};
	export let onBackToEmail: () => void = () => {};

	function handleEmailSubmit(e: SubmitEvent) {
		e.preventDefault();
		onEmailSubmit(email);
	}

	function handleOTPSubmit(e: SubmitEvent) {
		e.preventDefault();
		onOtpSubmit(otp);
	}

	function goBackToEmail() {
		onBackToEmail();
	}

	function validateEmail(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	function transformEmail(value: string): string {
		return value.trim();
	}

	function transformOTP(value: string): string {
		return value.replace(/[^0-9]/g, '');
	}
</script>

{#if isEmailStep}
	<form on:submit={handleEmailSubmit}>
		<FormField
			id="email"
			label="Email adresse"
			type="email"
			placeholder="Indtast din email"
			bind:value={email}
			transform={transformEmail}
			validate={validateEmail}
			required={true}
		/>

		<Button type="submit" disabled={isLoading || !validateEmail(email)} fullWidth={true}>
			{#if isLoading}
				<div class="flex justify-center items-center">
					<LoadingSpinner size="w-5 h-5" />
					<span class="ml-2">Sender...</span>
				</div>
			{:else}
				Fortsæt
			{/if}
		</Button>
	</form>
{:else}
	<form on:submit={handleOTPSubmit}>
		<FormField
			id="otp"
			label="Verifikationskode"
			type="text"
			placeholder="Indtast verifikationskode"
			bind:value={otp}
			transform={transformOTP}
			required={true}
		/>

		<div class="mb-4">
			<button
				type="button"
				class="text-sm text-slate-700 hover:text-slate-900 hover:underline"
				on:click={goBackToEmail}
			>
				Tilbage til email
			</button>
		</div>

		<Button type="submit" disabled={isLoading || otp.length === 0} fullWidth={true}>
			{#if isLoading}
				<div class="flex justify-center items-center">
					<LoadingSpinner size="w-5 h-5" />
					<span class="ml-2">Verificerer...</span>
				</div>
			{:else}
				Log ind
			{/if}
		</Button>
	</form>
{/if}
