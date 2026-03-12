import { render, fireEvent, cleanup } from '@testing-library/svelte';
import { describe, it, expect, afterEach } from 'vitest';
import Component from '../../src/lib/components/Component.svelte';

afterEach(() => cleanup());

describe('Component (template)', () => {
  it('renders with provided props and reacts to click', async () => {
    const { getByText } = render(Component, { props: { label: 'Hello' } });
    const btn = getByText('Hello');
    await fireEvent.click(btn);
    expect(getByText('Clicked')).toBeTruthy();
  });
});
