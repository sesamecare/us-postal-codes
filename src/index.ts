import path from 'path';

import { Database as DatabaseDriver } from 'sqlite3';
import type { Database } from 'sqlite';
import { open } from 'sqlite';

export interface PostalCodeLocation {
  postalCode: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface NearbyResult extends PostalCodeLocation {
  distanceMiles: number;
}

const EARTH_RADIUS_MILES = 3958.8;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
    return this.db.all(
      'SELECT city, state, lat, lng FROM locations WHERE postal_code = ?',
      zipCode,
    );
  }

  async nearby(lat: number, lng: number, limit = 10): Promise<NearbyResult[]> {
    if (!this.db) {
      throw new Error('Postal code database unavailable');
    }

    // Use approximate Euclidean ordering in SQL (fast for 41K rows),
    // then compute exact Haversine distances in JS
    const rows: { postal_code: string; city: string; state: string; lat: number; lng: number }[] =
      await this.db.all(
        `SELECT postal_code, city, state, lat, lng FROM locations
         ORDER BY (lat - ?) * (lat - ?) + (lng - ?) * (lng - ?)
         LIMIT ?`,
        lat,
        lat,
        lng,
        lng,
        limit,
      );

    return rows
      .map((row) => ({
        postalCode: row.postal_code,
        city: row.city,
        state: row.state,
        lat: row.lat,
        lng: row.lng,
        distanceMiles: Math.round(haversineDistance(lat, lng, row.lat, row.lng) * 100) / 100,
      }))
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  }
}
