import { test, expect } from './support/fixtures';
import { CartList } from './pages/components/cart-list';
import { customer, formatPrice, pickRandom, Product, users } from './support/ui-data';

const ITEMS_TO_BUY = 2;

async function expectCartToContain(cartList: CartList, products: Product[]) {
  await expect(cartList.items).toHaveCount(products.length);
  for (const product of products) {
    const item = cartList.item(product.name);
    await expect(item.row).toBeVisible();
    await expect(item.quantity).toHaveText('1');
    await expect(item.price).toHaveText(formatPrice(product.price));
  }
}

test.describe('Checkout', () => {

  test('standard user buys two items end to end', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await test.step('Login as standard_user', async () => {
      await loginPage.goto();
      await loginPage.login(users.standard);
      await inventoryPage.expectLoaded();
    });

    const products: Product[] = await test.step(`Inventory: add ${ITEMS_TO_BUY} distinct items`, async () => {
      const names = pickRandom(await inventoryPage.getProductNames(), ITEMS_TO_BUY);
      test.info().annotations.push({ type: 'products', description: names.join(', ') });

      const added: Product[] = [];
      for (const name of names) {
        added.push(await inventoryPage.addToCart(name));
      }
      await expect(inventoryPage.header.cartBadge).toHaveText(String(ITEMS_TO_BUY));
      return added;
    });

    await test.step('Cart: validate items and quantity', async () => {
      await inventoryPage.header.openCart();
      await cartPage.expectLoaded();
      await expectCartToContain(cartPage.cartList, products);
    });

    await test.step('Checkout: fill in customer information', async () => {
      await cartPage.checkout();
      await checkoutInformationPage.expectLoaded();
      await checkoutInformationPage.fillCustomerInfo(customer);
      await checkoutInformationPage.continueToOverview();
    });

    await test.step('Overview: validate items and totals', async () => {
      await checkoutOverviewPage.expectLoaded();
      await expectCartToContain(checkoutOverviewPage.cartList, products);

      // Compared as numbers: SauceDemo sometimes renders unrounded floats ("Item total: $59.980000000000004")
      const { itemTotal, tax, total } = await checkoutOverviewPage.getTotals();
      expect(itemTotal).toBeCloseTo(products.reduce((sum, product) => sum + product.price, 0), 2);
      expect(total).toBeCloseTo(itemTotal + tax, 2);
    });

    await test.step('Complete: finish and verify the confirmation', async () => {
      await checkoutOverviewPage.finish();
      await checkoutCompletePage.expectLoaded();
      await expect(checkoutCompletePage.successMessage).toHaveText('Thank you for your order!');
      await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
    });
  });
});
