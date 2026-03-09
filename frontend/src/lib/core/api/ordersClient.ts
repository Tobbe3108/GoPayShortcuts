import { apiClient } from './apiClient';
import { format } from 'date-fns';

// Frontend helper that calls the new backend endpoints
export async function fetchOrderIdsForPeriod(startDate: Date, endDate: Date) {
  return await apiClient.request<{ orders: { id: number }[] }>(
    `/orders/period?start=${format(startDate, 'yyyy-MM-dd')}&end=${format(
      endDate,
      'yyyy-MM-dd'
    )}`,
    'GET'
  );
}

export async function fetchOrderDetailsChunk(orderIds: number[]) {
  return await apiClient.request<{ orders: any[] }>(`/orders`, 'POST', {
    orderIds,
  });
}
