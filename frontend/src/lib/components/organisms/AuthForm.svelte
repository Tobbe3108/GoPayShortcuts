<script lang="ts">
	import FormField from '../molecules/FormField.svelte';
	import Button from '../atoms/Button.svelte';
	import LoadingSpinner from '../LoadingSpinner.svelte';

	type AuthFormProps = {
		isEmailStep?: boolean;
		email?: string;
		otp?: string;
		isLoading?: boolean;
		onEmailSubmit?: (email: string) => void;
		onOtpSubmit?: (otp: string) => void;
		onBackToEmail?: () => void;
	};

	let {
		isEmailStep = true,
		email = $bindable(''),
		otp = $bindable(''),
		isLoading = false,
		onEmailSubmit = (email: string) => {},
		onOtpSubmit = (otp: string) => {},
		onBackToEmail = () => {}
	}: AuthFormProps = $props();

	const validateEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
</script>

{#if isEmailStep}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			onEmailSubmit(email);
		}}
	>
		<FormField
			id="email"
			label="Email adresse"
			type="email"
			placeholder="Indtast din email"
			bind:value={email}
			transform={(v) => v.trim()}
			required={true}
		/>
		<Button type="submit" disabled={isLoading || !validateEmail(email)} fullWidth={true}>
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
	<form
		onsubmit={(e) => {
			e.preventDefault();
			onOtpSubmit(otp);
		}}
	>
		<FormField
			id="otp"
			label="Verifikationskode"
			type="text"
			placeholder="Indtast verifikationskode"
			bind:value={otp}
			transform={(v) => v.replace(/[^0-9]/g, '')}
			validate={(v) => v.length > 0}
			required={true}
		/>
		<Button type="submit" disabled={isLoading || otp.length === 0} fullWidth={true}>
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
				onclick={() => onBackToEmail()}
			>
				Tilbage
			</button>
		</div>
	</form>
{/if}
