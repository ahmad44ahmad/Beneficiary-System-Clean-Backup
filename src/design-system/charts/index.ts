/**
 * Design system charts — Phase 2.5 substrate.
 *
 * Recharts wrappers that enforce HRSD brand rules (palette, pie 12-o'clock
 * convention, max 5 slices, label colors). Existing chart files can
 * migrate one at a time:
 *
 * Before:
 *   <Cell fill="#ec4899" />  // off-palette pink
 *   <Bar dataKey="x" fill="#2BB574" />
 *
 * After:
 *   const { color } = useChartPalette();
 *   <Cell fill={color(0)} />
 *   <Bar dataKey="x" fill={color(0)} />
 *
 * For pies specifically, prefer <BrandPie> which applies all four brand
 * rules at once (palette + sort + clamp + 12-o'clock).
 */

export { BrandPie } from './BrandPie';
export type { BrandPieDatum } from './BrandPie';
export { useChartPalette } from './useChartPalette';
export {
    CHART_PALETTE_DEFAULT,
    CHART_PALETTE_FORMAL,
    MAX_PIE_SLICES,
    paletteForLevel,
    colorAt,
    chartTitleStyle,
    chartLabelStyle,
} from './palette';
