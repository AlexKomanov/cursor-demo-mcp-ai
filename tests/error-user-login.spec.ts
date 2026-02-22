import { test, expect } from "@playwright/test";

const USERNAME = "error_user";
const PASSWORD = "secret_sauce";

test.describe("error_user Login Scenario", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the login page", async ({ page }) => {
    await expect(page).toHaveTitle("Swag Labs");
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test("should login and display inventory page", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(
      page.locator('[data-test="inventory-container"]')
    ).toBeVisible();
  });

  test("should display product items on inventory page", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);

    const products = page.locator('[data-test="inventory-item"]');
    await expect(products).toHaveCount(6);
  });

  test("should have no blocking error overlays", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);

    await expect(page.locator(".error-message-container")).not.toBeVisible();

    await expect(page.locator("footer")).toBeVisible();
  });

  test("should validate core UI element stability", async ({ page }) => {
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL(/inventory\.html/);

    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();

    const firstProduct = page.locator('[data-test="inventory-item"]').first();
    await expect(firstProduct.locator('[data-test="inventory-item-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-test="inventory-item-price"]')).toBeVisible();
    await expect(firstProduct.locator("button")).toBeVisible();
  });
});
