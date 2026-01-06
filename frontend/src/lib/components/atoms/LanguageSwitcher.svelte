<script lang="ts">
	import { languageStore } from '$lib/core/i18n/store';
	import { switchLanguage } from '$lib/core/i18n/init';
	import type { Language } from '$lib/core/i18n/store';

	type LanguageSwitcherProps = {
		ariaLabel?: string;
	};

	let { ariaLabel = 'Switch language' }: LanguageSwitcherProps = $props();

	// Subscribe to language changes
	let currentLanguage: Language = $derived.by(() => {
		let lang: Language = 'da';
		const unsubscribe = languageStore.subscribe((l) => {
			lang = l;
		});
		unsubscribe();
		return lang;
	});

	/**
	 * Toggle between Danish and English
	 */
	async function handleToggleLanguage() {
		const newLanguage: Language = currentLanguage === 'da' ? 'en' : 'da';
		await switchLanguage(newLanguage);
	}

	/**
	 * Get display text for current language
	 */
	const getLanguageDisplay = (lang: Language) => (lang === 'da' ? 'DA' : 'EN');
</script>

<button
	type="button"
	{ariaLabel}
	onclick={handleToggleLanguage}
	class="flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
	title={`Current language: ${getLanguageDisplay(currentLanguage)}`}
>
	<!-- Language icon/label -->
	<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
		{getLanguageDisplay(currentLanguage).charAt(0)}
	</span>
	<!-- Language code text -->
	<span class="hidden sm:inline">{getLanguageDisplay(currentLanguage)}</span>
</button>

<style>
	/* Ensure button has proper touch target size on mobile */
	button {
		min-height: 2.5rem;
		min-width: 2.5rem;
	}
</style>
