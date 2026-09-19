import { Locator, Page } from '@playwright/test';

// Item list rendered with the same markup on the cart and on the checkout overview
export class CartList {
  readonly items: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('cart-list').getByTestId('inventory-item');
  }

  item(name: string) {
    const row = this.items.filter({ has: this.page.getByText(name, { exact: true }) });
    return {
      row,
      quantity: row.getByTestId('item-quantity'),
      price: row.getByTestId('inventory-item-price'),
    };
  }
}
