const { test, expect } = require("@playwright/test");
const path = require("path");

test("product cards render correctly and buttons exist", async ({ page }) => {
  const filePath = path.resolve(__dirname, "../public/index.html");
  await page.goto("http://localhost:3000");

  const cards = page.locator('[data-testid="product-card"]');
  await expect(cards).toHaveCount(3);

  for (let i = 0; i < 3; i++) {
    await expect(cards.nth(i).locator(".name")).toBeVisible();
    await expect(cards.nth(i).locator('[data-testid="price"]')).toBeVisible();
    await expect(cards.nth(i).locator('[data-testid="add-to-cart"]')).toBeVisible();
  }

  await expect(page).toHaveTitle(/New Arrivals/i);
});
