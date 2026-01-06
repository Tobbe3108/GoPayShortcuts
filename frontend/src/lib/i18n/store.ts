import { writable, type Readable } from 'svelte/store';

export type Locale = 'da' | 'en';

type Translations = Record<string, unknown>;

// Writable store for current locale, default to 'da'
export const locale = writable<Locale>('da');

// Helper function to safely navigate nested objects
function getNestedValue(obj: unknown, path: string): unknown {
	return path.split('.').reduce((current, key) => {
		if (current && typeof current === 'object' && key in current) {
			return (current as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

// Cache for loaded translations
const translationsCache = new Map<Locale, Translations>();

// Helper to load translations for a locale
async function loadTranslations(localeValue: Locale): Promise<Translations> {
	if (translationsCache.has(localeValue)) {
		return translationsCache.get(localeValue)!;
	}

	try {
		const module = await import(`./locales/${localeValue}.json`);
		const translations = module.default as Translations;
		translationsCache.set(localeValue, translations);
		return translations;
	} catch (error) {
		console.error(`Failed to load translations for locale: ${localeValue}`, error);
		// Fallback to Danish if loading fails
		try {
			const fallbackModule = await import('./locales/da.json');
			const translations = fallbackModule.default as Translations;
			translationsCache.set('da', translations);
			return translations;
		} catch (fallbackError) {
			console.error('Failed to load fallback Danish translations', fallbackError);
			return {};
		}
	}
}

// Readable store for translations that updates when locale changes
export function createTranslationsStore(): Readable<Translations> {
	const { subscribe } = writable<Translations>({});

	return {
		subscribe: (fn) => {
			const unsubscribeListen = locale.subscribe(async (currentLocale) => {
				const trans = await loadTranslations(currentLocale);
				fn(trans);
			});

			return unsubscribeListen;
		}
	};
}

export const translations = createTranslationsStore();

/**
 * Translation helper function
 * @param key - Dot-separated key path (e.g., 'auth.emailLabel')
 * @param defaultValue - Optional default value if key is not found
 * @returns Translated string or default value
 */
export function t(key: string, defaultValue?: string): string {
	let translationValue: unknown;

	// Subscribe to translations store to get current value
	let currentTranslations: Translations = {};
	const unsubscribe = translations.subscribe((trans) => {
		currentTranslations = trans;
	});

	translationValue = getNestedValue(currentTranslations, key);
	unsubscribe();

	if (typeof translationValue === 'string') {
		return translationValue;
	}

	return defaultValue ?? key;
}

/**
 * Browser language detection utility
 * Detects browser language and returns 'da' or 'en'
 * Default fallback is 'da' (Danish)
 */
export function detectBrowserLanguage(): Locale {
	if (typeof navigator === 'undefined') {
		return 'da';
	}

	const browserLang = navigator.language.toLowerCase();

	// Check for Danish language codes (da, da-DK, etc.)
	if (browserLang.startsWith('da')) {
		return 'da';
	}

	// Check for English language codes (en, en-US, en-GB, etc.)
	if (browserLang.startsWith('en')) {
		return 'en';
	}

	// Default to Danish if no match
	return 'da';
}
