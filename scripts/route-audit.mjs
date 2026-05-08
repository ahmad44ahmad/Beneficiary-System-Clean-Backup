#!/usr/bin/env node
/**
 * Route audit — Playwright sweep across Basira routes.
 *
 * For each route: navigate, wait for late-mount components (≥5s per
 * feedback_wait_before_console_check), evaluate the DOM for known
 * issue patterns, capture console.error count.
 *
 * Output: docs/pitch-prep-route-audit.md (committed, used by Session C).
 *
 * Run from /c/dev/basira:
 *   node scripts/route-audit.mjs                        # against laptop dev (5175)
 *   BASE_URL=https://<deploy-url> node scripts/route-audit.mjs  # against deployed URL
 *
 * On a deployed URL the script visits /dashboard?as=demo first so the
 * AuthContext URL-flag autosignin fires (Session F); subsequent route
 * visits then land authenticated and RLS-protected reads succeed.
 */

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:5175';

// Demo path (validated 2026-04-27) + module-representative routes.
// First 8 are the demo path, in order. Rest are breadth coverage.
const ROUTES = [
  // Demo path
  { path: '/', tag: 'DEMO', label: 'Welcome' },
  { path: '/dashboard', tag: 'DEMO', label: 'Dashboard (executive)' },
  { path: '/empowerment', tag: 'DEMO', label: 'Empowerment (click أبو سعد 172)' },
  { path: '/empowerment/dignity/172', tag: 'DEMO', label: 'DignityFile / أبو سعد' },
  { path: '/family-portal', tag: 'DEMO', label: 'Family Portal' },
  { path: '/family', tag: 'DEMO', label: 'Family (alias)' },
  { path: '/alerts', tag: 'DEMO', label: 'Alerts (= /smart-alerts)' },
  { path: '/smart-alerts', tag: 'DEMO', label: 'SmartAlertsPanel' },
  { path: '/legal-shield', tag: 'DEMO', label: 'Legal Shield' },
  { path: '/quality/manual', tag: 'DEMO', label: 'Quality Manual (132 ops)' },
  { path: '/sroi', tag: 'DEMO', label: 'SROI 1:4.2' },
  { path: '/beneficiaries-list', tag: 'DEMO', label: 'Beneficiaries list (export verified)' },
  // Beneficiary
  { path: '/beneficiaries', tag: 'CORE', label: 'Beneficiary list+detail' },
  { path: '/timeline', tag: 'CORE', label: 'Beneficiary Timeline' },
  // Indicators (7 AI engines)
  { path: '/indicators', tag: 'INDICATORS', label: 'SmartIndicatorsHub' },
  { path: '/indicators/behavioral', tag: 'INDICATORS', label: 'Behavioral Prediction' },
  { path: '/indicators/early-warning', tag: 'INDICATORS', label: 'Early Warning' },
  { path: '/indicators/satisfaction', tag: 'INDICATORS', label: 'Satisfaction Pulse' },
  { path: '/indicators/cost', tag: 'INDICATORS', label: 'Cost per Beneficiary' },
  { path: '/indicators/biological', tag: 'INDICATORS', label: 'Biological Audit' },
  { path: '/indicators/iso', tag: 'INDICATORS', label: 'ISO Compliance' },
  { path: '/indicators/strategic', tag: 'INDICATORS', label: 'Strategic KPI Targets' },
  // Strategic / governance
  { path: '/leadership-compass', tag: 'STRATEGY', label: 'Leadership Compass' },
  { path: '/governance', tag: 'STRATEGY', label: 'Golden Thread / governance' },
  { path: '/strategic', tag: 'STRATEGY', label: 'Strategic KPI dashboard' },
  { path: '/basira', tag: 'STRATEGY', label: 'Executive Dashboard (alt)' },
  { path: '/overview', tag: 'STRATEGY', label: 'Cross-Module Dashboard' },
  { path: '/liability', tag: 'STRATEGY', label: 'Liability Dashboard' },
  // Modules — one each
  { path: '/medical', tag: 'MODULE', label: 'Medical Overview' },
  { path: '/social', tag: 'MODULE', label: 'Social Overview' },
  { path: '/grc', tag: 'MODULE', label: 'GRC Dashboard' },
  { path: '/grc/excellence', tag: 'MODULE', label: 'Quality Excellence Hub' },
  { path: '/ipc', tag: 'MODULE', label: 'IPC Dashboard' },
  { path: '/catering', tag: 'MODULE', label: 'Catering Dashboard' },
  { path: '/operations', tag: 'MODULE', label: 'Operations Dashboard' },
  { path: '/operations/assets', tag: 'MODULE', label: 'Asset Registry (knows قريباً)' },
  { path: '/clothing', tag: 'MODULE', label: 'Clothing (knows قريباً)' },
  { path: '/handover', tag: 'MODULE', label: 'Shift Handover' },
  { path: '/scheduling', tag: 'MODULE', label: 'Scheduling (Session A fix verified)' },
  { path: '/emergency', tag: 'MODULE', label: 'Emergency (Session A fix verified)' },
  { path: '/pulse', tag: 'MODULE', label: 'Morning Pulse' },
  { path: '/wellbeing', tag: 'MODULE', label: 'Wellbeing Heatmap' },
  // Reports
  { path: '/reports', tag: 'REPORTS', label: 'Reports Dashboard' },
  { path: '/executive-report', tag: 'REPORTS', label: 'Executive Report' },
  { path: '/aggregate', tag: 'REPORTS', label: 'Aggregate Dashboard' },
  { path: '/integrated-reports', tag: 'REPORTS', label: 'Integrated Dashboard' },
  // Admin
  { path: '/admin/audit-logs', tag: 'ADMIN', label: 'Audit Log Viewer' },
  { path: '/structure', tag: 'ADMIN', label: 'Org Structure' },
  { path: '/staff', tag: 'ADMIN', label: 'Staff Profile' },
  { path: '/permissions', tag: 'ADMIN', label: 'Permissions' },
  { path: '/settings', tag: 'ADMIN', label: 'Settings' },
];

