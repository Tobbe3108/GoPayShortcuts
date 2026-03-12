import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

// Mock menuService and navigationStore
vi.mock('$lib/features/menu/menuService', () => ({
  menuService: { getMenu: vi.fn() }
}));

// Mock productsService to prevent any nested components from calling
// the real ApiClient via productsService.getProducts during mount/click
vi.mock('$lib/features/products/productsService', () => ({
  productsService: { getProducts: vi.fn().mockResolvedValue([]) }
}));

vi.mock('$lib/features/navigation/store', async (importOriginal) => {
  // partially use svelte/store readable to return the expected shape
  const { readable } = await import('svelte/store');
  const toggleMenu = vi.fn();
  return {
    navigationStore: {
      isCollapsed: (date: Date) => readable(false),
      toggleMenu
    },
    __spies: { toggleMenu }
  };
});

import TodaysMenu from './TodaysMenu.svelte';
import { menuService } from '$lib/features/menu/menuService';
import { navigationStore } from '$lib/features/navigation/store';

describe('TodaysMenu component', () => {
  beforeEach(async () => {
    // clear only call history and timers; keep top-level module mocks intact
    vi.clearAllMocks();
    // import mocked navigation store spies
    const mocked = await vi.importMock('$lib/features/navigation/store');
    // replace exported navigationStore reference with the mocked one
    // so assertions use the actual spy
    (global as any).navigationStoreMock = mocked.__spies;
  });

  it('renders menu items for today and opens toggle on click', async () => {
    const date = new Date('2026-03-12');
    (menuService.getMenu as any).mockResolvedValue([
      {
        date: '2026-03-12',
        items: [
          {
            item: 'Pizza',
            category: 'Hot',
            subItems: ['Cheese'],
            allergens: ['Gluten']
          }
        ]
      }
    ]);

  render(TodaysMenu, { props: { date } });

  // Menu item should appear
  expect(await screen.findByText('Pizza')).toBeInTheDocument();

  // Clicking the header should call toggleMenu
  const user = userEvent.setup();
    // More specific query to avoid ambiguous role matches in the DOM
    // The header button uses the i18n key 'menu.today' as its accessible
    // name in tests (svelte-i18n mock returns the key), so target that.
    const btn = screen.getByRole('button', { name: /menu.today/i });
    await user.click(btn);
    const mocked = await vi.importMock('$lib/features/navigation/store');
    expect(mocked.__spies.toggleMenu).toHaveBeenCalled();
  });
});
