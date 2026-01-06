import type { LayoutLoad } from './$types';
import { locale, detectBrowserLanguage } from '$lib/i18n';

export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	// Detect browser language on first load and set initial locale
	const detectedLocale = detectBrowserLanguage();
	locale.set(detectedLocale);

	return { fetch };
};
