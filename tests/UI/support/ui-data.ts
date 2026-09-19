export type User = {
  username: string;
  password: string;
};

export type Customer = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export type Product = {
  name: string;
  price: number;
};

const password = process.env.UI_PASSWORD ?? 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password },
} satisfies Record<string, User>;

export const customer: Customer = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '10001',
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

// "$29.99" or "Tax: $2.40" -> 29.99 / 2.4
export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) throw new Error(`No price found in "${text}"`);
  return Number(match[1]);
}

// Distinct random picks (Fisher-Yates on a copy) so every run can exercise different products
export function pickRandom<T>(items: readonly T[], count: number): T[] {
  if (count > items.length) throw new Error(`Cannot pick ${count} out of ${items.length} items`);
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
