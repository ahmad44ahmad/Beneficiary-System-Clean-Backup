#!/usr/bin/env node
import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const slides = [
    { html: 'C:/tmp/basira-deck/slide1.html', png: 'C:/tmp/basira-deck/slide1.png' },
    { html: 'C:/tmp/basira-deck/slide2.html', png: 'C:/tmp/basira-deck/slide2.png' },
    { html: 'C:/tmp/basira-deck/slide3.html', png: 'C:/tmp/basira-deck/slide3.png' },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
});

for (const { html, png } of slides) {
    const page = await context.newPage();
    const url = pathToFileURL(resolve(html)).href;
    console.log(`→ ${html}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
    });
    // small extra delay for any final layout
    await page.waitForTimeout(800);
    await page.screenshot({
        path: resolve(png),
        type: 'png',
        clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    console.log(`  saved → ${png}`);
    await page.close();
}

await browser.close();
console.log('Done.');
