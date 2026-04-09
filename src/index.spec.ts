import { describe, expect, test } from 'vitest';

import { USPostalCodes } from './index';

describe('Postal code lookup', () => {
  test('should return a list of postal codes', async () => {
    const zips = new USPostalCodes();
    await zips.open();
    const results = await zips.lookup('02446');
    expect(results).toMatchInlineSnapshot(`
      [
        {
          "city": "Brookline",
          "lat": 42.3431,
          "lng": -71.123,
          "state": "MA",
        },
      ]
    `);
  });
});

describe('Nearby lookup', () => {
  test('should find zip codes near a given lat/lng', async () => {
    const zips = new USPostalCodes();
    await zips.open();
    const results = await zips.nearby(42.3431, -71.123, 5);
    expect(results).toHaveLength(5);
    // First result should be Brookline itself (distance ~0)
    expect(results[0].city).toBe('Brookline');
    expect(results[0].postalCode).toBe('02446');
    expect(results[0].distanceMiles).toBe(0);
    // Results should be sorted by distance
    for (let i = 1; i < results.length; i++) {
      expect(results[i].distanceMiles).toBeGreaterThanOrEqual(results[i - 1].distanceMiles);
    }
  });

  test('should default to 10 results', async () => {
    const zips = new USPostalCodes();
    await zips.open();
    const results = await zips.nearby(42.3431, -71.123);
    expect(results).toHaveLength(10);
  });
});
