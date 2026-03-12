import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';

// Mock lucide-svelte to avoid hanging in jsdom.
// Each icon export needs to be a minimal Svelte component constructor.
function makeMockIcon() {
	// Return a function that Svelte can call as a component
	return function MockIcon() {};
}

vi.mock('lucide-svelte', () => ({
	Pencil: makeMockIcon(),
	Trash2: makeMockIcon(),
	Lock: makeMockIcon(),
	Plus: makeMockIcon(),
	Minus: makeMockIcon(),
	Check: makeMockIcon(),
	Star: makeMockIcon(),
	X: makeMockIcon(),
	ChevronUp: makeMockIcon(),
	ChevronDown: makeMockIcon(),
	ChevronLeft: makeMockIcon(),
	ChevronRight: makeMockIcon()
}));

import DayNavigator from './DayNavigator.svelte';

describe('DayNavigator.svelte', () => {
	it('renders previous and next navigation buttons', () => {
		const date = new Date(2025, 0, 15); // Wednesday
		render(DayNavigator, { props: { date } });

		// svelte-i18n mock returns key as-is
		expect(screen.getByLabelText('navigation.day.previous')).toBeInTheDocument();
		expect(screen.getByLabelText('navigation.day.next')).toBeInTheDocument();
	});

	it('renders the current day header', () => {
		const date = new Date(2025, 0, 15); // Wednesday
		render(DayNavigator, { props: { date } });

		expect(screen.getByText('Wednesday')).toBeInTheDocument();
	});

	it('calls onDayChange with previous weekday when clicking previous from Monday', async () => {
		const onDayChange = vi.fn();
		// Monday, January 13, 2025
		const date = new Date(2025, 0, 13);
		render(DayNavigator, { props: { date, onDayChange } });

		await fireEvent.click(screen.getByLabelText('navigation.day.previous'));

		// Previous day from Monday should skip weekend -> Friday (Jan 10)
		const newDate = onDayChange.mock.calls[0][0] as Date;
		expect(newDate.getDay()).toBe(5); // Friday
		expect(newDate.getDate()).toBe(10);
	});

	it('calls onDayChange with next weekday when clicking next from Friday', async () => {
		const onDayChange = vi.fn();
		// Friday, January 17, 2025
		const date = new Date(2025, 0, 17);
		render(DayNavigator, { props: { date, onDayChange } });

		await fireEvent.click(screen.getByLabelText('navigation.day.next'));

		// Next day from Friday should skip weekend -> Monday (Jan 20)
		const newDate = onDayChange.mock.calls[0][0] as Date;
		expect(newDate.getDay()).toBe(1); // Monday
		expect(newDate.getDate()).toBe(20);
	});

	it('goes to adjacent weekday when not at weekend boundary', async () => {
		const onDayChange = vi.fn();
		// Wednesday, January 15, 2025
		const date = new Date(2025, 0, 15);
		render(DayNavigator, { props: { date, onDayChange } });

		await fireEvent.click(screen.getByLabelText('navigation.day.next'));

		const newDate = onDayChange.mock.calls[0][0] as Date;
		expect(newDate.getDay()).toBe(4); // Thursday
		expect(newDate.getDate()).toBe(16);
	});

	it('does not throw when onDayChange is not provided', async () => {
		const date = new Date(2025, 0, 15);
		render(DayNavigator, { props: { date } });

		// Should not throw
		await fireEvent.click(screen.getByLabelText('navigation.day.next'));
	});
});
