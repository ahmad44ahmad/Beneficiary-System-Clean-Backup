// Skeleton - Loading placeholder components
// Provides visual feedback during data fetching

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    lines?: number;
    animate?: boolean;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    animate = true,
}: SkeletonProps) {
    const baseClasses = 'bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 bg-[length:200%_100%]';

    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'circular' ? width : undefined),
    };

    return (
        <motion.div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
            animate={animate ? {
                backgroundPosition: ['200% 0', '-200% 0'],
            } : undefined}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
}

/**
 * Text skeleton with multiple lines
 */
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i}>
                    <Skeleton
                        variant="text"
                        width={i === lines - 1 ? '75%' : '100%'}
                    />
                </div>
            ))}
        </div>
    );
}

/**
 * Card skeleton for dashboard cards
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-slate-800/50 rounded-xl p-4 border border-white/10 ${className}`}>
            <div className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                </div>
            </div>
            <div className="mt-4">
                <Skeleton variant="rectangular" height={60} />
            </div>
        </div>
    );
}

/**
 * Table row skeleton
 */
export function SkeletonTableRow({ columns = 4, className = '' }: { columns?: number; className?: string }) {
    return (
        <div className={`flex items-center gap-4 p-4 border-b border-white/5 ${className}`}>
            {Array.from({ length: columns }).map((_, i) => (
                <div key={i} className="flex-1">
                    <Skeleton
                        variant="text"
                        width={i === 0 ? 40 : '100%'}
                    />
                </div>
            ))}
        </div>
    );
}

/**
 * Table skeleton with header and rows
 */
export function SkeletonTable({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) {
    return (
        <div className={`bg-slate-800/50 rounded-xl border border-white/10 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-4 p-4 bg-white/5 border-b border-white/10">
                {Array.from({ length: columns }).map((_, i) => (
                    <div key={i} className="flex-1">
                        <Skeleton variant="text" width={i === 0 ? 40 : '100%'} />
                    </div>
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i}>
                    <SkeletonTableRow columns={columns} />
                </div>
            ))}
        </div>
    );
}

/**
 * Avatar skeleton
 */
export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
    return <Skeleton variant="circular" width={size} height={size} className={className} />;
}

/**
 * Stat card skeleton for KPI displays
 */
export function SkeletonStatCard({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width={60} height={24} />
            </div>
            <Skeleton variant="text" width="40%" height={36} className="mb-2" />
            <Skeleton variant="text" width="70%" height={16} />
        </div>
    );
}

/**
 * Chart skeleton
 */
export function SkeletonChart({ className = '' }: { className?: string }) {
    return (
        <div className={`bg-slate-800/50 rounded-xl p-6 border border-white/10 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
            </div>
            <div className="flex items-end gap-2 h-40">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex-1">
                        <Skeleton
                            variant="rectangular"
                            height={`${30 + Math.random() * 70}%`}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}>
                        <Skeleton variant="text" width={30} height={12} />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * List item skeleton
 */
export function SkeletonListItem({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 p-4 ${className}`}>
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="50%" />
            </div>
            <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
        </div>
    );
}

/**
 * Full page loading skeleton
 */
export function SkeletonPage({ className = '' }: { className?: string }) {
    return (
        <div className={`space-y-6 p-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton variant="text" width={200} height={32} />
                    <Skeleton variant="text" width={300} height={16} />
                </div>
                <div className="flex gap-2">
                    <Skeleton variant="rectangular" width={100} height={40} className="rounded-lg" />
                    <Skeleton variant="rectangular" width={100} height={40} className="rounded-lg" />
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <SkeletonStatCard />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonChart className="lg:col-span-2" />
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i}>
                            <SkeletonCard />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
