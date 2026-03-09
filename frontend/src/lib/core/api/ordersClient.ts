import { apiClient } from './apiClient';
import { format } from 'date-fns';

// Frontend helper that calls the new backend endpoints
export async function fetchOrderIdsForPeriod(startDate: Date, endDate: Date) {
  return await apiClient.fetchOrderIdsForPeriod(startDate, endDate);
}

export async function fetchOrderDetailsChunk(orderIds: number[]) {
  return await apiClient.request<{ orders: any[] }>(`/orders`, 'POST', {
    orderIds,
  });
}
