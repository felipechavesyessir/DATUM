import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const target =
  process.argv[2] ||
  `file:///${path.resolve("index.html").replaceAll("\\", "/").replaceAll(" ", "%20")}`;

const outputDir = path.resolve("reports", "audit");
await mkdir(outputDir, { recursive: true });

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000, isMobile: false },
  { name: "mobile-390", width: 390, height: 844, isMobile: true }
];

async function auditViewport(browser, viewport) {
  const consoleMessages = [];
  const pageErrors = [];
  const failedRequests = [];
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: viewport.isMobile
  });

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleMessages.push({
        type: message.type(),
        text: message.text(),
        location: message.location()
      });
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText || "unknown"
    });
  });

  await page.goto(target, { waitUntil: "networkidle" });

  const screenshotPath = path.join(outputDir, `${viewport.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const viewportWidth = window.innerWidth;
    const focusable = Array.from(
      document.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    );
    const invisibleFocusables = focusable
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim().slice(0, 80) || element.getAttribute("aria-label") || "",
          href: element.getAttribute("href"),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity
        };
      })
      .filter(
        (item) =>
          item.display === "none" ||
          item.visibility === "hidden" ||
          Number(item.opacity) === 0 ||
          item.width === 0 ||
          item.height === 0
      );

    const horizontalOverflow = Array.from(document.querySelectorAll("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector:
            element.id ? `#${element.id}` : element.className ? `.${String(element.className).split(" ").join(".")}` : element.tagName.toLowerCase(),
          left: Math.floor(rect.left),
          right: Math.ceil(rect.right),
          width: Math.ceil(rect.width)
        };
      })
      .filter((item) => item.right > viewportWidth + 2 || item.left < -2)
      .slice(0, 25);

    const links = Array.from(document.querySelectorAll("a[href]")).map((link) => ({
      text: link.textContent.trim(),
      href: link.getAttribute("href")
    }));

    const missingAccessibleNames = focusable
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        text: element.textContent?.trim(),
        ariaLabel: element.getAttribute("aria-label"),
        title: element.getAttribute("title"),
        href: element.getAttribute("href"),
        name: element.getAttribute("name")
      }))
      .filter((item) => !item.text && !item.ariaLabel && !item.title);

    const imagesWithoutAlt = Array.from(document.querySelectorAll("img")).filter(
      (img) => !img.hasAttribute("alt")
    ).length;

    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((heading) => ({
      level: heading.tagName.toLowerCase(),
      text: heading.textContent.trim().slice(0, 120)
    }));

    const heroTopographyPath = document.querySelector(".hero-topography path");
    const siteTopography = document.querySelector("#site-topography-field");

    return {
      documentWidth: doc.scrollWidth,
      bodyWidth: body.scrollWidth,
      viewportWidth,
      hasHorizontalOverflow: doc.scrollWidth > viewportWidth + 2 || body.scrollWidth > viewportWidth + 2,
      horizontalOverflow,
      invisibleFocusables,
      links,
      missingAccessibleNames,
      imagesWithoutAlt,
      headings,
      topographyPaths: document.querySelectorAll(".hero-topography path").length,
      topographyAnimation: heroTopographyPath ? getComputedStyle(heroTopographyPath).animationName : null,
      siteTopographyCanvas: siteTopography
        ? {
            width: siteTopography.width,
            height: siteTopography.height,
            opacity: getComputedStyle(siteTopography).opacity
          }
        : null
    };
  });

  const linkChecks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]")).map((link) => {
      const href = link.getAttribute("href");
      const isHash = href?.startsWith("#") && href.length > 1;
      const targetExists = isHash ? Boolean(document.querySelector(href)) : true;
      return { text: link.textContent.trim(), href, targetExists };
    });
  });

  const formResult = await page.evaluate(() => {
    const form = document.querySelector(".contact-form");
    const button = form?.querySelector("button");
    button?.click();
    return {
      invalidFields: Array.from(form?.querySelectorAll(".is-invalid") || []).map((field) => field.name),
      status: form?.querySelector(".form-status")?.textContent.trim() || "",
      nameError: form?.querySelector('[data-error-for="name"]')?.textContent.trim() || "",
      emailError: form?.querySelector('[data-error-for="email"]')?.textContent.trim() || "",
      messageError: form?.querySelector('[data-error-for="message"]')?.textContent.trim() || ""
    };
  });

  let menuResult = null;
  if (viewport.isMobile) {
    menuResult = await page.evaluate(() => {
      const button = document.querySelector(".nav-toggle");
      const nav = document.querySelector("#site-nav");
      const before = {
        expanded: button?.getAttribute("aria-expanded"),
        display: nav ? getComputedStyle(nav).display : null
      };
      button?.click();
      const after = {
        expanded: button?.getAttribute("aria-expanded"),
        display: nav ? getComputedStyle(nav).display : null,
        bodyOpen: document.body.classList.contains("nav-open")
      };
      return { before, after };
    });
  }

  await page.close();

  return {
    viewport,
    screenshotPath,
    consoleMessages,
    pageErrors,
    failedRequests,
    metrics,
    linkChecks,
    formResult,
    menuResult
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const viewport of viewports) {
  results.push(await auditViewport(browser, viewport));
}
await browser.close();

console.log(JSON.stringify({ target, results }, null, 2));
