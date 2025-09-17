import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout: number;
}

function createNotificationStore() {
  const { subscribe, update } = writable<Notification[]>([]);

  function addNotification(message: string, type: NotificationType = 'info', timeout = 5000) {
    const id = crypto.randomUUID();
    
    update(notifications => [
      ...notifications,
      { id, message, type, timeout }
    ]);

    if (timeout > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, timeout);
    }
    
    return id;
  }

  function removeNotification(id: string) {
    update(notifications => notifications.filter(notification => notification.id !== id));
  }

  return {
    subscribe,
    info: (msg: string, timeout?: number) => addNotification(msg, 'info', timeout),
    success: (msg: string, timeout?: number) => addNotification(msg, 'success', timeout),
    warning: (msg: string, timeout?: number) => { console.warn(msg); addNotification(msg, 'warning', timeout ?? 10000); },
    error: (msg: string, timeout?: number) => { console.error(msg); addNotification(msg, 'error', timeout ?? 15000); },
    remove: removeNotification
  };
}

export const notifications = createNotificationStore();
