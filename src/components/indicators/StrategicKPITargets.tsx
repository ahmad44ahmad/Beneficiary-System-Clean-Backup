import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, ChevronLeft, TrendingUp, TrendingDown, Minus,
    ArrowUpRight, ArrowDownRight, ClipboardCheck, AlertTriangle,
    Hand, Bell, Heart, DollarSign, RefreshCw, Wrench, Filter
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Cell, Legend,
    LineChart as _LineChart, Line as _Line
} from 'recharts';
import {
    STRATEGIC_KPIS, KPI_CATEGORIES, KPI_MONTHLY_TRENDS,
    StrategicKPI
} from '../../data/strategicKpiTargets';

// HRSD Brand Colors
const HRSD_NAVY = '#0F3144';
const HRSD_TEAL = '#269798';
const HRSD_GOLD = '#FCB614';

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
    ClipboardCheck,
    AlertTriangle,
    Hand,
    Bell,
    Heart,
    DollarSign,
    RefreshCw,
    Wrench,
};

type KpiStatus = 'excellent' | 'good' | 'needsImprovement';

const STATUS_COLORS: Record<KpiStatus, string> = {
    excellent: '#2BB574',
    good: '#FCB614',
    needsImprovement: '#DC2626',
};

const STATUS_LABELS: Record<KpiStatus, string> = {
    excellent: 'ممتاز',
    good: 'جيد',
    needsImprovement: 'يحتاج تحسين',
};

const STATUS_BG_CLASSES: Record<KpiStatus, string> = {
    excellent: 'bg-[#2BB574]',
    good: 'bg-[#FCB614]',
    needsImprovement: 'bg-[#DC2626]',
};

const STATUS_TEXT_CLASSES: Record<KpiStatus, string> = {
    excellent: 'text-[#2BB574]',
    good: 'text-[#FCB614]',
    needsImprovement: 'text-[#DC2626]',
};

const STATUS_BG_LIGHT_CLASSES: Record<KpiStatus, string> = {
    excellent: 'bg-[#2BB574]/10 border-[#2BB574]/30',
    good: 'bg-[#FCB614]/10 border-[#FCB614]/30',
    needsImprovement: 'bg-[#DC2626]/10 border-[#DC2626]/30',
};

function getKpiStatus(kpi: StrategicKPI): KpiStatus {
    const { currentValue, direction, thresholds } = kpi;

    if (direction === 'higher_is_better') {
        if (currentValue >= thresholds.excellent) return 'excellent';
        if (currentValue >= thresholds.good) return 'good';
        return 'needsImprovement';
    } else {
        if (currentValue <= thresholds.excellent) return 'excellent';
        if (currentValue <= thresholds.good) return 'good';
        return 'needsImprovement';
    }
}

function getAchievement(kpi: StrategicKPI): number {
    if (kpi.direction === 'higher_is_better') {
        return Math.round((kpi.currentValue / kpi.target) * 100);
    }
    return Math.round((kpi.target / kpi.currentValue) * 100);
}

function getProgressWidth(kpi: StrategicKPI): number {
    const achievement = getAchievement(kpi);
    return Math.min(achievement, 100);
}

function getTrendDirection(kpi: StrategicKPI): 'up' | 'down' | 'stable' {
    if (kpi.currentValue === kpi.previousValue) return 'stable';
    if (kpi.direction === 'higher_is_better') {
        return kpi.currentValue > kpi.previousValue ? 'up' : 'down';
    }
    return kpi.currentValue < kpi.previousValue ? 'up' : 'down';
}

