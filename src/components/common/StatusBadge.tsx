import React from 'react';
import { Clock, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { brand } from '../../design-system/tokens';
import { SAFE_PAIRS } from '../../design-system/a11y-tokens';

type StatusType =
    | 'pending' | 'delivered' | 'consumed' | 'refused' | 'preparing' | 'ready'
    | 'active' | 'inactive' | 'completed' | 'cancelled'
    | 'low' | 'medium' | 'high' | 'critical';

interface StatusBadgeProps {
    status: StatusType | string;
    size?: 'sm' | 'md';
    showIcon?: boolean;
}

/**
 * Status badge — brand-strict, AA-compliant.
 *
 * Earlier versions used `text-[#X] bg-[#X]/10` (same-hue text on tinted
 * background). That fails the HRSD body-text rule ("body = gray or
 * white only") and gives borderline contrast. This version uses solid
 * brand colors with high-contrast foregrounds drawn from SAFE_PAIRS in
 * `design-system/a11y-tokens.ts`:
 *   - good states     → white on green   (AA pass)
 *   - in-progress     → white on teal    (AA pass)
 *   - warning         → navy on gold     (AA pass — gold + white fails)
 *   - elevated        → navy on orange   (AA pass)
 *   - critical        → white on red     (AA pass)
 *   - neutral         → cool-gray on light gray (body-text rule)
 *
 * API preserved verbatim (status / size / showIcon) so existing
 * consumers (CateringDailyLog and indirect re-exports) need no changes.
 */
interface ToneSpec {
    label: string;
    fg: string;
    bg: string;
    icon?: React.ElementType;
}

const NEUTRAL_PAIR: { fg: string; bg: string } = { fg: brand.coolGray.hex, bg: '#F3F4F6' };

const statusConfig: Record<string, ToneSpec> = {
    // Meal statuses
    pending:   { label: 'معلق',         ...NEUTRAL_PAIR,                       icon: Clock },
    preparing: { label: 'قيد التحضير',  ...SAFE_PAIRS.badgeOnGold,             icon: Clock },
    ready:     { label: 'جاهز',         ...SAFE_PAIRS.badgeOnTeal,             icon: Check },
    delivered: { label: 'تم التسليم',   ...SAFE_PAIRS.badgeOnTeal,             icon: Check },
    consumed:  { label: 'تم الاستهلاك', ...SAFE_PAIRS.badgeOnGreen,            icon: CheckCircle2 },
    refused:   { label: 'رفض الوجبة',   fg: '#FFFFFF', bg: '#DC2626',          icon: X },

    // General statuses
    active:    { label: 'نشط',          ...SAFE_PAIRS.badgeOnGreen,            icon: CheckCircle2 },
    inactive:  { label: 'غير نشط',      ...NEUTRAL_PAIR },
    completed: { label: 'مكتمل',        ...SAFE_PAIRS.badgeOnGreen,            icon: CheckCircle2 },
    cancelled: { label: 'ملغى',         fg: '#FFFFFF', bg: '#DC2626',          icon: X },

    // Risk levels
    low:       { label: 'منخفض',        ...SAFE_PAIRS.badgeOnGreen },
    medium:    { label: 'متوسط',        ...SAFE_PAIRS.badgeOnGold },
    high:      { label: 'عالي',         ...SAFE_PAIRS.badgeOnOrange,           icon: AlertCircle },
    critical:  { label: 'حرج',          fg: '#FFFFFF', bg: '#DC2626',          icon: AlertCircle },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    size = 'md',
    showIcon = true,
}) => {
    const config = statusConfig[status] ?? {
        label: status,
        ...NEUTRAL_PAIR,
    };

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <span
            className={`inline-flex items-center gap-1 ${sizeClasses} rounded-full font-medium`}
            style={{ color: config.fg, backgroundColor: config.bg }}
        >
            {showIcon && config.icon && <config.icon className={iconSize} />}
            {config.label}
        </span>
    );
};

export default StatusBadge;
