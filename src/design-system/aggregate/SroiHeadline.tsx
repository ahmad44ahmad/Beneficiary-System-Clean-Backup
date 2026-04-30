import React from 'react';
import { Section } from '../primitives';
import { brand } from '../tokens';

/**
 * SroiHeadline — the single SROI ratio shown to ministerial-level
 * personas. NO methodology details in this view (those live in the
 * full SroiDashboard for operational personas).
 *
 * Canonical value source: src/data/sroiAssumptions.ts (1.80x as of
 * 2026-04-30 reconciliation).
 */

interface SroiHeadlineProps {
    /** The SROI ratio. Pass the canonical computed value, do not hardcode. */
    ratio: number;
    /** Period label, e.g. "السنة المالية 1446هـ". */
    period?: string;
    /** One-line interpretation, e.g. "كل ريال يعود بـ 1.80 ريال أثراً اجتماعياً". */
    interpretation?: string;
}

export const SroiHeadline: React.FC<SroiHeadlineProps> = ({
    ratio,
    period,
    interpretation,
}) => {
    const formatted = `${ratio.toFixed(2)}×`;
    return (
        <Section title="العائد على الاستثمار الاجتماعي" subtitle={period}>
            <div className="flex flex-col items-center text-center py-4">
                <span
                    className="text-7xl md:text-8xl font-extrabold leading-none tabular-nums tracking-tight"
                    style={{ color: brand.navy.hex }}
                    aria-label={`SROI ratio ${formatted}`}
                >
                    {formatted}
                </span>
                {interpretation && (
                    <p
                        className="mt-4 text-base md:text-lg max-w-xl"
                        style={{ color: brand.coolGray.hex }}
                    >
                        {interpretation}
                    </p>
                )}
            </div>
        </Section>
    );
};

export default SroiHeadline;
