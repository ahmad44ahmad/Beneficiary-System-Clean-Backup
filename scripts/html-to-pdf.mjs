#!/usr/bin/env node
/**
 * Convert an HTML file to PDF using Playwright's Chromium.
 * Preserves @page rules, print-color-adjust, Arabic fonts, RTL layout.
 *
 * Usage:
 *   node scripts/html-to-pdf.mjs <input.html> <output.pdf>
 */

import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const [inputArg, outputArg] = process.argv.slice(2);

if (!inputArg || !outputArg) {
    console.error('Usage: node scripts/html-to-pdf.mjs <input.html> <output.pdf>');
    process.exit(1);
}

const input = resolve(inputArg);
const output = resolve(outputArg);

if (!existsSync(input)) {
    console.error(`Input file not found: ${input}`);
    process.exit(1);
}

console.log(`Converting:\n  ${input}\n  → ${output}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

// Navigate to the HTML file and wait for all resources (including Google Fonts) to load.
await page.goto(pathToFileURL(input).href, { waitUntil: 'networkidle' });

// Give web fonts an extra moment to finish rendering before PDF capture.
await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }
});

// Force print media emulation so @media print styles apply.
await page.emulateMedia({ media: 'print' });

// preferCSSPageSize: respects the @page rule in the HTML (A4 + margins).
// printBackground: keeps colors, gradients, and backgrounds.
await page.pdf({
    path: output,
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    displayHeaderFooter: false,
});

await browser.close();
console.log(`✓ PDF written: ${output}`);
