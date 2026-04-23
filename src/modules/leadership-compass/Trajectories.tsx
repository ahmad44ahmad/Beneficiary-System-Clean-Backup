import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle, Info } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
    ResponsiveContainer,
} from 'recharts';
import {
    METRIC_SPECS, getTrajectory, gapFromTarget,
    type MetricCode, type Trajectory,
} from './data/seed-trajectories';
import { DECISION_LEVEL_LABELS, type DecisionLevel } from '../../types/leadership-compass';

/**
 * تبويب «اتّجاهات 12 شهراً» — منحنيات لا لقطات.
 * مبدأ: احترام الزمن (كلّ مؤشّر بطاقة مستقلّة، قابلة للدراسة باستقلال).
 */
export const Trajectories: React.FC = () => {
    const [level, setLevel] = useState<DecisionLevel>('center');

    const metrics: MetricCode[] = [
        'dignity_index',
        'compliance_iso',
        'family_satisfaction',
        'sroi',
        'employment_integration',
        'safety_incidents',
    ];

    return (
        <section className="space-y-5" dir="rtl">
            {/* شريط المستوى + ملاحظة شفافيّة */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 md:p-5 shadow-sm">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                    <div>
                        <h3 className="text-[16px] font-bold text-slate-900 dark:text-white mb-1">
                            المستوى الزمنيّ
                        </h3>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400">
                            12 شهراً كاملاً من البيانات — مايو 2025 إلى أبريل 2026
                        </p>
                    </div>

                    <LevelSelector value={level} onChange={setLevel} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-start gap-2.5 text-[13px] text-slate-600 dark:text-slate-300">
                    <Info className="w-4 h-4 text-hrsd-teal shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <span className="font-semibold text-hrsd-navy">شفافيّةٌ مَطلوبة:</span>{' '}
                        البيانات الواقعيّة حصراً من مستوى <strong>المركز</strong>.
                        مستويات <strong>الفرع</strong> و<strong>الوكالة</strong> تُعرَض كسيناريوهاتٍ
                        تقديريّةٍ لإظهار شكل التدرّج الوطنيّ حين تَكتمل البيانات. كلّ بطاقةٍ تُعلِن جودة بياناتها.
                    </p>
                </div>
            </div>

            {/* شبكة المؤشّرات */}
            <div className="grid gap-5 md:grid-cols-2">
                {metrics.map((metric) => (
                    <TrajectoryCard key={metric} metric={metric} level={level} />
                ))}
            </div>
        </section>
    );
};

// ─── مُحدِّد المستوى ────────────────────────────────────────────────────────────
const LevelSelector: React.FC<{
    value: DecisionLevel;
    onChange: (v: DecisionLevel) => void;
}> = ({ value, onChange }) => {
    const levels: DecisionLevel[] = ['center', 'branch', 'agency'];
    return (
        <div className="inline-flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 gap-1">
            {levels.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => onChange(l)}
                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                        value === l
                            ? 'bg-white dark:bg-slate-900 text-hrsd-navy dark:text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-300 hover:text-hrsd-navy'
                    }`}
                >
                    {DECISION_LEVEL_LABELS[l]}
                </button>
            ))}
        </div>
    );
};

// ─── بطاقة مؤشّر واحد ─────────────────────────────────────────────────────────
const TrajectoryCard: React.FC<{
    metric: MetricCode;
    level: DecisionLevel;
}> = ({ metric, level }) => {
    const spec = METRIC_SPECS[metric];
    // تَسامُحٌ: لو لم تتوفّر بياناتٌ لهذا المستوى، اعرض بيانات المركز مع ملاحظة
    const trajectory = getTrajectory(metric, level) ?? getTrajectory(metric, 'center');

    if (!trajectory) {
        return (
            <article className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{spec.titleAr}</h3>
                <p className="text-[13px] text-slate-500 mt-2">لا توجد بيانات متاحة.</p>
            </article>
        );
    }

    const gap = gapFromTarget(trajectory);
    const lastPoint = trajectory.points[trajectory.points.length - 1];
    const firstPoint = trajectory.points[0];
    const delta = lastPoint.value - firstPoint.value;
    const deltaFavorable = spec.higherIsBetter ? delta > 0 : delta < 0;

    return (
        <article
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700
                shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
            <header className="p-4 md:p-5 pb-0 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight">
                        {spec.titleAr}
                    </h3>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {spec.description}
                    </p>
                </div>
                <DataQualityBadge quality={trajectory.dataQuality} />
            </header>

            {/* الأرقام المفتاحيّة */}
            <div className="px-4 md:px-5 pt-3 flex items-end gap-5 flex-wrap">
                <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">آخر قيمة</div>
                    <div className="text-[24px] font-black text-slate-900 dark:text-white leading-none">
                        {formatValue(gap.lastValue, spec.unit)}
                    </div>
                </div>

                <div className={`flex items-center gap-1 text-[13px] font-bold ${
                    deltaFavorable ? 'text-hrsd-green-dark' : 'text-rose-600'
                }`}>
                    {deltaFavorable
                        ? (spec.higherIsBetter ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />)
                        : (spec.higherIsBetter ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />)}
                    <span>{formatValue(Math.abs(delta), spec.unit)}</span>
                    <span className="text-slate-400 font-normal me-1">خلال 12 شهراً</span>
                </div>

                <div className="ms-auto flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>المستهدَف: {formatValue(gap.target, spec.unit)}</span>
                </div>
            </div>

            {/* الرسم البيانيّ */}
            <div className="px-2 md:px-3 pt-2 flex-1" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trajectory.points} margin={{ top: 10, right: 12, left: 12, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="monthLabel"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            interval={1}
                            tickFormatter={(v) => v.split(' ')[0].slice(0, 4)}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            domain={[0, 'auto']}
                            width={35}
                        />
                        <Tooltip content={<CustomTooltip unit={spec.unit} />} />
                        <ReferenceLine
                            y={spec.targetValue}
                            stroke="#FAB414"
                            strokeDasharray="5 3"
                            label={{ value: 'المستهدَف', position: 'insideTopLeft', fill: '#FAB414', fontSize: 10 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={spec.color}
                            strokeWidth={2.5}
                            dot={<AnnotatedDot color={spec.color} />}
                            activeDot={{ r: 5 }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* الحالة */}
            <footer className={`px-5 py-3 border-t ${
                gap.onTrack ? 'bg-hrsd-green/5 border-hrsd-green/30' : 'bg-amber-50 border-amber-200'
            } flex items-center gap-2`}>
                {gap.onTrack ? (
                    <TrendingUp className="w-4 h-4 text-hrsd-green-dark" />
                ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className={`text-[13px] font-semibold ${
                    gap.onTrack ? 'text-hrsd-green-dark' : 'text-amber-800'
                }`}>
                    {gap.onTrack ? 'في المسار الصحيح' : `فجوة ${formatValue(gap.gap, spec.unit)} عن المستهدَف`}
                </span>
                <span className="ms-auto text-[11px] text-slate-500 dark:text-slate-400">
                    {trajectory.levelScope}
                </span>
            </footer>
        </article>
    );
};

// ─── شارة جودة البيانات ───────────────────────────────────────────────────────
const DataQualityBadge: React.FC<{ quality: Trajectory['dataQuality'] }> = ({ quality }) => {
    const tones = {
        real:    { bg: 'bg-hrsd-green/15', text: 'text-hrsd-green-dark', label: 'حقيقيّة' },
        partial: { bg: 'bg-amber-100',     text: 'text-amber-800',       label: 'جزئيّة' },
        modeled: { bg: 'bg-slate-100',     text: 'text-slate-600',       label: 'تقديريّة' },
    };
    const t = tones[quality];
    return (
        <span className={`shrink-0 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${t.bg} ${t.text}`}>
            {t.label}
        </span>
    );
};

// ─── نقطة مشروحة (للأحداث) ────────────────────────────────────────────────────
const AnnotatedDot: React.FC<{ cx?: number; cy?: number; payload?: { annotation?: string }; color: string }> =
    ({ cx, cy, payload, color }) => {
    if (cx === undefined || cy === undefined) return <circle cx={0} cy={0} r={0} />;
    if (payload?.annotation) {
        return (
            <g>
                <circle cx={cx} cy={cy} r={5} fill="#FAB414" stroke="#fff" strokeWidth={2} />
                <circle cx={cx} cy={cy} r={8} fill="none" stroke="#FAB414" strokeWidth={1} opacity={0.4} />
            </g>
        );
    }
    return <circle cx={cx} cy={cy} r={3} fill={color} stroke="#fff" strokeWidth={1.5} />;
};

// ─── تلميح مُخصَّص (Tooltip) ─────────────────────────────────────────────────
const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{ payload: { monthLabel: string; value: number; annotation?: string } }>;
    unit: string;
}> = ({ active, payload, unit }) => {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
            rounded-lg shadow-lg p-3 text-[12px]" dir="rtl">
            <div className="font-bold text-slate-900 dark:text-white mb-1">{p.monthLabel}</div>
            <div className="text-hrsd-teal font-semibold">
                {formatValue(p.value, unit)}
            </div>
            {p.annotation && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 max-w-[200px] leading-snug">
                    📌 {p.annotation}
                </div>
            )}
        </div>
    );
};

// ─── تنسيق القيمة مع الوحدة ───────────────────────────────────────────────────
function formatValue(value: number, unit: string): string {
    const rounded = Number.isInteger(value) ? value : Math.round(value * 100) / 100;
    if (unit === '%' || unit === '×') return `${rounded}${unit}`;
    if (unit === 'نقطة') return `${rounded > 0 ? '+' : ''}${rounded}`;
    return `${rounded} ${unit}`;
}
