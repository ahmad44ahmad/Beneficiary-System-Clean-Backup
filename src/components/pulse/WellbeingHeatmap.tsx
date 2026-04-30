import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart, Utensils, Shield, Smile, Activity,
    TrendingUp, TrendingDown, Minus, Search, Filter,
    AlertTriangle, CheckCircle, Eye
} from 'lucide-react';

/**
 * Wellbeing Heatmap — Phase 2A.
 * Brand level: Default (light mode).
 *
 * Per HRSD Brand Guidelines:
 * - Light surface (white card on subtle gray surface).
 * - Status colors limited to HRSD palette + one semantic exception:
 *     critical (< 50) → red (semantic — life-safety justification)
 *     warning (50–79) → HRSD gold #FCB614
 *     good    (≥ 80)  → HRSD green #2BB574
 * - Body text in cool-gray, headings in navy.
 * - Maximum 2 brand colors + 1 semantic per surface.
 * - Cards use white background with status-tinted left border for at-a-glance scan.
 */

interface BeneficiaryWellbeing {
    id: string;
    name: string;
    age: number;
    room: string;
    wellbeingScore: number;
    trend: 'up' | 'down' | 'stable';
    indicators: {
        health: number;
        nutrition: number;
        safety: number;
        mood: number;
        activity: number;
    };
    lastUpdate: string;
    alerts: number;
}

const mockBeneficiaries: BeneficiaryWellbeing[] = [
    { id: '1', name: 'محمد أحمد العمري', age: 45, room: 'غ-101', wellbeingScore: 92, trend: 'up', indicators: { health: 95, nutrition: 90, safety: 100, mood: 85, activity: 90 }, lastUpdate: '10:30', alerts: 0 },
    { id: '2', name: 'فاطمة سعيد', age: 38, room: 'غ-102', wellbeingScore: 45, trend: 'down', indicators: { health: 40, nutrition: 50, safety: 60, mood: 35, activity: 40 }, lastUpdate: '10:25', alerts: 2 },
    { id: '3', name: 'عبدالله خالد', age: 52, room: 'غ-103', wellbeingScore: 78, trend: 'stable', indicators: { health: 80, nutrition: 85, safety: 90, mood: 70, activity: 65 }, lastUpdate: '10:20', alerts: 0 },
    { id: '4', name: 'نورة محمد', age: 41, room: 'غ-104', wellbeingScore: 88, trend: 'up', indicators: { health: 90, nutrition: 88, safety: 95, mood: 85, activity: 82 }, lastUpdate: '10:15', alerts: 0 },
    { id: '5', name: 'سعود العتيبي', age: 60, room: 'غ-105', wellbeingScore: 35, trend: 'down', indicators: { health: 30, nutrition: 40, safety: 45, mood: 25, activity: 35 }, lastUpdate: '10:10', alerts: 3 },
    { id: '6', name: 'هند السالم', age: 35, room: 'غ-106', wellbeingScore: 95, trend: 'up', indicators: { health: 98, nutrition: 95, safety: 100, mood: 90, activity: 92 }, lastUpdate: '10:05', alerts: 0 },
    { id: '7', name: 'خالد الدوسري', age: 48, room: 'غ-107', wellbeingScore: 62, trend: 'stable', indicators: { health: 65, nutrition: 60, safety: 70, mood: 55, activity: 60 }, lastUpdate: '10:00', alerts: 1 },
    { id: '8', name: 'ريم الحربي', age: 29, room: 'غ-108', wellbeingScore: 85, trend: 'up', indicators: { health: 88, nutrition: 82, safety: 90, mood: 80, activity: 85 }, lastUpdate: '09:55', alerts: 0 },
];

/** Status thresholds — kept as functions for reuse and future tuning. */
type ScoreStatus = 'critical' | 'warning' | 'good';
const statusOf = (score: number): ScoreStatus => {
    if (score >= 80) return 'good';
    if (score >= 50) return 'warning';
    return 'critical';
};

