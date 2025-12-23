import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, title, description, footer, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm',
                    className
                )}
                {...props}
            >
                {(title || description) && (
                    <div className="flex flex-col space-y-1.5 p-6 pb-4 border-b border-gray-100">
                        {title && (
                            <h3 className="font-semibold leading-none tracking-tight text-lg">
                                {title}
                            </h3>
                        )}
                        {description && (
                            <p className="text-sm text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>
                )}
                <div className="p-6 pt-4">{children}</div>
                {footer && (
                    <div className="flex items-center p-6 pt-0">
                        {footer}
                    </div>
                )}
            </div>
        );
    }
);
Card.displayName = 'Card';
