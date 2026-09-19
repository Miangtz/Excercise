import { Locator, Page } from '@playwright/test';
import { AuthenticatedPage } from './authenticated-page';
import { Customer } from '../support/ui-data';

export class CheckoutInformationPage extends AuthenticatedPage {
  protected readonly path = '/checkout-step-one.html';
  protected readonly titleText = 'Checkout: Your Information';
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }: Customer) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }
}
