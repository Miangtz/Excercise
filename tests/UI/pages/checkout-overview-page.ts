import { Locator, Page } from '@playwright/test';
import { AuthenticatedPage } from './authenticated-page';
import { CartList } from './components/cart-list';
import { parsePrice } from '../support/ui-data';

export class CheckoutOverviewPage extends AuthenticatedPage {
  protected readonly path = '/checkout-step-two.html';
  protected readonly titleText = 'Checkout: Overview';
  readonly cartList: CartList;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList = new CartList(page);
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async getTotals() {
    return {
      itemTotal: parsePrice(await this.subtotal.innerText()),
      tax: parsePrice(await this.tax.innerText()),
      total: parsePrice(await this.total.innerText()),
    };
  }

  async finish() {
    await this.finishButton.click();
  }
}
