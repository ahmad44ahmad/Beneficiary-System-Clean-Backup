import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sun, Moon, CloudSun, AlertTriangle, CheckCircle, Clock,
    Users, Heart, Pill, Shield, TrendingUp, TrendingDown,
    Thermometer, Wind, Bell, X, ChevronLeft, Sparkles,
    Coffee, Sunrise, Activity, Zap
} from 'lucide-react';

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

const mockPulseData: PulseData = {
    totalBeneficiaries: 145,
    criticalAlerts: 3,
    upcomingMedications: 12,
    todayPriorities: [
        'فحص طبي شامل - جناح الذكور',
        'زيارة عائلية - 5 مستفيدين',
        'جلسة علاج طبيعي جماعية',
        'اجتماع فريق الرعاية'
    ],
    weather: { temp: 24, condition: 'sunny', humidity: 45 },
    staffOnDuty: 18,
    occupancyRate: 87
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'صباح الخير', icon: Sunrise, color: 'from-amber-400 to-orange-500' };
    if (hour < 17) return { text: 'مساء الخير', icon: Sun, color: 'from-sky-400 to-blue-500' };
    return { text: 'مساء الخير', icon: Moon, color: 'from-indigo-500 to-purple-600' };
};

const getWeatherIcon = (condition: string) => {
    switch (condition) {
        case 'sunny': return Sun;
        case 'cloudy': return CloudSun;
        default: return Sun;
    }
};

export const MorningPulse: React.FC<MorningPulseProps> = ({ onClose, onNavigate }) => {
    const [data] = useState<PulseData>(mockPulseData);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    const greeting = getGreeting();
    const WeatherIcon = getWeatherIcon(data.weather.condition);

    useEffect(() => {
        setIsVisible(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const stats = [
        { label: 'المستفيدين', value: data.totalBeneficiaries, icon: Users, color: 'bg-blue-500', trend: '+2' },
        { label: 'تنبيهات حرجة', value: data.criticalAlerts, icon: AlertTriangle, color: 'bg-red-500', urgent: true },
        { label: 'أدوية قادمة', value: data.upcomingMedications, icon: Pill, color: 'bg-purple-500' },
        { label: 'الكادر المتواجد', value: data.staffOnDuty, icon: Heart, color: 'bg-green-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${greeting.color} flex items-center justify-center shadow-lg`}>
                        <greeting.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{greeting.text}</h1>
                        <p className="text-slate-400 text-sm">
                            {currentTime.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-left">
                        <p className="text-3xl font-bold tabular-nums">
                            {currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-slate-500 text-xs">التوقيت المحلي</p>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </motion.header>

            {/* Main Title */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-full mb-4 border border-amber-500/30">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-300 text-sm font-medium">نظام بصيرة | نبض المركز</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    الحالة العامة للمركز
                </h2>
                <p className="text-slate-400 mt-2">نظرة سريعة على أهم المؤشرات في 10 ثوانٍ</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer group ${stat.urgent ? 'ring-2 ring-red-500/50 animate-pulse' : ''}`}
                        onClick={() => onNavigate?.(stat.label)}
                    >
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        {stat.trend && (
                            <div className="absolute top-4 left-4 flex items-center gap-1 text-green-400 text-xs">
                                <TrendingUp className="w-3 h-3" />
                                {stat.trend}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Priorities */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">أولويات اليوم</h3>
                            <p className="text-slate-500 text-sm">{data.todayPriorities.length} مهام مجدولة</p>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {data.todayPriorities.map((priority, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer group"
                            >
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-sm">
                                    {index + 1}
                                </div>
                                <span className="flex-1 text-slate-300">{priority}</span>
                                <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Weather & Occupancy */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    {/* Weather Card */}
                    <div className="bg-gradient-to-br from-sky-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-6 border border-sky-700/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sky-400 text-sm mb-1">حالة الطقس</p>
                                <p className="text-4xl font-bold">{data.weather.temp}°</p>
                                <p className="text-slate-400 text-sm mt-1">الرطوبة: {data.weather.humidity}%</p>
                            </div>
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <WeatherIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Occupancy Rate */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-green-400" />
                                <span className="font-medium">نسبة الإشغال</span>
                            </div>
                            <span className="text-2xl font-bold text-green-400">{data.occupancyRate}%</span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.occupancyRate}%` }}
                                transition={{ delay: 0.8, duration: 1 }}
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                            />
                        </div>
                        <p className="text-slate-500 text-sm mt-2">
                            {Math.round(data.totalBeneficiaries * data.occupancyRate / 100)} من {data.totalBeneficiaries} سرير مشغول
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onNavigate?.('alerts')}
                            className="flex items-center gap-2 p-4 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 text-red-400 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="font-medium">التنبيهات</span>
                        </button>
                        <button
                            onClick={() => onNavigate?.('medications')}
                            className="flex items-center gap-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl border border-purple-500/30 text-purple-400 transition-colors"
                        >
                            <Pill className="w-5 h-5" />
                            <span className="font-medium">الأدوية</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MorningPulse;
