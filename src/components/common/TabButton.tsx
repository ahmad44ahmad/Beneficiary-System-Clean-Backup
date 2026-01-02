import React from 'react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon?: React.ElementType;
    badge?: number;
    variant?: 'primary' | 'secondary';
}

export const TabButton: React.FC<TabButtonProps> = ({
    active,
    onClick,
    label,
    icon: Icon,
    badge,
    variant = 'primary'
}) => {
    const baseClasses = 'flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all font-medium';

    const variantClasses = {
        primary: active
            ? 'bg-[#14415A] text-white shadow-lg'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
        secondary: active
            ? 'bg-[#148287] text-white shadow-lg'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="bg-[#F5961E] text-white text-xs px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </button>
    );
};

export default TabButton;
