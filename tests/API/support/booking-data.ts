import { randomUUID } from 'crypto';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds: string;
};

export const credentials = {
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};

// Unique lastname so parallel runs never collide on the shared API
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'John',
    lastname: `Doe-${randomUUID().slice(0, 8)}`,
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-01-02',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
