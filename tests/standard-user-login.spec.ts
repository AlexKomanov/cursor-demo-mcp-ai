import { test, expect } from "@playwright/test";

const USERNAME = "standard_user";
const PASSWORD = "secret_sauce";

test.describe("standard_user Login Scenario", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the login page", async ({ page }) => {
    await expect(page).toHaveTitle("Swag Labs");
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("should login successfully and redirect to inventory", async ({
    page,
  }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(
      page.locator('[data-test="inventory-container"]')
    ).toBeVisible();
  });

  test("should display all 6 product items", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    const products = page.locator('[data-test="inventory-item"]');
    await expect(products).toHaveCount(6);

    for (const product of await products.all()) {
      await expect(
        product.locator('[data-test="inventory-item-name"]')
      ).toBeVisible();
      await expect(
        product.locator('[data-test="inventory-item-price"]')
      ).toBeVisible();
      await expect(product.locator("button")).toBeVisible();
    }
  });

  test("should sort products by price low to high", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("lohi");

    const prices = await page
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();
    const numericPrices = prices.map((p) => parseFloat(p.replace("$", "")));
    const sorted = [...numericPrices].sort((a, b) => a - b);

    expect(numericPrices).toEqual(sorted);
  });

  test("should add item to cart and verify badge count", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]')
    ).toHaveText("1");

    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();
  });

  test("should navigate to cart and verify item", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(1);
    await expect(
      page.locator('[data-test="inventory-item-name"]')
    ).toHaveText("Sauce Labs Backpack");
  });

  test("should complete checkout flow", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await page.locator('[data-test="firstName"]').fill("John");
    await page.locator('[data-test="lastName"]').fill("Doe");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText(
      "$29.99"
    );
    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      "Thank you for your order!"
    );
  });

  test("should logout successfully", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await page.locator("#react-burger-menu-btn").click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
