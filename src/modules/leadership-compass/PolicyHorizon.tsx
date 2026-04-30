import React from 'react';
import { Telescope, Info, AlertCircle, Users, Compass } from 'lucide-react';
import {
    SEED_SIGNALS, HORIZON_LABELS, STRENGTH_LABELS, STRENGTH_TONES,
    type PolicySignal, type SignalHorizon,
} from './data/seed-horizon';

/**
 * تبويب «أفق السياسات» — رادار الإشارات الضعيفة.
 * مبدأ: القيادة الجيّدة لا تَنتظر الأزمات؛ تَراها وهي تَتَشكَّل.
 * كلّ إشارة مُصنَّفةٌ بقوّتها وأفقها الزمنيّ، مع خطوات استعدادٍ مُقترَحة.
 */
export const PolicyHorizon: React.FC = () => {
    const byHorizon: Record<SignalHorizon, PolicySignal[]> = {
        '6_months':  SEED_SIGNALS.filter((s) => s.horizonBand === '6_months'),
        '12_months': SEED_SIGNALS.filter((s) => s.horizonBand === '12_months'),
        '18_months': SEED_SIGNALS.filter((s) => s.horizonBand === '18_months'),
    };

    return (
        <section className="space-y-5" dir="rtl">
            <div className="bg-gradient-to-br from-hrsd-navy/5 to-hrsd-teal/5 border-r-4 border-hrsd-navy rounded-xl p-4 flex items-start gap-3">
                <Telescope className="w-5 h-5 text-hrsd-navy mt-0.5 shrink-0" />
                <div className="text-[13.5px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                    <span className="font-bold text-hrsd-navy">رادار السياسات:</span>{' '}
                    إشاراتٌ ضعيفةٌ من البيانات والمناقشات الميدانيّة تَتشكَّل ببطء،
                    لكنّها تَستحقّ اهتمامكم الآن بدل أن تَنفجر كأزماتٍ لاحقاً.
                    لكلّ إشارةٍ أفقٌ زمنيّ وقوّةٌ مُعلَنة.
                </div>
            </div>

            {/* ثلاث خانات زمنيّة */}
            <div className="grid md:grid-cols-3 gap-5">
                <HorizonBand
                    horizon="6_months"
                    signals={byHorizon['6_months']}
                    accent="rose"
                />
                <HorizonBand
                    horizon="12_months"
                    signals={byHorizon['12_months']}
                    accent="amber"
                />
                <HorizonBand
                    horizon="18_months"
                    signals={byHorizon['18_months']}
                    accent="teal"
                />
            </div>
        </section>
    );
};

const ACCENT_STYLES: Record<'rose' | 'amber' | 'teal', { bg: string; text: string; border: string }> = {
    rose:  { bg: 'bg-[#DC2626]/10',   text: 'text-[#7F1D1D]',  border: 'border-[#DC2626]' },
    amber: { bg: 'bg-[#FCB614]/10',  text: 'text-[#0F3144]', border: 'border-[#FCB614]' },
    teal:  { bg: 'bg-hrsd-teal/5', text: 'text-hrsd-teal', border: 'border-hrsd-teal/40' },
};

