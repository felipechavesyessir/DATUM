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
        'a[href], button, input:not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])'
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

  let cardMotionResult = null;
  let scrollControlResult = null;
  if (!viewport.isMobile) {
    const cards = page.locator(".product-card");
    const cardCount = await cards.count();
    const transforms = [];

    for (let index = 0; index < cardCount; index += 1) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      const before = await card.evaluate((element) => getComputedStyle(element).transform);
      await card.hover();
      await page.waitForTimeout(240);
      const after = await card.evaluate((element) => getComputedStyle(element).transform);
      transforms.push({
        index: index + 1,
        changedOnHover: before !== after,
        before,
        after
      });
    }

    scrollControlResult = await page.evaluate(async () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.min(520, document.documentElement.scrollHeight - window.innerHeight));
      const initialY = window.scrollY;
      root.style.scrollBehavior = previousBehavior;
      await new Promise((resolve) => window.setTimeout(resolve, 2400));
      const finalY = window.scrollY;
      return {
        initialY,
        finalY,
        remainedUnderUserControl: Math.abs(finalY - initialY) < 2
      };
    });

    cardMotionResult = {
      allCardsRespond: transforms.length > 0 && transforms.every((item) => item.changedOnHover),
      transforms
    };
  }

  const formResult = await page.evaluate(() => {
    const form = document.querySelector(".contact-form");
    const button = form?.querySelector("button");
    button?.click();
    const invalidState = {
      invalidFields: Array.from(form?.querySelectorAll(".is-invalid") || []).map((field) => field.name),
      status: form?.querySelector(".form-status")?.textContent.trim() || "",
      nameError: form?.querySelector('[data-error-for="name"]')?.textContent.trim() || "",
      contactError: form?.querySelector('[data-error-for="contact"]')?.textContent.trim() || ""
    };

    const setField = (name, value) => {
      const field = form.elements[name];
      field.value = value;
      field.dispatchEvent(new Event(field.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
    };

    document.querySelector('[data-service="modelagem-3d"]')?.click();
    setField("name", "Teste DATUM");
    setField("contact", "contato-invalido");
    setField("intent", "parceria-tecnica");
    setField("message", "Apoio técnico em um projeto.");
    button?.click();
    const invalidContactRejected = Boolean(form.elements.contact.classList.contains("is-invalid"));

    setField("contact", "teste@datum.com.br");

    let openedWhatsappUrl = "";
    const nativeAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function captureLeadLink() {
      if (this.href.startsWith("https://wa.me/")) {
        openedWhatsappUrl = this.href;
        return;
      }
      nativeAnchorClick.call(this);
    };

    button?.click();
    HTMLAnchorElement.prototype.click = nativeAnchorClick;

    const leadEvent = window.dataLayer?.find((item) => item.event === "datum_lead_submit") || null;
    const whatsappMessage = openedWhatsappUrl
      ? new URL(openedWhatsappUrl).searchParams.get("text")
      : "";

    return {
      invalidState,
      submission: {
        invalidContactRejected,
        servicePrefilledFromCard: form.elements.service.value === "modelagem-3d",
        openedWhatsapp: Boolean(openedWhatsappUrl),
        whatsappMessage,
        leadEvent
      }
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
    cardMotionResult,
    scrollControlResult,
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
