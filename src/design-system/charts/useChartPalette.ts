import { useMemo } from 'react';
import { useBrandLevel } from '../BrandLevelProvider';
import { paletteForLevel, colorAt } from './palette';

/**
 * Hook — returns the chart palette for the current brand level + a
 * convenience indexer. Use inside Recharts charts to color Cells / Bar /
 * Line / Area without hard-coding hex values.
 *
 * Usage:
 *   const { palette, color } = useChartPalette();
 *   <Bar dataKey="value" fill={color(0)} />
 *   <Line dataKey="trend" stroke={color(1)} />
 */
export const useChartPalette = () => {
    const { level } = useBrandLevel();
    return useMemo(() => ({
        level,
        palette: paletteForLevel(level),
        /** color at index, modulo palette length. */
        color: (index: number) => colorAt(level, index),
    }), [level]);
};