/**
 * In-page audit — runs in the browser context for each route.
 * Returns: counts + a few representative samples per category.
 */
const AUDIT_FN = `() => {
  const out = {
    bodyTextLen: 0,
    htmlLen: document.documentElement.outerHTML.length,

    // White-on-white (computed color === backgroundColor on text-bearing elements)
    whiteOnWhite: [],
    // Other identical color/bg combos (text invisible)
    invisibleText: [],
    // English-text fragments in body (likely missed translations)
    englishFragments: [],
    // Empty buttons (no text + no aria-label + no title)
    emptyButtons: 0,
    // Buttons with onclick="alert(...)" or pure no-op
    placeholderButtons: 0,
    // Explicit "قريباً" markers
    qareebanCount: 0,
    // Broken images (failed naturalWidth=0)
    brokenImages: 0,
    // Total interactive elements
    buttons: 0,
    inputs: 0,

    // RTL flag
    isRTL: document.documentElement.getAttribute('dir') === 'rtl' || document.body.getAttribute('dir') === 'rtl',
    lang: document.documentElement.getAttribute('lang') || 'unknown',
  };

  out.bodyTextLen = (document.body?.innerText || '').length;

  // Scan visible elements for invisible-text issues
  const visible = Array.from(document.querySelectorAll('body *')).filter(el => {
    if (!el || !el.offsetParent) return false;
    const r = el.getBoundingClientRect();
    return r.width > 5 && r.height > 5;
  });

  const norm = (c) => {
    if (!c) return '';
    // normalize "rgb(255, 255, 255)" / "rgba(255, 255, 255, 1)" / etc.
    return c.replace(/\\s+/g, '').replace(/,1\\)$/, ')').replace('rgba(','rgb(');
  };

  for (const el of visible) {
    const text = (el.innerText || '').trim();
    if (!text || text.length < 2) continue;
    // only leaf-ish nodes (avoid double-counting parents)
    if (el.children && el.children.length > 0 && el.children[0].innerText === text) continue;

    const cs = window.getComputedStyle(el);
    const fg = norm(cs.color);
    const bg = norm(cs.backgroundColor);

    // White on white
    if ((fg === 'rgb(255,255,255)' || fg === '#fff' || fg === '#ffffff')
        && (bg === 'rgb(255,255,255)' || bg === '#fff' || bg === '#ffffff')) {
      if (out.whiteOnWhite.length < 5) {
        out.whiteOnWhite.push({
          tag: el.tagName,
          text: text.slice(0, 60),
          cls: (el.className || '').toString().slice(0, 80)
        });
      }
    }
    // Other identical fg/bg (transparent backgrounds excluded)
    else if (fg === bg && fg !== 'rgba(0,0,0,0)' && !fg.includes('transparent')) {
      if (out.invisibleText.length < 5) {
        out.invisibleText.push({
          tag: el.tagName,
          text: text.slice(0, 60),
          fg, bg,
          cls: (el.className || '').toString().slice(0, 80)
        });
      }
    }

    // English fragments: text > 6 chars, mostly ASCII letters, and NOT a recognized brand/term
    if (text.length > 6 && text.length < 200) {
      const arabic = (text.match(/[\\u0600-\\u06FF]/g) || []).length;
      const latin = (text.match(/[A-Za-z]/g) || []).length;
      if (latin > 0 && latin > arabic * 2) {
        // Allow brand/code words that are legitimately English
        const allow = /^(Basira|HRSD|MHRSD|ISO|NCA|PDPL|CRPD|CBAHI|admin|Excel|PDF|CSV|API|N95|JSON|YAML|UTF|POST|GET|SROI|KPI|IoT|AI|UI|ID|QR|Tanstack|DEBUG|ROLE|SWITCHER|Open|Tanstack)\\b/;
        const stripped = text.replace(allow, '').replace(/[^A-Za-z]/g, '');
        if (stripped.length > 6 && out.englishFragments.length < 8) {
          out.englishFragments.push({
            tag: el.tagName,
            text: text.slice(0, 100),
            cls: (el.className || '').toString().slice(0, 80)
          });
        }
      }
    }
  }

  // Buttons
  const buttons = Array.from(document.querySelectorAll('button'));
  out.buttons = buttons.length;
  out.emptyButtons = buttons.filter(b => {
    const t = (b.textContent || '').trim();
    const a = b.getAttribute('aria-label') || '';
    const tt = b.getAttribute('title') || '';
    return !t && !a && !tt && b.querySelectorAll('svg').length === 0;
  }).length;
  // Heuristic: buttons whose onclick attribute contains alert(
  out.placeholderButtons = Array.from(document.querySelectorAll('button[onclick]'))
    .filter(b => /alert\\(/.test(b.getAttribute('onclick') || ''))
    .length;

  out.inputs = document.querySelectorAll('input, textarea, select').length;

  // قريباً markers in body text
  out.qareebanCount = ((document.body?.innerText || '').match(/قريبا[ًه]?/g) || []).length;

  // Broken images
  out.brokenImages = Array.from(document.querySelectorAll('img'))
    .filter(img => img.complete && img.naturalWidth === 0).length;

  return out;
}`;

