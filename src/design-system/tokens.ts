/**
 * HRSD Design Tokens — Single Source of Truth
 *
 * Built from the official HRSD Brand Guidelines (PDF, 132pp, v1.0 2023, InDesign Sept 2024).
 * Source PDF: C:\Users\aass1\Desktop\HRSD guideline -employee.pdf
 * Canonical reference: ~/.claude/projects/C--Users-aass1/memory/reference_hrsd_brand_identity.md
 *
 * RULES:
 * 1. Color values MUST match the PDF exactly. RGB/HEX/Pantone are not optional.
 * 2. This file is the only place RGB/HEX values for brand colors should live.
 * 3. CSS variables in index.css and hrsd-theme.css must mirror these values.
 * 4. Adding a new "brand color" requires updating the PDF reference; otherwise
 *    it belongs in `semantic` or `neutral`, not `brand`.
 */

/** Brand colors — verbatim from HRSD Guidelines pages 25–28. */
export const brand = {
  /* Primary palette (2 colors) */
  navy: {
    hex: '#0F3144',
    rgb: 'rgb(15, 49, 68)',
    pantone: '2189C',
  },
  white: {
    hex: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    pantone: null,
  },

  /* Secondary palette (5 colors) */
  orange: {
    hex: '#F7941D',
    rgb: 'rgb(247, 148, 29)',
    pantone: '2011C',
  },
  gold: {
    hex: '#FCB614',
    rgb: 'rgb(252, 182, 20)',
    pantone: '7409C',
  },
  teal: {
    hex: '#269798',
    rgb: 'rgb(38, 151, 152)',
    pantone: '2235C',
  },
  green: {
    hex: '#2BB574',
    rgb: 'rgb(43, 181, 116)',
    pantone: '2414C',
  },
  coolGray: {
    hex: '#7A7A7A',
    rgb: 'rgb(122, 122, 122)',
    pantone: 'Cool Gray 9',
  },
} as const;

/**
 * Tints — derived per the brand guideline's 20%-100% scale, used for
 * illustrations, characters, and charts. NOT for body text or buttons.
 */
export const tints = {
  navy: {
    20: 'rgba(15, 49, 68, 0.2)',
    40: 'rgba(15, 49, 68, 0.4)',
    60: 'rgba(15, 49, 68, 0.6)',
    80: 'rgba(15, 49, 68, 0.8)',
    100: brand.navy.hex,
  },
  orange: {
    20: 'rgba(247, 148, 29, 0.2)',
    40: 'rgba(247, 148, 29, 0.4)',
    60: 'rgba(247, 148, 29, 0.6)',
    80: 'rgba(247, 148, 29, 0.8)',
    100: brand.orange.hex,
  },
  gold: {
    20: 'rgba(252, 182, 20, 0.2)',
    40: 'rgba(252, 182, 20, 0.4)',
    60: 'rgba(252, 182, 20, 0.6)',
    80: 'rgba(252, 182, 20, 0.8)',
    100: brand.gold.hex,
  },
  teal: {
    20: 'rgba(38, 151, 152, 0.2)',
    40: 'rgba(38, 151, 152, 0.4)',
    60: 'rgba(38, 151, 152, 0.6)',
    80: 'rgba(38, 151, 152, 0.8)',
    100: brand.teal.hex,
  },
  green: {
    20: 'rgba(43, 181, 116, 0.2)',
    40: 'rgba(43, 181, 116, 0.4)',
    60: 'rgba(43, 181, 116, 0.6)',
    80: 'rgba(43, 181, 116, 0.8)',
    100: brand.green.hex,
  },
  coolGray: {
    20: 'rgba(122, 122, 122, 0.2)',
    40: 'rgba(122, 122, 122, 0.4)',
    60: 'rgba(122, 122, 122, 0.6)',
    80: 'rgba(122, 122, 122, 0.8)',
    100: brand.coolGray.hex,
  },
} as const;

/**
 * Light/dark navy variants — derived shades for hover states, dark navy
 * accents, etc. Not in the original brand book; used internally only.
 */
export const navyShades = {
  base: brand.navy.hex,
  dark: '#0A2030',
  light: '#1F4A60',
} as const;

/**
 * Semantic colors — system status colors NOT in the brand palette.
 * Reserved for: badges, alerts, validation states, audit-trail status.
 * Should NOT be used as primary visual elements.
 */
export const semantic = {
  success: '#2BB574',
  warning: '#FCB614',
  danger: '#DC2626',
  info: '#269798',
} as const;

/**
 * Neutrals — for surfaces, borders, dividers. NOT brand-defining.
 * Body text MUST use brand.coolGray.hex; secondary text may use these.
 */
export const neutral = {
  white: '#FFFFFF',
  surface50: '#F9FAFB',
  surface100: '#F3F4F6',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  textBody: brand.coolGray.hex,
  textSecondary: '#9CA3AF',
  textOnDark: '#FFFFFF',
} as const;

/** Typography — current production fonts (Tajawal/Plex). HRSD Gov pending license. */
export const typography = {
  arabic: 'Tajawal, "IBM Plex Sans Arabic", "Cairo", sans-serif',
  numeric: 'Tajawal, "Readex Pro", system-ui, sans-serif',
} as const;

/**
 * Brand level — controls Formal vs Default appearance per the guideline.
 * Formal: ministerial speeches, press releases, briefings to deputy minister+.
 *         Strict gray + primary palette only. Icons blue/white only.
 * Default: all other surfaces. Full secondary palette.
 */
export type BrandLevel = 'formal' | 'default';

/** Helper: get the allowed accent colors for a given brand level. */
export const accentsForLevel = (level: BrandLevel): string[] => {
  if (level === 'formal') {
    return [brand.navy.hex, brand.coolGray.hex, brand.white.hex];
  }
  return [
    brand.orange.hex,
    brand.gold.hex,
    brand.teal.hex,
    brand.green.hex,
    brand.coolGray.hex,
  ];
};

/** Default export for ergonomic imports. */
const tokens = { brand, tints, navyShades, semantic, neutral, typography, accentsForLevel };
export default tokens;
