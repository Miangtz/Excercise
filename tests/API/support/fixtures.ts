import { test as base, expect } from '@playwright/test';
import { BookingApi } from './booking-api';
import { Booking, buildBooking, credentials } from './booking-data';

type TestFixtures = {
  api: BookingApi;
  booking: { id: number; data: Booking };
};

type WorkerFixtures = {
  token: string;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // Auth once per worker and reuse the token in every test
  token: [async ({ playwright }, use, workerInfo) => {
    const context = await playwright.request.newContext({ baseURL: workerInfo.project.use.baseURL });
    const response = await new BookingApi(context).createToken(credentials.username, credentials.password);
    const { token } = await response.json();
    expect(token, '/auth returns 200 even with bad credentials').toBeTruthy();
    await context.dispose();
    await use(token);
  }, { scope: 'worker' }],

  api: async ({ request }, use) => {
    await use(new BookingApi(request));
  },

  // Fresh booking for tests that need existing data, deleted afterwards even if the test fails
  booking: async ({ api, token }, use) => {
    const data = buildBooking();
    const response = await api.create(data);
    expect(response.status()).toBe(200);
    const { bookingid } = await response.json();

    await use({ id: bookingid, data });

    await api.delete(bookingid, token);
  },
});

export { expect };
