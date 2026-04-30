import React from 'react';
import { Eye, ArrowLeft } from 'lucide-react';
import {
    HonestMirrorFinding,
    MIRROR_SEVERITY_LABELS,
    MIRROR_SEVERITY_TONES,
} from '../../types/leadership-compass';

/**
 * بطاقة اكتشافٍ من المرآة الصادقة.
 *
 * تَعرض نمطاً بنيويّاً يَستحقّ نظر القيادة — لا حادثةً فرديّة.
 * مبدأ: واضحةٌ، غير اتّهاميّة، تَقترح إجراءً لا تَفرضه.
 */
export const MirrorFindingCard: React.FC<{
    finding: HonestMirrorFinding;
    onAcknowledge?: (finding: HonestMirrorFinding) => void;
}> = ({ finding, onAcknowledge }) => {
    const tone = MIRROR_SEVERITY_TONES[finding.severity];

    return (
        <article
            dir="rtl"
            className={`bg-white dark:bg-white rounded-2xl border-2 ${tone.border}
                shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
        >
            <div className={`${tone.bg} px-4 py-2 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">{tone.icon}</span>
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${tone.text}`}>
                        {MIRROR_SEVERITY_LABELS[finding.severity]}
                    </span>
                </div>
                <span className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray font-mono">
                    {finding.ruleCode}
                </span>
            </div>

            <div className="p-5 space-y-3">
                <header>
                    <h3 className="text-[15px] font-bold text-hrsd-navy dark:text-white leading-snug mb-2">
                        {finding.findingHeadline}
                    </h3>
                    {finding.findingDetail && (
                        <p className="text-[13.5px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">
                            {finding.findingDetail}
                        </p>
                    )}
                </header>

                {/* بيانات مُساندة */}
                {finding.supportingData && Object.keys(finding.supportingData).length > 0 && (
                    <div className="bg-slate-50 dark:bg-white/50 rounded-lg p-3">
                        <div className="text-[11px] font-semibold text-hrsd-cool-gray dark:text-hrsd-cool-gray uppercase tracking-wider mb-1.5">
                            بيانات مُساندة
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[12px]">
                            {Object.entries(finding.supportingData).map(([key, value]) => (
                                <div key={key} className="text-hrsd-navy dark:text-hrsd-navy">
                                    <span className="font-semibold">{humanizeKey(key)}:</span> {String(value)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {finding.suggestedAction && (
                    <div className="flex items-start gap-2 p-3 bg-hrsd-teal/5 border-r-4 border-hrsd-teal rounded-lg">
                        <Eye className="w-4 h-4 text-hrsd-teal mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <div className="text-[11px] font-bold text-hrsd-teal uppercase tracking-wider mb-0.5">
                                إجراءٌ مُقترَح
                            </div>
                            <p className="text-[13px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                                {finding.suggestedAction}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-200">
                    <span className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                        قاعدة: {finding.ruleDescription}
                    </span>
                    {finding.status === 'open' && onAcknowledge && (
                        <button
                            type="button"
                            onClick={() => onAcknowledge(finding)}
                            className="text-[13px] font-semibold text-hrsd-teal hover:text-hrsd-teal-dark
                                flex items-center gap-1.5 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            استلام المعلومة وإنشاء قرار
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

// ─── helper: turn snake_case keys into readable Arabic ─────────────────────────
function humanizeKey(key: string): string {
    const dict: Record<string, string> = {
        affectedBeneficiariesCount: 'عدد المستفيدين',
        affectedCentersCount: 'عدد المراكز',
        averageStaleDays: 'متوسّط أيام الجمود',
        lastActivityDaysAgo: 'آخر نشاط (أيام)',
        totalFamiliesAffected: 'عدد الأُسَر',
        barrierCode: 'رمز العائق',
        totalAttemptedInterventions: 'التدخّلات المُحاولة',
        positiveMovementInstances: 'حالات التحرّك الإيجابي',
        periodMonths: 'الفترة (أشهر)',
        regionCode: 'رمز المنطقة',
        turnoverRatePercent: 'معدّل الدوران %',
        comparableRegionsAverage: 'متوسّط المناطق المُماثِلة %',
    };
    return dict[key] || key;
}
