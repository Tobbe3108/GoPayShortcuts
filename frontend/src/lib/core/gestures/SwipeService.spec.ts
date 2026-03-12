import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SwipeService } from './SwipeService';
import { swipeStore } from './swipeStore';

vi.mock('$lib/features/navigation/store', () => {
  const nextDay = vi.fn();
  const prevDay = vi.fn();
  return { navigationStore: { nextDay, prevDay } };
});

vi.mock('$lib/core/responsive/isMobile', () => ({ isMobile: vi.fn(() => true) }));

// Access mocked modules lazily inside tests to avoid hoisting/order issues
let navigationStore: any;
beforeEach(async () => {
  const mocked = await vi.importMock('$lib/features/navigation/store');
  navigationStore = mocked.navigationStore;
});

describe('SwipeService', () => {
  beforeEach(() => {
    // Clear call history but preserve hoisted top-level mocks
    vi.clearAllMocks();
    navigationStore.nextDay.mockReset?.();
    navigationStore.prevDay.mockReset?.();
  });

  it('handles left swipe by calling nextDay when mobile', async () => {
    // configure isMobile mock for this test
    const mod = await vi.importMock('$lib/core/responsive/isMobile');
    (mod.isMobile as unknown as vi.Mock).mockReturnValue(true);
    const svc = SwipeService.getInstance();
    svc.enableSwipeNavigation();
    swipeStore.handleSwipe({ detail: { direction: 'left' } } as any);
    expect(navigationStore.nextDay).toHaveBeenCalled();
  });

  it('handles right swipe by calling prevDay when mobile', async () => {
    const mod = await vi.importMock('$lib/core/responsive/isMobile');
    (mod.isMobile as unknown as vi.Mock).mockReturnValue(true);
    const svc = SwipeService.getInstance();
    svc.enableSwipeNavigation();
    swipeStore.handleSwipe({ detail: { direction: 'right' } } as any);
    expect(navigationStore.prevDay).toHaveBeenCalled();
  });

  it('does nothing when not mobile', async () => {
    const mod = await vi.importMock('$lib/core/responsive/isMobile');
    (mod.isMobile as unknown as vi.Mock).mockReturnValue(false);
    const svc = SwipeService.getInstance();
    svc.enableSwipeNavigation();
    swipeStore.handleSwipe({ detail: { direction: 'left' } } as any);
    expect(navigationStore.nextDay).not.toHaveBeenCalled();
  });
});
