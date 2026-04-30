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
    /** HRSD palette tones — `blue` and `purple` are deprecated aliases (mapped to teal/gold). */
    color?: 'teal' | 'orange' | 'gold' | 'green' | 'navy' | 'blue' | 'purple';
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
    // HRSD palette mapping. Legacy `blue`/`purple` aliases map to nearest brand tone
    // so old call-sites keep working while new code uses brand names directly.
    const iconColorStyles: Record<string, string> = {
        teal:   'bg-[#269798]/10 text-[#269798]',
        orange: 'bg-[#F7941D]/10 text-[#D67A0A]',
        gold:   'bg-[#FCB614]/10 text-[#D49A0A]',
        green:  'bg-[#2BB574]/10 text-[#1E9658]',
        navy:   'bg-[#0F3144]/10 text-[#0F3144]',
        blue:   'bg-[#0F3144]/10 text-[#0F3144]',   // legacy alias → navy
        purple: 'bg-[#FCB614]/10 text-[#D49A0A]',   // legacy alias → gold
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
                            trend === 'up' ? "bg-[#2BB574]/10 text-[#1E9658]" :
                                trend === 'down' ? "bg-[#DC2626]/10 text-[#DC2626]" :
                                    "bg-gray-100 text-hrsd-cool-gray"
                        )}>
                            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '−'}
                            {trendValue}
                        </div>
                    )}
                </div>

                <h3 className="text-hrsd-cool-gray text-sm font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-hrsd-navy tabular-nums">{value}</span>
                    {subtitle && <span className="text-hrsd-cool-gray text-xs">{subtitle}</span>}
                </div>

                {summary && (
                    <p className="mt-3 text-sm text-hrsd-cool-gray leading-relaxed border-t border-gray-100 pt-3">
                        {summary}
                    </p>
                )}
            </div>
        </Card>
    );
};
