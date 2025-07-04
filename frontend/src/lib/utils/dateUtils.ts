export const DANISH_LOCALE = 'da-DK';

// For API date formatting (YYYY-MM-DD)
export const API_DATE_LOCALE = 'sv-SE'; // Swedish locale gives ISO format dates

export const formatDateOptions = {
  weekday: {
    long: { weekday: 'long' } as Intl.DateTimeFormatOptions,
    short: { weekday: 'short' } as Intl.DateTimeFormatOptions
  },
  date: {
    short: { month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions,
    medium: { year: 'numeric', month: 'short', day: 'numeric' } as Intl.DateTimeFormatOptions
  },
  api: { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions
};

export function formatDay(date: Date): string {
    const day = date.toLocaleDateString(DANISH_LOCALE, formatDateOptions.weekday.long)
    return day.charAt(0).toUpperCase() + day.slice(1)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString(DANISH_LOCALE, formatDateOptions.date.short);
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

/**
 * Creates a date object set to noon on the specified date to avoid timezone issues
 * when converting to ISO string for API calls
 */
export function createOrderDate(date: Date): Date {
  const orderDate = new Date(date);
  orderDate.setHours(12, 0, 0, 0);
  return orderDate;
}

/**
 * Formats a date for API calls in YYYY-MM-DD format
 */
export function formatDateForApi(date: Date): string {
  const formatter = new Intl.DateTimeFormat(API_DATE_LOCALE, formatDateOptions.api);
  return formatter.format(date).replace(/\//g, '-');
}

/**
 * Formats a date in the exact format required by the API: YYYY-MM-DDT00:00:00.000+02:00
 */
export function formatISODateWithOffset(date: Date): string {
  // Get the date part in YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Use fixed time of 00:00:00.000 as required
  const timePart = "00:00:00.000";
  
  // Use fixed Danish timezone offset +02:00
  const offset = "+02:00";
  
  return `${year}-${month}-${day}T${timePart}${offset}`;
}

/**
 * Checks if a date is in the past (before today)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  
  return compareDate < today;
}

/**
 * Determines if ordering a specific item type is allowed based on the time and date
 */
export function isOrderTimeAllowed(itemType: 'breakfast' | 'lunch' | 'soda', date: Date): boolean {
  if (itemType === 'soda') return true;
  if (isPastDate(date)) return false;

  // If ordering for a future day, allow it regardless of current time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orderDate = new Date(date);
  orderDate.setHours(0, 0, 0, 0);

  // Allow ordering for future days regardless of current time
  if (orderDate > today) return true;

  // For same-day orders, apply time restrictions
  const hour = new Date().getHours();
  if (itemType === 'breakfast') return hour < 10;
  if (itemType === 'lunch') return hour < 13;
  return true;
}