/**
 * Brand-compliant status palette.
 * - good: HRSD green #2BB574 (Pantone 2414C)
 * - warning: HRSD gold #FCB614 (Pantone 7409C)
 * - critical: semantic red #DC2626 (life-safety exception, not in brand palette)
 *
 * Each entry returns the four states a card needs.
 */
const STATUS_TOKENS: Record<ScoreStatus, {
    text: string;
    bg: string;
    bgSoft: string;
    border: string;
    borderStrong: string;
    bar: string;
    label: string;
}> = {
    good: {
        text: 'text-[#2BB574]',
        bg: 'bg-[#2BB574]',
        bgSoft: 'bg-[#2BB574]/10',
        border: 'border-[#2BB574]/30',
        borderStrong: 'border-[#2BB574]',
        bar: 'bg-[#2BB574]',
        label: 'حالة جيدة',
    },
    warning: {
        text: 'text-[#FCB614]',
        bg: 'bg-[#FCB614]',
        bgSoft: 'bg-[#FCB614]/10',
        border: 'border-[#FCB614]/30',
        borderStrong: 'border-[#FCB614]',
        bar: 'bg-[#FCB614]',
        label: 'تحتاج متابعة',
    },
    critical: {
        text: 'text-[#DC2626]',
        bg: 'bg-[#DC2626]',
        bgSoft: 'bg-[#DC2626]/10',
        border: 'border-[#DC2626]/30',
        borderStrong: 'border-[#DC2626]',
        bar: 'bg-[#DC2626]',
        label: 'حالة حرجة',
    },
};

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[#2BB574]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-[#DC2626]" />;
    return <Minus className="w-4 h-4 text-hrsd-cool-gray" />;
};

const IndicatorBar: React.FC<{ value: number; icon: React.ElementType; label: string }> = ({ value, icon: Icon, label }) => {
    const tone = STATUS_TOKENS[statusOf(value)];
    return (
        <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-hrsd-cool-gray" aria-label={label} />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${tone.bar}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="text-xs text-hrsd-cool-gray w-6 tabular-nums">{value}</span>
        </div>
    );
};

