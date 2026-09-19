import { Locator, Page } from '@playwright/test';
import { AuthenticatedPage } from './authenticated-page';
import { CartList } from './components/cart-list';

export class CartPage extends AuthenticatedPage {
  protected readonly path = '/cart.html';
  protected readonly titleText = 'Your Cart';
  readonly cartList: CartList;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = new CartList(page);
    this.checkoutButton = page.getByTestId('checkout');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
