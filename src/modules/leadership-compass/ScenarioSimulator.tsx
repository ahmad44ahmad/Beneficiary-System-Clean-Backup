import React, { useState, useMemo } from 'react';
import { Calculator, Info, TrendingUp, Briefcase, Home, Users, ArrowLeftRight } from 'lucide-react';

/**
 * محاكاة السيناريوهات — أداةٌ تقديريّةٌ لمقارنة استراتيجيّات تخصيص الميزانيّة.
 *
 * ملاحظةٌ أخلاقيّةٌ مُعلَنة في الواجهة: هذه محاكاةٌ مبنيّة على فرضيّاتٍ من
 * بيانات الباحة، لا تنبُّؤٌ دقيقٌ للمستقبل. درجة الثقة تُعرَض صراحةً.
 */

// ─── الاستراتيجيّات الثلاث ───────────────────────────────────────────────────
type Strategy = 'vocational' | 'reintegration' | 'staff';

interface StrategySpec {
    code: Strategy;
    titleAr: string;
    icon: React.ElementType;
    color: string;
    costPerOutcome: number;     // تكلفة تقريبيّة لنتيجةٍ واحدة
    sroi: number;               // العائد الاجتماعي
    confidence: number;         // ثقة 0-1
    barriersAddressed: string[];
    outcomeLabel: string;       // اسم النتيجة
    description: string;
}

const STRATEGIES: Record<Strategy, StrategySpec> = {
    vocational: {
        code: 'vocational',
        titleAr: 'التمكين المهنيّ',
        icon: Briefcase,
        color: '#F7941D',
        costPerOutcome: 25_000,
        sroi: 3.0,
        confidence: 0.6,
        barriersAddressed: ['B1', 'B2', 'B4'],
        outcomeLabel: 'حالة توظيف مستدام',
        description: 'تأهيل مهنيّ + شراكات توظيفيّة + متابعة ≥6 أشهر.',
    },
    reintegration: {
        code: 'reintegration',
        titleAr: 'الدمج الأسريّ',
        icon: Home,
        color: '#2BB574',
        costPerOutcome: 15_000,
        sroi: 2.5,
        confidence: 0.7,
        barriersAddressed: ['B6', 'B7', 'B8'],
        outcomeLabel: 'حالة دمج أسريّ ناجح',
        description: 'برنامج الرعاية اللاحقة + تدريب الأسرة + متابعة ميدانيّة.',
    },
    staff: {
        code: 'staff',
        titleAr: 'بناء قدرات الكادر',
        icon: Users,
        color: '#269798',
        costPerOutcome: 10_000,
        sroi: 1.5,
        confidence: 0.5,
        barriersAddressed: ['B4'],
        outcomeLabel: 'موظّف مُؤهَّل حديثاً',
        description: 'تدريب مُتخصّص + شهادات معتمدة + تقليل دوران الكادر.',
    },
};

// ─── التخصيصات المُسبَقة ──────────────────────────────────────────────────────
const PRESETS: Record<string, { label: string; split: Record<Strategy, number> }> = {
    balanced:    { label: 'متوازن',             split: { vocational: 40, reintegration: 40, staff: 20 } },
    employment:  { label: 'توظيف أوّلاً',         split: { vocational: 60, reintegration: 25, staff: 15 } },
    family:      { label: 'دمج أسريّ أوّلاً',    split: { vocational: 25, reintegration: 60, staff: 15 } },
    capability:  { label: 'قدرات كادرٍ أوّلاً',  split: { vocational: 20, reintegration: 30, staff: 50 } },
};

interface ScenarioOutput {
    label: string;
    split: Record<Strategy, number>;
    outcomes: Record<Strategy, { count: number; lower: number; upper: number }>;
    totalSroi: number;
    dignityPointsEstimate: number;
    barrierCoverage: string[];
}

function computeOutcomes(budgetSar: number, split: Record<Strategy, number>, horizonMonths: number): ScenarioOutput['outcomes'] {
    const timeFactor = horizonMonths / 12; // تقريباً — نتائج 12 شهراً كأساس
    const result: ScenarioOutput['outcomes'] = {} as ScenarioOutput['outcomes'];
    for (const code of Object.keys(STRATEGIES) as Strategy[]) {
        const spec = STRATEGIES[code];
        const allocated = budgetSar * (split[code] / 100);
        const expected = (allocated / spec.costPerOutcome) * timeFactor;
        const variance = expected * (1 - spec.confidence) * 0.5;
        result[code] = {
            count: Math.round(expected),
            lower: Math.max(0, Math.round(expected - variance)),
            upper: Math.round(expected + variance),
        };
    }
    return result;
}

