import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, Clock,
    CheckCircle2, XCircle, PauseCircle, FileQuestion,
} from 'lucide-react';
import {
    StrategicDecision,
    DECISION_LEVEL_LABELS,
    DECISION_CATEGORY_LABELS,
    URGENCY_LABELS,
    URGENCY_TONES,
    EVIDENCE_TYPE_LABELS,
    daysUntilDeadline,
    isOverdue,
} from '../../types/leadership-compass';

/**
 * بطاقة القرار الاستراتيجيّ — المكوّن الأساس في بوصلة القيادة.
 *
 * مبدأ التصميم: القرار قبل البيانات. العرض الافتراضيّ يَعرض فقط ما
 * يَحتاجه القياديّ لاتّخاذ قرارٍ سريع. التفاصيل تَظهر عند الطلب.
 */
export const DecisionCard: React.FC<{
    decision: StrategicDecision;
    onAction?: (action: 'approve' | 'reject' | 'delay' | 'more_evidence', decision: StrategicDecision) => void;
}> = ({ decision, onAction }) => {
    const [expanded, setExpanded] = useState(false);
    const daysLeft = daysUntilDeadline(decision.deadline);
    const overdue = isOverdue(decision);
    const tone = URGENCY_TONES[decision.urgency];

    return (
        <article
            dir="rtl"
            className={`bg-white dark:bg-white rounded-2xl border-2 ${tone.border}
                shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
        >
            {/* شريط عاجليّة */}
            <div className={`${tone.bg} px-5 py-2.5 flex items-center justify-between flex-wrap gap-2`}>
                <div className="flex items-center gap-2.5">
                    <span className={`text-[12px] font-bold uppercase tracking-wider ${tone.text}`}>
                        عاجليّة: {URGENCY_LABELS[decision.urgency]}
                    </span>
                    <span className="text-hrsd-cool-gray">·</span>
                    <span className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-navy font-medium">
                        {DECISION_CATEGORY_LABELS[decision.category]}
                    </span>
                    <span className="text-hrsd-cool-gray">·</span>
                    <span className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-navy">
                        مستوى {DECISION_LEVEL_LABELS[decision.level]}
                    </span>
                </div>

                {decision.deadline && (
                    <span className={`text-[13px] font-semibold flex items-center gap-1.5 ${
                        overdue ? 'text-[#B91C1C]' :
                        (daysLeft !== null && daysLeft <= 7) ? 'text-[#D67A0A]' : tone.text
                    }`}>
                        <Clock className="w-4 h-4" />
                        {overdue
                            ? `انقضى بـ ${Math.abs(daysLeft ?? 0)} يوماً`
                            : `خلال ${daysLeft} يوماً`}
                    </span>
                )}
            </div>

            {/* المحتوى الرئيسيّ */}
            <div className="p-5 md:p-6 space-y-5">
                <header>
                    <h3 className="text-[17px] font-bold text-hrsd-navy dark:text-white leading-tight mb-2">
                        {decision.title}
                    </h3>
                    <p className="text-[14px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">
                        {decision.question}
                    </p>
                </header>

                {/* التوصية */}
                <div className="bg-hrsd-teal/5 border-r-4 border-hrsd-teal rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-hrsd-teal" />
                        <span className="text-[13px] font-bold text-hrsd-teal uppercase tracking-wider">
                            التوصية
                        </span>
                    </div>
                    <p className="text-[15px] font-semibold text-hrsd-navy dark:text-white leading-relaxed mb-2">
                        {decision.recommendation}
                    </p>
                    {decision.recommendationReason && (
                        <p className="text-[13px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">
                            <span className="font-semibold">السبب الحاسم:</span> {decision.recommendationReason}
                        </p>
                    )}
                </div>

                {/* أرقامٌ مفتاحيّة */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {decision.estimatedCostSar !== undefined && (
                        <div className="bg-slate-50 dark:bg-gray-50 rounded-lg p-3">
                            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray font-medium mb-0.5">التكلفة</div>
                            <div className="text-[15px] font-bold text-hrsd-navy dark:text-white">
                                {decision.estimatedCostSar === 0
                                    ? 'بدون تكلفة'
                                    : `${decision.estimatedCostSar.toLocaleString('ar-SA')} ريال`}
                            </div>
                        </div>
                    )}
                    {decision.estimatedSroi !== undefined && (
                        <div className="bg-slate-50 dark:bg-gray-50 rounded-lg p-3">
                            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray font-medium mb-0.5">SROI المتوقَّع</div>
                            <div className="text-[15px] font-bold text-hrsd-green-dark">
                                {decision.estimatedSroi}×
                            </div>
                        </div>
                    )}
                    {decision.affectedBeneficiariesCount !== undefined && (
                        <div className="bg-slate-50 dark:bg-gray-50 rounded-lg p-3">
                            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray font-medium mb-0.5">المتأثّرون</div>
                            <div className="text-[15px] font-bold text-hrsd-navy dark:text-white">
                                {decision.affectedBeneficiariesCount} مستفيد
                            </div>
                        </div>
                    )}
                    {decision.barrierTypesAddressed && decision.barrierTypesAddressed.length > 0 && (
                        <div className="bg-slate-50 dark:bg-gray-50 rounded-lg p-3">
                            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray font-medium mb-0.5">العوائق المستهدَفة</div>
                            <div className="text-[15px] font-bold text-hrsd-navy">
                                {decision.barrierTypesAddressed.join(' · ')}
                            </div>
                        </div>
                    )}
                </div>

                {/* زر توسيع */}
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                        border border-gray-200 dark:border-gray-300 text-hrsd-cool-gray dark:text-hrsd-navy
                        hover:bg-slate-50 dark:hover:bg-gray-50 text-[14px] font-medium transition-colors"
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {expanded ? 'إخفاء التفاصيل' : 'عرض البطاقة الكاملة (أدلّة · بدائل · تبعات)'}
                </button>

                {/* التفاصيل الكاملة */}
                {expanded && (
                    <div className="space-y-5 pt-3 border-t border-gray-200 dark:border-gray-200">
                        {/* ستاك الأدلّة */}
                        {decision.evidence.length > 0 && (
                            <section>
                                <h4 className="text-[14px] font-bold text-hrsd-navy dark:text-white mb-2.5 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded bg-hrsd-navy text-white flex items-center justify-center text-[11px]">
                                        {decision.evidence.length}
                                    </span>
                                    ستاك الأدلّة
                                </h4>
                                <div className="space-y-2">
                                    {decision.evidence.map((e, i) => (
                                        <div key={i} className="bg-slate-50 dark:bg-white/50 rounded-lg p-3 border border-gray-200 dark:border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <span className="shrink-0 inline-block text-[11px] font-bold uppercase tracking-wider
                                                    bg-hrsd-gold/20 text-hrsd-gold-dark px-2 py-0.5 rounded">
                                                    {EVIDENCE_TYPE_LABELS[e.type]}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-[14px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                                                        {e.summary}
                                                    </p>
                                                    {e.source && (
                                                        <p className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-1">
                                                            المصدر: {e.source}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* البدائل */}
                        {decision.alternatives.length > 0 && (
                            <section>
                                <h4 className="text-[14px] font-bold text-hrsd-navy dark:text-white mb-2.5">
                                    البدائل المدروسة
                                </h4>
                                <div className="grid gap-3">
                                    {decision.alternatives.map((a, i) => (
                                        <div key={i} className="border border-gray-200 dark:border-gray-200 rounded-lg p-3">
                                            <p className="text-[14px] font-semibold text-hrsd-navy dark:text-white mb-2">
                                                {a.title}
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-3 text-[13px]">
                                                <div>
                                                    <div className="font-medium text-hrsd-green-dark mb-1">مزايا</div>
                                                    <ul className="space-y-0.5 text-hrsd-navy dark:text-hrsd-navy">
                                                        {a.pros.map((p, j) => <li key={j}>• {p}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-[#B91C1C] mb-1">عيوب</div>
                                                    <ul className="space-y-0.5 text-hrsd-navy dark:text-hrsd-navy">
                                                        {a.cons.map((c, j) => <li key={j}>• {c}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* التبعات */}
                        <section>
                            <h4 className="text-[14px] font-bold text-hrsd-navy dark:text-white mb-2.5">
                                التبعات حسب القرار
                            </h4>
                            <div className="grid md:grid-cols-3 gap-3 text-[13px]">
                                {decision.consequences.ifApproved && (
                                    <div className="bg-hrsd-green/5 border border-hrsd-green/30 rounded-lg p-3">
                                        <div className="font-bold text-hrsd-green-dark mb-1.5">لو وافقت</div>
                                        <p className="text-hrsd-navy dark:text-hrsd-navy leading-relaxed">{decision.consequences.ifApproved.impact}</p>
                                        {decision.consequences.ifApproved.timeline && (
                                            <p className="text-[12px] text-hrsd-cool-gray mt-1">🕒 {decision.consequences.ifApproved.timeline}</p>
                                        )}
                                    </div>
                                )}
                                {decision.consequences.ifDelayed && (
                                    <div className="bg-[#FCB614]/10 border border-[#FCB614]/30 rounded-lg p-3">
                                        <div className="font-bold text-[#D49A0A] mb-1.5">لو أجَّلت</div>
                                        <p className="text-hrsd-navy dark:text-hrsd-navy leading-relaxed">{decision.consequences.ifDelayed.impact}</p>
                                        {decision.consequences.ifDelayed.risk && (
                                            <p className="text-[12px] text-[#D49A0A] mt-1">⚠ {decision.consequences.ifDelayed.risk}</p>
                                        )}
                                    </div>
                                )}
                                {decision.consequences.ifRejected && (
                                    <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg p-3">
                                        <div className="font-bold text-[#B91C1C] mb-1.5">لو رفضت</div>
                                        <p className="text-hrsd-navy dark:text-hrsd-navy leading-relaxed">{decision.consequences.ifRejected.impact}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* المعلومات الإداريّة */}
                        <section className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray flex flex-wrap gap-x-4 gap-y-1 pt-2 border-t border-slate-100 dark:border-gray-200">
                            {decision.recommendedByRole && <span>التوصية من: {decision.recommendedByRole}</span>}
                            <span>المُقرِّر: {decision.ownerRole}</span>
                            <span>رقم القرار: {decision.id}</span>
                        </section>
                    </div>
                )}
            </div>

            {/* أزرار الإجراء */}
            <div className="bg-slate-50 dark:bg-white/50 px-5 py-3 border-t border-gray-200 dark:border-gray-200
                flex flex-wrap gap-2 justify-end">
                <button
                    type="button"
                    onClick={() => onAction?.('more_evidence', decision)}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-hrsd-cool-gray dark:text-hrsd-navy
                        hover:bg-slate-200 dark:hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                >
                    <FileQuestion className="w-4 h-4" />
                    طلب أدلّة
                </button>
                <button
                    type="button"
                    onClick={() => onAction?.('delay', decision)}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-[#D49A0A]
                        hover:bg-[#FCB614]/10 flex items-center gap-1.5 transition-colors"
                >
                    <PauseCircle className="w-4 h-4" />
                    تأجيل
                </button>
                <button
                    type="button"
                    onClick={() => onAction?.('reject', decision)}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-[#B91C1C]
                        hover:bg-[#DC2626]/10 flex items-center gap-1.5 transition-colors"
                >
                    <XCircle className="w-4 h-4" />
                    رفض
                </button>
                <button
                    type="button"
                    onClick={() => onAction?.('approve', decision)}
                    className="px-4 py-2 rounded-lg text-[13px] font-bold text-white
                        bg-hrsd-teal hover:bg-hrsd-teal-dark flex items-center gap-1.5 transition-colors shadow-sm"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    موافقة
                </button>
            </div>
        </article>
    );
};
