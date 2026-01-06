import { languageStore, getCurrentLanguage, type Language } from './store';
import { readable, type Readable } from 'svelte/store';
import type daTranslations from './locales/da.json';

/**
 * Type-safe translation keys for autocomplete
 * Represents the structure of translation files
 */
export type TranslationKey = string;

/**
 * Translation parameters for substitution in strings
 */
export interface TranslationParams {
	[key: string]: string | number;
}

/**
 * Load translations for a given language
 */
async function loadTranslations(language: Language): Promise<Record<string, unknown>> {
	try {
		if (language === 'da') {
			return await import('./locales/da.json').then((m) => m.default);
		} else if (language === 'en') {
			return await import('./locales/en.json').then((m) => m.default);
		}
		// Fallback to Danish if language not found
		return await import('./locales/da.json').then((m) => m.default);
	} catch (error) {
		console.error(`Failed to load translations for language: ${language}`, error);
		return {};
	}
}

/**
 * Get value from nested object using dot notation path
 * @param obj - Object to traverse
 * @param path - Dot-separated path (e.g., "auth.email.label")
 * @returns The value at the path or undefined
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	const keys = path.split('.');
	let current: unknown = obj;

	for (const key of keys) {
		if (typeof current === 'object' && current !== null && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return undefined;
		}
	}

	return current;
}

/**
 * Substitute parameters in a translation string
 * Supports {{param}} syntax
 * @param str - String with placeholders
 * @param params - Object with parameter values
 * @returns String with substituted values
 */
function substituteParams(str: string, params?: TranslationParams): string {
	if (!params || typeof str !== 'string') {
		return str;
	}

	return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
		const value = params[key];
		return value !== undefined ? String(value) : match;
	});
}

/**
 * Current translations cache
 */
let currentTranslations: Record<string, unknown> = {};

/**
 * Initialize translations on app startup
 */
export async function initializeTranslations(initialLanguage?: Language): Promise<void> {
	const language = initialLanguage || getCurrentLanguage();
	currentTranslations = await loadTranslations(language);
}

/**
 * Translate a key to the current language
 * @param key - Translation key using dot notation (e.g., "auth.email.label")
 * @param params - Optional parameters for substitution
 * @returns Translated string or the key if not found
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
	const value = getNestedValue(currentTranslations, key);

	if (typeof value === 'string') {
		return substituteParams(value, params);
	}

	// Return key if translation not found (useful for debugging)
	console.warn(`Translation missing for key: ${key}`);
	return key;
}

/**
 * Create a reactive translation derived store
 * Updates whenever language changes
 */
export function createTranslationStore(
	key: TranslationKey,
	params?: TranslationParams
): Readable<string> {
	return readable(t(key, params), (set) => {
		const unsubscribe = languageStore.subscribe(async (language) => {
			currentTranslations = await loadTranslations(language);
			set(t(key, params));
		});

		return () => {
			unsubscribe();
		};
	});
}

/**
 * Setup language change subscription and reload translations
 * Call this in app initialization
 */
export function setupLanguageSubscription(): void {
	if (typeof window === 'undefined') {
		return;
	}

	languageStore.subscribe(async (language) => {
		currentTranslations = await loadTranslations(language);
	});
}

export { languageStore, getCurrentLanguage, setLanguage, detectBrowserLanguage } from './store';
export type { Language } from './store';
