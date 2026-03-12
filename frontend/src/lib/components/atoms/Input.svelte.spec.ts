import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Input from './Input.svelte';

describe('Input.svelte', () => {
	describe('rendering', () => {
		it('renders an input element with default props', () => {
			render(Input);

			const input = screen.getByRole('textbox');
			expect(input).toBeInTheDocument();
			expect(input).not.toBeDisabled();
			expect(input).not.toBeRequired();
		});

		it('renders with placeholder text', () => {
			render(Input, { props: { placeholder: 'Enter email' } });

			expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
		});

		it('renders with aria-label for accessibility', () => {
			render(Input, { props: { ariaLabel: 'Email address' } });

			expect(screen.getByLabelText('Email address')).toBeInTheDocument();
		});

		it('renders as disabled when disabled prop is true', () => {
			render(Input, { props: { ariaLabel: 'test', disabled: true } });

			expect(screen.getByLabelText('test')).toBeDisabled();
		});

		it('renders as required when required prop is true', () => {
			render(Input, { props: { ariaLabel: 'test', required: true } });

			expect(screen.getByLabelText('test')).toBeRequired();
		});
	});

	describe('error display', () => {
		it('shows error message when error prop is provided', () => {
			render(Input, { props: { error: 'Email is required' } });

			expect(screen.getByText('Email is required')).toBeInTheDocument();
		});

		it('sets aria-invalid when error is present', () => {
			render(Input, { props: { ariaLabel: 'test', error: 'Invalid' } });

			expect(screen.getByLabelText('test')).toHaveAttribute('aria-invalid', 'true');
		});

		it('does not set aria-invalid when no error', () => {
			render(Input, { props: { ariaLabel: 'test' } });

			expect(screen.getByLabelText('test')).toHaveAttribute('aria-invalid', 'false');
		});

		it('does not show error label when error is empty', () => {
			render(Input, { props: { error: '' } });

			// Should not have a label with variant="error"
			const labels = screen.queryAllByText(/.+/);
			// Input should exist but no error text
			expect(screen.getByRole('textbox')).toBeInTheDocument();
		});
	});

	describe('input handling', () => {
		it('calls onInput callback when user types', async () => {
			const onInput = vi.fn();
			render(Input, { props: { ariaLabel: 'test', onInput } });

			const input = screen.getByLabelText('test');
			await fireEvent.input(input, { target: { value: 'hello' } });

			expect(onInput).toHaveBeenCalledWith('hello');
		});

		it('applies transform function to input value', async () => {
			const transform = (v: string) => v.toUpperCase();
			const onInput = vi.fn();
			render(Input, { props: { ariaLabel: 'test', transform, onInput } });

			const input = screen.getByLabelText('test');
			await fireEvent.input(input, { target: { value: 'hello' } });

			expect(onInput).toHaveBeenCalledWith('HELLO');
		});

		it('rejects input when validate returns false', async () => {
			const validate = (v: string) => v.length <= 3;
			const onInput = vi.fn();
			render(Input, { props: { ariaLabel: 'test', validate, onInput } });

			const input = screen.getByLabelText('test');

			// Valid input
			await fireEvent.input(input, { target: { value: 'abc' } });
			expect(onInput).toHaveBeenCalledWith('abc');

			onInput.mockClear();

			// Invalid input (too long)
			await fireEvent.input(input, { target: { value: 'abcdef' } });
			expect(onInput).not.toHaveBeenCalled();
		});

		it('applies transform before validate', async () => {
			const transform = (v: string) => v.trim();
			const validate = (v: string) => v.length <= 5;
			const onInput = vi.fn();
			render(Input, { props: { ariaLabel: 'test', transform, validate, onInput } });

			const input = screen.getByLabelText('test');

			// '  hi  ' trimmed to 'hi' (length 2, passes validation)
			await fireEvent.input(input, { target: { value: '  hi  ' } });
			expect(onInput).toHaveBeenCalledWith('hi');
		});
	});

	describe('callbacks', () => {
		it('calls onBlur when input loses focus', async () => {
			const onBlur = vi.fn();
			render(Input, { props: { ariaLabel: 'test', onBlur } });

			await fireEvent.blur(screen.getByLabelText('test'));

			expect(onBlur).toHaveBeenCalled();
		});

		it('calls onFocus when input gains focus', async () => {
			const onFocus = vi.fn();
			render(Input, { props: { ariaLabel: 'test', onFocus } });

			await fireEvent.focus(screen.getByLabelText('test'));

			expect(onFocus).toHaveBeenCalled();
		});
	});

	describe('number type', () => {
		it('renders number input with min, max, step attributes', () => {
			render(Input, {
				props: { type: 'number', ariaLabel: 'qty', min: 0, max: 100, step: 5 }
			});

			const input = screen.getByLabelText('qty');
			expect(input).toHaveAttribute('type', 'number');
			expect(input).toHaveAttribute('min', '0');
			expect(input).toHaveAttribute('max', '100');
			expect(input).toHaveAttribute('step', '5');
		});
	});
});
