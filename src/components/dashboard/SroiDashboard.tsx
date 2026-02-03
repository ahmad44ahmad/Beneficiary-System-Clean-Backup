import React, { useState, useEffect } from 'react';
import {
    Calculator,
    TrendingUp,
    DollarSign,
    Users,
    ArrowRight,
    Building2,
    PieChart,
    Download
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SroiMetricsCard } from './SroiMetricsCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

// Types for SROI Calculation
interface SroiScenario {
    beneficiaryCount: number;
    avgCostPerMonth: number;
    rehabSuccessRate: number; // 0-100%
    employmentRate: number; // 0-100%
    avgSalary: number;
}

export const SroiDashboard: React.FC = () => {
    // Initial State (Default Assumptions)
    const [scenario, setScenario] = useState<SroiScenario>({
        beneficiaryCount: 310,
        avgCostPerMonth: 12000, // SAR
        rehabSuccessRate: 45, // %
        employmentRate: 15, // %
        avgSalary: 4000 // SAR
    });

    const [chartData, setChartData] = useState<any[]>([]);

    // Calculation Logic
    useEffect(() => {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

        // Traditional Model Cost (Static)
        const traditionalCost = scenario.beneficiaryCount * scenario.avgCostPerMonth;

        // Empowerment Model Cost (Decreases as success increases)
        // Assumption: Each successful rehab reduces cost by 40% (less supervision needed)
        const successFactor = scenario.rehabSuccessRate / 100;
        const savingsPerSuccess = scenario.avgCostPerMonth * 0.40;
        const totalSavings = (scenario.beneficiaryCount * successFactor) * savingsPerSuccess;
        const empowermentCost = traditionalCost - totalSavings;

        // Economic Value Created (Employment)
        const employedCount = scenario.beneficiaryCount * (scenario.employmentRate / 100);
        const economicValue = employedCount * scenario.avgSalary;

        // SROI Ratio Calculation
        // Value Created = Savings + Economic Contribution
        const totalValueCreated = totalSavings + economicValue;
        const sroiRatio = (totalValueCreated / traditionalCost).toFixed(2);

        // Generate Chart Data for 1 Year Projection
        const data = months.map((month, index) => {
            // Simulate gradual improvement over the year
            const progress = (index + 1) / 12;
            const currentSavings = totalSavings * progress;
            const currentEconomicVal = economicValue * progress;

            return {
                name: month,
                'التكلفة التقليدية': traditionalCost,
                'تكلفة نموذج التمكين': traditionalCost - currentSavings,
                'القيمة الاقتصادية': currentEconomicVal,
                savings: currentSavings
            };
        });

        setChartData(data);
    }, [scenario]);

    const handleSliderChange = (field: keyof SroiScenario, value: number) => {
        setScenario(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-8 h-8 text-teal-600" />
                        لوحة العائد الاجتماعي على الاستثمار (SROI)
                    </h1>
                    <p className="text-gray-500 mt-1">قياس الأثر الاقتصادي لبرامج التأهيل والتمكين</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    تصدير التقرير
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SroiMetricsCard
                    title="معدل العائد (SROI)"
                    value={`1 : ${(
                        ((scenario.beneficiaryCount * (scenario.rehabSuccessRate / 100) * (scenario.avgCostPerMonth * 0.40) +
                            (scenario.beneficiaryCount * (scenario.employmentRate / 100) * scenario.avgSalary)) /
                            (scenario.beneficiaryCount * scenario.avgCostPerMonth)) + 1
                    ).toFixed(2)}`}
                    subtitle="ريال"
                    icon={TrendingUp}
                    color="teal"
                    summary="لكل ريال يتم استثماره، يحقق المركز هذا العائد للمجتمع"
                    trend="up"
                    trendValue="+12%"
                />
                <SroiMetricsCard
                    title="التوفر المتوقع (سنوياً)"
                    value={`${((scenario.beneficiaryCount * (scenario.rehabSuccessRate / 100) * (scenario.avgCostPerMonth * 0.40) * 12) / 1000000).toFixed(1)}M`}
                    subtitle="مليون ريال"
                    icon={DollarSign}
                    color="orange"
                    summary="نتيجة انخفاض الاعتماد الكلي وتحسن الاستقلالية"
                    trend="up"
                    trendValue="4.2M"
                />
                <SroiMetricsCard
                    title="المساهمة الاقتصادية"
                    value={`${((scenario.beneficiaryCount * (scenario.employmentRate / 100) * scenario.avgSalary * 12) / 1000000).toFixed(1)}M`}
                    subtitle="مليون ريال"
                    icon={Building2}
                    color="blue"
                    summary="إجمالي رواتب المستفيدين الذين تم تمكينهم وظيفياً"
                    trend="up"
                    trendValue="1.5M"
                />
                <SroiMetricsCard
                    title="حالات التمكين"
                    value={`${Math.round(scenario.beneficiaryCount * (scenario.rehabSuccessRate / 100))}`}
                    subtitle="مستفيد"
                    icon={Users}
                    color="purple"
                    summary="عدد المستفيدين الذين انتقلوا لدرجة استقلالية أعلى"
                    trend="up"
                    trendValue="+15"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calculator Controls */}
                <Card className="lg:col-span-1 border-teal-100 shadow-md">
                    <div className="p-6 space-y-8">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                            <Calculator className="w-5 h-5 text-teal-600" />
                            <h2 className="font-bold text-gray-800">حاسبة الأثر (محاكاة)</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Rehab Success Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">نجاح التأهيل (تحسن الاستقلالية)</label>
                                    <span className="text-teal-600 font-bold">{scenario.rehabSuccessRate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={scenario.rehabSuccessRate}
                                    onChange={(e) => handleSliderChange('rehabSuccessRate', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">نسبة المستفيدين الذين تحسنت درجاتهم في مقياس ADL</p>
                            </div>

                            {/* Employment Rate Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">معدل التوظيف</label>
                                    <span className="text-blue-600 font-bold">{scenario.employmentRate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={scenario.employmentRate}
                                    onChange={(e) => handleSliderChange('employmentRate', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <p className="text-xs text-gray-500 mt-1">نسبة المستفيدين الملتحقين بسوق العمل</p>
                            </div>

                            {/* Cost Input */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">متوسط التكلفة الشهرية (للفرد)</label>
                                    <span className="text-orange-600 font-bold">{scenario.avgCostPerMonth.toLocaleString()} ر.س</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="30000"
                                    step="500"
                                    value={scenario.avgCostPerMonth}
                                    onChange={(e) => handleSliderChange('avgCostPerMonth', Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                />
                            </div>
                        </div>

                        <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 mt-6">
                            <h4 className="text-sm font-bold text-teal-800 mb-2">رؤية المحاكاة</h4>
                            <p className="text-xs text-teal-700 leading-relaxed">
                                زيادة نسبة نجاح التأهيل بـ 5% فقط تؤدي إلى وفورات سنوية تقدر بـ <strong>{((scenario.beneficiaryCount * 0.05 * (scenario.avgCostPerMonth * 0.40) * 12) / 1000).toFixed(0)} ألف ريال</strong>.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Main Chart */}
                <Card className="lg:col-span-2 border-gray-100 shadow-md">
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-gray-500" />
                                <h2 className="font-bold text-gray-800">تحليل الأثر المالي (5 سنوات)</h2>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                                    <span className="text-gray-600">التكلفة التقليدية</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                                    <span className="text-gray-600">نموذج التمكين</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-[300px]" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorEmpowerment" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip
                                        formatter={(value: number) => value.toLocaleString() + ' ر.س'}
                                        labelStyle={{ textAlign: 'right' }}
                                        contentStyle={{ direction: 'rtl' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="التكلفة التقليدية"
                                        stroke="#94a3b8"
                                        fillOpacity={1}
                                        fill="url(#colorTraditional)"
                                        stackId="1"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="تكلفة نموذج التمكين"
                                        stroke="#0d9488"
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
