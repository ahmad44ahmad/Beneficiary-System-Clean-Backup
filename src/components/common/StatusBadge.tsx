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

const statusConfig: Record<string, {
    label: string;
    bgColor: string;
    textColor: string;
    icon?: React.ElementType
}> = {
    // Meal statuses
    pending: { label: 'معلق', bgColor: 'bg-gray-100', textColor: 'text-gray-500', icon: Clock },
    preparing: { label: 'قيد التحضير', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', icon: Clock },
    ready: { label: 'جاهز', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: Check },
    delivered: { label: 'تم التسليم', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: Check },
    consumed: { label: 'تم الاستهلاك', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: CheckCircle2 },
    refused: { label: 'رفض الوجبة', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: X },

    // General statuses
    active: { label: 'نشط', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: CheckCircle2 },
    inactive: { label: 'غير نشط', bgColor: 'bg-gray-100', textColor: 'text-gray-500' },
    completed: { label: 'مكتمل', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: CheckCircle2 },
    cancelled: { label: 'ملغى', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: X },

    // Risk levels
    low: { label: 'منخفض', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    medium: { label: 'متوسط', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    high: { label: 'عالي', bgColor: 'bg-orange-50', textColor: 'text-orange-600', icon: AlertCircle },
    critical: { label: 'حرج', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: AlertCircle }
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
