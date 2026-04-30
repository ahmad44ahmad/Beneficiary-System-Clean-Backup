import React from 'react';
import { Section, EmptyState } from '../primitives';
import { brand } from '../tokens';
import { SAFE_PAIRS } from '../a11y-tokens';

/**
 * ContractorsList — operating companies + contract status.
 *
 * Aggregate-level field per Ahmad: ministry leadership wants to see who
 * is operating which service line and whether contracts are healthy.
 * No financial detail, no individual employee data.
 */

export type ContractStatus = 'active' | 'expiring' | 'expired' | 'tendering';

export interface ContractorRow {
    company: string;
    serviceArea: string; // e.g., "تشغيل وصيانة" or "خدمة التغذية"
    status: ContractStatus;
    /** ISO date string for end of current term. */
    expiresAt?: string;
}

interface ContractorsListProps {
    rows: ContractorRow[];
}

const STATUS_LABEL: Record<ContractStatus, string> = {
    active: 'ساري',
    expiring: 'قارب الانتهاء',
    expired: 'منتهٍ',
    tendering: 'قيد الطرح',
};

const statusPair = (s: ContractStatus): { fg: string; bg: string } => {
    switch (s) {
        case 'active':
            return SAFE_PAIRS.badgeOnTeal;
        case 'expiring':
            return SAFE_PAIRS.badgeOnGold;
        case 'expired':
            return { fg: '#FFFFFF', bg: '#DC2626' };
        case 'tendering':
            return SAFE_PAIRS.bodyOnWhite;
    }
};

export const ContractorsList: React.FC<ContractorsListProps> = ({ rows }) => {
    if (rows.length === 0) {
        return (
            <Section title="الشركات المُشغِّلة">
                <EmptyState
                    title="لم تُسجَّل عقود تشغيل بعد"
                    description="تظهر هنا قائمة الشركات المتعاقدة مع المركز فور إضافتها."
                />
            </Section>
        );
    }

    return (
        <Section title="الشركات المُشغِّلة">
            <ul className="divide-y divide-gray-100" dir="rtl">
                {rows.map((row, idx) => {
                    const pair = statusPair(row.status);
                    return (
                        <li key={idx} className="flex items-center justify-between gap-4 py-3">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold" style={{ color: brand.navy.hex }}>
                                    {row.company}
                                </p>
                                <p className="text-xs" style={{ color: brand.coolGray.hex }}>
                                    {row.serviceArea}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span
                                    className="text-xs font-bold rounded-full px-2.5 py-0.5"
                                    style={{ color: pair.fg, backgroundColor: pair.bg }}
                                >
                                    {STATUS_LABEL[row.status]}
                                </span>
                                {row.expiresAt && (
                                    <span className="text-[10px]" style={{ color: brand.coolGray.hex }}>
                                        ينتهي {row.expiresAt}
                                    </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
};

export default ContractorsList;
