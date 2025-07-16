import type { LayoutLoad } from './$types';

// Enable static site generation
export const prerender = true;
export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
	// Pass the fetch function to the page load functions
	return {
		fetch
	};
};
