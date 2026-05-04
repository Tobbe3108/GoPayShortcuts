import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationsService, locationsService } from './locationsService';

vi.mock('$lib/core/notifications/notificationStore', () => ({
  notifications: { error: vi.fn() }
}));

import { notifications } from '$lib/core/notifications/notificationStore';
import { apiClient } from '$lib/core/api/apiClient';

describe('LocationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns locations on success', async () => {
    vi.spyOn(apiClient, 'getLocations').mockResolvedValue([{ id: 1, name: 'HQ' }] as any);

    const res = await LocationsService.getLocations();
    expect(res).toEqual([{ id: 1, name: 'HQ' }]);
  });

  it('logs and notifies on Error and rethrows', async () => {
    const err = new Error('boom');
    vi.spyOn(apiClient, 'getLocations').mockResolvedValue(err as any);

    await expect(LocationsService.getLocations()).rejects.toBe(err);
    expect((notifications as any).error).toHaveBeenCalled();
  });
});
