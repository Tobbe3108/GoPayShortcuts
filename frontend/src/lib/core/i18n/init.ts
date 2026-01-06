import {
	detectBrowserLanguage,
	setLanguage,
	type Language,
	getCurrentLanguage
} from './store';
import { initializeTranslations, setupLanguageSubscription } from './index';

/**
 * Initialize i18n system on app startup
 *
 * This function should be called once during app initialization (e.g., in +layout.svelte)
 * It will:
 * 1. Detect browser language preference
 * 2. Load appropriate translation files
 * 3. Set HTML lang attribute
 * 4. Setup reactive language change handling
 *
 * @param preferredLanguage - Optional language override (useful for testing)
 */
export async function initI18n(preferredLanguage?: Language): Promise<void> {
	try {
		// Detect and set language
		const language = preferredLanguage || detectBrowserLanguage();
		setLanguage(language);

		// Initialize translations for the selected language
		await initializeTranslations(language);

		// Setup reactivity - reload translations when language changes
		setupLanguageSubscription();

		// Update HTML lang attribute
		if (typeof document !== 'undefined') {
			document.documentElement.lang = language;
		}
	} catch (error) {
		console.error('Failed to initialize i18n:', error);
		// Fall back to Danish and continue
		setLanguage('da');
		await initializeTranslations('da');
	}
}

/**
 * Change the current language at runtime
 * Updates store, loads translations, and refreshes UI
 *
 * @param language - Language code ('da' or 'en')
 */
export async function switchLanguage(language: Language): Promise<void> {
	try {
		setLanguage(language);
		await initializeTranslations(language);
	} catch (error) {
		console.error(`Failed to switch to language: ${language}`, error);
	}
}
