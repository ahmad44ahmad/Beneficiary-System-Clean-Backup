import React from 'react';
import { Lightbulb, Users, Info, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import {
    SEED_DISCOVERIES, CONFIDENCE_LABELS, CONFIDENCE_TONES,
    STAGE_LABELS, type Discovery,
} from './data/seed-discoveries';

/**
 * تبويب «اكتشف» — محرّك يُبرز تدخّلاتٍ تَستحقّ الدراسة للتعميم.
 * ليس تنافساً بين مراكز — بل عرضٌ لممارساتٍ قابلةٍ للنقل.
 */
export const Discover: React.FC = () => {
    return (
        <section className="space-y-5" dir="rtl">
            <div className="bg-hrsd-teal/5 border-r-4 border-hrsd-teal rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-hrsd-teal mt-0.5 shrink-0" />
                <div className="text-[13.5px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                    <span className="font-bold text-hrsd-navy">فلسفة هذه الأداة:</span>{' '}
                    لا نَعرض «المركز الأفضل» — هذه منافسة. نَعرض «الممارسة التي تَستحقّ النَسخ» —
                    هذه منهجيّة. كلّ اكتشافٍ مرفقٌ بدرجة ثقةٍ صريحةٍ وخطواتٍ مقترَحةٍ للتحقّق قبل التعميم.
                </div>
            </div>

            <div className="grid gap-5">
                {SEED_DISCOVERIES.map((d) => (
                    <DiscoveryCard key={d.id} discovery={d} />
                ))}
            </div>
        </section>
    );
};

const DiscoveryCard: React.FC<{ discovery: Discovery }> = ({ discovery }) => {
    const conf = CONFIDENCE_TONES[discovery.confidence];

    return (
        <article
            className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200
                shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* الشريط العلويّ */}
            <div className={`${conf.bg} px-5 py-2.5 flex items-center justify-between flex-wrap gap-2 border-b ${conf.border}`}>
                <div className="flex items-center gap-2.5 text-[12px]">
                    <Lightbulb className={`w-4 h-4 ${conf.text}`} />
                    <span className={`font-bold uppercase tracking-wider ${conf.text}`}>
                        ثقة {CONFIDENCE_LABELS[discovery.confidence]}
                    </span>
                    <span className="text-hrsd-cool-gray">·</span>
                    <span className="text-hrsd-navy dark:text-hrsd-navy font-semibold">
                        {STAGE_LABELS[discovery.stage]}
                    </span>
                </div>
                <span className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    عيّنة: {discovery.sampleSize}
                </span>
            </div>

            <div className="p-5 md:p-6 space-y-4">
                {/* العنوان */}
                <header>
                    <h3 className="text-[17px] font-bold text-hrsd-navy dark:text-white leading-tight mb-1.5">
                        {discovery.title}
                    </h3>
                    <p className="text-[12.5px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                        {discovery.originCenter} · منذ {discovery.observedSince}
                    </p>
                </header>

                {/* التدخل */}
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray dark:text-hrsd-cool-gray mb-1.5">
                        التدخُّل
                    </div>
                    <p className="text-[14px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                        {discovery.intervention}
                    </p>
                </div>

                {/* المُخرَج البارز */}
                <div className="bg-hrsd-gold/5 border-r-4 border-hrsd-gold rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                        <ArrowUpRight className="w-4 h-4 text-hrsd-gold-dark" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-hrsd-gold-dark">
                            ما يُلفت النظر
                        </span>
                    </div>
                    <p className="text-[15px] font-bold text-hrsd-navy dark:text-white mb-1">
                        {discovery.outcomeDelta}
                    </p>
                    <p className="text-[12.5px] text-hrsd-cool-gray dark:text-hrsd-navy">
                        المقياس: {discovery.outcomeMetric}
                    </p>
                    <p className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-1 font-mono">
                        {discovery.baselineComparison}
                    </p>
                </div>

                {/* الإجراءات المقترحة */}
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray dark:text-hrsd-cool-gray mb-2">
                        خطواتٌ مقترَحةٌ
                    </div>
                    <div className="grid md:grid-cols-3 gap-2">
                        {discovery.proposedActions.map((a, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-white border border-gray-200 dark:border-gray-200 rounded-lg p-3">
                                <div className="flex items-center gap-1.5 text-hrsd-teal text-[13px] font-bold mb-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {a.title}
                                </div>
                                <p className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">
                                    {a.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* المخاطر */}
                {discovery.risks.length > 0 && (
                    <div className="bg-[#FCB614]/10 border-r-4 border-[#FCB614] rounded-lg p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <AlertTriangle className="w-4 h-4 text-[#FCB614]" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F3144]">
                                مخاطرُ التعميم
                            </span>
                        </div>
                        <ul className="space-y-0.5 text-[12.5px] text-[#0F3144] leading-relaxed">
                            {discovery.risks.map((r, i) => (
                                <li key={i} className="flex gap-1.5"><span>•</span><span>{r}</span></li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* أسفل — عوائق + زر */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-200 dark:border-gray-200">
                    <div className="text-[12.5px] text-hrsd-cool-gray dark:text-hrsd-navy">
                        <span className="font-semibold">عوائقُ مُستهدَفة:</span>{' '}
                        {discovery.barriersAddressed.join(' · ')}
                    </div>
                    <button
                        type="button"
                        className="px-3.5 py-2 rounded-lg text-[13px] font-bold text-white
                            bg-hrsd-teal hover:bg-hrsd-teal-dark flex items-center gap-1.5 transition-colors shadow-sm"
                        onClick={() => alert(`فُتح قرارٌ جديدٌ لتجربة توسّعٍ: ${discovery.title}\n(في النسخة الحقيقيّة يُربط مع تبويب «القرارات»)`)}
                    >
                        اقتراحٌ للتعميم
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </article>
    );
};
