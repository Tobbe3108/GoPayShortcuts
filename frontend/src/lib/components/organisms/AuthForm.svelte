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

	function handleEmailSubmit() {
		onEmailSubmit(email);
	}

	function handleOTPSubmit() {
		onOtpSubmit(otp);
	}

	function goBackToEmail() {
		onBackToEmail();
	}
</script>

{#if isEmailStep}
	<form on:submit|preventDefault={handleEmailSubmit}>
		<FormField
			id="email"
			label="Email adresse"
			type="email"
			placeholder="Indtast din email"
			value={email}
			required={true}
			on:input={(e) => (email = e.detail)}
		/>

		<Button type="submit" disabled={isLoading} fullWidth={true}>
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
	<form on:submit|preventDefault={handleOTPSubmit}>
		<FormField
			id="otp"
			label="Verifikationskode"
			type="text"
			placeholder="Indtast verifikationskode"
			value={otp}
			required={true}
			on:input={(e) => (otp = e.detail)}
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

		<Button type="submit" disabled={isLoading} fullWidth={true}>
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
