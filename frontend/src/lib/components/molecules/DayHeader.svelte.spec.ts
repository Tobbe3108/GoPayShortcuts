import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DayHeader from './DayHeader.svelte';

// svelte-i18n is mocked in setup.ts (locale='en')

describe('DayHeader.svelte', () => {
	it('renders the day name for a given date', () => {
		// Wednesday, January 15, 2025
		const date = new Date(2025, 0, 15);
		render(DayHeader, { props: { date } });

		expect(screen.getByText('Wednesday')).toBeInTheDocument();
	});

	it('renders the date string for a given date', () => {
		// January 15, 2025 → "15. January" in en locale
		const date = new Date(2025, 0, 15);
		render(DayHeader, { props: { date } });

		expect(screen.getByText('15. January')).toBeInTheDocument();
	});

	it('renders correctly for a different date', () => {
		// Friday, March 7, 2025
		const date = new Date(2025, 2, 7);
		render(DayHeader, { props: { date } });

		expect(screen.getByText('Friday')).toBeInTheDocument();
		expect(screen.getByText('7. March')).toBeInTheDocument();
	});

	it('applies font-semibold class when date is today', () => {
		const today = new Date();
		const { container } = render(DayHeader, { props: { date: today } });

		// The day name label should have font-semibold
		const labels = container.querySelectorAll('label');
		const dayLabel = labels[0]; // first label is the day name
		expect(dayLabel.className).toContain('font-semibold');
	});

	it('does not apply font-semibold class for non-today date', () => {
		// A date far in the past
		const date = new Date(2020, 0, 1);
		const { container } = render(DayHeader, { props: { date } });

		const labels = container.querySelectorAll('label');
		const dayLabel = labels[0];
		expect(dayLabel.className).not.toContain('font-semibold');
	});
});
