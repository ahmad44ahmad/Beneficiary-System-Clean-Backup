import React from 'react';
import { Section, EmptyState } from '../primitives';
import { brand } from '../tokens';
import { SAFE_PAIRS } from '../a11y-tokens';

/**
 * RiskRegisterPreview — top 5 active risks for ministerial visibility.
 *
 * Per Ahmad's directive: leadership sees the risks (so they can act),
 * but the register itself is a confidential governance instrument.
 * This view shows ONLY:
 *   - title (sanitized — no beneficiary names, no PII)
 *   - severity
 *   - reporter ROLE (not name)
 *   - logged date
 *
 * The risk register editor lives elsewhere (operational personas only).
 * This component is read-only and never links anywhere.
 */

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface RiskPreviewRow {
    /** Sanitized title. CALLER is responsible for ensuring no PII. */
    title: string;
    severity: RiskSeverity;
    /** Reporter role label, e.g. "مدير المركز", never a name. */
    reporterRole: string;
    /** Logged-at date. Display format. */
    loggedAt: string;
}

interface RiskRegisterPreviewProps {
    rows: RiskPreviewRow[];
    /** Cap for display. Defaults to 5 (ministerial view should be terse). */
    limit?: number;
}

const SEVERITY_LABEL: Record<RiskSeverity, string> = {
    critical: 'حرج',
    high: 'مرتفع',
    medium: 'متوسط',
    low: 'منخفض',
};

const severityPair = (s: RiskSeverity): { fg: string; bg: string } => {
    switch (s) {
        case 'critical':
            return { fg: '#FFFFFF', bg: '#DC2626' };
        case 'high':
            return SAFE_PAIRS.badgeOnOrange;
        case 'medium':
            return SAFE_PAIRS.badgeOnGold;
        case 'low':
            return SAFE_PAIRS.badgeOnTeal;
    }
};

export const RiskRegisterPreview: React.FC<RiskRegisterPreviewProps> = ({
    rows,
    limit = 5,
}) => {
    const visible = rows.slice(0, limit);

    if (visible.length === 0) {
        return (
            <Section title="سجل المخاطر">
                <EmptyState
                    title="لا توجد مخاطر مفعّلة"
                    description="يظهر هنا أعلى ٥ مخاطر فعّالة في السجل لعرضها على القيادة."
                />
            </Section>
        );
    }

    return (
        <Section
            title="سجل المخاطر"
            subtitle={`أعلى ${visible.length} من المخاطر الفعّالة`}
        >
            <ul className="divide-y divide-gray-100" dir="rtl">
                {visible.map((row, idx) => {
                    const pair = severityPair(row.severity);
                    return (
                        <li key={idx} className="flex items-start justify-between gap-4 py-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold" style={{ color: brand.navy.hex }}>
                                    {row.title}
                                </p>
                                <p className="text-xs mt-0.5" style={{ color: brand.coolGray.hex }}>
                                    سُجِّل بواسطة {row.reporterRole} · {row.loggedAt}
                                </p>
                            </div>
                            <span
                                className="shrink-0 text-xs font-bold rounded-full px-2.5 py-0.5"
                                style={{ color: pair.fg, backgroundColor: pair.bg }}
                            >
                                {SEVERITY_LABEL[row.severity]}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
};

export default RiskRegisterPreview;