export const WellbeingHeatmap: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | ScoreStatus>('all');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);

    const filteredBeneficiaries = mockBeneficiaries.filter(b => {
        const matchesSearch = b.name.includes(searchTerm) || b.room.includes(searchTerm);
        const matchesFilter = filterStatus === 'all' || statusOf(b.wellbeingScore) === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        critical: mockBeneficiaries.filter(b => statusOf(b.wellbeingScore) === 'critical').length,
        warning: mockBeneficiaries.filter(b => statusOf(b.wellbeingScore) === 'warning').length,
        good: mockBeneficiaries.filter(b => statusOf(b.wellbeingScore) === 'good').length,
    };

    return (
        <div className="min-h-screen bg-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-hrsd-navy mb-2">خريطة الرفاهية</h1>
                <p className="text-hrsd-cool-gray">
                    تصوّر بصري تفاعلي لحالة جميع المستفيدين بحسب مؤشّرات الرعاية اليومية
                </p>
            </motion.div>

            {/* Stats Summary — three filter chips */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {(['critical', 'warning', 'good'] as const).map((status, idx) => {
                    const tone = STATUS_TOKENS[status];
                    const count = stats[status];
                    const Icon = status === 'critical' ? AlertTriangle : status === 'warning' ? Eye : CheckCircle;
                    const isActive = filterStatus === status;
                    return (
                        <motion.button
                            key={status}
                            type="button"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.06 }}
                            onClick={() => setFilterStatus(isActive ? 'all' : status)}
                            className={`text-right rounded-xl p-4 border-2 transition-all bg-white ${
                                isActive ? tone.borderStrong : tone.border
                            } hover:${tone.bgSoft}`}
                            aria-pressed={isActive}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-lg ${tone.bgSoft} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${tone.text}`} />
                                </div>
                                <p className={`text-3xl font-bold ${tone.text} tabular-nums`}>{count}</p>
                            </div>
                            <p className="text-sm font-semibold text-hrsd-navy">{tone.label}</p>
                            <p className="text-xs text-hrsd-cool-gray mt-1">
                                {isActive ? 'انقر لإلغاء التصفية' : 'انقر للتصفية'}
                            </p>
                        </motion.button>
                    );
                })}
            </div>

            {/* Search & Filter row */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hrsd-cool-gray" />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو رقم الغرفة…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl pe-10 ps-4 py-3 text-hrsd-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/30 focus:border-hrsd-teal"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                        filterStatus === 'all'
                            ? 'bg-hrsd-navy text-white'
                            : 'bg-white border border-gray-300 text-hrsd-cool-gray hover:bg-gray-50'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    عرض الكل
                </button>
            </div>

            {/* Beneficiaries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBeneficiaries.map((beneficiary, index) => {
                    const status = statusOf(beneficiary.wellbeingScore);
                    const tone = STATUS_TOKENS[status];
                    const isSelected = selectedBeneficiary === beneficiary.id;
                    return (
                        <motion.button
                            type="button"
                            key={beneficiary.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`relative text-right rounded-2xl p-4 cursor-pointer transition-all bg-white border-2 ${
                                isSelected ? tone.borderStrong + ' shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                            onClick={() => setSelectedBeneficiary(isSelected ? null : beneficiary.id)}
                            aria-pressed={isSelected}
                        >
                            {/* Status accent bar (left edge in RTL) */}
                            <span
                                className={`absolute top-3 bottom-3 start-0 w-1 rounded-full ${tone.bar}`}
                                aria-hidden="true"
                            />

                            {/* Alerts Badge */}
                            {beneficiary.alerts > 0 && (
                                <div className="absolute -top-2 -start-2 w-6 h-6 bg-[#DC2626] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                    {beneficiary.alerts}
                                </div>
                            )}

                            {/* Header */}
                            <div className="flex items-start justify-between mb-3 ps-3">
                                <div>
                                    <h3 className="font-bold text-hrsd-navy">{beneficiary.name}</h3>
                                    <p className="text-hrsd-cool-gray text-sm">{beneficiary.room} · {beneficiary.age} سنة</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendIcon trend={beneficiary.trend} />
                                </div>
                            </div>

                            {/* Score + indicators */}
                            <div className="flex items-center gap-4 mb-1 ps-3">
                                <div className={`w-16 h-16 rounded-full ${tone.bgSoft} border-2 ${tone.border} flex items-center justify-center`}>
                                    <span className={`text-xl font-bold ${tone.text} tabular-nums`}>
                                        {beneficiary.wellbeingScore}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    <IndicatorBar value={beneficiary.indicators.health} icon={Heart} label="الصحة" />
                                    <IndicatorBar value={beneficiary.indicators.nutrition} icon={Utensils} label="التغذية" />
                                    <IndicatorBar value={beneficiary.indicators.mood} icon={Smile} label="المزاج" />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="border-t border-gray-200 pt-3 mt-3 space-y-2 ps-3"
                                >
                                    <IndicatorBar value={beneficiary.indicators.safety} icon={Shield} label="السلامة" />
                                    <IndicatorBar value={beneficiary.indicators.activity} icon={Activity} label="النشاط" />
                                    <p className="text-hrsd-cool-gray text-xs mt-2">
                                        آخر تحديث: {beneficiary.lastUpdate}
                                    </p>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Empty state when filter yields no results */}
            {filteredBeneficiaries.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-hrsd-cool-gray">لا توجد نتائج تطابق المعايير الحالية.</p>
                </div>
            )}
        </div>
    );
};

export default WellbeingHeatmap;
