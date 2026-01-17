// ═══════════════════════════════════════════════════════════════════════════
// EmptyState - Reusable empty state display component
// Shows a consistent empty/no-results state across all pages
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { Inbox, Search, FileX, AlertCircle, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    /** Icon to display */
    icon?: LucideIcon;
    /** Main title */
    title: string;
    /** Description text */
    description?: string;
    /** Action button text */
    actionText?: string;
    /** Action button callback */
    onAction?: () => void;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Custom class name */
    className?: string;
}

/**
 * Reusable empty state component
 * Shows when a list or search has no results
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon = Inbox,
    title,
    description,
    actionText,
    onAction,
    size = 'md',
    className = ''
}) => {
    const sizes = {
        sm: { icon: 'w-10 h-10', title: 'text-sm', desc: 'text-xs', padding: 'p-4' },
        md: { icon: 'w-16 h-16', title: 'text-base', desc: 'text-sm', padding: 'p-8' },
        lg: { icon: 'w-20 h-20', title: 'text-lg', desc: 'text-base', padding: 'p-12' }
    };

    const s = sizes[size];

    return (
        <div className={`flex flex-col items-center justify-center text-center ${s.padding} ${className}`} dir="rtl">
            <div className="mb-4 text-gray-300">
                <Icon className={s.icon} />
            </div>
            <h3 className={`font-medium text-gray-600 mb-2 ${s.title}`}>
                {title}
            </h3>
            {description && (
                <p className={`text-gray-400 max-w-xs ${s.desc}`}>
                    {description}
                </p>
            )}
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="mt-4 px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 transition-colors"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
};

/**
 * Pre-configured empty states for common scenarios
 */
export const NoResults: React.FC<{ onClear?: () => void }> = ({ onClear }) => (
    <EmptyState
        icon={Search}
        title="لا توجد نتائج"
        description="لم يتم العثور على أي نتائج تطابق بحثك. حاول تغيير معايير البحث."
        actionText={onClear ? "مسح البحث" : undefined}
        onAction={onClear}
    />
);

export const NoData: React.FC<{ title?: string; onAdd?: () => void; addText?: string }> = ({
    title = "لا توجد بيانات",
    onAdd,
    addText = "إضافة جديد"
}) => (
    <EmptyState
        icon={FileX}
        title={title}
        description="لا توجد بيانات لعرضها حالياً."
        actionText={onAdd ? addText : undefined}
        onAction={onAdd}
    />
);

export const ErrorState: React.FC<{ onRetry?: () => void; message?: string }> = ({
    onRetry,
    message = "حدث خطأ أثناء تحميل البيانات"
}) => (
    <EmptyState
        icon={AlertCircle}
        title="خطأ"
        description={message}
        actionText={onRetry ? "إعادة المحاولة" : undefined}
        onAction={onRetry}
    />
);

export default EmptyState;
