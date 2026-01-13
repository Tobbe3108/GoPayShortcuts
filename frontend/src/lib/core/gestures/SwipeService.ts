import { swipeStore } from './swipeStore';
import { navigationStore } from '$lib/features/navigation/store';
import { isMobile } from '$lib/core/responsive/isMobile';
import type { SwipeCustomEvent } from 'svelte-gestures';

export class SwipeService {
	private static instance: SwipeService | null = null;

	private constructor() {
		// Private constructor for singleton
	}

	public static getInstance(): SwipeService {
		if (!SwipeService.instance) {
			SwipeService.instance = new SwipeService();
		}
		return SwipeService.instance;
	}

	public enableSwipeNavigation() {
		swipeStore.setHandler(this.handleSwipe.bind(this));
	}

	public disableSwipeNavigation() {
		swipeStore.clearHandler();
	}

	private handleSwipe(event: SwipeCustomEvent) {
		// Only handle swipes on mobile devices
		if (!isMobile()) {
			return;
		}

		const { direction } = event.detail;

		if (!direction) {
			return;
		}

		switch (direction) {
			case 'left':
				navigationStore.nextDay();
				break;
			case 'right':
				navigationStore.prevDay();
				break;
			case 'top':
				navigationStore.collapseMenu();
				break;
			case 'bottom':
				navigationStore.expandMenu();
				break;
		}
	}
}
