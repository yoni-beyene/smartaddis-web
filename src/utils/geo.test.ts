import { describe, it, expect } from 'vitest';
import { haversineKm } from './geo';

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(9.03, 38.74, 9.03, 38.74)).toBe(0);
  });

  it('returns ~111.19km for one degree of latitude difference', () => {
    expect(haversineKm(0, 0, 1, 0)).toBeCloseTo(111.19, 1);
  });
});
