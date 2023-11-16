# us-postal-codes

Lookup city, state and geolocation by US postal codes. Includes infra for fetching the latest values.

```typescript
import { USPostalCodes } from '@sesamecare-oss/us-postal-codes';

const zips = new USPostalCodes();
await zips.open();
const results = await zips.lookup('02446');
```

Uses [geonames zip code data](https://www.geonames.org/about.html) under [Creative Commons license](https://creativecommons.org/licenses/by/4.0/).
