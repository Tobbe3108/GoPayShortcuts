import { writable, type Writable } from 'svelte/store';

/**
 * Supported languages
 */
export type Language = 'da' | 'en';

/**
 * Language preference constants
 */
export const LANGUAGES = {
	DA: 'da' as Language,
	EN: 'en' as Language
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = LANGUAGES.DA;

/**
 * Get current language from store
 */
export function getCurrentLanguage(): Language {
	let current: Language = DEFAULT_LANGUAGE;
	const unsubscribe = languageStore.subscribe((lang) => {
		current = lang;
	});
	unsubscribe();
	return current;
}

/**
 * Set language in store
 */
export function setLanguage(language: Language): void {
	languageStore.set(language);
	// Update HTML lang attribute
	if (typeof document !== 'undefined') {
		document.documentElement.lang = language;
	}
	// Persist to localStorage
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('language', language);
	}
}

/**
 * Detect browser language preference
 * Returns 'da' or 'en', defaults to Danish
 */
export function detectBrowserLanguage(): Language {
	// Return cached preference if available
	if (typeof localStorage !== 'undefined') {
		const saved = localStorage.getItem('language');
		if (saved === 'da' || saved === 'en') {
			return saved;
		}
	}

	// Check navigator.language
	if (typeof navigator !== 'undefined') {
		const browserLang = navigator.language.toLowerCase();

		// Exact matches
		if (browserLang === 'da' || browserLang === 'en') {
			return browserLang;
		}

		// Language code matches (e.g., 'en-US' -> 'en')
		const langCode = browserLang.split('-')[0];
		if (langCode === 'da' || langCode === 'en') {
			return langCode;
		}
	}

	// Default to Danish
	return DEFAULT_LANGUAGE;
}

/**
 * Language store - reactive store for current language
 */
export const languageStore: Writable<Language> = writable<Language>(DEFAULT_LANGUAGE);
