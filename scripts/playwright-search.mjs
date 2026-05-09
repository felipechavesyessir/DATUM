import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const query = process.argv.slice(2).join(" ").trim();

if (!query) {
  console.error('Usage: npm run browser:search -- "termo de busca"');
  process.exit(1);
}

const outputDir = path.resolve("reports", "browser-search");
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1366, height: 900 },
  locale: "pt-BR"
});

const searchUrls = [
  `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`,
  `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories`
];
let searchUrl = "";
let results = [];

for (const url of searchUrls) {
  searchUrl = url;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

  const consentButton = page
    .getByRole("button", { name: /aceito|accept|concordo|agree/i })
    .first();
  if (await consentButton.isVisible().catch(() => false)) {
    await consentButton.click();
  }

  await page.waitForLoadState("networkidle").catch(() => {});

  results = await page.locator("a.result-link, a[href*='/search?q='], a[href*='/topics/'], a[href*='/repositories/']").evaluateAll((links) =>
    links
      .map((link) => ({
        title: link.textContent?.replace(/\s+/g, " ").trim(),
        href: link.href
      }))
      .filter((item) => item.title && item.href && item.title.length > 3)
      .slice(0, 8)
  );

  if (results.length === 0) {
    results = await page.locator("a").evaluateAll((links) =>
      links
        .map((link) => ({
          title: link.textContent?.replace(/\s+/g, " ").trim(),
          href: link.href
        }))
        .filter((item) => item.title && item.href && item.href.startsWith("http") && item.title.length > 3)
        .slice(0, 8)
    );
  }

  results = results.filter((item) => !/duckduckgo|pular|accessibility|sign in/i.test(item.title));
  if (results.length > 0) {
    break;
  }
}

if (results.length === 0) {
  results = await page.locator("a").evaluateAll((links) =>
    links
      .map((link) => ({
        title: link.textContent?.replace(/\s+/g, " ").trim(),
        href: link.href
      }))
      .filter((item) => item.title && item.href && item.href.startsWith("http") && item.title.length > 3)
      .slice(0, 8)
  );
}

const safeName = query
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/gi, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase();

const screenshotPath = path.join(outputDir, `${safeName || "busca"}.png`);
const jsonPath = path.join(outputDir, `${safeName || "busca"}.json`);

await page.screenshot({ path: screenshotPath, fullPage: false });
await browser.close();

const payload = {
  query,
  searchedAt: new Date().toISOString(),
  searchUrl,
  screenshotPath,
  results
};

await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");

console.log(JSON.stringify(payload, null, 2));
