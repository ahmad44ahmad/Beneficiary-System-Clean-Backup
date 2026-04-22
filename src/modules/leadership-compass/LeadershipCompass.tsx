import React, { useState } from 'react';
import { Compass, Gavel, Eye, TrendingUp, Calculator, Lightbulb, BookOpen, Telescope } from 'lucide-react';
import { SEED_DECISIONS } from './data/seed-decisions';
import { SEED_MIRROR_FINDINGS } from './data/seed-mirror';
import { DecisionCard } from './DecisionCard';
import { MirrorFindingCard } from './MirrorFindingCard';
import { Trajectories } from './Trajectories';
import { ScenarioSimulator } from './ScenarioSimulator';
import type { StrategicDecision, HonestMirrorFinding } from '../../types/leadership-compass';

type CompassTab = 'decisions' | 'mirror' | 'trajectories' | 'simulator' | 'discover' | 'ledger' | 'horizon';

interface TabDef {
    id: CompassTab;
    label: string;
    icon: React.ElementType;
    available: boolean;
    badge?: number;
}

export const LeadershipCompass: React.FC = () => {
    const [activeTab, setActiveTab] = useState<CompassTab>('decisions');

    // لاحقاً: قراءة من Supabase عند تطبيق ترحيل 024. الآن: بذور محليّة.
    const [decisions] = useState<StrategicDecision[]>(SEED_DECISIONS);
    const [findings] = useState<HonestMirrorFinding[]>(SEED_MIRROR_FINDINGS);

    const pendingCount = decisions.filter((d) =>
        d.status === 'pending' || d.status === 'more_evidence',
    ).length;
    const openFindings = findings.filter((f) => f.status === 'open').length;

    const tabs: TabDef[] = [
        { id: 'decisions',    label: 'القرارات المُعلَّقة', icon: Gavel,      available: true,  badge: pendingCount },
        { id: 'mirror',       label: 'المرآة الصادقة',     icon: Eye,        available: true,  badge: openFindings },
        { id: 'trajectories', label: 'اتّجاهات 12 شهراً',  icon: TrendingUp, available: true },
        { id: 'simulator',    label: 'محاكاة السيناريوهات', icon: Calculator, available: true },
        { id: 'discover',     label: 'اكتشف',              icon: Lightbulb,  available: false },
        { id: 'ledger',       label: 'سجلّ القرارات',       icon: BookOpen,   available: false },
        { id: 'horizon',      label: 'أفق السياسات',       icon: Telescope,  available: false },
    ];

    const handleDecisionAction = (action: string, decision: StrategicDecision) => {
        console.info(`[بوصلة القيادة] إجراء "${action}" على القرار ${decision.id} — (نموذج تجريبيّ)`);
        alert(
            `تمّ تسجيل الإجراء: ${action}\n` +
            `القرار: ${decision.title}\n\n` +
            `(في النسخة الحقيقيّة، يُحفَظ الإجراء في سجلّ القرارات)`,
        );
    };

    return (
        <div className="p-6 min-h-screen space-y-6" dir="rtl">
            {/* الترويسة */}
            <header className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-hrsd-navy to-hrsd-teal rounded-2xl
                        flex items-center justify-center shadow-lg">
                        <Compass className="w-8 h-8 text-hrsd-gold" />
                    </div>
                    <div>
                        <h1 className="text-[24px] font-bold text-slate-900 dark:text-white leading-tight">
                            بوصلة القيادة
                        </h1>
                        <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-0.5">
                            مساحةُ عملٍ قراريّة — لمساعد التنمية والمدير العام فأعلى
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider
                        bg-amber-100 text-amber-800 px-2.5 py-1 rounded">
                        نموذج تجريبيّ (v0)
                    </span>
                </div>
            </header>

            {/* الفلسفة — ملاحظة افتتاحيّة */}
            <div className="bg-hrsd-navy/5 border-r-4 border-hrsd-gold rounded-xl p-4 flex items-start gap-3">
                <Compass className="w-5 h-5 text-hrsd-navy mt-0.5 shrink-0" />
                <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-hrsd-navy">فلسفة هذه المساحة:</span>{' '}
                    القرار قبل البيانات. تُقدَّم لكم هنا قراراتٌ مُصاغةٌ بأدلّة، مع بدائل وتبعات،
                    بدلاً من لوحاتِ بياناتٍ تَنتظر تَفسيركم لها. كلّ قرارٍ يَبقى في السجلّ —
                    نَتعلَّم من أين حطَّت النتائج.
                </p>
            </div>

            {/* أشرطة التبويب */}
            <nav
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5
                    flex flex-wrap gap-1 shadow-sm"
                aria-label="أقسام بوصلة القيادة"
            >
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => tab.available && setActiveTab(tab.id)}
                            disabled={!tab.available}
                            className={`relative flex-1 min-w-[140px] flex items-center justify-center gap-2
                                px-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all
                                ${isActive
                                    ? 'bg-hrsd-navy text-white shadow-md'
                                    : tab.available
                                        ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        : 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'}`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.badge !== undefined && tab.badge > 0 && (
                                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                                    isActive ? 'bg-hrsd-gold text-hrsd-navy' : 'bg-hrsd-teal text-white'
                                }`}>
                                    {tab.badge}
                                </span>
                            )}
                            {!tab.available && (
                                <span className="text-[10px] font-semibold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                    قريباً
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* المحتوى */}
            {activeTab === 'decisions' && (
                <section aria-labelledby="decisions-title" className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 id="decisions-title" className="text-[18px] font-bold text-slate-900 dark:text-white">
                            القرارات المُعلَّقة ({pendingCount})
                        </h2>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400">
                            مُرتَّبة حسب العاجليّة × الموعد النهائيّ
                        </p>
                    </div>
                    <div className="space-y-5">
                        {decisions
                            .filter((d) => d.status === 'pending' || d.status === 'more_evidence')
                            .sort((a, b) => {
                                const urgencyRank = { critical: 0, high: 1, medium: 2, low: 3 };
                                const u = urgencyRank[a.urgency] - urgencyRank[b.urgency];
                                if (u !== 0) return u;
                                const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
                                const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
                                return da - db;
                            })
                            .map((d) => (
                                <DecisionCard key={d.id} decision={d} onAction={handleDecisionAction} />
                            ))}
                    </div>
                </section>
            )}

            {activeTab === 'mirror' && (
                <section aria-labelledby="mirror-title" className="space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 id="mirror-title" className="text-[18px] font-bold text-slate-900 dark:text-white">
                            المرآة الصادقة ({openFindings})
                        </h2>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400">
                            أنماطٌ بنيويّةٌ يَراها النظام ويَرى أنّها تَستحقّ نظركم
                        </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        {findings
                            .filter((f) => f.status === 'open')
                            .sort((a, b) => {
                                const sev = { urgent: 0, concern: 1, watch: 2, info: 3 };
                                return sev[a.severity] - sev[b.severity];
                            })
                            .map((f) => (
                                <MirrorFindingCard
                                    key={f.id}
                                    finding={f}
                                    onAcknowledge={(finding) => {
                                        console.info(`[المرآة الصادقة] استلام ${finding.id}`);
                                        alert(`تمّ استلام المعلومة: ${finding.findingHeadline}\n(في النسخة الحقيقيّة، يُفتَح قرارٌ جديد)`);
                                    }}
                                />
                            ))}
                    </div>
                </section>
            )}

            {activeTab === 'trajectories' && <Trajectories />}

            {activeTab === 'simulator' && <ScenarioSimulator />}

            {/* شرائح «قريباً» — نبرة صريحة، لا تَظاهر بالاكتمال */}
            {activeTab !== 'decisions' && activeTab !== 'mirror' && activeTab !== 'trajectories' && activeTab !== 'simulator' && (
                <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-[18px] font-bold text-slate-900 dark:text-white mb-2">
                            هذا القسم قيد التطوير
                        </h2>
                        <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            بوصلة القيادة تَبدأ بما نَستطيع تَسليمه بثقةٍ اليوم: «القرارات المُعلَّقة»
                            و«المرآة الصادقة». الأقسام الأربعة الأخرى تُفعَّل في مراحل v2.2 و v2.3
                            حين تَكون بياناتنا كافيةً لتَقديم رؤيةٍ موثوقة — لا عرضاً جميلاً على بياناتٍ ضحلة.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default LeadershipCompass;
