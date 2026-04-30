/**
 * Accessibility tokens — Phase 2.5 substrate.
 *
 * The HRSD brand palette has known WCAG contrast hazards on white
 * backgrounds:
 *   - Gold #FCB614  contrast ≈ 1.6:1   FAILS AA (needs 4.5:1 for body)
 *   - Orange #F7941D contrast ≈ 2.5:1  FAILS AA for body
 *   - Cool Gray #7A7A7A contrast ≈ 4.5:1  borderline AA pass
 *
 * The brand body-text rule ("body = gray or white only") happens to
 * be a11y-compatible. The danger is in *non-body* surfaces: badges,
 * status pills, callout banners. This module provides the helpers to
 * keep those compliant.
 *
 * Per Ahmad's "لا تعقّد" directive: contrast is a runtime warning in
 * dev, not a CI gate. Ministry team will run their own WCAG audit
 * before production rollout.
 */

import { brand } from './tokens';

/** Standard focus ring spec. Used by Button, Input, links, anything tabbable. */
export const FOCUS_RING = {
    /** 2px ring, gold per HRSD palette — high contrast against navy header */
    color: brand.gold.hex,
    width: 2,
    offset: 2,
    /** Tailwind class shorthand for focus-visible state. */
    className: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FCB614]',
} as const;

/**
 * Computes WCAG contrast ratio between two hex colors.
 * Returns a number from 1 (no contrast) to 21 (max contrast, black/white).
 *
 * AA threshold: 4.5 for body text, 3.0 for large text.
 * AAA threshold: 7.0 for body text, 4.5 for large text.
 */
export const contrastRatio = (hex1: string, hex2: string): number => {
    const luminance = (hex: string): number => {
        const rgb = hex.replace('#', '').match(/.{2}/g);
        if (!rgb) return 0;
        const [r, g, b] = rgb.map(c => {
            const v = parseInt(c, 16) / 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

/** AA pass for normal body text (4.5:1). */
export const passesAA = (fg: string, bg: string): boolean =>
    contrastRatio(fg, bg) >= 4.5;

/** AA pass for large text or UI components (3:1). */
export const passesAALarge = (fg: string, bg: string): boolean =>
    contrastRatio(fg, bg) >= 3.0;

/**
 * Pre-computed safe foreground/background pairs for common cases.
 * Use these in StatusBadge, Callout, etc. instead of free-form mixing.
 */
export const SAFE_PAIRS = {
    /** Body text on white surface. */
    bodyOnWhite: { fg: brand.coolGray.hex, bg: '#FFFFFF' },
    /** Body text on navy surface (dark mode). */
    bodyOnNavy: { fg: '#FFFFFF', bg: brand.navy.hex },
    /** Heading on white. */
    headingOnWhite: { fg: brand.navy.hex, bg: '#FFFFFF' },
    /** Heading on navy (dark mode). */
    headingOnNavy: { fg: '#FFFFFF', bg: brand.navy.hex },
    /** Status badges: white text on saturated brand colors. */
    badgeOnTeal: { fg: '#FFFFFF', bg: brand.teal.hex },
    badgeOnGreen: { fg: '#FFFFFF', bg: brand.green.hex },
    /** WARNING: gold/orange need DARK foreground because they fail with white. */
    badgeOnGold: { fg: brand.navy.hex, bg: brand.gold.hex },
    badgeOnOrange: { fg: brand.navy.hex, bg: brand.orange.hex },
} as const;

/**
 * Dev-only assertion. Logs a warning if a fg/bg pair fails AA. No-op in
 * production builds. Useful when introducing a new colored surface.
 */
export const warnIfFailsAA = (fg: string, bg: string, context: string): void => {
    if (!import.meta.env?.DEV) return;
    if (passesAA(fg, bg)) return;
    const ratio = contrastRatio(fg, bg).toFixed(2);
    console.warn(
        `[a11y] Contrast ${ratio}:1 fails AA for body text in "${context}". ` +
        `Use SAFE_PAIRS or pick a different color combination.`
    );
};
