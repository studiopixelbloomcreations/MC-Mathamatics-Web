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

test.describe("PART 1: Diagnose Blank Section After Hero", () => {
  test.setTimeout(60000);
  for (const vp of VIEWPORTS) {
    test(`Reproduce & diagnose on ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const logLines: string[] = [];
      logLines.push(`=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);

      // 1. Initial screenshot at top (scroll 0)
      const outDir = path.join(process.cwd(), "docs", "fix-screenshots", "before");
      await page.screenshot({
        path: path.join(outDir, `${vp.name}-scroll-0.png`),
      });

      // 2. Measure Hero container & section right after it
      const metrics = await page.evaluate(() => {
        const heroContainer = document.querySelector("main > div:first-child") as HTMLElement;
        const stickyViewport = heroContainer?.querySelector(":scope > div") as HTMLElement;
        const sectionAfter = document.querySelector("main > section:first-of-type") as HTMLElement;

        const main = document.querySelector("main") as HTMLElement;
        const mainStyle = window.getComputedStyle(main);

        return {
          windowInnerHeight: window.innerHeight,
          windowScrollY: window.scrollY,
          mainOverflowX: mainStyle.overflowX,
          mainOverflow: mainStyle.overflow,
          hero: {
            offsetHeight: heroContainer?.offsetHeight,
            clientHeight: heroContainer?.clientHeight,
            offsetTop: heroContainer?.offsetTop,
            rect: heroContainer?.getBoundingClientRect(),
          },
          stickyViewport: {
            offsetHeight: stickyViewport?.offsetHeight,
            position: window.getComputedStyle(stickyViewport)?.position,
            top: window.getComputedStyle(stickyViewport)?.top,
            rect: stickyViewport?.getBoundingClientRect(),
          },
          sectionAfter: {
            tagName: sectionAfter?.tagName,
            id: sectionAfter?.id,
            className: sectionAfter?.className,
            offsetTop: sectionAfter?.offsetTop,
            offsetHeight: sectionAfter?.offsetHeight,
            rect: sectionAfter?.getBoundingClientRect(),
            opacity: window.getComputedStyle(sectionAfter)?.opacity,
            visibility: window.getComputedStyle(sectionAfter)?.visibility,
            display: window.getComputedStyle(sectionAfter)?.display,
          },
        };
      });

      logLines.push(`Hero container height: ${metrics.hero.offsetHeight}px (expected 2.2 * ${vp.height} = ${vp.height * 2.2}px)`);
      logLines.push(`Sticky viewport position: ${metrics.stickyViewport.position}, top: ${metrics.stickyViewport.top}`);
      logLines.push(`Main overflow-x: ${metrics.mainOverflowX}`);
      logLines.push(`Section right after hero offsetTop: ${metrics.sectionAfter.offsetTop}px, height: ${metrics.sectionAfter.offsetHeight}px`);
      logLines.push(`Section right after hero initial opacity: ${metrics.sectionAfter.opacity}, visibility: ${metrics.sectionAfter.visibility}`);

      // 3. Scroll through hero in increments and capture evidence
      const scrollSteps = [
        Math.round(vp.height * 0.5),
        Math.round(vp.height * 1.0),
        Math.round(vp.height * 1.5),
        Math.round(vp.height * 2.2),
      ];

      for (let i = 0; i < scrollSteps.length; i++) {
        const scrollTarget = scrollSteps[i];
        await page.evaluate((y) => window.scrollTo(0, y), scrollTarget);
        await page.waitForTimeout(300);

        const stepMetrics = await page.evaluate(() => {
          const sectionAfter = document.querySelector("main > section:first-of-type") as HTMLElement;
          const rect = sectionAfter?.getBoundingClientRect();
          const firstReveal = sectionAfter?.querySelector("div") as HTMLElement;
          return {
            scrollY: window.scrollY,
            rectTop: rect?.top,
            rectHeight: rect?.height,
            opacity: sectionAfter ? window.getComputedStyle(sectionAfter).opacity : "null",
            firstRevealOpacity: firstReveal ? window.getComputedStyle(firstReveal).opacity : "null",
            firstRevealTransform: firstReveal ? window.getComputedStyle(firstReveal).transform : "null",
          };
        });

        logLines.push(
          `ScrollStep ${i + 1} (${scrollTarget}px) -> sectionTop: ${stepMetrics.rectTop}px, sectionOpacity: ${stepMetrics.opacity}, revealOpacity: ${stepMetrics.firstRevealOpacity}`
        );

        await page.screenshot({
          path: path.join(outDir, `${vp.name}-scroll-${scrollTarget}.png`),
        });
      }

      console.log(logLines.join("\n"));
    });
  }
});
