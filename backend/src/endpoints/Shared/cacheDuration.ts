const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const cacheDuration = {
  seconds(value: number): number {
    return value * SECOND;
  },
  minutes(value: number): number {
    return value * MINUTE;
  },
  hours(value: number): number {
    return value * HOUR;
  },
  days(value: number): number {
    return value * DAY;
  },
} as const;

export function seconds(value: number): number {
  return cacheDuration.seconds(value);
}

export function minutes(value: number): number {
  return cacheDuration.minutes(value);
}

export function hours(value: number): number {
  return cacheDuration.hours(value);
}

export function days(value: number): number {
  return cacheDuration.days(value);
}
