import React from 'react';
import { brand } from '../tokens';

/**
 * EmptyState — shown when a list/dashboard has no data yet.
 *
 * Dignity-aware: copy should describe what to do next, not what is
 * "missing". Examples (good): "لم تُسجَّل بعد ملاحظات اليوم — ابدأ
 * من زر الإضافة". Examples (avoid): "لا توجد بيانات", "قائمة فارغة".
 *
 * Visual: muted icon (cool-gray) + navy title + body text in cool-gray
 * + optional primary action. No illustrations of "sad characters" — per
 * HRSD brand, characters must be integrated with type and pattern, never
 * standalone, and never in a deficit/pity framing.
 */

interface EmptyStateProps {
    /** Icon node (e.g. <Inbox /> from lucide). Rendered at 40px in cool-gray. */
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Optional CTA button or link. */
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center px-4 py-10 ${className}`}
            dir="rtl"
            role="status"
        >
            {icon && (
                <div
                    className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100"
                    style={{ color: brand.coolGray.hex }}
                    aria-hidden="true"
                >
                    {icon}
                </div>
            )}
            <h3
                className="text-base md:text-lg font-bold"
                style={{ color: brand.navy.hex }}
            >
                {title}
            </h3>
            {description && (
                <p
                    className="mt-2 text-sm max-w-md"
                    style={{ color: brand.coolGray.hex }}
                >
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;
