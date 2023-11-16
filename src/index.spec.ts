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
