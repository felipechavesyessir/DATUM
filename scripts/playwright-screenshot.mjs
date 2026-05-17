import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const target =
  process.argv[2] ||
  `file:///${path.resolve("index.html").replaceAll("\\", "/").replaceAll(" ", "%20")}`;

const outputDir = path.resolve("reports", "screenshots");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1
});

await page.goto(target, { waitUntil: "networkidle" });

const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y <= pageHeight; y += 700) {
  await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
  await page.waitForTimeout(80);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(120);

const screenshotPath = path.join(outputDir, "data-home.png");
await page.screenshot({ path: screenshotPath, fullPage: true });
const title = await page.title();
const h1 = await page.locator("h1").innerText();
const logo = await page.locator(".brand .data-vector-logo").evaluate((logoEl) => {
  const box = logoEl.getBoundingClientRect();
  return {
    type: logoEl.tagName.toLowerCase(),
    clientWidth: Math.round(box.width),
    clientHeight: Math.round(box.height),
    animatedPaths: logoEl.querySelectorAll(".logo-trace").length
  };
});

await browser.close();

console.log(JSON.stringify({ target, title, h1, logo, screenshotPath }, null, 2));
