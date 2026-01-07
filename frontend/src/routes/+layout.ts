import type { LayoutLoad } from './$types';
import { register, init, getLocaleFromNavigator, waitLocale } from 'svelte-i18n';

export const prerender = true;
export const ssr = false;

// Register locales
register('en', () => import('$lib/i18n/en.json'));
register('da', () => import('$lib/i18n/da.json'));

// Initialize i18n
init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator() || 'en'
});

export const load: LayoutLoad = async ({ fetch }) => {
	// Ensure dictionaries are loaded before rendering
	await waitLocale();

	return { fetch };
};
