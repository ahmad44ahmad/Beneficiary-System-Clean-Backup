import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    message,
    fullScreen = false,
    className = ''
}) => {
    const spinner = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className={`animate-spin text-[#14415A] ${sizeClasses[size]}`} />
            {message && (
                <p className="text-gray-500 text-sm font-medium">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;
