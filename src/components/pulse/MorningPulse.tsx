import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sun, Moon, CloudSun, AlertTriangle, CheckCircle,
    Users, Heart, Pill,
    Bell, X, ChevronLeft, Sparkles,
    Sunrise, Activity
} from 'lucide-react';
import { useWelcomeStats } from '../../hooks/useWelcomeStats';

/**
 * Morning Pulse — Phase 2B.
 * Brand level: Default (light mode).
 *
 * The morning briefing screen. Per HRSD Brand Guidelines:
 * - Light surface; navy headings; cool-gray body.
 * - Stats use a restricted palette (teal/gold/green/orange) — one accent per card.
 * - "Critical alerts" is the only place semantic red is allowed (life-safety).
 * - No purple, no sky-blue, no Tailwind raw colors anywhere.
 */

interface MorningPulseProps {
    onClose?: () => void;
    onNavigate?: (section: string) => void;
}

interface PulseData {
    totalBeneficiaries: number;
    criticalAlerts: number;
    upcomingMedications: number;
    todayPriorities: string[];
    weather: { temp: number; condition: string; humidity: number };
    staffOnDuty: number;
    occupancyRate: number;
}

const fallbackPulseData: PulseData = {
    totalBeneficiaries: 62,
    criticalAlerts: 3,
    upcomingMedications: 12,
    todayPriorities: [
        'متابعة طبية شاملة — الجناح الشمالي',
        'زيارة أسرية مجدولة — ٥ مستفيدين',
        'جلسة تأهيل حركي جماعية',
        'اجتماع فريق الرعاية الأسبوعي',
    ],
    weather: { temp: 24, condition: 'sunny', humidity: 45 },
    staffOnDuty: 18,
    occupancyRate: 87,
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'صباح الخير', icon: Sunrise, accent: '#FCB614' };
    if (hour < 17) return { text: 'مساء الخير', icon: Sun, accent: '#F7941D' };
    return { text: 'مساء الخير', icon: Moon, accent: '#0F3144' };
};

const getWeatherIcon = (condition: string) => {
    switch (condition) {
        case 'sunny': return Sun;
        case 'cloudy': return CloudSun;
        default: return Sun;
    }
};

