import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

vi.mock('$lib/features/products/productsService', () => ({
  productsService: { getProducts: vi.fn() }
}));

import OrderEditor from './OrderEditor.svelte';
import { productsService } from '$lib/features/products/productsService';

describe('OrderEditor component', () => {
  beforeEach(() => {
    // do not reset top-level mocks created with vi.mock (they are hoisted)
    vi.clearAllMocks();
    // default mock products
    (productsService.getProducts as any).mockResolvedValue([
      { id: 1, name: 'Burger', price: 20 },
      { id: 2, name: 'Gæst - Guest', price: 30 }
    ]);
  });

  it('renders products and calls onOrderChange when quantity incremented', async () => {
    const order = { date: '2026-03-12', kitchenId: 1, orderlines: [{ productId: 1, quantity: 1, price: 20 }], cancelEnabled: false } as any;
    const onOrderChange = vi.fn();

    render(OrderEditor, { props: { order, editMode: true, onOrderChange } });

    // Wait for product to render
    const prod = await screen.findByText('Burger');
    expect(prod).toBeInTheDocument();

    // Find the row container and click the increment button
    const row = prod.closest('div');
    expect(row).toBeTruthy();
    const buttons = row!.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);

    const user = userEvent.setup();
    // Increment is typically the last button in the row
    await user.click(buttons[buttons.length - 1]);

    expect(onOrderChange).toHaveBeenCalled();
    const arg = (onOrderChange as any).mock.calls[0][0];
    const changed = arg.orderlines.find((l: any) => l.productId === 1);
    expect(changed.quantity).toBeGreaterThanOrEqual(2);
  });
});
