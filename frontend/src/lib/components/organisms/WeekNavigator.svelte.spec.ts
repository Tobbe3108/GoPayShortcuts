import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

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

import WeekNavigator from './WeekNavigator.svelte';

describe('WeekNavigator.svelte', () => {
	it('renders week prefix and navigation buttons', () => {
		// Wednesday, January 15, 2025
		const date = new Date(2025, 0, 15);
		render(WeekNavigator, { props: { date } });

		// Week prefix from svelte-i18n mock returns key
		expect(screen.getByText(/navigation\.week\.weekPrefix/)).toBeInTheDocument();
		expect(screen.getByLabelText('navigation.week.previous')).toBeInTheDocument();
		expect(screen.getByLabelText('navigation.week.next')).toBeInTheDocument();
	});

	it('calls onWeekChange with previous week start when clicking previous', async () => {
		const onWeekChange = vi.fn();
		// Wednesday, January 15, 2025 -> week starts Monday Jan 13
		const date = new Date(2025, 0, 15);
		render(WeekNavigator, { props: { date, onWeekChange } });

		await fireEvent.click(screen.getByLabelText('navigation.week.previous'));

		const newDate = onWeekChange.mock.calls[0][0] as Date;
		// Previous week start: Monday Jan 6
		expect(newDate.getDay()).toBe(1); // Monday
		expect(newDate.getDate()).toBe(6);
		expect(newDate.getMonth()).toBe(0); // January
	});

	it('calls onWeekChange with next week start when clicking next', async () => {
		const onWeekChange = vi.fn();
		// Wednesday, January 15, 2025 -> week starts Monday Jan 13
		const date = new Date(2025, 0, 15);
		render(WeekNavigator, { props: { date, onWeekChange } });

		await fireEvent.click(screen.getByLabelText('navigation.week.next'));

		const newDate = onWeekChange.mock.calls[0][0] as Date;
		// Next week start: Monday Jan 20
		expect(newDate.getDay()).toBe(1); // Monday
		expect(newDate.getDate()).toBe(20);
		expect(newDate.getMonth()).toBe(0); // January
	});

	it('does not throw when onWeekChange is not provided', async () => {
		const date = new Date(2025, 0, 15);
		render(WeekNavigator, { props: { date } });

		await fireEvent.click(screen.getByLabelText('navigation.week.next'));
	});
});
