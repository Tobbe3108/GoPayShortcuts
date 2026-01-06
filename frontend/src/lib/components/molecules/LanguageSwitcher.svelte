<script lang="ts">
	import { i18n, type Language } from '$lib/features/localization';

	// Track current language reactively
	let currentLanguage = $state<Language>(i18n.getLanguage());

	// Subscribe to i18n store changes to keep component in sync
	$effect(() => {
		const unsubscribe = i18n.subscribe((state) => {
			currentLanguage = state.currentLanguage;
		});

		return () => unsubscribe();
	});

	// Handle language switching
	function handleLanguageChange(lang: Language): void {
		currentLanguage = lang;
		i18n.setLanguage(lang);
	}

	// Check if language is currently active
	function isActive(lang: Language): boolean {
		return currentLanguage === lang;
	}
</script>

<!-- Language switcher toggle -->
<div
	class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm transition-colors duration-200 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800"
	role="group"
	aria-label="Language selector"
>
	<!-- Danish button -->
	<button
		type="button"
		class="rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200"
		class:bg-blue-500={isActive('da')}
		class:text-white={isActive('da')}
		class:text-gray-700={!isActive('da')}
		class:hover:bg-gray-100={!isActive('da')}
		class:dark:text-gray-300={!isActive('da')}
		class:dark:hover:bg-gray-700={!isActive('da')}
		on:click={() => handleLanguageChange('da')}
		aria-pressed={isActive('da')}
		aria-label="Switch to Danish language"
	>
		DA
	</button>

	<!-- Divider -->
	<div class="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>

	<!-- English button -->
	<button
		type="button"
		class="rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200"
		class:bg-blue-500={isActive('en')}
		class:text-white={isActive('en')}
		class:text-gray-700={!isActive('en')}
		class:hover:bg-gray-100={!isActive('en')}
		class:dark:text-gray-300={!isActive('en')}
		class:dark:hover:bg-gray-700={!isActive('en')}
		on:click={() => handleLanguageChange('en')}
		aria-pressed={isActive('en')}
		aria-label="Switch to English language"
	>
		EN
	</button>
</div>

<style lang="postcss">
	:global {
		/* Smooth transitions for theme changes */
		button {
			@apply transition-colors;
		}
	}
</style>
