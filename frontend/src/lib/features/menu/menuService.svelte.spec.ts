import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MenuService } from './menuService';

const mockGetMenu = vi.fn();
vi.mock('$lib/core/api/apiClient', () => ({
  apiClient: { getMenu: (...args: any[]) => mockGetMenu(...args) },
}));

const mockNotifyError = vi.fn();
vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: (...args: any[]) => mockNotifyError(...args) },
}));

describe('MenuService', () => {
  beforeEach(() => {
    mockGetMenu.mockReset();
    mockNotifyError.mockReset();
  });

  it('returns menu on success', async () => {
    const fake = [{ date: '2026-03-12', items: [] }];
    mockGetMenu.mockResolvedValue(fake);

    const out = await MenuService.getMenu();
    expect(out).toEqual(fake);
  });

  it('throws and notifies on Error', async () => {
    mockGetMenu.mockResolvedValue(new Error('bad'));

    await expect(MenuService.getMenu()).rejects.toBeInstanceOf(Error);
    expect(mockNotifyError).toHaveBeenCalled();
  });
});
