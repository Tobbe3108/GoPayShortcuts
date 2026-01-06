<script lang="ts">
	import { locale, t } from '$lib/i18n';
	import type { Locale } from '$lib/i18n';
	import Button from '$lib/components/atoms/Button.svelte';

	// Example of using i18n in a component

	// Get translations for the current locale
	let emailLabel = $derived(t('auth.emailLabel'));
	let emailPlaceholder = $derived(t('auth.emailPlaceholder'));
	let continueButton = $derived(t('auth.continueButton'));
	let logoutButton = $derived(t('navigation.logout'));

	// Function to change locale
	function switchLocale(newLocale: Locale) {
		locale.set(newLocale);
	}
</script>

<!-- Example 1: Basic usage -->
<div class="mb-4">
	<label>{emailLabel}</label>
	<input type="email" placeholder={emailPlaceholder} />
	<button type="button">{continueButton}</button>
</div>

<!-- Example 2: Locale switcher -->
<div class="mb-4">
	<p>Current locale: {$locale}</p>
	<div class="space-x-2">
		<Button onclick={() => switchLocale('da')} variant={$locale === 'da' ? 'primary' : 'transparent'}>
			Dansk
		</Button>
		<Button onclick={() => switchLocale('en')} variant={$locale === 'en' ? 'primary' : 'transparent'}>
			English
		</Button>
	</div>
</div>

<!-- Example 3: Translation output -->
<div class="mb-4">
	<p>Logout button text: {logoutButton}</p>
	<p>Email label: {emailLabel}</p>
	<p>Continue button: {continueButton}</p>
</div>
