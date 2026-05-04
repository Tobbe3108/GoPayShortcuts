import { render, fireEvent } from '@testing-library/svelte';
import Quantity from './Quantity.svelte';
import { describe, it, expect } from 'vitest';

describe('Quantity.svelte', () => {
  it('calls onChange when increment and decrement buttons clicked', async () => {
    const handle = vi.fn();
    const { getByRole } = render(Quantity, { props: { value: 2, min: 1, max: 5, onChange: handle } });

    const inc = getByRole('button', { name: 'Increment' });
    const dec = getByRole('button', { name: 'Decrement' });

    await fireEvent.click(inc);
    expect(handle).toHaveBeenCalledWith(3);

    await fireEvent.click(dec);
    // second call should have been made with decremented value
    expect(handle).toHaveBeenCalledWith(1);
  });

  it('does not call onChange when disabled or at bounds', async () => {
    const handle = vi.fn();
    const { getByRole } = render(Quantity, { props: { value: 0, min: 0, max: 2, onChange: handle, disabled: true } });
    const inc = getByRole('button', { name: 'Increment' });
    await fireEvent.click(inc);
    expect(handle).not.toHaveBeenCalled();
  });
});
