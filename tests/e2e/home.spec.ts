import { test, expect } from "@playwright/test";

test.describe("Foundation & Design System", () => {
  test("loads the landing page with slogan", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Maths is the question");
  });

  test("navigates to design-system showcase", async ({ page }) => {
    await page.goto("/design-system");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("MC Mathematics UI Kit")).toBeVisible();
  });
});