// ──────────────────────────────────────────────────────────────────────

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const OUT = resolve(process.cwd(), 'docs', 'pitch-prep-route-audit.md');

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1366, height: 768 },
  locale: 'ar-SA',
  // Accept self-signed cert if any
  ignoreHTTPSErrors: true,
});
const page = await ctx.newPage();

// Auth setup — visit /dashboard?as=demo first so the URL-flag autosignin
// fires (Session F). After this the session is in localStorage and every
// audited route lands authenticated.
console.log(`Auth setup: ${BASE}/dashboard?as=demo`);
await page.goto(BASE + '/dashboard?as=demo', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(7000);

const results = [];
let i = 0;
for (const r of ROUTES) {
  i++;
  const consoleErrors = [];
  const consoleWarnings = [];
  const onErr = (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 300));
    if (msg.type() === 'warning') consoleWarnings.push(msg.text().slice(0, 200));
  };
  const onPageErr = (err) => consoleErrors.push('PAGEERR: ' + (err.message || String(err)).slice(0, 300));
  page.on('console', onErr);
  page.on('pageerror', onPageErr);

  const startedAt = Date.now();
  let navError = null;
  try {
    await page.goto(BASE + r.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (e) {
    navError = e.message;
  }
  // Wait for late-mounting React components
  await page.waitForTimeout(5000);

  let audit = null;
  let auditError = null;
  try {
    audit = await page.evaluate(AUDIT_FN);
  } catch (e) {
    auditError = e.message;
  }

  const elapsed = Date.now() - startedAt;
  page.off('console', onErr);
  page.off('pageerror', onPageErr);

  results.push({
    idx: i,
    ...r,
    elapsedMs: elapsed,
    navError,
    auditError,
    consoleErrors,
    consoleWarnings,
    audit,
  });

  // eslint-disable-next-line no-console
  console.log(`[${i}/${ROUTES.length}] ${r.path}  err=${consoleErrors.length}  ww=${audit?.whiteOnWhite?.length||0}  en=${audit?.englishFragments?.length||0}  empty=${audit?.emptyButtons||0}`);
}

await browser.close();

// ──────────────────────────────────────────────────────────────────────
// Render markdown report

const total = results.length;
const errs = results.reduce((a, r) => a + (r.consoleErrors?.length || 0), 0);
const ww = results.reduce((a, r) => a + (r.audit?.whiteOnWhite?.length || 0), 0);
const en = results.reduce((a, r) => a + (r.audit?.englishFragments?.length || 0), 0);
const eb = results.reduce((a, r) => a + (r.audit?.emptyButtons || 0), 0);
const qa = results.reduce((a, r) => a + (r.audit?.qareebanCount || 0), 0);
const navFails = results.filter(r => r.navError).length;
const noBody = results.filter(r => (r.audit?.bodyTextLen || 0) < 50).length;

let md = `# Pitch-prep route audit — ${ts}\n\n`;
md += `**Source:** \`scripts/route-audit.mjs\`. Generated headless via Playwright/Chromium against \`${BASE}\`.\n\n`;
md += `**Routes scanned:** ${total}. **Demo path = first 12 entries** (per \`docs/pitch-prep.md\` §"Demo path").\n\n`;
md += `## Aggregate counts\n\n`;
md += `| Metric | Total |\n|---|---|\n`;
md += `| Console errors (across all routes) | **${errs}** |\n`;
md += `| White-on-white text instances (visible) | **${ww}** |\n`;
md += `| Same-color fg/bg invisible text (other) | **${results.reduce((a,r)=>a+(r.audit?.invisibleText?.length||0),0)}** |\n`;
md += `| English-fragment candidates in body text | **${en}** |\n`;
md += `| Empty buttons (no text/aria-label/title/icon) | **${eb}** |\n`;
md += `| "قريباً" markers in body text | **${qa}** |\n`;
md += `| Broken images (naturalWidth=0) | **${results.reduce((a,r)=>a+(r.audit?.brokenImages||0),0)}** |\n`;
md += `| Routes that failed to navigate | **${navFails}** |\n`;
md += `| Routes with <50 chars body text (likely empty/skeleton) | **${noBody}** |\n\n`;

// Per-route ranked table
md += `## Per-route summary (sorted by issue density)\n\n`;
md += `Issue density score = consoleErrors×3 + whiteOnWhite×3 + invisibleText×2 + englishFragments×1 + emptyButtons×1 + qareeban×1.\n\n`;
md += `| # | Tag | Route | Density | err | ww | inv | en | btn | qareeban | bodyLen | nav |\n`;
md += `|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
const ranked = results
  .map(r => {
    const a = r.audit || {};
    const density =
      (r.consoleErrors?.length || 0) * 3 +
      (a.whiteOnWhite?.length || 0) * 3 +
      (a.invisibleText?.length || 0) * 2 +
      (a.englishFragments?.length || 0) * 1 +
      (a.emptyButtons || 0) * 1 +
      (a.qareebanCount || 0) * 1;
    return { ...r, density };
  })
  .sort((a, b) => b.density - a.density);

for (const r of ranked) {
  const a = r.audit || {};
  md += `| ${r.idx} | ${r.tag} | \`${r.path}\` | **${r.density}** | ${r.consoleErrors?.length || 0} | ${a.whiteOnWhite?.length || 0} | ${a.invisibleText?.length || 0} | ${a.englishFragments?.length || 0} | ${a.emptyButtons || 0} | ${a.qareebanCount || 0} | ${a.bodyTextLen ?? '?'} | ${r.navError ? 'FAIL' : 'ok'} |\n`;
}

