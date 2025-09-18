<script lang="ts">
	import FormField from '$lib/components/molecules/FormField.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';

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
		class="space-y-4"
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
		class="space-y-4"
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
		<div class="space-y-2">
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
			<Button
				type="button"
				variant="secondary"
				size="sm"
				onclick={() => onBackToEmail()}
				fullWidth={true}
			>
				Tilbage
			</Button>
		</div>
	</form>
{/if}
