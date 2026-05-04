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

import EditModeControls from './EditModeControls.svelte';

// Helper: both Button and Icon share the same aria-label, so use getByRole('button')
// to target the interactive element specifically.
function getButton(name: string) {
	return screen.getByRole('button', { name });
}

function queryButton(name: string) {
	return screen.queryByRole('button', { name });
}

describe('EditModeControls.svelte', () => {
	describe('locked state', () => {
		it('shows lock icon when locked and not appendOnly', () => {
			const { container } = render(EditModeControls, { props: { locked: true } });

			// Icon renders a <span role="img" aria-label="Locked">
			const lockIcon = container.querySelector('[aria-label="Locked"][role="img"]');
			expect(lockIcon).toBeTruthy();
		});

		it('does not show lock icon when locked and appendOnly', () => {
			const { container } = render(EditModeControls, {
				props: { locked: true, appendOnly: true }
			});

			const lockIcon = container.querySelector('[aria-label="Locked"][role="img"]');
			expect(lockIcon).toBeNull();
		});
	});

	describe('view mode (not editing)', () => {
		it('shows edit button when not locked and not editing', () => {
			render(EditModeControls, { props: {} });

			expect(getButton('Edit')).toBeInTheDocument();
		});

		it('calls onEdit and enters edit mode when edit button is clicked', async () => {
			const onEdit = vi.fn();
			render(EditModeControls, { props: { onEdit } });

			await fireEvent.click(getButton('Edit'));

			expect(onEdit).toHaveBeenCalled();
			// After clicking edit, save and cancel should appear
			expect(getButton('Save')).toBeInTheDocument();
			expect(getButton('Cancel')).toBeInTheDocument();
		});
	});

	describe('edit mode', () => {
		it('shows save and cancel buttons when in edit mode', () => {
			render(EditModeControls, { props: { isEditing: true } });

			expect(getButton('Save')).toBeInTheDocument();
			expect(getButton('Cancel')).toBeInTheDocument();
		});

		it('shows delete button when showDelete is true', () => {
			render(EditModeControls, { props: { isEditing: true, showDelete: true } });

			expect(getButton('Delete')).toBeInTheDocument();
		});

		it('hides delete button when showDelete is false', () => {
			render(EditModeControls, { props: { isEditing: true, showDelete: false } });

			expect(queryButton('Delete')).not.toBeInTheDocument();
		});

		it('hides delete button when appendOnly is true', () => {
			render(EditModeControls, {
				props: { isEditing: true, showDelete: true, appendOnly: true }
			});

			expect(queryButton('Delete')).not.toBeInTheDocument();
		});

		it('calls onSave and exits edit mode when save is clicked', async () => {
			const onSave = vi.fn();
			render(EditModeControls, { props: { isEditing: true, onSave } });

			await fireEvent.click(getButton('Save'));

			expect(onSave).toHaveBeenCalled();
			// Should exit edit mode -> edit button reappears
			expect(getButton('Edit')).toBeInTheDocument();
		});

		it('calls onCancel and exits edit mode when cancel is clicked', async () => {
			const onCancel = vi.fn();
			render(EditModeControls, { props: { isEditing: true, onCancel } });

			await fireEvent.click(getButton('Cancel'));

			expect(onCancel).toHaveBeenCalled();
			expect(getButton('Edit')).toBeInTheDocument();
		});

		it('calls onDelete and exits edit mode when delete is clicked', async () => {
			const onDelete = vi.fn();
			render(EditModeControls, { props: { isEditing: true, onDelete } });

			await fireEvent.click(getButton('Delete'));

			expect(onDelete).toHaveBeenCalled();
			expect(getButton('Edit')).toBeInTheDocument();
		});
	});

	describe('default toggle', () => {
		it('shows default toggle button when showDefaultToggle is true and editing', () => {
			render(EditModeControls, {
				props: { isEditing: true, showDefaultToggle: true }
			});

			expect(getButton('Toggle default')).toBeInTheDocument();
		});

		it('does not show default toggle when showDefaultToggle is false', () => {
			render(EditModeControls, {
				props: { isEditing: true, showDefaultToggle: false }
			});

			expect(queryButton('Toggle default')).not.toBeInTheDocument();
		});

		it('calls onToggleDefault without exiting edit mode', async () => {
			const onToggleDefault = vi.fn();
			render(EditModeControls, {
				props: { isEditing: true, showDefaultToggle: true, onToggleDefault }
			});

			await fireEvent.click(getButton('Toggle default'));

			expect(onToggleDefault).toHaveBeenCalled();
			// Should still be in edit mode
			expect(getButton('Save')).toBeInTheDocument();
			expect(getButton('Cancel')).toBeInTheDocument();
		});
	});

	describe('disabled state', () => {
		it('disables edit button when disabled prop is true', () => {
			render(EditModeControls, { props: { disabled: true } });

			const editBtn = getButton('Edit');
			expect(editBtn).toHaveAttribute('aria-disabled', 'true');
		});
	});
});
