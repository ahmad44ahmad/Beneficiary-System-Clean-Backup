import type React from 'react';
import { brand } from '../tokens';
import type { BrandLevel } from '../tokens';

/**
 * Chart palettes — Phase 2.5 substrate.
 *
 * HRSD brand book p. 96-97:
 *   - Charts may use the full secondary palette in Default level.
 *   - Formal level charts: gray + primary palette only (icons blue+white).
 *   - No 3D, no shadows, no gradients.
 *   - Adjacent tints in one chart are forbidden — use distinct colors.
 *
 * Order is fixed across the app so the same data category lands on the
 * same color in every chart. This avoids the "same value, different
 * color" reader confusion we saw in the prior bespoke charts.
 */

/** Default-level palette: secondary palette, ordered for visual distinction. */
export const CHART_PALETTE_DEFAULT: readonly string[] = [
    brand.teal.hex,    // primary status / positive
    brand.orange.hex,  // attention
    brand.green.hex,   // achievement / completion
    brand.gold.hex,    // pending / in-progress
    brand.coolGray.hex, // neutral / "other"
] as const;

/** Formal-level palette: navy + cool-gray only, with white as separator. */
export const CHART_PALETTE_FORMAL: readonly string[] = [
    brand.navy.hex,
    brand.coolGray.hex,
    '#1F4A60', // navy-light derived (per tokens.ts navyShades)
    '#0A2030', // navy-dark
    '#9CA3AF', // neutral text-secondary
] as const;

/**
 * Maximum slices/series before the brand book demands a switch to a
 * different chart type (pie → bar). Enforced by BrandPie via clamp.
 */
export const MAX_PIE_SLICES = 5;

/** Resolves the palette array for a given brand level. */
export const paletteForLevel = (level: BrandLevel): readonly string[] =>
    level === 'formal' ? CHART_PALETTE_FORMAL : CHART_PALETTE_DEFAULT;

/**
 * Picks a color for an indexed series. Wraps modulo length so charts
 * with more series than palette slots still render (with repetition —
 * a soft signal that the chart should be redesigned).
 */
export const colorAt = (level: BrandLevel, index: number): string => {
    const palette = paletteForLevel(level);
    return palette[index % palette.length];
};

/**
 * Style preset for chart titles — HRSD Title weight, navy in light mode.
 * Inline-style object so it can be passed to Recharts <text> elements
 * which don't accept Tailwind classes.
 */
export const chartTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-arabic, Tajawal, "IBM Plex Sans Arabic", sans-serif)',
    fontWeight: 700,
    fill: brand.navy.hex,
    fontSize: 14,
};

/**
 * Style preset for chart labels — body weight, cool-gray (per HRSD body
 * text rule: gray or white, never secondary colors).
 */
export const chartLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-arabic, Tajawal, sans-serif)',
    fontWeight: 500,
    fill: brand.coolGray.hex,
    fontSize: 12,
};
