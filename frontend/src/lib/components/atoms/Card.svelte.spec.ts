import { render } from '@testing-library/svelte';
import CardHost from './CardHost.svelte';
import { describe, it, expect } from 'vitest';

describe('Card.svelte', () => {
  it('renders slot content and respects muted prop', () => {
    const { getByText, container } = render(CardHost, { props: { muted: true, className: 'my-class' } });
    expect(getByText('Inner')).toBeTruthy();
    const div = container.querySelector('div');
    // aria-disabled when muted should be present
    expect(div).toHaveAttribute('aria-disabled', 'true');
  });
});
