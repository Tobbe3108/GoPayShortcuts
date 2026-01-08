/**
 * Gesture detection utilities for Svelte components
 * Provides classes and actions for handling swipe and flick gestures
 */

/**
 * Configuration and state for swipe gesture detection
 */
interface SwipeState {
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	startTime: number;
	endTime: number;
}

/**
 * Configuration and state for flick gesture detection
 */
interface FlickState {
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	startTime: number;
	endTime: number;
}

/**
 * SwipeGestureHandler detects horizontal swipe gestures
 * Minimum horizontal distance: 30px
 * Vertical tolerance: < 50% of horizontal movement
 */
export class SwipeGestureHandler {
	private state: SwipeState;
	private element: HTMLElement;
	private onSwipeLeftCallback?: () => void;
	private onSwipeRightCallback?: () => void;
	private readonly minDistance = 30;
	private readonly maxVerticalRatio = 0.5;

	private readonly handleTouchStart = (e: TouchEvent): void => {
		const touch = e.touches[0];
		if (!touch) return;

		this.state = {
			startX: touch.clientX,
			startY: touch.clientY,
			currentX: touch.clientX,
			currentY: touch.clientY,
			startTime: Date.now(),
			endTime: Date.now(),
		};
	};

	private readonly handleTouchMove = (e: TouchEvent): void => {
		const touch = e.touches[0];
		if (!touch) return;

		this.state.currentX = touch.clientX;
		this.state.currentY = touch.clientY;
	};

	private readonly handleTouchEnd = (e: TouchEvent): void => {
		this.state.endTime = Date.now();

		const horizontalDistance = this.state.currentX - this.state.startX;
		const verticalDistance = Math.abs(this.state.currentY - this.state.startY);

		// Check if horizontal distance meets minimum threshold
		if (Math.abs(horizontalDistance) < this.minDistance) {
			return;
		}

		// Check if vertical movement is within tolerance
		if (verticalDistance > Math.abs(horizontalDistance) * this.maxVerticalRatio) {
			return;
		}

		// Prevent default behavior for valid swipes
		e.preventDefault();

		// Fire appropriate callback
		if (horizontalDistance > 0) {
			this.onSwipeRightCallback?.();
		} else {
			this.onSwipeLeftCallback?.();
		}
	};

	constructor(element: HTMLElement) {
		this.element = element;
		this.state = {
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			startTime: 0,
			endTime: 0,
		};

		this.attach();
	}

	private attach(): void {
		this.element.addEventListener('touchstart', this.handleTouchStart, false);
		this.element.addEventListener('touchmove', this.handleTouchMove, false);
		this.element.addEventListener('touchend', this.handleTouchEnd, false);
	}

	public destroy(): void {
		this.element.removeEventListener('touchstart', this.handleTouchStart, false);
		this.element.removeEventListener('touchmove', this.handleTouchMove, false);
		this.element.removeEventListener('touchend', this.handleTouchEnd, false);
	}

	public setOnSwipeLeft(callback: () => void): void {
		this.onSwipeLeftCallback = callback;
	}

	public setOnSwipeRight(callback: () => void): void {
		this.onSwipeRightCallback = callback;
	}

	public getDirection(): 'left' | 'right' | 'none' {
		const horizontalDistance = this.state.currentX - this.state.startX;
		if (Math.abs(horizontalDistance) < this.minDistance) {
			return 'none';
		}
		return horizontalDistance > 0 ? 'right' : 'left';
	}

	public getDistance(): number {
		return Math.abs(this.state.currentX - this.state.startX);
	}

	public getVelocity(): number {
		const duration = Math.max(this.state.endTime - this.state.startTime, 1);
		const distance = this.getDistance();
		return distance / duration;
	}
}

/**
 * FlickGestureHandler detects vertical downward flick gestures
 * Minimum vertical distance: 20px
 * Maximum duration: 300ms for fast flick
 * Horizontal tolerance: < 30px
 */
export class FlickGestureHandler {
	private state: FlickState;
	private element: HTMLElement;
	private onFlickDownCallback?: () => void;
	private readonly minDistance = 20;
	private readonly maxDuration = 300;
	private readonly maxHorizontalMovement = 30;

