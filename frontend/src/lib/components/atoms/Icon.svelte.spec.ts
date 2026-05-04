import { render } from '@testing-library/svelte';
import Icon from './Icon.svelte';
import { describe, it, expect } from 'vitest';

describe('Icon.svelte', () => {
  it('renders an svg for known icon name', () => {
    const { container } = render(Icon, { props: { name: 'edit', ariaLabel: 'edit' } });
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(container.querySelector('[aria-label="edit"]')).toBeTruthy();
  });

  it('renders right chevron for right name', () => {
    const { container } = render(Icon, { props: { name: 'right', ariaLabel: 'right' } });
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
