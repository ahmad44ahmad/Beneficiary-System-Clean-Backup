import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useChartPalette } from './useChartPalette';
import { MAX_PIE_SLICES, chartLabelStyle } from './palette';

/**
 * BrandPie — a pie chart that follows HRSD brand rules automatically.
 *
 * The brand book (p. 96) mandates:
 *   1. Largest slice positioned at 12 o'clock.
 *   2. Slices ordered clockwise descending.
 *   3. Maximum 5 slices — beyond that, switch to a bar chart.
 *
 * Implementation:
 *   - Sorts data by value descending before rendering.
 *   - Clamps to MAX_PIE_SLICES; surplus slices are merged into "أخرى"
 *     using the neutral cool-gray color, with a console warning in dev.
 *   - startAngle=90 (12 o'clock), endAngle=-270 (clockwise to 12).
 *
 * Caller does NOT pass colors — the brand palette handles that.
 */

export interface BrandPieDatum {
    /** Display label. */
    name: string;
    /** Numeric value (any positive number). */
    value: number;
}

interface BrandPieProps {
    data: BrandPieDatum[];
    /** Inner radius for donut style; 0 = solid pie. */
    innerRadius?: number;
    /** Outer radius. Default 80. */
    outerRadius?: number;
    /** Container height. Defaults to 280px. */
    height?: number;
    /** Show legend below the chart. Default true. */
    showLegend?: boolean;
    /** Show data labels on slices. Default false (legend usually clearer). */
    showLabels?: boolean;
    /** Container className passthrough. */
    className?: string;
}

const OTHERS_LABEL = 'أخرى';

export const BrandPie: React.FC<BrandPieProps> = ({
    data,
    innerRadius = 0,
    outerRadius = 80,
    height = 280,
    showLegend = true,
    showLabels = false,
    className = '',
}) => {
    const { color } = useChartPalette();

    const prepared = useMemo<BrandPieDatum[]>(() => {
        const sorted = [...data].sort((a, b) => b.value - a.value);
        if (sorted.length <= MAX_PIE_SLICES) return sorted;

        if (import.meta.env?.DEV) {
            console.warn(
                `[BrandPie] ${sorted.length} slices supplied; HRSD brand limits ` +
                `pies to ${MAX_PIE_SLICES}. Surplus slices merged into "${OTHERS_LABEL}". ` +
                `Consider a bar chart instead.`
            );
        }

        const head = sorted.slice(0, MAX_PIE_SLICES - 1);
        const tail = sorted.slice(MAX_PIE_SLICES - 1);
        const tailSum = tail.reduce((sum, d) => sum + d.value, 0);
        return [...head, { name: OTHERS_LABEL, value: tailSum }];
    }, [data]);

    return (
        <div className={className} dir="rtl">
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={prepared}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        label={showLabels ? { style: chartLabelStyle } : false}
                        isAnimationActive={false}
                    >
                        {prepared.map((_, i) => (
                            <Cell key={i} fill={color(i)} stroke="#FFFFFF" strokeWidth={1} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            fontFamily: 'var(--font-arabic, Tajawal, sans-serif)',
                            fontSize: 12,
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                        }}
                    />
                    {showLegend && (
                        <Legend
                            wrapperStyle={chartLabelStyle}
                            iconType="circle"
                        />
                    )}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BrandPie;
