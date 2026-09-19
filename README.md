# QA Automation Challenge — Restful-Booker API & SauceDemo UI

Automated tests built with [Playwright Test](https://playwright.dev/) and TypeScript.

- **Part 1 – API:** booking lifecycle on [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) (auth → create → read → update → delete).
- **Part 2 – UI:** e-commerce critical path on [SauceDemo](https://www.saucedemo.com/) (login → add 2 items → cart → checkout → order confirmation).
- **Part 3:** manual bug report for `problem_user` (see [Bug Report](#bug-report)).

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (developed with Node 24)
- npm

## Installation

```bash
npm install
npx playwright install --with-deps
```

## Running the tests

| Command | What it runs |
| --- | --- |
| `npm test` | Every test (API + UI in Chromium, Firefox and WebKit) |
| `npm run test:api` | API tests only (no browser) |
| `npm run test:ui` | UI tests only, headless, in all three browsers |
| `npm run test:ui:headed` | UI tests in Chromium with a visible browser |
| `npm run test:ui-mode` | Playwright UI Mode (interactive runner with time-travel debugging) |
| `npm run report` | Opens the last HTML report |

Useful variations:

```bash
npx playwright test tests/UI --project=chromium      # single browser
npx playwright test tests/UI --debug                  # step through with the inspector
```

### Environment variables (optional)

All of them have working defaults; override them to point at another environment.

| Variable | Default |
| --- | --- |
| `API_BASE_URL` | `https://restful-booker.herokuapp.com` |
| `API_USERNAME` / `API_PASSWORD` | `admin` / `password123` |
| `UI_BASE_URL` | `https://www.saucedemo.com` |
| `UI_PASSWORD` | `secret_sauce` |

## Reporting

The Playwright HTML Reporter is enabled, plus the `list` reporter for console output. After a run, open the report with `npm run report`. Screenshots are saved on failure and traces on the first retry.

## Project structure

```
tests/
├── API/
│   ├── booking-crud.spec.ts
│   └── support/
│       ├── booking-api.ts
│       ├── booking-data.ts
│       └── fixtures.ts
└── UI/
    ├── checkout-flow.spec.ts
    ├── pages/
    │   ├── base-page.ts
    │   ├── authenticated-page.ts
    │   ├── login-page.ts
    │   ├── inventory-page.ts
    │   ├── cart-page.ts
    │   ├── checkout-information-page.ts
    │   ├── checkout-overview-page.ts
    │   ├── checkout-complete-page.ts
    │   └── components/
    │       ├── header.ts
    │       └── cart-list.ts
    └── support/
        ├── fixtures.ts
        └── ui-data.ts
playwright.config.ts
```


## Bug Report
---

## BUG — Cart buttons on the Products and Product Detail pages are inert for `problem_user`

**Severity:** Critical (Blocker) &nbsp;|&nbsp; **Priority:** P1
**Component:** Inventory / Shopping Cart &nbsp;|&nbsp; **Type:** Functional

### Description
When logged in as `problem_user`, clicking **Add to cart** (or **Remove**) on the Products page or on any Product Detail page produces no effect at all: the button label does not toggle, the cart badge does not change, and the persisted cart (`localStorage` key `cart-contents`) is not modified. The user is therefore unable to add any product to the cart, which blocks the entire purchase flow end to end.
The same clicks, at the same coordinates, work correctly for `standard_user`, so the defect is tied to the `problem_user` account and not to the page markup or the browser.

### repro steps
1. Navigate to `https://www.saucedemo.com`.
2. Log in with `problem_user` / `secret_sauce`.
3. On the **Products** page, click **Add to cart** on *Sauce Labs Bolt T-Shirt*.
4. Click **Add to cart** on *Sauce Labs Fleece Jacket*.
5. Observe the button labels and the cart badge in the header.
6. Open any product detail page (e.g. `inventory-item.html?id=4`) and click its **Add to cart** / **Remove** button.

### Expected Result
- Each **Add to cart** button changes to **Remove**.
- The cart badge increments by 1 per product added (0 → 1 → 2).
- The product appears in `cart.html`.
- **Remove** reverses the operation.

### Actual Result
- The button label stays **Add to cart** (or **Remove**) — no state change.
- The cart badge does not change.
- `localStorage.cart-contents` remains unchanged.
- No item is added to the cart; checkout cannot be started with any newly selected product.

