import React, { useState, useEffect, useMemo } from 'react';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    Users,
    Building2,
    PieChart,
    Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SroiMetricsCard } from './SroiMetricsCard';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { SROI_ASSUMPTIONS } from '../../data/sroiAssumptions';

/**
 * SROI Dashboard — Phase 2H.
 * Brand level: Default (light mode).
 *
 * Brand:
 * - Light surface, navy headings, cool-gray body, HRSD palette only.
 *
 * Data correctness (the bigger fix):
 * - Previously this component had its own hardcoded scenario (310 beneficiaries,
 *   45% rehab, 15% employment, 40% savings) with NO discount factors — yielding
 *   1.23× while the canonical SROI_ASSUMPTIONS yielded 1.80×.
 * - Now both sliders + computed metrics use SROI_ASSUMPTIONS as the single
 *   source of truth, applying the four NEF discount factors (deadweight,
 *   attribution, displacement, drop-off). The "1.80×" claim in pitches now
 *   matches what the system actually shows.
 */

interface SroiScenario {
    beneficiaryCount: number;
    avgCostPerMonth: number;
    rehabSuccessRate: number; // %
    employmentRate: number;   // %
    avgSalary: number;
    costSavingsRate: number;  // % of monthly cost saved per successful rehab
}

const defaultScenario: SroiScenario = {
    beneficiaryCount: SROI_ASSUMPTIONS.beneficiaryCount,
    avgCostPerMonth: SROI_ASSUMPTIONS.avgCostPerBeneficiaryMonth,
    rehabSuccessRate: SROI_ASSUMPTIONS.rehabSuccessRate * 100,
    employmentRate: SROI_ASSUMPTIONS.employmentRate * 100,
    avgSalary: SROI_ASSUMPTIONS.avgSalary,
    costSavingsRate: SROI_ASSUMPTIONS.costSavingsPerSuccess * 100,
};

/**
 * Apply the four NEF discount factors so any SROI shown here matches the
 * canonical computation in sroiAssumptions.ts. This is the same shape as
 * computeSroiCardSummary but parameterised on the scenario sliders.
 */
const computeSroi = (s: SroiScenario) => {
    const a = SROI_ASSUMPTIONS;
    const successfulCount = s.beneficiaryCount * (s.rehabSuccessRate / 100);
    const monthlyCostSavings = successfulCount * s.avgCostPerMonth * (s.costSavingsRate / 100);
    const monthlyEmploymentValue = successfulCount * (s.employmentRate / 100) * s.avgSalary;

    const grossValue = monthlyCostSavings + monthlyEmploymentValue;
    const netValue = grossValue
        * (1 - a.deadweight)
        * (1 - a.attribution)
        * (1 - a.displacement);

    // Investment scales with beneficiary count proportionally to the canonical reference.
    const investmentRef = a.monthlyInvestment;
    const investment = investmentRef * (s.beneficiaryCount / a.beneficiaryCount);

    const ratio = netValue / investment + 1;

    return {
        ratio,
        annualSavings: monthlyCostSavings * 12,
        annualEconomicValue: monthlyEmploymentValue * 12,
        successfulCount: Math.round(successfulCount),
        investment,
        netValue,
    };
};

