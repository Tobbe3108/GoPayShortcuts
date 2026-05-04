import { render, fireEvent } from '@testing-library/svelte';
import Select from './Select.svelte';
import { describe, it, expect } from 'vitest';

describe('Select.svelte', () => {
  it('renders options and calls onChange', async () => {
    const opt = [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }];
    const handle = vi.fn();
    const { getByLabelText } = render(Select, { props: { label: 'L', options: opt, selectedId: 1, onChange: handle } });
    const sel = getByLabelText('L') as HTMLSelectElement;
    await fireEvent.change(sel, { target: { value: '2' } });
    expect(handle).toHaveBeenCalledWith('2');
  });
});
