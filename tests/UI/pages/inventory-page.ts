import { Locator, Page } from '@playwright/test';
import { AuthenticatedPage } from './authenticated-page';
import { parsePrice, Product } from '../support/ui-data';

export class InventoryPage extends AuthenticatedPage {
  protected readonly path = '/inventory.html';
  protected readonly titleText = 'Products';
  readonly items: Locator;
  readonly itemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
  }

  // allTextContents() does not auto-wait, so wait for the list to render first
  async getProductNames(): Promise<string[]> {
    await this.itemNames.first().waitFor();
    return this.itemNames.allTextContents();
  }

  item(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  // The button's data-test id embeds the product slug, so it is found by role inside the product card.
  // Returns the product as shown here so later pages can be checked against it.
  async addToCart(name: string): Promise<Product> {
    const item = this.item(name);
    const price = parsePrice(await item.getByTestId('inventory-item-price').innerText());
    await item.getByRole('button', { name: 'Add to cart' }).click();
    return { name, price };
  }
}
