import React from 'react';
import { Clock, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';

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
 * Status → HRSD-compliant tones.
 * - good states (active, completed, consumed, low risk): HRSD green #2BB574
 * - in-progress / informational (preparing, ready, delivered): HRSD teal #269798
 * - warning (medium risk): HRSD gold #FCB614
 * - elevated (high risk): HRSD orange #F7941D
 * - critical / refused / cancelled: semantic red #DC2626 (life-safety exception)
 * - neutral (pending, inactive): HRSD cool gray #7A7A7A
 */
const statusConfig: Record<string, {
    label: string;
    bgColor: string;
    textColor: string;
    icon?: React.ElementType
}> = {
    // Meal statuses
    pending: { label: 'معلق', bgColor: 'bg-gray-100', textColor: 'text-hrsd-cool-gray', icon: Clock },
    preparing: { label: 'قيد التحضير', bgColor: 'bg-[#FCB614]/10', textColor: 'text-[#D49A0A]', icon: Clock },
    ready: { label: 'جاهز', bgColor: 'bg-[#269798]/10', textColor: 'text-[#269798]', icon: Check },
    delivered: { label: 'تم التسليم', bgColor: 'bg-[#269798]/10', textColor: 'text-[#269798]', icon: Check },
    consumed: { label: 'تم الاستهلاك', bgColor: 'bg-[#2BB574]/10', textColor: 'text-[#1E9658]', icon: CheckCircle2 },
    refused: { label: 'رفض الوجبة', bgColor: 'bg-[#DC2626]/10', textColor: 'text-[#DC2626]', icon: X },

    // General statuses
    active: { label: 'نشط', bgColor: 'bg-[#2BB574]/10', textColor: 'text-[#1E9658]', icon: CheckCircle2 },
    inactive: { label: 'غير نشط', bgColor: 'bg-gray-100', textColor: 'text-hrsd-cool-gray' },
    completed: { label: 'مكتمل', bgColor: 'bg-[#2BB574]/10', textColor: 'text-[#1E9658]', icon: CheckCircle2 },
    cancelled: { label: 'ملغى', bgColor: 'bg-[#DC2626]/10', textColor: 'text-[#DC2626]', icon: X },

    // Risk levels
    low: { label: 'منخفض', bgColor: 'bg-[#2BB574]/10', textColor: 'text-[#1E9658]' },
    medium: { label: 'متوسط', bgColor: 'bg-[#FCB614]/10', textColor: 'text-[#D49A0A]' },
    high: { label: 'عالي', bgColor: 'bg-[#F7941D]/10', textColor: 'text-[#D67A0A]', icon: AlertCircle },
    critical: { label: 'حرج', bgColor: 'bg-[#DC2626]/10', textColor: 'text-[#DC2626]', icon: AlertCircle }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    size = 'md',
    showIcon = true
}) => {
    const config = statusConfig[status] || {
        label: status,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-500',
        icon: undefined
    };

    const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <span className={`inline-flex items-center gap-1 ${config.bgColor} ${config.textColor} ${sizeClasses} rounded-full font-medium`}>
            {showIcon && config.icon && <config.icon className={iconSize} />}
            {config.label}
        </span>
    );
};

export default StatusBadge;
