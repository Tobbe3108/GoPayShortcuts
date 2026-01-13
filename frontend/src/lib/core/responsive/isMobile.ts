/**
 * Check if the current viewport is mobile (max-width: 1023px)
 */
export function isMobile(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	return window.innerWidth <= 1023;
}