// Detail blocks for routes with density > 0
md += `\n## Detail per affected route\n\n`;
const affected = ranked.filter(r => r.density > 0 || r.navError);
if (affected.length === 0) {
  md += `_No routes flagged any issues._\n`;
} else {
  for (const r of affected) {
    const a = r.audit || {};
    md += `\n### \`${r.path}\` — ${r.label} (density ${r.density})\n\n`;
    if (r.navError) md += `- **Nav failed:** ${r.navError}\n`;
    if (r.consoleErrors?.length) {
      md += `- **Console errors (${r.consoleErrors.length}):**\n`;
      for (const e of r.consoleErrors.slice(0, 5)) md += `  - \`${e.replace(/\\n/g, ' ').slice(0, 240)}\`\n`;
    }
    if (a.whiteOnWhite?.length) {
      md += `- **White-on-white text:**\n`;
      for (const w of a.whiteOnWhite) md += `  - \`<${w.tag.toLowerCase()}>\` "${w.text}" — class: \`${w.cls}\`\n`;
    }
    if (a.invisibleText?.length) {
      md += `- **Same-color fg/bg invisible text:**\n`;
      for (const w of a.invisibleText) md += `  - \`<${w.tag.toLowerCase()}>\` "${w.text}" fg=${w.fg} bg=${w.bg}\n`;
    }
    if (a.englishFragments?.length) {
      md += `- **English-fragment candidates (might be untranslated):**\n`;
      for (const e of a.englishFragments) md += `  - \`<${e.tag.toLowerCase()}>\` "${e.text}"\n`;
    }
    if (a.qareebanCount) md += `- **\`قريباً\` markers:** ${a.qareebanCount} in body text\n`;
    if (a.emptyButtons) md += `- **Empty buttons (no text/aria-label/title/icon):** ${a.emptyButtons}\n`;
    if (a.brokenImages) md += `- **Broken images:** ${a.brokenImages}\n`;
  }
}

md += `\n---\n\n_Generated automatically; commit alongside \`docs/pitch-prep.md\` for Session C ingestion._\n`;

writeFileSync(OUT, md, 'utf8');
console.log(`\nWrote ${OUT}`);
console.log(`Aggregate: ${errs} console errors, ${ww} white-on-white, ${en} EN fragments, ${eb} empty buttons across ${total} routes.`);
