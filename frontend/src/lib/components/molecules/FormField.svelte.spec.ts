import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import FormField from './FormField.svelte';

describe('FormField.svelte', () => {
	it('renders a label and input', () => {
		render(FormField, {
			props: { id: 'email', label: 'Email Address', placeholder: 'you@example.com' }
		});

		expect(screen.getByText('Email Address')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
	});

	it('associates label with input via forId', () => {
		render(FormField, { props: { id: 'email', label: 'Email' } });

		// The label's for attribute should match the input's id
		const label = screen.getByText('Email');
		expect(label).toHaveAttribute('for', 'email');

		const input = document.getElementById('email');
		expect(input).toBeInTheDocument();
		expect(input?.tagName.toLowerCase()).toBe('input');
	});

	it('passes disabled prop through to input', () => {
		render(FormField, {
			props: { id: 'field', label: 'Field', disabled: true }
		});

		const input = document.getElementById('field') as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it('passes required prop through to input', () => {
		render(FormField, {
			props: { id: 'field', label: 'Field', required: true }
		});

		const input = document.getElementById('field') as HTMLInputElement;
		expect(input.required).toBe(true);
	});

	it('calls onInput callback when user types', async () => {
		const onInput = vi.fn();
		render(FormField, {
			props: { id: 'field', label: 'Field', onInput }
		});

		const input = document.getElementById('field')!;
		await fireEvent.input(input, { target: { value: 'test' } });

		expect(onInput).toHaveBeenCalled();
	});

	it('applies transform function to input', async () => {
		const transform = (v: string) => v.toUpperCase();
		const onInput = vi.fn();
		render(FormField, {
			props: { id: 'field', label: 'Field', transform, onInput }
		});

		const input = document.getElementById('field')!;
		await fireEvent.input(input, { target: { value: 'hello' } });

		expect(onInput).toHaveBeenCalledWith('HELLO');
	});
});
