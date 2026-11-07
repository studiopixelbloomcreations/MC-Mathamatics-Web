import { test, expect } from "@playwright/test";

test.describe("Landing Page & Agency Narrative", () => {
  test("renders the full hero and brand slogan", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText("Maths is the question");
    await expect(page.locator("body")).toContainText("MC is the answer");
  });

  test("contains all core sections from blueprint A2", async ({ page }) => {
    await page.goto("/");
    // Trust strip
    await expect(page.getByText("Top Mathematics Specialist in Kurunegala")).toBeVisible();
    // Meet Sir
    await expect(page.locator("#meet-sir")).toBeVisible();
    // Feature Bento
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.getByText("Zero-Cost WhatsApp Reports")).toBeVisible();
    // How It Works
    await expect(page.locator("#how-it-works")).toBeVisible();
    // Smart Analysis
    await expect(page.locator("#analysis")).toBeVisible();
    // Grades
    await expect(page.locator("#grades")).toBeVisible();
    // FAQ
    await expect(page.locator("#faq")).toBeVisible();
  });

  test("toggles FAQ accordion cleanly", async ({ page }) => {
    await page.goto("/#faq");
    const firstFaq = page.locator("#faq h3").first();
    await firstFaq.click();
    await expect(page.getByText("At registration, every student receives an atomic sequential ID")).toBeVisible();
  });
});
