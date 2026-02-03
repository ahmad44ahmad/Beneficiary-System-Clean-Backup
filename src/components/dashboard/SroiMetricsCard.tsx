import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../ui/Button';

interface SroiMetricsCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    summary?: string;
    color?: 'teal' | 'orange' | 'blue' | 'purple';
}

export const SroiMetricsCard: React.FC<SroiMetricsCardProps> = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    summary,
    color = 'teal'
}) => {
    const colorStyles = {
        teal: 'bg-teal-50 text-teal-600 border-teal-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };

    const iconColorStyles = {
        teal: 'bg-teal-100 text-teal-700',
        orange: 'bg-orange-100 text-orange-700',
        blue: 'bg-blue-100 text-blue-700',
        purple: 'bg-purple-100 text-purple-700'
    };

    return (
        <Card className="hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl", iconColorStyles[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                            trend === 'up' ? "bg-green-100 text-green-700" :
                                trend === 'down' ? "bg-red-100 text-red-700" :
                                    "bg-gray-100 text-gray-700"
                        )}>
                            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '−'}
                            {trendValue}
                        </div>
                    )}
                </div>

                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{value}</span>
                    {subtitle && <span className="text-gray-400 text-xs">{subtitle}</span>}
                </div>

                {summary && (
                    <p className="mt-3 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                        {summary}
                    </p>
                )}
            </div>
        </Card>
    );
};
