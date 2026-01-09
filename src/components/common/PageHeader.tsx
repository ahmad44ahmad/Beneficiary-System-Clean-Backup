import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    iconGradient?: string;
    showBack?: boolean;
    showRefresh?: boolean;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    icon: Icon,
    iconGradient = 'gradient-primary',
    showBack = true,
    showRefresh = true,
    actions,
}) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className={`p-3 ${iconGradient} rounded-xl`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">{title}</h1>
                        {subtitle && (
                            <p className="text-hierarchy-small text-gray-500">{subtitle}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {actions}
                    {showRefresh && (
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="تحديث"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
