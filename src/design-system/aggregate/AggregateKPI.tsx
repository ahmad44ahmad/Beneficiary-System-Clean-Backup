import React from 'react';
import { Section, DescriptionList } from '../primitives';
import type { DescriptionItem } from '../primitives';
import { brand } from '../tokens';

/**
 * AggregateKPI — total count + classification breakdown.
 *
 * Used at the top of Wakeel/Branch-GM dashboards. Shows ONE big number
 * (e.g., "145 مستفيد") + a small breakdown table beside it. No drill-in.
 *
 * Per Ahmad's directive: aggregate personas see counts, not records.
 * There is no onClick handler and no <Link> here, intentionally.
 */

export interface AggregateBreakdownRow {
    label: string;
    value: number;
}

interface AggregateKPIProps {
    title: string;
    /** The hero number, formatted for display (e.g., "145" or "1,250"). */
    headline: string;
    /** Optional unit suffix shown after the number ("مستفيد", "موظف"). */
    unit?: string;
    /** Breakdown rows. Pass as numbers; component renders as "32 - شديد" pattern. */
    breakdown?: AggregateBreakdownRow[];
    /** Optional one-line caption beneath the number. */
    caption?: string;
}

export const AggregateKPI: React.FC<AggregateKPIProps> = ({
    title,
    headline,
    unit,
    breakdown,
    caption,
}) => {
    const items: DescriptionItem[] = (breakdown ?? []).map(row => ({
        label: row.label,
        value: row.value.toLocaleString('ar-SA'),
    }));

    return (
        <Section title={title}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-baseline gap-2">
                    <span
                        className="text-5xl md:text-6xl font-extrabold leading-none tabular-nums"
                        style={{ color: brand.navy.hex }}
                    >
                        {headline}
                    </span>
                    {unit && (
                        <span className="text-base font-medium" style={{ color: brand.coolGray.hex }}>
                            {unit}
                        </span>
                    )}
                </div>
                {items.length > 0 && (
                    <div className="md:max-w-xs flex-1">
                        <DescriptionList items={items} layout="two-col" dense />
                    </div>
                )}
            </div>
            {caption && (
                <p className="mt-4 text-xs" style={{ color: brand.coolGray.hex }}>
                    {caption}
                </p>
            )}
        </Section>
    );
};

export default AggregateKPI;
