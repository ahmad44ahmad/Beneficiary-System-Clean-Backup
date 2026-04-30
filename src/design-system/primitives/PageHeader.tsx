import React from 'react';
import { useBrandLevel } from '../BrandLevelProvider';
import { brand } from '../tokens';

/**
 * PageHeader — top of any page.
 *
 * - Title in navy (always — page title is identity, not theme).
 * - Subtitle in cool-gray.
 * - Optional breadcrumb slot ABOVE the title (page navigation context).
 * - Optional actions slot at start (RTL: visual left).
 *
 * Formal level → no decorative gradient/accent line.
 * Default level → thin teal/orange/etc. accent line below title (3px).
 */

type Accent = 'teal' | 'orange' | 'gold' | 'green';

interface PageHeaderProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    breadcrumb?: React.ReactNode;
    actions?: React.ReactNode;
    /** Accent color for the underline (default level only). */
    accent?: Accent;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    breadcrumb,
    actions,
    accent = 'teal',
    className = '',
}) => {
    const { isFormal } = useBrandLevel();
    const accentColor = brand[accent].hex;

    return (
        <header className={`mb-6 ${className}`} dir="rtl">
            {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h1
                        className="text-2xl md:text-3xl font-bold leading-tight"
                        style={{ color: brand.navy.hex }}
                    >
                        {title}
                    </h1>
                    {!isFormal && (
                        <span
                            className="block mt-2 h-[3px] w-12 rounded-full"
                            style={{ backgroundColor: accentColor }}
                            aria-hidden="true"
                        />
                    )}
                    {subtitle && (
                        <p className="mt-3 text-sm md:text-base text-hrsd-cool-gray dark:text-white/70 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="shrink-0 flex items-center gap-2">{actions}</div>
                )}
            </div>
        </header>
    );
};

export default PageHeader;
