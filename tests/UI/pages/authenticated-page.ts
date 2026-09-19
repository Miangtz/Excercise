import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { Header } from './components/header';

// Pages behind the login share the header (cart) and a title bar
export abstract class AuthenticatedPage extends BasePage {
  protected abstract readonly titleText: string;
  readonly header: Header;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.title = page.getByTestId('title');
  }

  // URL alone is not enough: also wait until the page has rendered its own title
  override async expectLoaded() {
    await super.expectLoaded();
    await expect(this.title).toHaveText(this.titleText);
  }
}