function computeScenario(
    label: string,
    budgetSar: number,
    split: Record<Strategy, number>,
    horizonMonths: number,
): ScenarioOutput {
    const outcomes = computeOutcomes(budgetSar, split, horizonMonths);
    // SROI مُوزون حسب التخصيص
    let weightedSroi = 0;
    for (const code of Object.keys(STRATEGIES) as Strategy[]) {
        weightedSroi += STRATEGIES[code].sroi * (split[code] / 100);
    }
    // نقاط الكرامة التقديريّة
    const dignityPointsEstimate =
        outcomes.vocational.count * 3 +
        outcomes.reintegration.count * 4 +
        Math.round(outcomes.staff.count * 1.5);
    // تغطية العوائق
    const barriers = new Set<string>();
    for (const code of Object.keys(STRATEGIES) as Strategy[]) {
        if (split[code] > 0) STRATEGIES[code].barriersAddressed.forEach((b) => barriers.add(b));
    }
    return {
        label,
        split,
        outcomes,
        totalSroi: Math.round(weightedSroi * 100) / 100,
        dignityPointsEstimate,
        barrierCoverage: Array.from(barriers).sort(),
    };
}

// ─── المكوّن الرئيسيّ ────────────────────────────────────────────────────────
export const ScenarioSimulator: React.FC = () => {
    const [budget, setBudget] = useState<number>(2_000_000);
    const [horizon, setHorizon] = useState<6 | 12 | 24>(12);
    const [split, setSplit] = useState<Record<Strategy, number>>(PRESETS.balanced.split);
    const [activePreset, setActivePreset] = useState<string>('balanced');

    const splitTotal = split.vocational + split.reintegration + split.staff;
    const isValid = Math.abs(splitTotal - 100) < 0.1 && budget > 0;

    // احسب 3 سيناريوهات للمقارنة
    const scenarios = useMemo<ScenarioOutput[] | null>(() => {
        if (!isValid) return null;
        return [
            computeScenario('سيناريوك', budget, split, horizon),
            computeScenario('توظيف أوّلاً', budget, PRESETS.employment.split, horizon),
            computeScenario('دمج أسريّ أوّلاً', budget, PRESETS.family.split, horizon),
        ];
    }, [budget, horizon, split, isValid]);

    const applyPreset = (key: string) => {
        setSplit(PRESETS[key].split);
        setActivePreset(key);
    };

    const updateSplit = (code: Strategy, value: number) => {
        setSplit({ ...split, [code]: value });
        setActivePreset('custom');
    };

    return (
        <section className="space-y-5" dir="rtl">
            {/* ملاحظة افتتاحيّة — تواضع معرفيّ */}
            <div className="bg-[#FCB614]/10 border-r-4 border-[#FCB614] rounded-xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#D49A0A] mt-0.5 shrink-0" />
                <div className="text-[13.5px] text-[#92400E] leading-relaxed">
                    <strong>هذه محاكاةٌ تقديريّةٌ، ليست تنبُّؤاً دقيقاً.</strong>{' '}
                    النموذج مبنيٌّ على فرضيّاتٍ من بيانات مركز الباحة (2-3 حالات توظيف سابقة، ومعدّلات دمجٍ أسريٍّ محدودة).
                    درجة الثقة موزونةٌ حسب الاستراتيجيّة. السيناريوهات مفيدةٌ لتأطير النقاش، لا لالتزام مالي.
                </div>
            </div>

            {/* شريط الإدخال */}
            <div className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 p-5 md:p-6 shadow-sm">
                <header className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 bg-hrsd-teal/10 rounded-xl flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-hrsd-teal" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold text-hrsd-navy dark:text-white">محرّك المحاكاة</h3>
                        <p className="text-[12.5px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                            حدِّد الميزانيّة والأفق الزمنيّ وتوزيع التخصيص
                        </p>
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-5 mb-5">
                    {/* الميزانيّة */}
                    <div>
                        <label className="text-[13px] font-bold text-hrsd-navy dark:text-slate-200 block mb-2">
                            إجمالي الميزانيّة (ريال)
                        </label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                            step={100_000}
                            min={0}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-300
                                rounded-xl bg-white dark:bg-white text-[15px] font-semibold
                                text-hrsd-navy dark:text-white focus:border-hrsd-teal focus:outline-none"
                        />
                        <p className="text-[11.5px] text-hrsd-cool-gray mt-1.5">
                            {budget.toLocaleString('ar-SA')} ريال
                        </p>
                    </div>

                    {/* الأفق الزمنيّ */}
                    <div>
                        <label className="text-[13px] font-bold text-hrsd-navy dark:text-slate-200 block mb-2">
                            الأفق الزمنيّ
                        </label>
                        <div className="flex gap-2">
                            {[6, 12, 24].map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => setHorizon(h as 6 | 12 | 24)}
                                    className={`flex-1 py-2.5 rounded-xl text-[14px] font-bold transition-all border-2 ${
                                        horizon === h
                                            ? 'bg-hrsd-navy text-white border-hrsd-navy'
                                            : 'bg-white dark:bg-white border-gray-200 dark:border-gray-300 text-hrsd-cool-gray dark:text-hrsd-navy hover:border-hrsd-teal'
                                    }`}
                                >
                                    {h} شهر
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* تحقّق من المجموع */}
                    <div>
                        <label className="text-[13px] font-bold text-hrsd-navy dark:text-slate-200 block mb-2">
                            مجموع التخصيص
                        </label>
                        <div className={`px-4 py-2.5 rounded-xl border-2 text-[15px] font-black ${
                            Math.abs(splitTotal - 100) < 0.1
                                ? 'border-hrsd-green bg-hrsd-green/5 text-hrsd-green-dark'
                                : 'border-[#DC2626] bg-[#DC2626]/10 text-[#B91C1C]'
                        }`}>
                            {splitTotal}% {Math.abs(splitTotal - 100) < 0.1 ? '✓' : '— يجب أن يساوي 100'}
                        </div>
                    </div>
                </div>

                {/* أزرار التخصيصات المُسبَقة */}
                <div className="mb-5">
                    <div className="text-[13px] font-bold text-hrsd-navy dark:text-slate-200 mb-2">
                        تخصيصاتٌ مُسبَقة:
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(PRESETS).map(([key, preset]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => applyPreset(key)}
                                className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all border ${
                                    activePreset === key
                                        ? 'bg-hrsd-teal text-white border-hrsd-teal'
                                        : 'bg-white dark:bg-white border-gray-300 dark:border-gray-300 text-hrsd-cool-gray dark:text-hrsd-navy hover:border-hrsd-teal hover:text-hrsd-teal'
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* مُعدِّلات التوزيع */}
                <div className="grid md:grid-cols-3 gap-4">
                    {(Object.keys(STRATEGIES) as Strategy[]).map((code) => {
                        const spec = STRATEGIES[code];
                        const Icon = spec.icon;
                        const allocated = budget * (split[code] / 100);
                        return (
                            <div key={code} className="bg-slate-50 dark:bg-white rounded-xl p-4 border border-gray-200 dark:border-gray-200">
                                <div className="flex items-center gap-2.5 mb-2.5">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${spec.color}20` }}>
                                        <Icon className="w-5 h-5" style={{ color: spec.color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[14px] font-bold text-hrsd-navy dark:text-white leading-tight">
                                            {spec.titleAr}
                                        </h4>
                                        <p className="text-[11.5px] text-hrsd-cool-gray dark:text-hrsd-cool-gray leading-snug mt-0.5">
                                            {spec.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={split[code]}
                                        onChange={(e) => updateSplit(code, parseInt(e.target.value))}
                                        className="flex-1"
                                        style={{ accentColor: spec.color }}
                                    />
                                    <div className="text-[14px] font-black min-w-[3rem] text-end" style={{ color: spec.color }}>
                                        {split[code]}%
                                    </div>
                                </div>
                                <div className="text-[11.5px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-1.5">
                                    التخصيص: {allocated.toLocaleString('ar-SA')} ريال
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* المقارنة — 3 سيناريوهات جنباً إلى جنب */}
            {scenarios ? (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <ArrowLeftRight className="w-5 h-5 text-hrsd-navy" />
                        <h3 className="text-[16px] font-bold text-hrsd-navy dark:text-white">
                            مقارنة السيناريوهات ({horizon} شهراً · ميزانيّة {(budget / 1_000_000).toFixed(1)} م.ر)
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {scenarios.map((s, i) => (
                            <ScenarioCard key={i} scenario={s} isUserScenario={i === 0} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-slate-50 dark:bg-white border-2 border-dashed border-gray-300 dark:border-gray-300 rounded-xl p-8 text-center">
                    <p className="text-[14px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                        صحِّح مجموع التخصيص إلى 100% لرؤية نتائج المحاكاة.
                    </p>
                </div>
            )}
        </section>
    );
};

// ─── بطاقة سيناريو واحد ───────────────────────────────────────────────────────
const ScenarioCard: React.FC<{ scenario: ScenarioOutput; isUserScenario: boolean }> = ({ scenario, isUserScenario }) => {
    const totalOutcomes =
        scenario.outcomes.vocational.count +
        scenario.outcomes.reintegration.count +
        Math.round(scenario.outcomes.staff.count * 0.3); // موظّفو كادر يُحسبون بوزنٍ أقلّ

    return (
        <article
            className={`rounded-2xl p-5 border-2 transition-shadow hover:shadow-md ${
                isUserScenario
                    ? 'bg-hrsd-navy text-white border-hrsd-navy shadow-md'
                    : 'bg-white dark:bg-white border-gray-200 dark:border-gray-200'
            }`}
        >
            <header className="mb-4">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${
                    isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-cool-gray dark:text-hrsd-cool-gray'
                }`}>
                    {isUserScenario ? 'سيناريوك المُقتَرح' : 'بديلٌ للمقارنة'}
                </div>
                <h4 className={`text-[17px] font-bold mt-0.5 ${
                    isUserScenario ? 'text-white' : 'text-hrsd-navy dark:text-white'
                }`}>
                    {scenario.label}
                </h4>
            </header>

            {/* التخصيص */}
            <div className={`mb-4 ${isUserScenario ? 'text-white/80' : 'text-hrsd-cool-gray dark:text-hrsd-navy'} text-[12px] space-y-1`}>
                <div className="flex justify-between"><span>تمكين مهنيّ</span><span className="font-mono font-bold">{scenario.split.vocational}%</span></div>
                <div className="flex justify-between"><span>دمج أسريّ</span><span className="font-mono font-bold">{scenario.split.reintegration}%</span></div>
                <div className="flex justify-between"><span>بناء قدرات</span><span className="font-mono font-bold">{scenario.split.staff}%</span></div>
            </div>

            {/* المُخرَجات المُتوقَّعة */}
            <div className={`rounded-xl p-3 mb-3 ${
                isUserScenario ? 'bg-white/10' : 'bg-slate-50 dark:bg-white'
            }`}>
                <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
                    isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-cool-gray dark:text-hrsd-cool-gray'
                }`}>
                    مُخرَجاتٌ مُتوقَّعة
                </div>
                <OutcomeRow
                    label="توظيف مستدام"
                    range={scenario.outcomes.vocational}
                    isHighlighted={isUserScenario}
                />
                <OutcomeRow
                    label="دمج أسريّ ناجح"
                    range={scenario.outcomes.reintegration}
                    isHighlighted={isUserScenario}
                />
                <OutcomeRow
                    label="موظّفون مُدرَّبون"
                    range={scenario.outcomes.staff}
                    isHighlighted={isUserScenario}
                />
            </div>

            {/* الأرقام الأساسيّة */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`rounded-lg p-2.5 ${
                    isUserScenario ? 'bg-hrsd-gold/20' : 'bg-hrsd-green/10 dark:bg-hrsd-green/20'
                }`}>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-green-dark'
                    }`}>SROI مُرجَّح</div>
                    <div className={`text-[18px] font-black ${
                        isUserScenario ? 'text-white' : 'text-hrsd-green-dark'
                    }`}>
                        {scenario.totalSroi}×
                    </div>
                </div>
                <div className={`rounded-lg p-2.5 ${
                    isUserScenario ? 'bg-hrsd-gold/20' : 'bg-hrsd-teal/10 dark:bg-hrsd-teal/20'
                }`}>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-teal'
                    }`}>نقاط كرامة تقديريّة</div>
                    <div className={`text-[18px] font-black ${
                        isUserScenario ? 'text-white' : 'text-hrsd-teal'
                    }`}>
                        +{scenario.dignityPointsEstimate}
                    </div>
                </div>
            </div>

            {/* تغطية العوائق */}
            <div className={`text-[11.5px] ${
                isUserScenario ? 'text-white/80' : 'text-hrsd-cool-gray dark:text-hrsd-navy'
            }`}>
                <span className="font-semibold">عوائق مستهدَفة:</span>{' '}
                {scenario.barrierCoverage.join(' · ')}
            </div>

            {/* إجمالي المخرجات */}
            <div className={`mt-3 pt-3 border-t flex items-center gap-2 ${
                isUserScenario ? 'border-white/20 text-white' : 'border-gray-200 dark:border-gray-200 text-hrsd-navy dark:text-white'
            }`}>
                <TrendingUp className={`w-4 h-4 ${isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-green-dark'}`} />
                <span className="text-[13px] font-bold">إجمالي الأثر المباشر:</span>
                <span className={`ms-auto text-[16px] font-black ${isUserScenario ? 'text-hrsd-gold' : 'text-hrsd-green-dark'}`}>
                    {totalOutcomes}+ حالة
                </span>
            </div>
        </article>
    );
};

const OutcomeRow: React.FC<{
    label: string;
    range: { count: number; lower: number; upper: number };
    isHighlighted: boolean;
}> = ({ label, range, isHighlighted }) => (
    <div className="flex items-baseline justify-between py-1 text-[12.5px]">
        <span className={isHighlighted ? 'text-white/85' : 'text-hrsd-cool-gray dark:text-hrsd-navy'}>{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`font-black text-[15px] ${isHighlighted ? 'text-white' : 'text-hrsd-navy dark:text-white'}`}>
                {range.count}
            </span>
            <span className={`text-[10px] ${isHighlighted ? 'text-white/60' : 'text-hrsd-cool-gray'}`}>
                ({range.lower}–{range.upper})
            </span>
        </div>
    </div>
);
