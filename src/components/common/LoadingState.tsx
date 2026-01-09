import React from 'react';

interface LoadingStateProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullPage?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    size = 'md',
    text = 'جاري التحميل...',
    fullPage = false,
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-b-2',
        lg: 'h-16 w-16 border-4',
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`animate-spin rounded-full border-hrsd-teal ${sizeClasses[size]}`}
                style={{ borderTopColor: 'transparent' }}
            />
            {text && <p className="text-sm text-gray-500">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-12">
            {content}
        </div>
    );
};

// Skeleton Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`}></div>
);

export const SkeletonText: React.FC<{ width?: string; height?: string }> = ({
    width = 'w-24',
    height = 'h-4'
}) => (
    <div className={`bg-gray-200 rounded animate-pulse ${width} ${height}`}></div>
);

export const SkeletonAvatar: React.FC<{ size?: string }> = ({ size = 'w-10 h-10' }) => (
    <div className={`bg-gray-200 rounded-full animate-pulse ${size}`}></div>
);

export default LoadingState;