	private readonly handleTouchStart = (e: TouchEvent): void => {
		const touch = e.touches[0];
		if (!touch) return;

		this.state = {
			startX: touch.clientX,
			startY: touch.clientY,
			currentX: touch.clientX,
			currentY: touch.clientY,
			startTime: Date.now(),
			endTime: Date.now(),
		};
	};

	private readonly handleTouchMove = (e: TouchEvent): void => {
		const touch = e.touches[0];
		if (!touch) return;

		this.state.currentX = touch.clientX;
		this.state.currentY = touch.clientY;
	};

	private readonly handleTouchEnd = (e: TouchEvent): void => {
		this.state.endTime = Date.now();

		const verticalDistance = this.state.currentY - this.state.startY;
		const horizontalDistance = Math.abs(this.state.currentX - this.state.startX);
		const duration = this.state.endTime - this.state.startTime;

		// Check if vertical distance meets minimum threshold (downward)
		if (verticalDistance < this.minDistance) {
			return;
		}

		// Ignore horizontal drags
		if (horizontalDistance >= this.maxHorizontalMovement) {
			return;
		}

		// Check if flick is fast enough
		if (duration > this.maxDuration) {
			return;
		}

		// Prevent default behavior for valid flicks
		e.preventDefault();

		// Fire callback
		this.onFlickDownCallback?.();
	};

	constructor(element: HTMLElement) {
		this.element = element;
		this.state = {
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			startTime: 0,
			endTime: 0,
		};

		this.attach();
	}

	private attach(): void {
		this.element.addEventListener('touchstart', this.handleTouchStart, false);
		this.element.addEventListener('touchmove', this.handleTouchMove, false);
		this.element.addEventListener('touchend', this.handleTouchEnd, false);
	}

	public destroy(): void {
		this.element.removeEventListener('touchstart', this.handleTouchStart, false);
		this.element.removeEventListener('touchmove', this.handleTouchMove, false);
		this.element.removeEventListener('touchend', this.handleTouchEnd, false);
	}

	public setOnFlickDown(callback: () => void): void {
		this.onFlickDownCallback = callback;
	}

	public getVelocity(): number {
		const duration = Math.max(this.state.endTime - this.state.startTime, 1);
		const distance = this.state.currentY - this.state.startY;
		return distance / duration;
	}

	public getDuration(): number {
		return this.state.endTime - this.state.startTime;
	}
}

/**
 * Handlers configuration for swipe gesture action
 */
interface SwipeGestureHandlers {
	onSwipeLeft?: () => void;
	onSwipeRight?: () => void;
}

/**
 * Handlers configuration for flick gesture action
 */
interface FlickGestureHandlers {
	onFlickDown?: () => void;
}

/**
 * Svelte action for swipe gesture detection
 * Usage: use:useSwipeGesture={{ onSwipeLeft: handler, onSwipeRight: handler }}
 */
export function useSwipeGesture(
	element: HTMLElement,
	handlers: SwipeGestureHandlers = {}
) {
	const detector = new SwipeGestureHandler(element);

	if (handlers.onSwipeLeft) {
		detector.setOnSwipeLeft(handlers.onSwipeLeft);
	}
	if (handlers.onSwipeRight) {
		detector.setOnSwipeRight(handlers.onSwipeRight);
	}

	return {
		destroy: () => {
			detector.destroy();
		},
		update: (newHandlers: SwipeGestureHandlers) => {
			if (newHandlers.onSwipeLeft) {
				detector.setOnSwipeLeft(newHandlers.onSwipeLeft);
			}
			if (newHandlers.onSwipeRight) {
				detector.setOnSwipeRight(newHandlers.onSwipeRight);
			}
		},
	};
}

/**
 * Svelte action for flick gesture detection
 * Usage: use:useFlickGesture={{ onFlickDown: handler }}
 */
export function useFlickGesture(
	element: HTMLElement,
	handlers: FlickGestureHandlers = {}
) {
	const detector = new FlickGestureHandler(element);

	if (handlers.onFlickDown) {
		detector.setOnFlickDown(handlers.onFlickDown);
	}

	return {
		destroy: () => {
			detector.destroy();
		},
		update: (newHandlers: FlickGestureHandlers) => {
			if (newHandlers.onFlickDown) {
				detector.setOnFlickDown(newHandlers.onFlickDown);
			}
		},
	};
}
