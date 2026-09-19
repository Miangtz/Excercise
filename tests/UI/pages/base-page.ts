import { expect, Page } from '@playwright/test';

// Every page declares the path it lives on; navigation and the load check come from here
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto() {
    await this.page.goto(this.path);
  }

  // Page-transition guard: web-first assertion that retries until the URL matches, no fixed sleeps
  async expectLoaded() {
    await expect(this.page).toHaveURL((url) => url.pathname === this.path);
  }
}
