import { APIRequestContext } from '@playwright/test';
import { Booking } from './booking-data';

const authHeader = (token?: string): Record<string, string> => (token ? { Cookie: `token=${token}` } : {});

// Single place that knows endpoints and headers; tests only call these methods
export class BookingApi {
  constructor(private readonly request: APIRequestContext) {}

  createToken(username: string, password: string) {
    return this.request.post('/auth', { data: { username, password } });
  }

  create(booking: Booking) {
    return this.request.post('/booking', { data: booking });
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  update(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, { data: booking, headers: authHeader(token) });
  }

  delete(id: number, token?: string) {
    return this.request.delete(`/booking/${id}`, { headers: authHeader(token) });
  }
}
