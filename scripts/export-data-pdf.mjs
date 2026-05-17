import { chromium } from 'playwright';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const input = path.resolve(root, process.argv[2] || path.join('reports', 'data-conteudo-site.html'));
const output = path.resolve(root, process.argv[3] || path.join('reports', 'DATA-conteudo-institucional-site.pdf'));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1240, height: 1754 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' });
await page.pdf({
  path: output,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: `
    <div style="width:100%; font-size:8px; color:#5e6b76; padding:0 16mm; display:flex; justify-content:space-between; font-family:Arial, sans-serif;">
      <span>DATA - Dossiê institucional</span>
      <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
    </div>
  `,
  margin: { top: '0', right: '0', bottom: '10mm', left: '0' },
});

await browser.close();
console.log(output);
