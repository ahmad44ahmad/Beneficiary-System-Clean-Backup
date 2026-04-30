import React from 'react';
import { clsx, type ClassValue } from 'clsx';

// eslint-disable-next-line react-refresh/only-export-components
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        // Variants use HRSD palette only.
        // - primary:   teal #269798 (Pantone 2235C)
        // - secondary: gold #FCB614 (Pantone 7409C)
        // - danger:    semantic red (life-safety only)
        // - outline:   teal border on white
        // - ghost:     neutral, hover gray
        const variants = {
            primary: 'bg-[#269798] text-white hover:bg-[#269798] shadow-sm',
            secondary: 'bg-[#FCB614] text-[#0F3144] hover:bg-[#FCB614] shadow-sm',
            danger: 'bg-[#DC2626] text-white hover:bg-[#DC2626] shadow-sm',
            outline: 'border border-[#269798] text-[#269798] hover:bg-[#269798]/10 dark:hover:bg-slate-800',
            ghost: 'bg-transparent hover:bg-gray-100 text-hrsd-cool-gray hover:text-[#0F3144] dark:text-slate-300 dark:hover:bg-slate-700',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#269798] disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
