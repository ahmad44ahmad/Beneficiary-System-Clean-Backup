import React from 'react';
import { Clock, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { brand } from '../../design-system/tokens';
import { SAFE_PAIRS } from '../../design-system/a11y-tokens';

type StatusType =
    | 'pending' | 'delivered' | 'consumed' | 'refused' | 'preparing' | 'ready'
    | 'active' | 'inactive' | 'completed' | 'cancelled'
    | 'low' | 'medium' | 'high' | 'critical';

/**
 * Six canonical badge tones — every brand-aligned status shape collapses
 * to one of these. Modules with custom labels (RiskRegister, BICLS, etc.)
 * use `tone + label` instead of `status` for their domain words.
 */
export type StatusTone = 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'elevated';

interface BaseProps {
    size?: 'sm' | 'md';
    showIcon?: boolean;
}

type StatusModeProps = BaseProps & {
    /** Built-in status keyword. Auto-resolves label, tone, and icon. */
    status: StatusType | string;
    tone?: never;
    label?: never;
    icon?: never;
};

type ToneModeProps = BaseProps & {
    /** Canonical brand tone — used together with `label` for custom statuses. */
    tone: StatusTone;
    /** Display text. Required in tone mode. */
    label: string;
    /** Optional icon component. */
    icon?: React.ElementType;
    status?: never;
};

type StatusBadgeProps = StatusModeProps | ToneModeProps;

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

/** Canonical tone → SAFE_PAIRS mapping. */
const TONE_PAIR: Record<StatusTone, { fg: string; bg: string }> = {
    success:  SAFE_PAIRS.badgeOnGreen,
    info:     SAFE_PAIRS.badgeOnTeal,
    warning:  SAFE_PAIRS.badgeOnGold,
    elevated: SAFE_PAIRS.badgeOnOrange,
    danger:   { fg: '#FFFFFF', bg: '#DC2626' },
    neutral:  NEUTRAL_PAIR,
};

export const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
    const { size = 'md', showIcon = true } = props;

    let resolved: ToneSpec;
    if ('tone' in props && props.tone) {
        const pair = TONE_PAIR[props.tone];
        resolved = { label: props.label, fg: pair.fg, bg: pair.bg, icon: props.icon };
    } else if ('status' in props && props.status) {
        resolved = statusConfig[props.status] ?? {
            label: props.status,
            ...NEUTRAL_PAIR,
        };
    } else {
        resolved = { label: '—', ...NEUTRAL_PAIR };
    }

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <span
            className={`inline-flex items-center gap-1 ${sizeClasses} rounded-full font-medium`}
            style={{ color: resolved.fg, backgroundColor: resolved.bg }}
        >
            {showIcon && resolved.icon && <resolved.icon className={iconSize} />}
            {resolved.label}
        </span>
    );
};

export default StatusBadge;
