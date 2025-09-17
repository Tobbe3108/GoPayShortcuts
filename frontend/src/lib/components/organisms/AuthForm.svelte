<script lang="ts">
	import FormField from '../molecules/FormField.svelte';
	import Button from '../atoms/Button.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	let {
		isEmailStep = true,
		email = $bindable(''),
		otp = $bindable(''),
		isLoading = false,
		onEmailSubmit = (email: string) => {},
		onOtpSubmit = (otp: string) => {},
		onBackToEmail = () => {}
	} = $props();

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

TODO: fix errors / refactor / Add page and test

{#if isEmailStep}
	<form onsubmit={handleEmailSubmit}>
		<FormField
			id="email"
			label="Email adresse"
			type="email"
			placeholder="Indtast din email"
			bind:value={email}
			transform={transformEmail}
			validate={validateEmail}
			required={true}
			onInput={() => {}}
			onBlur={() => {}}
			onFocus={() => {}}
		/>

		<Button
			type="submit"
			disabled={isLoading || !validateEmail(email)}
			fullWidth={true}
			onclick={() => {}}
		>
			{#snippet children()}
				{#if isLoading}
					<div class="flex justify-center items-center">
						<LoadingSpinner size="w-5 h-5" />
						<span class="ml-2">Sender...</span>
					</div>
				{:else}
					Fortsæt
				{/if}
			{/snippet}
		</Button>
	</form>
{:else}
	<form onsubmit={handleOTPSubmit}>
		<FormField
			id="otp"
			label="Verifikationskode"
			type="text"
			placeholder="Indtast verifikationskode"
			bind:value={otp}
			transform={transformOTP}
			validate={(val: string) => val.length > 0}
			required={true}
			onInput={() => {}}
			onBlur={() => {}}
			onFocus={() => {}}
		/>

		<Button
			type="submit"
			disabled={isLoading || otp.length === 0}
			fullWidth={true}
			onclick={() => {}}
		>
			{#snippet children()}
				{#if isLoading}
					<div class="flex justify-center items-center">
						<LoadingSpinner size="w-5 h-5" />
						<span class="ml-2">Verificerer...</span>
					</div>
				{:else}
					Log ind
				{/if}
			{/snippet}
		</Button>

		<div class="mt-4 text-center">
			<button
				type="button"
				class="inline-flex items-center justify-center text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline transition-colors cursor-pointer"
				onclick={goBackToEmail}
			>
				Tilbage
			</button>
		</div>
	</form>
{/if}
