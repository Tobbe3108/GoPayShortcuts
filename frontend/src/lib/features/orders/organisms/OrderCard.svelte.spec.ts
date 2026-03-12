import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';

// Mock dependencies used by OrderCard
const mockedLocations = [{ kitchenId: 1, id: 1, name: 'HQ' }];
vi.mock('$lib/features/locations/locationsService', () => ({
  locationsService: { getLocations: vi.fn() }
}));

// Mock productsService to avoid real network fetches triggered by OrderEditor
vi.mock('$lib/features/products/productsService', () => ({
  productsService: { getProducts: vi.fn().mockResolvedValue([]) }
}));

// Also mock the low-level apiClient used by services to ensure no real fetch
// runs if any service delegates directly to apiClient during mount.
vi.mock('$lib/core/api/apiClient', () => ({
  apiClient: {
    getProducts: vi.fn().mockResolvedValue([]),
    getLocations: vi.fn().mockResolvedValue([]),
    getMenu: vi.fn().mockResolvedValue([]),
    request: vi.fn().mockResolvedValue({})
  }
}));

// also mock the relative path import used by the component to be robust
vi.mock('../../locations/locationsService', () => ({
  locationsService: { getLocations: vi.fn() }
}));

vi.mock('$lib/features/orders/defaultStore', () => ({
  default: {
    getTemplateForDateAndKitchen: vi.fn(),
    getPreferredForWeekday: vi.fn(),
    createTemplate: vi.fn(),
    setPreferredForWeekday: vi.fn(),
    updateTemplate: vi.fn()
  },
  templatesSignal: { subscribe: vi.fn((cb: any) => {
    // do not invoke callback now; return unsubscribe fn
    return () => {};
  }) }
}));

vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: vi.fn(), success: vi.fn(), info: vi.fn() }
}));

vi.mock('$lib/features/orders/ordersService', () => ({
  ordersService: { updateDay: vi.fn().mockResolvedValue([]), listOrders: vi.fn().mockResolvedValue([]) }
}));

import OrderCard from './OrderCard.svelte';

describe('OrderCard component', () => {
  beforeEach(() => {
    // ensure any accidental network calls are blocked in setup, so stub fetch
    // here to a safe no-op response for this spec
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    // Clear call history but keep module mocks defined by top-level vi.mock
    vi.clearAllMocks();

    // clear localStorage entries used by the component to avoid cross-test leakage
    localStorage.removeItem('app.preferredByWeekday');
    localStorage.removeItem('app.defaultTemplates');
  });

  // Ensure the mocked modules expose the method implementations expected
  // by the component. Use a small helper to set the resolved value for both
  // import paths the component may use.
  async function ensureLocationMock() {
    const { locationsService } = await import('$lib/features/locations/locationsService');
    if (locationsService && typeof locationsService.getLocations === 'function') {
      locationsService.getLocations = vi.fn().mockResolvedValue(mockedLocations);
    }
    // relative path used in component
    const rel = await import('../../locations/locationsService');
    if (rel && rel.locationsService && typeof rel.locationsService.getLocations === 'function') {
      rel.locationsService.getLocations = vi.fn().mockResolvedValue(mockedLocations);
    }
  }

  it('renders kitchen name after loading locations', async () => {
    const order = { date: '2026-03-12', kitchenId: 1, orderlines: [], cancelEnabled: true } as any;

    // ensure mocks are wired
    await ensureLocationMock();

    render(OrderCard, { props: { order, isEditing: false } });

    // kitchen name (HQ) comes from mocked locationsService.getLocations
    expect(await screen.findByText('HQ')).toBeInTheDocument();
  });
});
