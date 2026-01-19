import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    iconBgColor?: string;
    iconColor?: string;
    value: string | number;
    label: string;
    trend?: {
        value: string;
        direction: 'up' | 'down' | 'stable';
    };
    onClick?: () => void;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon: Icon,
    iconBgColor = 'bg-hrsd-teal/10',
    iconColor = 'text-hrsd-teal',
    value,
    label,
    trend,
    onClick,
    className = '',
}) => {
    const getTrendColor = (direction: string) => {
        switch (direction) {
            case 'up': return 'text-hrsd-green';
            case 'down': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getTrendIcon = (direction: string) => {
        switch (direction) {
            case 'up': return '↑';
            case 'down': return '↓';
            default: return '→';
        }
    };

    return (
        <div
            className={`hrsd-card-stat ${onClick ? 'cursor-pointer hover:shadow-lg' : ''} ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className={`p-3 ${iconBgColor} rounded-xl shadow-sm`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                        {trend && (
                            <span className={`text-sm font-semibold ${getTrendColor(trend.direction)}`}>
                                {getTrendIcon(trend.direction)} {trend.value}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
