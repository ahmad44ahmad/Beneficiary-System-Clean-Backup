import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { ClothingPhase, CLOTHING_PHASE_LABELS } from '../../types/clothing';

const PHASE_ORDER: ClothingPhase[] = [
    'phase_1_request',
    'phase_2_procurement',
    'phase_3_settlement',
    'phase_4_damage',
];

interface Props {
    currentPhase?: ClothingPhase;
    completedPhases?: ClothingPhase[];
}

/**
 * Visualises the four-phase clothing-procurement cycle from
 * ضوابط الكسوة 2020. Every phase gets a dedicated card —
 * no cramming, no tiny sub-labels. Current phase is highlighted
 * in HRSD teal; completed phases show a check; pending phases
 * sit quietly in muted gray.
 */
export const ClothingPhaseTracker: React.FC<Props> = ({
    currentPhase,
    completedPhases = [],
}) => {
    const phaseState = (p: ClothingPhase): 'completed' | 'current' | 'pending' => {
        if (completedPhases.includes(p)) return 'completed';
        if (p === currentPhase) return 'current';
        return 'pending';
    };

    return (
        <section
            dir="rtl"
            className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 p-5 shadow-sm"
        >
            <div className="flex items-baseline justify-between mb-5">
                <h2 className="text-[17px] font-bold text-hrsd-navy dark:text-white">
                    دورة تأمين الكسوة — أربع مراحل
                </h2>
                <span className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                    المصدر: ضوابط الكسوة 2020
                </span>
            </div>
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PHASE_ORDER.map((phase, idx) => {
                    const label = CLOTHING_PHASE_LABELS[phase];
                    const state = phaseState(phase);

                    const base =
                        'relative rounded-xl p-4 border-2 transition-all flex flex-col gap-3 min-h-[140px]';
                    const tone =
                        state === 'current'
                            ? 'border-hrsd-teal bg-hrsd-teal/5 shadow-md'
                            : state === 'completed'
                            ? 'border-hrsd-green bg-hrsd-green/5'
                            : 'border-gray-200 bg-gray-50 dark:border-gray-200 dark:bg-white';

                    const Icon =
                        state === 'completed' ? CheckCircle2 : state === 'current' ? Clock : Circle;
                    const iconTone =
                        state === 'current'
                            ? 'text-hrsd-teal'
                            : state === 'completed'
                            ? 'text-hrsd-green'
                            : 'text-hrsd-cool-gray';

                    return (
                        <li key={phase} className={`${base} ${tone}`}>
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[14px] font-bold ${
                                        state === 'current'
                                            ? 'bg-hrsd-teal text-white'
                                            : state === 'completed'
                                            ? 'bg-hrsd-green text-white'
                                            : 'bg-slate-200 text-hrsd-cool-gray dark:bg-gray-50 dark:text-hrsd-navy'
                                    }`}
                                >
                                    {idx + 1}
                                </span>
                                <Icon className={`w-5 h-5 ${iconTone}`} />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-hrsd-navy dark:text-white leading-snug">
                                    {label.ar}
                                </h3>
                                <p className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-1">
                                    {label.en}
                                </p>
                            </div>
                            {label.durationDays && (
                                <p className="text-[13px] text-hrsd-cool-gray dark:text-hrsd-navy mt-auto">
                                    المدة المعتمدة: {label.durationDays[0]}–{label.durationDays[1]} يوم
                                </p>
                            )}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};

export default ClothingPhaseTracker;
