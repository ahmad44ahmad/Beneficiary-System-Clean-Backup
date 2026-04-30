import React, { createContext, useContext, useMemo } from 'react';
import { useViewModeStore } from '../stores/useViewModeStore';
import { isAggregatePersona } from '../stores/useViewModeStore';
import type { BrandLevel } from './tokens';
import { accentsForLevel } from './tokens';

/**
 * BrandLevelProvider — Phase 2.5 substrate.
 *
 * Per HRSD brand guideline pp. 30-32, the visual identity has two appearance
 * levels:
 *   - "Formal" (مستوى رسمي): ministerial briefings, press releases.
 *     Permanent gray + limited primary palette. Icons blue+white only.
 *   - "Default" (مستوى افتراضي): operational tools (Basira's natural state).
 *     Full secondary palette.
 *
 * Default mapping: aggregate-scope personas (Wakeel, Branch GM) inherit
 * "formal" automatically. Operational personas (Dept Head, Staff) inherit
 * "default". A subtree can override via the `level` prop.
 *
 * Reads as a CSS attribute on document.body (`data-brand-level`) so legacy
 * Tailwind / CSS files can adapt without prop drilling.
 */

interface BrandLevelContextValue {
    level: BrandLevel;
    accents: string[];
    isFormal: boolean;
}

const BrandLevelContext = createContext<BrandLevelContextValue | undefined>(undefined);

interface BrandLevelProviderProps {
    /**
     * Optional override. When omitted, the level is derived from the current
     * persona's scope: aggregate → formal, operational → default.
     */
    level?: BrandLevel;
    children: React.ReactNode;
}

export const BrandLevelProvider: React.FC<BrandLevelProviderProps> = ({ level, children }) => {
    const persona = useViewModeStore(s => s.currentView);

    const resolved: BrandLevel = useMemo(() => {
        if (level) return level;
        return isAggregatePersona(persona) ? 'formal' : 'default';
    }, [level, persona]);

    const value = useMemo<BrandLevelContextValue>(() => ({
        level: resolved,
        accents: accentsForLevel(resolved),
        isFormal: resolved === 'formal',
    }), [resolved]);

    React.useEffect(() => {
        if (typeof document !== 'undefined') {
            document.body.setAttribute('data-brand-level', resolved);
        }
    }, [resolved]);

    return (
        <BrandLevelContext.Provider value={value}>
            {children}
        </BrandLevelContext.Provider>
    );
};

/**
 * Hook for components that need to vary appearance by brand level.
 * Returns the resolved level + the allowed accent palette + a convenience
 * boolean. Defaults to 'default' if used outside a provider (no crash).
 */
export const useBrandLevel = (): BrandLevelContextValue => {
    const ctx = useContext(BrandLevelContext);
    if (ctx) return ctx;
    return {
        level: 'default',
        accents: accentsForLevel('default'),
        isFormal: false,
    };
};

/**
 * Convenience wrapper for opting a subtree into Formal level explicitly,
 * regardless of persona. Used for ministerial-briefing surfaces
 * (ExecutiveReport / aggregate dashboards) that should stay formal even
 * when previewed by an operational persona.
 */
export const Formal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrandLevelProvider level="formal">{children}</BrandLevelProvider>
);
