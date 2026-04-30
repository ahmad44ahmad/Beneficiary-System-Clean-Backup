import React from 'react';
import { useBrandLevel } from '../BrandLevelProvider';
import { brand } from '../tokens';

/**
 * Section — padded content wrapper with optional title.
 *
 * Body text inherits Cool Gray (light) / white (dark). Title color:
 *   - Formal level → navy + cool-gray subtitle (no secondary accents)
 *   - Default level → optional `accent` prop chooses from secondary palette
 *
 * No drop shadow, no decorative effects (per HRSD brand book p. 61).
 */

type Accent = 'navy' | 'teal' | 'green' | 'orange' | 'gold' | 'coolGray';

interface SectionProps {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    /** Optional accent for the title underline / icon color (default level only). */
    accent?: Accent;
    /** Right-side action buttons (RTL: visually start). */
    actions?: React.ReactNode;
    /** When true, removes inner padding — useful when Section wraps a Card grid. */
    flush?: boolean;
    className?: string;
    children: React.ReactNode;
    /** Optional leading icon next to title. */
    icon?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
    title,
    subtitle,
    accent = 'navy',
    actions,
    flush = false,
    className = '',
    children,
    icon,
}) => {
    const { isFormal } = useBrandLevel();

    const titleColor = isFormal ? brand.navy.hex : brand[accent].hex;
    const showHeader = title || subtitle || actions;

    return (
        <section
            className={`bg-white dark:bg-hrsd-navy/50 rounded-xl border border-gray-200 dark:border-white/10 ${flush ? '' : 'p-5 md:p-6'} ${className}`}
            dir="rtl"
        >
            {showHeader && (
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        {title && (
                            <h2
                                className="text-lg md:text-xl font-bold leading-tight flex items-center gap-2"
                                style={{ color: titleColor }}
                            >
                                {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
                                <span className="min-w-0">{title}</span>
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-1 text-sm text-hrsd-cool-gray dark:text-white/70">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="shrink-0 flex items-center gap-2">{actions}</div>
                    )}
                </header>
            )}
            {children}
        </section>
    );
};

export default Section;
