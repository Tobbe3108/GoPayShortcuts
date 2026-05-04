import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import type { Notification } from '../notificationStore';

// Mock lucide-svelte to prevent jsdom hanging (Icon.svelte imports these)
vi.mock('lucide-svelte', () => {
	const MockIcon = () => {};
	return {
		Pencil: MockIcon, Trash2: MockIcon, Lock: MockIcon,
		Plus: MockIcon, Minus: MockIcon, Check: MockIcon,
		Star: MockIcon, X: MockIcon, ChevronUp: MockIcon,
		ChevronDown: MockIcon, ChevronLeft: MockIcon, ChevronRight: MockIcon
	};
});

import NotificationItem from './NotificationItem.svelte';

function createNotification(overrides: Partial<Notification> = {}): Notification {
	return {
		id: 'notif-1',
		message: 'Something happened',
		type: 'info',
		timeout: 2500,
		...overrides
	};
}

describe('NotificationItem.svelte', () => {
	it('renders notification message', () => {
		const notification = createNotification({ message: 'File saved successfully' });
		render(NotificationItem, { props: { notification, onClose: vi.fn() } });

		expect(screen.getByText('File saved successfully')).toBeInTheDocument();
	});

	it('calls onClose with notification id when close button is clicked', async () => {
		const onClose = vi.fn();
		const notification = createNotification({ id: 'test-123' });
		render(NotificationItem, { props: { notification, onClose } });

		// svelte-i18n mock returns key as-is
		await fireEvent.click(screen.getByLabelText('notifications.close'));

		expect(onClose).toHaveBeenCalledWith('test-123');
	});

	it('renders action button when notification has an action', () => {
		const notification = createNotification({
			action: vi.fn(),
			actionLabel: 'Undo'
		});
		render(NotificationItem, { props: { notification, onClose: vi.fn() } });

		// The action button has aria-label="Undo", use getByRole to disambiguate
		// from the duplicate text spans (sr-only + aria-hidden)
		expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
	});

	it('calls action and onClose when action button is clicked', async () => {
		const action = vi.fn();
		const onClose = vi.fn();
		const notification = createNotification({
			id: 'notif-action',
			action,
			actionLabel: 'Undo'
		});
		render(NotificationItem, { props: { notification, onClose } });

		await fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

		expect(action).toHaveBeenCalledWith('notif-action');
		expect(onClose).toHaveBeenCalledWith('notif-action');
	});

	it('does not render action button when notification has no action', () => {
		const notification = createNotification({ action: undefined });
		render(NotificationItem, { props: { notification, onClose: vi.fn() } });

		expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
	});

	it('applies success styling for success notifications', () => {
		const notification = createNotification({ type: 'success' });
		const { container } = render(NotificationItem, {
			props: { notification, onClose: vi.fn() }
		});

		const div = container.firstElementChild as HTMLElement;
		expect(div.classList.contains('bg-green-100')).toBe(true);
	});

	it('applies error styling for error notifications', () => {
		const notification = createNotification({ type: 'error' });
		const { container } = render(NotificationItem, {
			props: { notification, onClose: vi.fn() }
		});

		const div = container.firstElementChild as HTMLElement;
		expect(div.classList.contains('bg-red-100')).toBe(true);
	});

	it('applies warning styling for warning notifications', () => {
		const notification = createNotification({ type: 'warning' });
		const { container } = render(NotificationItem, {
			props: { notification, onClose: vi.fn() }
		});

		const div = container.firstElementChild as HTMLElement;
		expect(div.classList.contains('bg-yellow-100')).toBe(true);
	});

	it('applies info styling for info notifications', () => {
		const notification = createNotification({ type: 'info' });
		const { container } = render(NotificationItem, {
			props: { notification, onClose: vi.fn() }
		});

		const div = container.firstElementChild as HTMLElement;
		expect(div.classList.contains('bg-muted')).toBe(true);
	});
});
