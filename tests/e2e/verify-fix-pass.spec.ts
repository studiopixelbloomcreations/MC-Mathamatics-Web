import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "mobile-360", width: 360, height: 740 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "ultrawide-1920", width: 1920, height: 1080 },
];

test.describe("PART 5: Verify Fix Pass Across All 6 Viewports", () => {
  test.setTimeout(60000);

  const afterDir = path.join(process.cwd(), "docs", "fix-screenshots", "after");
  if (!fs.existsSync(afterDir)) {
    fs.mkdirSync(afterDir, { recursive: true });
  }

  for (const vp of VIEWPORTS) {
    test(`Verify layout and capture screenshots on ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      // 1. Check no horizontal overflow
      const overflowCheck = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const bodyWidth = document.body.scrollWidth;
        return {
          docWidth,
          winWidth,
          bodyWidth,
          hasOverflow: docWidth > winWidth + 2,
        };
      });

      expect(overflowCheck.hasOverflow).toBe(false);

      // 2. Initial landing screenshot
      await page.screenshot({
        path: path.join(afterDir, `${vp.name}-scroll-0.png`),
      });

      // 3. Scroll to the Statement section right after the hero
      const statementSection = page.locator("#method");
      await expect(statementSection).toBeVisible();

      // Check height > 0
      const sectionHeight = await statementSection.evaluate((el) => el.getBoundingClientRect().height);
      expect(sectionHeight).toBeGreaterThan(100);

      // Check heading presence
      await expect(statementSection.getByRole("heading", { level: 2 })).toHaveText(
        "One teacher. One method. Progress you can measure."
      );

      // Check 01 / 02 / 03 and Learn / Practice / Improve items
      await expect(statementSection).toContainText("01");
      await expect(statementSection).toContainText("02");
      await expect(statementSection).toContainText("03");
      await expect(statementSection).toContainText("Learn");
      await expect(statementSection).toContainText("Practice");
      await expect(statementSection).toContainText("Improve");

      // Scroll into view of statement section and take screenshot
      await statementSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      await page.screenshot({
        path: path.join(afterDir, `${vp.name}-statement-section.png`),
      });

      // 4. Scroll steps to verify no blank screen occurs
      const scrollSteps = [
        Math.round(vp.height * 0.5),
        Math.round(vp.height * 1.0),
        Math.round(vp.height * 1.5),
      ];

      for (let i = 0; i < scrollSteps.length; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollSteps[i]);
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(afterDir, `${vp.name}-scroll-${scrollSteps[i]}.png`),
        });
      }

      // 5. Full page screenshot
      await page.screenshot({
        path: path.join(afterDir, `${vp.name}-fullpage.png`),
        fullPage: true,
      });
    });
  }

  test("Reduced motion mode: All content immediately visible without delay", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const statementSection = page.locator("#method");
    await expect(statementSection).toBeVisible();

    const opacity = await statementSection.evaluate((el) => {
      const child = el.querySelector("div");
      return window.getComputedStyle(child || el).opacity;
    });
    expect(Number(opacity)).toBeGreaterThan(0.9);
  });
});