const HorizonBand: React.FC<{
    horizon: SignalHorizon;
    signals: PolicySignal[];
    accent: keyof typeof ACCENT_STYLES;
}> = ({ horizon, signals, accent }) => {
    const style = ACCENT_STYLES[accent];
    return (
        <div className="space-y-3">
            <header className={`${style.bg} ${style.text} rounded-xl p-3 border-2 ${style.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    <span className="font-bold text-[14px]">{HORIZON_LABELS[horizon]}</span>
                </div>
                <span className="text-[12px] font-semibold">{signals.length} إشارة</span>
            </header>

            <div className="space-y-3">
                {signals.length > 0
                    ? signals.map((s) => <SignalCard key={s.id} signal={s} />)
                    : <div className="bg-white dark:bg-white border border-dashed border-gray-300 dark:border-gray-300 rounded-lg p-6 text-center text-[12px] text-hrsd-cool-gray">
                        لا إشاراتٌ في هذا الأفق حاليّاً.
                    </div>
                }
            </div>
        </div>
    );
};

const SignalCard: React.FC<{ signal: PolicySignal }> = ({ signal }) => {
    const [expanded, setExpanded] = React.useState(false);
    const strength = STRENGTH_TONES[signal.strength];

    return (
        <article className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 shadow-sm overflow-hidden">
            <div className={`${strength.bg} px-4 py-2 flex items-center gap-2 border-b ${strength.border}`}>
                <span className="text-base" aria-hidden="true">{strength.icon}</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${strength.text}`}>
                    {STRENGTH_LABELS[signal.strength]}
                </span>
            </div>

            <div className="p-4 space-y-3">
                <h3 className="text-[15px] font-bold text-hrsd-navy dark:text-white leading-tight">
                    {signal.title}
                </h3>

                <div>
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-0.5">
                        السياق الحاليّ
                    </div>
                    <p className="text-[12.5px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">
                        {signal.currentContext}
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-white rounded-lg p-3">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1">
                        القضيّة الناشئة
                    </div>
                    <p className="text-[13px] font-semibold text-hrsd-navy dark:text-slate-100 leading-relaxed">
                        {signal.emergingIssue}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-1.5 text-[12.5px] font-semibold text-hrsd-teal hover:text-hrsd-teal-dark"
                >
                    {expanded ? '▲ إخفاء التفاصيل' : '▼ الإشارات + الخطوات المقترحة'}
                </button>

                {expanded && (
                    <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-gray-200">
                        {/* الإشارات الضعيفة */}
                        <div>
                            <div className="flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1.5">
                                <Info className="w-3 h-3" />
                                إشاراتٌ ضعيفة رُصِدت
                            </div>
                            <ul className="space-y-1 text-[12px] text-hrsd-navy dark:text-slate-200">
                                {signal.weakSignals.map((w, i) => (
                                    <li key={i} className="flex gap-1.5"><span className="text-hrsd-teal">◂</span><span>{w}</span></li>
                                ))}
                            </ul>
                        </div>

                        {/* القرارات المحتملة */}
                        <div>
                            <div className="text-[10.5px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1.5">
                                قراراتٌ مُحتمَلة مطلوبة
                            </div>
                            <ul className="space-y-1 text-[12px] text-hrsd-navy dark:text-slate-200">
                                {signal.likelyPolicyDecisions.map((d, i) => (
                                    <li key={i} className="flex gap-1.5"><span className="text-hrsd-gold">✓</span><span>{d}</span></li>
                                ))}
                            </ul>
                        </div>

                        {/* خطوات الاستعداد */}
                        <div className="bg-hrsd-teal/5 rounded-lg p-3">
                            <div className="text-[10.5px] font-bold uppercase tracking-wider text-hrsd-teal mb-1.5">
                                خطواتٌ مقترَحةٌ للاستعداد
                            </div>
                            <ol className="space-y-1 text-[12px] text-hrsd-navy dark:text-slate-200 list-decimal list-inside">
                                {signal.preparationSteps.map((s, i) => <li key={i}>{s}</li>)}
                            </ol>
                        </div>

                        {/* المعنيّون */}
                        <div className="flex items-start gap-2 text-[11.5px]">
                            <Users className="w-3.5 h-3.5 text-hrsd-cool-gray mt-0.5 shrink-0" />
                            <span className="text-hrsd-cool-gray">
                                <strong className="text-hrsd-navy dark:text-slate-200">المعنيّون:</strong>{' '}
                                {signal.stakeholdersInvolved.join(' · ')}
                            </span>
                        </div>

                        {/* المخاطرة لو أُهمِلت */}
                        <div className="flex items-start gap-2 text-[11.5px] text-[#DC2626] bg-[#DC2626]/10 rounded-lg p-2.5">
                            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span><strong>خطرُ التجاهل:</strong> {signal.riskIfIgnored}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-hrsd-cool-gray pt-2 border-t border-slate-100 dark:border-gray-200">
                    <span className="font-semibold">عوائقُ مُرتبطة:</span>
                    <span>{signal.barriersImplicated.join(' · ')}</span>
                </div>
            </div>
        </article>
    );
};
