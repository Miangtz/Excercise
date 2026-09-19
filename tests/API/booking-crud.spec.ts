import { test, expect } from './support/fixtures';
import { buildBooking, credentials } from './support/booking-data';

test.describe('Booking CRUD', () => {

  test('generates an auth token', async ({ api }) => {
    const response = await api.createToken(credentials.username, credentials.password);
    expect(response.status()).toBe(200);
    expect((await response.json()).token).toBeTruthy();
  });

  test('creates a booking', async ({ api, token }) => {
    const data = buildBooking();
    const response = await api.create(data);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.bookingid).toBeTruthy();
    expect(body.booking).toMatchObject(data);

    await api.delete(body.bookingid, token);
  });

  test('reads a booking', async ({ api, booking }) => {
    const response = await api.get(booking.id);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(booking.data);
  });

  test('updates the checkout date', async ({ api, booking, token }) => {
    const updated = {
      ...booking.data,
      bookingdates: { ...booking.data.bookingdates, checkout: '2026-01-05' },
    };
    const response = await api.update(booking.id, updated, token);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(updated);
  });

  test('deletes a booking', async ({ api, booking, token }) => {
    const response = await api.delete(booking.id, token);
    expect(response.status()).toBe(201);
    expect((await api.get(booking.id)).status()).toBe(404);
  });

  test('rejects an update without token', async ({ api, booking }) => {
    const response = await api.update(booking.id, booking.data);
    expect(response.status()).toBe(403);
  });
});

test.describe('Booking lifecycle', () => {


  
  test('auth → create → read → update → delete', async ({ api }) => {
    const data = buildBooking();

    const token: string = await test.step('Auth: generate token', async () => {
      const response = await api.createToken(credentials.username, credentials.password);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.token).toBeTruthy();
      return body.token;
    });

    const bookingId: number = await test.step('Create booking', async () => {
      const response = await api.create(data);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.booking).toMatchObject(data);
      return body.bookingid;
    });

    await test.step('Read booking', async () => {
      const response = await api.get(bookingId);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject(data);
    });

    await test.step('Update checkout date', async () => {
      const updated = { ...data, bookingdates: { ...data.bookingdates, checkout: '2026-01-05' } };
      const response = await api.update(bookingId, updated, token);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject(updated);
    });

    await test.step('Delete booking', async () => {
      const response = await api.delete(bookingId, token);
      expect(response.status()).toBe(201);
      expect((await api.get(bookingId)).status()).toBe(404);
    });
  });
});
