import React from 'react';
import { Section, DescriptionList } from '../primitives';
import type { DescriptionItem } from '../primitives';

/**
 * StaffingOverview — counts by role, no individual names.
 *
 * Aggregate personas see "10 أخصائيين، 5 ممرضين"; never "أحمد، سلمى".
 * The component intentionally accepts only role+count rows. If a
 * caller has staff records, they MUST aggregate before passing here.
 */

export interface RoleCount {
    /** Role display label, dignity-language compliant. */
    role: string;
    count: number;
    /** Optional secondary label, e.g. shift coverage "(٢ صباحي · ٣ مسائي)". */
    note?: string;
}

interface StaffingOverviewProps {
    /** Total headcount (precomputed; not derived from rows for clarity). */
    total: number;
    rows: RoleCount[];
    /** Optional caption — e.g. last-update timestamp. */
    caption?: string;
}

export const StaffingOverview: React.FC<StaffingOverviewProps> = ({
    total,
    rows,
    caption,
}) => {
    const items: DescriptionItem[] = rows.map(row => ({
        label: row.role,
        value: row.count.toLocaleString('ar-SA'),
        suffix: row.note ? (
            <span className="text-xs text-hrsd-cool-gray">{row.note}</span>
        ) : undefined,
    }));

    return (
        <Section
            title="الكادر الوظيفي"
            subtitle={`الإجمالي: ${total.toLocaleString('ar-SA')} موظف`}
        >
            <DescriptionList items={items} layout="two-col" />
            {caption && (
                <p className="mt-3 text-xs text-hrsd-cool-gray">{caption}</p>
            )}
        </Section>
    );
};

export default StaffingOverview;