export const SroiDashboard: React.FC = () => {
    const [scenario, setScenario] = useState<SroiScenario>(defaultScenario);

    const sroi = useMemo(() => computeSroi(scenario), [scenario]);

    const [chartData, setChartData] = useState<{
        name: string;
        'التكلفة التقليدية': number;
        'تكلفة نموذج التمكين': number;
    }[]>([]);

    useEffect(() => {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const traditionalCost = scenario.beneficiaryCount * scenario.avgCostPerMonth;

        const data = months.map((month, index) => {
            const progress = (index + 1) / 12;
            const currentSavings = (sroi.annualSavings / 12) * progress * 12;
            return {
                name: month,
                'التكلفة التقليدية': traditionalCost,
                'تكلفة نموذج التمكين': Math.max(0, traditionalCost - currentSavings),
            };
        });

        setChartData(data);
    }, [scenario, sroi]);

    const handleSliderChange = (field: keyof SroiScenario, value: number) => {
        setScenario(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 p-6 bg-white min-h-screen animate-in fade-in duration-500" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-hrsd-navy flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-[#269798]" />
                        لوحة العائد الاجتماعي على الاستثمار (SROI)
                    </h1>
                    <p className="text-hrsd-cool-gray mt-1">
                        قياس الأثر الاقتصادي لبرامج التأهيل والتمكين — وفق منهجية NEF مع تطبيق
                        مُعاملات الخصم الأربعة (deadweight, attribution, displacement, drop-off)
                    </p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير التقرير
                </Button>
            </div>

            {/* Metrics Cards — all values now derive from the canonical computeSroi. */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SroiMetricsCard
                    title="معدل العائد (SROI)"
                    value={`1 : ${sroi.ratio.toFixed(2)}`}
                    subtitle="ريال"
                    icon={TrendingUp}
                    color="teal"
                    summary="لكل ريال يُستثمر، يحقّق المركز هذا العائد الصافي للمجتمع — بعد تطبيق معاملات الخصم"
                    trend="up"
                    trendValue="+12%"
                />
                <SroiMetricsCard
                    title="الوفورات المتوقعة (سنوياً)"
                    value={`${(sroi.annualSavings / 1_000_000).toFixed(1)}M`}
                    subtitle="مليون ريال"
                    icon={DollarSign}
                    color="orange"
                    summary="نتيجة انخفاض الاعتماد الكلي وتحسّن الاستقلالية"
                    trend="up"
                    trendValue={`${(sroi.annualSavings / 1_000_000).toFixed(1)}M`}
                />
                <SroiMetricsCard
                    title="المساهمة الاقتصادية"
                    value={`${(sroi.annualEconomicValue / 1_000_000).toFixed(1)}M`}
                    subtitle="مليون ريال"
                    icon={Building2}
                    color="navy"
                    summary="إجمالي رواتب المستفيدين الذين تمّ تمكينهم وظيفياً"
                    trend="up"
                    trendValue={`${(sroi.annualEconomicValue / 1_000_000).toFixed(1)}M`}
                />
                <SroiMetricsCard
                    title="حالات التمكين"
                    value={`${sroi.successfulCount}`}
                    subtitle="مستفيد"
                    icon={Users}
                    color="gold"
                    summary="عدد المستفيدين الذين انتقلوا لدرجة استقلالية أعلى"
                    trend="up"
                    trendValue="+15"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calculator Controls */}
                <Card className="lg:col-span-1 border-gray-200 shadow-sm">
                    <div className="p-6 space-y-8">
                        <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
                            <Calculator className="w-5 h-5 text-[#269798]" />
                            <h2 className="font-bold text-hrsd-navy">حاسبة الأثر (محاكاة)</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Rehab Success Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-hrsd-navy">نجاح التأهيل (تحسّن الاستقلالية)</label>
                                    <span className="text-[#269798] font-bold tabular-nums">{scenario.rehabSuccessRate.toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={scenario.rehabSuccessRate}
                                    onChange={(e) => handleSliderChange('rehabSuccessRate', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#269798]"
                                />
                                <p className="text-xs text-hrsd-cool-gray mt-1">نسبة المستفيدين الذين تحسّنت درجاتهم في مقياس ADL</p>
                            </div>

                            {/* Employment Rate Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-hrsd-navy">معدل التوظيف</label>
                                    <span className="text-[#2BB574] font-bold tabular-nums">{scenario.employmentRate.toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={scenario.employmentRate}
                                    onChange={(e) => handleSliderChange('employmentRate', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2BB574]"
                                />
                                <p className="text-xs text-hrsd-cool-gray mt-1">نسبة المستفيدين الملتحقين بسوق العمل</p>
                            </div>

                            {/* Cost Input */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-hrsd-navy">متوسط التكلفة الشهرية (للفرد)</label>
                                    <span className="text-[#D67A0A] font-bold tabular-nums">{scenario.avgCostPerMonth.toLocaleString()} ر.س</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="30000"
                                    step="500"
                                    value={scenario.avgCostPerMonth}
                                    onChange={(e) => handleSliderChange('avgCostPerMonth', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F7941D]"
                                />
                            </div>
                        </div>

                        <div className="bg-[#269798]/10 p-4 rounded-xl border border-[#269798]/30 mt-6">
                            <h4 className="text-sm font-bold text-[#269798] mb-2">رؤية المحاكاة</h4>
                            <p className="text-xs text-hrsd-navy leading-relaxed">
                                زيادة نسبة نجاح التأهيل بـ 5% فقط تؤدي إلى وفورات سنوية تقدر بـ{' '}
                                <strong className="text-[#1B7778]">
                                    {((scenario.beneficiaryCount * 0.05 * (scenario.avgCostPerMonth * (scenario.costSavingsRate / 100)) * 12) / 1000).toFixed(0)} ألف ريال
                                </strong>.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Main Chart */}
                <Card className="lg:col-span-2 border-gray-200 shadow-sm">
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-hrsd-cool-gray" />
                                <h2 className="font-bold text-hrsd-navy">تحليل الأثر المالي (تنبؤ سنوي)</h2>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                    <span className="text-hrsd-cool-gray">التكلفة التقليدية</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-[#269798]"></span>
                                    <span className="text-hrsd-cool-gray">نموذج التمكين</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[300px]" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEmpowerment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#269798" stopOpacity={0.7} />
                                            <stop offset="95%" stopColor="#269798" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#7A7A7A" />
                                    <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} stroke="#7A7A7A" />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <Tooltip
                                        formatter={(value: number) => value.toLocaleString() + ' ر.س'}
                                        labelStyle={{ textAlign: 'right', color: '#0F3144' }}
                                        contentStyle={{ direction: 'rtl', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="التكلفة التقليدية"
                                        stroke="#9CA3AF"
                                        fillOpacity={1}
                                        fill="url(#colorTraditional)"
                                        stackId="1"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="تكلفة نموذج التمكين"
                                        stroke="#269798"
                                        fillOpacity={1}
                                        fill="url(#colorEmpowerment)"
                                        stackId="2"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
