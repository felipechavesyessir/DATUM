import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("reports", "enter-analysis");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  locale: "pt-BR"
});

await page.goto("https://www.getenter.ai/", {
  waitUntil: "domcontentloaded",
  timeout: 90000
});
await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
await page.screenshot({ path: path.join(outDir, "enter-home.png"), fullPage: true });

const data = await page.evaluate(() => {
  const clean = (text) => (text || "").replace(/\s+/g, " ").trim();
  const sections = Array.from(document.querySelectorAll("header, main section, section, footer"))
    .slice(0, 30)
    .map((el, index) => {
      const rect = el.getBoundingClientRect();
      return {
        index,
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString().slice(0, 180),
        text: clean(el.innerText).slice(0, 900),
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          w: Math.round(rect.width),
          h: Math.round(rect.height)
        }
      };
    });

  const links = Array.from(document.querySelectorAll("a"))
    .map((a) => ({ text: clean(a.innerText || a.getAttribute("aria-label")), href: a.href }))
    .filter((a) => a.text)
    .slice(0, 80);

  const buttons = Array.from(document.querySelectorAll("button, [role='button']"))
    .map((b) => clean(b.innerText || b.getAttribute("aria-label")))
    .filter(Boolean)
    .slice(0, 40);

  const headings = Array.from(document.querySelectorAll("h1,h2,h3"))
    .map((h) => ({ level: h.tagName, text: clean(h.innerText) }))
    .filter((h) => h.text)
    .slice(0, 80);

  return {
    title: document.title,
    url: location.href,
    headings,
    links,
    buttons,
    sections
  };
});

await writeFile(path.join(outDir, "enter-analysis.json"), JSON.stringify(data, null, 2), "utf8");
await browser.close();

console.log(
  JSON.stringify(
    {
      title: data.title,
      sections: data.sections.length,
      headings: data.headings.slice(0, 12),
      output: outDir
    },
    null,
    2
  )
);
