<script lang="ts">
	import FormField from '$lib/components/molecules/FormField.svelte';
	import Button from '$lib/components/atoms/Button.svelte';
	import LoadingSpinner from '$lib/core/loading/organisms/LoadingSpinner.svelte';
	import { _ } from 'svelte-i18n';

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
			label={$_('auth.email.label')}
			type="email"
			placeholder={$_('auth.email.placeholder')}
			bind:value={email}
			transform={(v) => v.trim()}
			required={true}
		/>
		<Button type="submit" disabled={isLoading || !validateEmail(email)} fullWidth={true}>
			{#snippet children()}
				{#if isLoading}
					<div class="flex justify-center items-center">
						<LoadingSpinner size="w-5 h-5" />
						<span class="ml-2">{$_('auth.login.sending')}</span>
					</div>
				{:else}
					{$_('auth.login.continue')}
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
			label={$_('auth.otp.label')}
			type="text"
			placeholder={$_('auth.otp.placeholder')}
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
							<span class="ml-2">{$_('auth.login.verifying')}</span>
						</div>
					{:else}
						{$_('auth.login.login')}
					{/if}
				{/snippet}
			</Button>
			<Button
				type="button"
				variant="transparent"
				size="sm"
				className="text-secondary!"
				onclick={() => onBackToEmail()}
				fullWidth={true}
			>
				{$_('auth.login.back')}
			</Button>
		</div>
	</form>
{/if}
