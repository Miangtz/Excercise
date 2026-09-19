import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';
import { User } from '../support/ui-data';

export class LoginPage extends BasePage {
  protected readonly path = '/';
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
  }

  async login({ username, password }: User) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
