import { describe, it, expect } from 'vitest';
import { getTodayHours, DAY_NAMES } from './hours';

describe('getTodayHours', () => {
  it('returns the hours for the given date\'s weekday, case-insensitively', () => {
    const date = new Date(2026, 6, 6);
    const dayName = DAY_NAMES[date.getDay()];
    const openingHours = { [dayName.toUpperCase()]: '8:00 AM - 6:00 PM' };
    expect(getTodayHours(openingHours, date)).toBe('8:00 AM - 6:00 PM');
  });

  it('returns null when the day is missing from the map', () => {
    const date = new Date(2026, 6, 6);
    const otherDay = DAY_NAMES[(date.getDay() + 1) % 7];
    const openingHours = { [otherDay]: '8:00 AM - 6:00 PM' };
    expect(getTodayHours(openingHours, date)).toBeNull();
  });

  it('returns null when openingHours is undefined', () => {
    expect(getTodayHours(undefined)).toBeNull();
  });
});
