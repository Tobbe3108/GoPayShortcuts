import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
	id: string;
	message: string;
	type: NotificationType;
	timeout: number;
	actionLabel?: string;
	action?: (id: string) => void;
}

function createNotificationStore() {
	const { subscribe, update } = writable<Notification[]>([]);

	function addNotification(
		message: string,
		type: NotificationType = 'info',
		timeout = 5000,
		actionLabel?: string,
		action?: (id: string) => void
	) {
		const id = crypto.randomUUID();

		update((notifications) => [
			...notifications,
			{ id, message, type, timeout, actionLabel, action }
		]);

		if (timeout > 0) {
			setTimeout(() => {
				removeNotification(id);
			}, timeout);
		}

		return id;
	}

	function removeNotification(id: string) {
		update((notifications) => notifications.filter((notification) => notification.id !== id));
	}

	return {
		subscribe,
		info: (msg: string, timeout?: number, actionLabel?: string, action?: (id: string) => void) =>
			addNotification(msg, 'info', timeout, actionLabel, action),
		success: (msg: string, timeout?: number, actionLabel?: string, action?: (id: string) => void) =>
			addNotification(msg, 'success', timeout, actionLabel, action),
		warning: (
			msg: string,
			timeout?: number,
			actionLabel?: string,
			action?: (id: string) => void
		) => {
			console.warn(msg);
			addNotification(msg, 'warning', timeout ?? 10000, actionLabel, action);
		},
		error: (msg: string, timeout?: number, actionLabel?: string, action?: (id: string) => void) => {
			console.error(msg);
			addNotification(msg, 'error', timeout ?? 15000, actionLabel, action);
		},
		remove: removeNotification
	};
}

export const notifications = createNotificationStore();
