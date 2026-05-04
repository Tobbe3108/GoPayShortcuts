import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
// Use a wrapper component to pass slot content in tests
import Wrapper from '../../../../test/fixtures/ButtonWrapper.svelte';

describe('Button component', () => {
  it('renders slot content', () => {
    render(Wrapper, { props: { text: 'Press me' } });
    expect(screen.getByText(/Press me/i)).toBeInTheDocument();
  });

  it('calls onclick when clicked and respects disabled state', async () => {
    const onClick = vi.fn();

    const user = userEvent.setup();
    render(Wrapper, { props: { text: 'Click', onclick: onClick } });
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();

    cleanup();

    render(Wrapper, { props: { text: 'Click', onclick: onClick, disabled: true } });
    const disabledBtn = screen.getByRole('button');
    expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
    expect(disabledBtn).toHaveAttribute('tabindex', '-1');
  });
});
