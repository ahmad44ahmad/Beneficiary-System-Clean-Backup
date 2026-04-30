import React from 'react';
import { brand } from '../tokens';

/**
 * DescriptionList — labeled key/value rows for beneficiary detail pages,
 * profile sheets, and aggregate KPI summaries.
 *
 * Body text in cool-gray (per HRSD brand: body text is gray or white,
 * never secondary colors). Labels in cool-gray, slightly smaller. Values
 * in navy (light mode) or white (dark mode) — slightly heavier weight.
 *
 * Two layouts:
 *   - 'stacked'  → label above value (mobile-first).
 *   - 'two-col'  → label start, value end (desktop, RTL aware).
 *
 * Renders as semantic <dl><dt><dd>.
 */

export interface DescriptionItem {
    label: React.ReactNode;
    value: React.ReactNode;
    /** Optional trailing badge or icon (e.g. status dot). */
    suffix?: React.ReactNode;
}

interface DescriptionListProps {
    items: DescriptionItem[];
    layout?: 'stacked' | 'two-col';
    /** Compact spacing for tightly-packed sheets. */
    dense?: boolean;
    className?: string;
}

export const DescriptionList: React.FC<DescriptionListProps> = ({
    items,
    layout = 'stacked',
    dense = false,
    className = '',
}) => {
    const rowGap = dense ? 'gap-2' : 'gap-3';
    const itemGap = dense ? 'py-2' : 'py-3';

    if (layout === 'two-col') {
        return (
            <dl
                className={`divide-y divide-gray-100 dark:divide-white/10 ${className}`}
                dir="rtl"
            >
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`grid grid-cols-3 gap-4 ${itemGap}`}
                    >
                        <dt
                            className="col-span-1 text-sm"
                            style={{ color: brand.coolGray.hex }}
                        >
                            {item.label}
                        </dt>
                        <dd className="col-span-2 text-sm font-medium text-hrsd-navy dark:text-white flex items-center gap-2">
                            <span className="min-w-0">{item.value}</span>
                            {item.suffix && <span className="shrink-0">{item.suffix}</span>}
                        </dd>
                    </div>
                ))}
            </dl>
        );
    }

    return (
        <dl className={`flex flex-col ${rowGap} ${className}`} dir="rtl">
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                    <dt
                        className="text-xs font-medium"
                        style={{ color: brand.coolGray.hex }}
                    >
                        {item.label}
                    </dt>
                    <dd className="text-sm font-semibold text-hrsd-navy dark:text-white flex items-center gap-2">
                        <span className="min-w-0">{item.value}</span>
                        {item.suffix && <span className="shrink-0">{item.suffix}</span>}
                    </dd>
                </div>
            ))}
        </dl>
    );
};

export default DescriptionList;
