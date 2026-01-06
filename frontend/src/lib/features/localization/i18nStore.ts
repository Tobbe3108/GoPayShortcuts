/**
 * Type-safe i18n (internationalization) store for managing language and translations.
 * Detects browser language, persists to localStorage, and provides reactive language switching.
 */

import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { translations, type Language } from './translations';

const LANGUAGE_PREFERENCE_KEY = 'language-preference';

/**
 * Converts browser language code to supported language
 * @param lang - Browser language code (e.g., 'da-DK', 'en-GB', 'en')
 * @returns Supported language: 'da' or 'en'
 */
export function getSupportedLanguage(lang: string): Language {
	const baseLang = lang.split('-')[0].toLowerCase();

	if (baseLang === 'da') {
		return 'da';
	}
	if (baseLang === 'en') {
		return 'en';
	}

	// Default to Danish
	return 'da';
}

/**
 * Detects the user's preferred language from browser or localStorage
 * Priority: localStorage -> navigator.language -> 'da' (default)
 */
function detectLanguage(): Language {
	// Check localStorage first
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
		if (saved === 'da' || saved === 'en') {
			return saved;
		}

		// Check browser language
		const browserLang = navigator.language;
		const detected = getSupportedLanguage(browserLang);
		return detected;
	}

	// Default to Danish (server-side or if localStorage unavailable)
	return 'da';
}

/**
 * i18n store state
 */
interface I18nState {
	currentLanguage: Language;
	translations: typeof translations;
}

/**
 * Create the i18n store with readable pattern for reactivity
 */
function createI18nStore(): Readable<I18nState> & {
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
	getLanguage: () => Language;
} {
	let currentLanguage: Language = detectLanguage();

	const { subscribe } = readable<I18nState>({ currentLanguage, translations }, (set) => {
		// Persist language preference whenever it changes
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			localStorage.setItem(LANGUAGE_PREFERENCE_KEY, currentLanguage);
		}

		set({ currentLanguage, translations });
	});

	return {
		subscribe,
		/**
		 * Set the current language and persist to localStorage
		 */
		setLanguage: (lang: Language) => {
			currentLanguage = lang;
			if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
				localStorage.setItem(LANGUAGE_PREFERENCE_KEY, lang);
			}
		},
		/**
		 * Get a translation by dot-notation key with fallback to Danish
		 * @param key - Translation key (e.g., 'auth.email', 'orders.title')
		 * @returns Translated string or original key if not found
		 */
		t: (key: string): string => {
			return getTranslation(key, currentLanguage);
		},
		/**
		 * Get the current language
		 */
		getLanguage: () => currentLanguage,
	};
}

/**
 * Utility function to get translation by dot-notation key
 * Falls back to Danish if key not found in target language
 * @param key - Dot-notation key (e.g., 'auth.email')
 * @param lang - Target language
 * @returns Translated string or key as fallback
 */
export function getTranslation(key: string, lang: Language = 'da'): string {
	const keys = key.split('.');

	// Navigate through nested object
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let value: any = translations[lang];

	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			// Key not found in target language, try Danish fallback
			if (lang !== 'da') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let fallbackValue: any = translations.da;
				for (const fk of keys) {
					if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
						fallbackValue = fallbackValue[fk];
					} else {
						return key; // Return key as last resort
					}
				}
				return String(fallbackValue);
			}
			return key; // Return key as fallback
		}
	}

	return String(value);
}

/**
 * Create and export the i18n store instance
 */
export const i18n = createI18nStore();

/**
 * Type-safe wrapper for getting translations in components
 * Usage: t('auth.email') - returns translated string
 */
export function t(key: string): string {
	return getTranslation(key, i18n.getLanguage());
}
