# us-postal-codes

Lookup city, state, and geolocation by US postal code, or find nearby zip codes by latitude/longitude. Bundled with a SQLite database covering ~41,000 US postal codes.

## Installation

```bash
npm install @sesamecare-oss/us-postal-codes
```

## Usage

```typescript
import { USPostalCodes } from '@sesamecare-oss/us-postal-codes';

const zips = new USPostalCodes();
await zips.open();
```

### Lookup by zip code

```typescript
const results = await zips.lookup('02446');
// [{ city: 'Brookline', state: 'MA', lat: 42.3431, lng: -71.123 }]
```

### Find nearby zip codes

Find the closest zip codes to a given latitude/longitude:

```typescript
const nearby = await zips.nearby(42.3431, -71.123, 5);
// [
//   { postalCode: '02446', city: 'Brookline', state: 'MA', lat: 42.3431, lng: -71.123, distanceMiles: 0 },
//   { postalCode: '02445', city: 'Brookline', state: 'MA', lat: 42.3318, lng: -71.1285, distanceMiles: 0.84 },
//   ...
// ]
```

The second argument is the number of results to return (defaults to 10). Results are sorted by distance and include the `distanceMiles` from the input coordinates, calculated using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).

## Data

Uses [geonames zip code data](https://www.geonames.org/about.html) under [Creative Commons license](https://creativecommons.org/licenses/by/4.0/).

To refresh the bundled database with the latest data:

```bash
make uspostalcodes
```