export const StrategicKPITargets: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedKpiCode, setSelectedKpiCode] = useState<string>(STRATEGIC_KPIS[0].code);

    const filteredKpis = useMemo(() => {
        if (selectedCategory === 'all') return STRATEGIC_KPIS;
        return STRATEGIC_KPIS.filter(kpi => kpi.category === selectedCategory);
    }, [selectedCategory]);

    const summaryStats = useMemo(() => {
        const total = STRATEGIC_KPIS.length;
        const meetingTarget = STRATEGIC_KPIS.filter(kpi => {
            const status = getKpiStatus(kpi);
            return status === 'excellent';
        }).length;
        const needsImprovement = STRATEGIC_KPIS.filter(kpi => {
            const status = getKpiStatus(kpi);
            return status === 'needsImprovement';
        }).length;
        const avgAchievement = Math.round(
            STRATEGIC_KPIS.reduce((sum, kpi) => sum + getAchievement(kpi), 0) / total
        );
        return { total, meetingTarget, needsImprovement, avgAchievement };
    }, []);

    const selectedKpi = useMemo(
        () => STRATEGIC_KPIS.find(k => k.code === selectedKpiCode) || STRATEGIC_KPIS[0],
        [selectedKpiCode]
    );

    const trendChartData = useMemo(() => {
        return KPI_MONTHLY_TRENDS.map(entry => ({
            month: entry.month,
            value: entry[selectedKpiCode as keyof typeof entry] as number,
        }));
    }, [selectedKpiCode]);

    const selectedKpiStatus = getKpiStatus(selectedKpi);

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                    <span className="text-sm">رجوع</span>
                </button>

                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: HRSD_NAVY }}>
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: HRSD_NAVY }}>
                            المؤشرات الاستراتيجية
                        </h1>
                        <p className="text-gray-500 text-sm">
                            مقارنة الأداء الفعلي بالقيم المستهدفة وفق معايير وزارة الموارد البشرية
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">تصفية حسب الفئة</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {KPI_CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat.key
                                    ? 'text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                            }`}
                            style={
                                selectedCategory === cat.key
                                    ? { backgroundColor: cat.color }
                                    : undefined
                            }
                        >
                            {cat.labelAr}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">إجمالي المؤشرات</div>
                    <div className="text-2xl font-bold" style={{ color: HRSD_NAVY }}>
                        {summaryStats.total}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#2BB574]/10 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">يحقق المستهدف</div>
                    <div className="text-2xl font-bold text-[#2BB574]">
                        {summaryStats.meetingTarget}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-[#DC2626]/10 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">يحتاج تحسين</div>
                    <div className="text-2xl font-bold text-[#DC2626]">
                        {summaryStats.needsImprovement}
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">متوسط نسبة التحقق</div>
                    <div className="text-2xl font-bold" style={{ color: HRSD_TEAL }}>
                        {summaryStats.avgAchievement}%
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {filteredKpis.map(kpi => {
                    const status = getKpiStatus(kpi);
                    const achievement = getAchievement(kpi);
                    const trend = getTrendDirection(kpi);
                    const IconComponent = ICON_MAP[kpi.icon] || Target;
                    const isSelected = kpi.code === selectedKpiCode;

                    return (
                        <div
                            key={kpi.code}
                            onClick={() => setSelectedKpiCode(kpi.code)}
                            className={`bg-white rounded-xl p-4 border-2 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                                isSelected
                                    ? 'border-[#269798] shadow-blue-100'
                                    : 'border-gray-100 hover:border-gray-200'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: `${STATUS_COLORS[status]}20` }}
                                    >
                                        <IconComponent
                                            className="w-5 h-5"
                                            style={{ color: STATUS_COLORS[status] }}
                                        />
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BG_LIGHT_CLASSES[status]} border`}
                                        >
                                            <span className={STATUS_TEXT_CLASSES[status]}>
                                                {STATUS_LABELS[status]}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                {/* Trend Arrow */}
                                <div className="flex items-center gap-1">
                                    {trend === 'up' && (
                                        <ArrowUpRight className="w-4 h-4 text-[#2BB574]" />
                                    )}
                                    {trend === 'down' && (
                                        <ArrowDownRight className="w-4 h-4 text-[#DC2626]" />
                                    )}
                                    {trend === 'stable' && (
                                        <Minus className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* KPI Name */}
                            <h3 className="text-sm font-semibold text-gray-800 mb-2 leading-relaxed">
                                {kpi.nameAr}
                            </h3>

                            {/* Current Value */}
                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="text-2xl font-bold" style={{ color: HRSD_NAVY }}>
                                    {kpi.currentValue}
                                </span>
                                <span className="text-xs text-gray-500">{kpi.unitAr}</span>
                            </div>

                            {/* Target Comparison */}
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                <Target className="w-3 h-3" />
                                <span>المستهدف: {kpi.target} {kpi.unitAr}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${STATUS_BG_CLASSES[status]}`}
                                        style={{ width: `${getProgressWidth(kpi)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Achievement & Trend */}
                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-medium ${STATUS_TEXT_CLASSES[status]}`}>
                                    التحقق: {achievement}%
                                </span>
                                <span className="text-gray-400">
                                    سابق: {kpi.previousValue} {kpi.unitAr}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Trend Chart Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: HRSD_NAVY }}>
                            اتجاه المؤشر عبر الأشهر
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedKpi.nameAr} - آخر 6 أشهر
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${STATUS_BG_LIGHT_CLASSES[selectedKpiStatus]} border`}
                        >
                            <span className={STATUS_TEXT_CLASSES[selectedKpiStatus]}>
                                {STATUS_LABELS[selectedKpiStatus]}
                            </span>
                        </span>
                    </div>
                </div>

                {/* KPI Selector Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {STRATEGIC_KPIS.map(kpi => (
                        <button
                            key={kpi.code}
                            onClick={() => setSelectedKpiCode(kpi.code)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                selectedKpiCode === kpi.code
                                    ? 'text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={
                                selectedKpiCode === kpi.code
                                    ? { backgroundColor: HRSD_TEAL }
                                    : undefined
                            }
                        >
                            {kpi.nameAr}
                        </button>
                    ))}
                </div>

                {/* Bar Chart */}
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={trendChartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                domain={['auto', 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    direction: 'rtl',
                                }}
                                formatter={(value: number) => [
                                    `${value} ${selectedKpi.unitAr}`,
                                    selectedKpi.nameAr,
                                ]}
                                labelFormatter={(label) => `شهر: ${label}`}
                            />
                            <Legend
                                formatter={() => selectedKpi.nameAr}
                                wrapperStyle={{ direction: 'rtl' }}
                            />
                            <ReferenceLine
                                y={selectedKpi.target}
                                stroke={HRSD_GOLD}
                                strokeWidth={2}
                                strokeDasharray="8 4"
                                label={{
                                    value: `المستهدف: ${selectedKpi.target}`,
                                    position: 'right',
                                    fill: HRSD_GOLD,
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            >
                                {trendChartData.map((entry, index) => {
                                    let fill = HRSD_TEAL;
                                    if (selectedKpi.direction === 'higher_is_better') {
                                        if (entry.value >= selectedKpi.thresholds.excellent) fill = '#2BB574';
                                        else if (entry.value >= selectedKpi.thresholds.good) fill = '#FCB614';
                                        else fill = '#DC2626';
                                    } else {
                                        if (entry.value <= selectedKpi.thresholds.excellent) fill = '#2BB574';
                                        else if (entry.value <= selectedKpi.thresholds.good) fill = '#FCB614';
                                        else fill = '#DC2626';
                                    }
                                    return <Cell key={`cell-${index}`} fill={fill} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#2BB574]" />
                        <span>ممتاز</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#FCB614]" />
                        <span>جيد</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-sm bg-[#DC2626]" />
                        <span>يحتاج تحسين</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-1 rounded-sm" style={{ backgroundColor: HRSD_GOLD }} />
                        <span>القيمة المستهدفة</span>
                    </div>
                </div>
            </div>

            {/* KPI Detail Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4" style={{ color: HRSD_NAVY }}>
                    تفاصيل المؤشر المحدد
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-1">رمز المؤشر</div>
                        <div className="text-sm font-bold" style={{ color: HRSD_NAVY }}>
                            {selectedKpi.code}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-1">الفئة</div>
                        <div className="text-sm font-bold" style={{ color: HRSD_TEAL }}>
                            {selectedKpi.categoryAr}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-1">الاتجاه المطلوب</div>
                        <div className="flex items-center gap-1">
                            {selectedKpi.direction === 'higher_is_better' ? (
                                <>
                                    <TrendingUp className="w-4 h-4 text-[#2BB574]" />
                                    <span className="text-sm font-bold text-[#2BB574]">
                                        الأعلى أفضل
                                    </span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-4 h-4 text-[#269798]" />
                                    <span className="text-sm font-bold text-[#269798]">
                                        الأقل أفضل
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-xs text-gray-500 mb-1">مصدر البيانات</div>
                        <div className="text-sm font-bold text-gray-700">
                            {selectedKpi.dataSource}
                        </div>
                    </div>
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">الوصف</div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                        {selectedKpi.description}
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-[#2BB574]/10 border border-[#2BB574]/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-[#2BB574] mb-1">ممتاز</div>
                        <div className="text-lg font-bold text-[#2BB574]">
                            {selectedKpi.direction === 'lower_is_better' ? '≤' : '≥'}{' '}
                            {selectedKpi.thresholds.excellent} {selectedKpi.unitAr}
                        </div>
                    </div>
                    <div className="bg-[#FCB614]/10 border border-[#FCB614]/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-[#FCB614] mb-1">جيد</div>
                        <div className="text-lg font-bold text-[#FCB614]">
                            {selectedKpi.direction === 'lower_is_better' ? '≤' : '≥'}{' '}
                            {selectedKpi.thresholds.good} {selectedKpi.unitAr}
                        </div>
                    </div>
                    <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-[#DC2626] mb-1">يحتاج تحسين</div>
                        <div className="text-lg font-bold text-[#DC2626]">
                            {selectedKpi.direction === 'lower_is_better' ? '>' : '<'}{' '}
                            {selectedKpi.thresholds.good} {selectedKpi.unitAr}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
