import { Locator, Page } from '@playwright/test';
import { AuthenticatedPage } from './authenticated-page';

export class CheckoutCompletePage extends AuthenticatedPage {
  protected readonly path = '/checkout-complete.html';
  protected readonly titleText = 'Checkout: Complete!';
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.getByTestId('complete-header');
  }
}
