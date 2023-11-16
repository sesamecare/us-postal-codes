import path from 'path';

import { Database as DatabaseDriver } from 'sqlite3';
import type { Database } from 'sqlite';
import { open } from 'sqlite';

export class USPostalCodes {
  db: Database | undefined;

  async open() {
    this.db = await open({
      filename: path.join(__dirname, '../assets/uspostalcodes.db'),
      driver: DatabaseDriver,
    });
  }

  async lookup(zipCode: string): Promise<
    {
      city: string;
      state: string;
      lat: number;
      lng: number;
    }[]
  > {
    if (!this.db) {
      throw new Error('Postal code database unavailable');
    }
    return this.db.all('SELECT city, state, lat, lng FROM locations WHERE postal_code = ?', zipCode);
  }
}