export const MorningPulse: React.FC<MorningPulseProps> = ({ onClose, onNavigate }) => {
    const liveStats = useWelcomeStats();
    const [currentTime, setCurrentTime] = useState(new Date());
    const greeting = getGreeting();

    const data: PulseData = {
        ...fallbackPulseData,
        totalBeneficiaries: liveStats.loading ? fallbackPulseData.totalBeneficiaries : liveStats.beneficiariesCount,
        criticalAlerts: liveStats.loading ? fallbackPulseData.criticalAlerts : Math.min(liveStats.activeRisksCount, 9),
        staffOnDuty: liveStats.loading ? fallbackPulseData.staffOnDuty : liveStats.staffCount,
        occupancyRate: liveStats.loading ? fallbackPulseData.occupancyRate : liveStats.complianceRate,
    };
    const WeatherIcon = getWeatherIcon(data.weather.condition);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    /**
     * Stat tiles — one HRSD accent per tile.
     * Critical alerts is the only exception that uses semantic red.
     */
    const stats: Array<{
        label: string;
        value: number;
        icon: React.ComponentType<{ className?: string }>;
        accent: string;
        accentSoft: string;
        urgent?: boolean;
    }> = [
        { label: 'المستفيدون', value: data.totalBeneficiaries, icon: Users, accent: 'bg-[#269798]', accentSoft: 'bg-[#269798]/10' },
        { label: 'تنبيهات حرجة', value: data.criticalAlerts, icon: AlertTriangle, accent: 'bg-[#DC2626]', accentSoft: 'bg-[#DC2626]/10', urgent: data.criticalAlerts > 0 },
        { label: 'أدوية قادمة', value: data.upcomingMedications, icon: Pill, accent: 'bg-[#FCB614]', accentSoft: 'bg-[#FCB614]/10' },
        { label: 'الكادر المتواجد', value: data.staffOnDuty, icon: Heart, accent: 'bg-[#2BB574]', accentSoft: 'bg-[#2BB574]/10' },
    ];

    return (
        <div className="min-h-screen bg-white p-6" dir="rtl">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: greeting.accent }}
                    >
                        <greeting.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-hrsd-navy">{greeting.text}</h1>
                        <p className="text-hrsd-cool-gray text-sm">
                            {currentTime.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-left">
                        <p className="text-3xl font-bold text-hrsd-navy tabular-nums">
                            {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-hrsd-cool-gray text-xs">التوقيت المحلي</p>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-hrsd-cool-gray"
                            aria-label="إغلاق"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </motion.header>

            {/* Main Title */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-2 bg-[#FCB614]/10 px-4 py-1.5 rounded-full mb-4 border border-[#FCB614]/30">
                    <Sparkles className="w-4 h-4 text-[#FCB614]" />
                    <span className="text-[#FCB614] text-sm font-medium">منظومة بصيرة — نبض المركز</span>
                </div>
                <h2 className="text-4xl font-bold text-hrsd-navy">الموقف العام للمركز</h2>
                <p className="text-hrsd-cool-gray mt-2">تحديث لحظي للمؤشرات التشغيلية</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.button
                        type="button"
                        key={stat.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        className={`text-right relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group ${
                            stat.urgent ? 'ring-2 ring-[#DC2626]/40' : ''
                        }`}
                        onClick={() => onNavigate?.(stat.label)}
                    >
                        <div className={`w-12 h-12 ${stat.accent} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-hrsd-navy mb-1 tabular-nums">{stat.value}</p>
                        <p className="text-hrsd-cool-gray text-sm">{stat.label}</p>
                    </motion.button>
                ))}
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Priorities */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#269798] rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-hrsd-navy">أولويات اليوم</h3>
                            <p className="text-hrsd-cool-gray text-sm">{data.todayPriorities.length} مهام مجدولة</p>
                        </div>
                    </div>
                    <ul className="space-y-2.5">
                        {data.todayPriorities.map((priority, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.08 }}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                            >
                                <div className="w-8 h-8 bg-[#269798]/10 rounded-lg flex items-center justify-center text-[#269798] font-bold text-sm">
                                    {index + 1}
                                </div>
                                <span className="flex-1 text-hrsd-navy">{priority}</span>
                                <ChevronLeft className="w-4 h-4 text-hrsd-cool-gray group-hover:text-hrsd-navy transition-colors" />
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Weather + Occupancy + Actions */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    {/* Weather Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-hrsd-cool-gray text-sm mb-1">حالة الطقس</p>
                                <p className="text-4xl font-bold text-hrsd-navy tabular-nums">{data.weather.temp}°</p>
                                <p className="text-hrsd-cool-gray text-sm mt-1">الرطوبة: {data.weather.humidity}%</p>
                            </div>
                            <div className="w-20 h-20 bg-[#FCB614]/15 border-2 border-[#FCB614]/30 rounded-full flex items-center justify-center">
                                <WeatherIcon className="w-10 h-10 text-[#FCB614]" />
                            </div>
                        </div>
                    </div>

                    {/* Occupancy Rate */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-[#2BB574]" />
                                <span className="font-medium text-hrsd-navy">نسبة الإشغال</span>
                            </div>
                            <span className="text-2xl font-bold text-[#2BB574] tabular-nums">{data.occupancyRate}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.occupancyRate}%` }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="h-full bg-[#2BB574] rounded-full"
                            />
                        </div>
                        <p className="text-hrsd-cool-gray text-sm mt-2">
                            {Math.round(data.totalBeneficiaries * data.occupancyRate / 100)} من {data.totalBeneficiaries} سرير مشغول
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('alerts')}
                            className="flex items-center gap-2 p-4 bg-[#DC2626]/10 hover:bg-[#DC2626]/15 rounded-xl border border-[#DC2626]/30 text-[#DC2626] transition-colors font-medium"
                        >
                            <Bell className="w-5 h-5" />
                            <span>التنبيهات</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate?.('medications')}
                            className="flex items-center gap-2 p-4 bg-[#269798]/10 hover:bg-[#269798]/15 rounded-xl border border-[#269798]/30 text-[#269798] transition-colors font-medium"
                        >
                            <Pill className="w-5 h-5" />
                            <span>الأدوية</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MorningPulse;
