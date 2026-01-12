import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Heart, Utensils, Shield, Smile, Activity,
    TrendingUp, TrendingDown, Minus, Search, Filter,
    AlertTriangle, CheckCircle, Eye
} from 'lucide-react';

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

const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-400';
    if (score >= 60) return 'from-yellow-500 to-amber-400';
    return 'from-red-500 to-rose-400';
};

const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
};

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
};

const IndicatorBar: React.FC<{ value: number; icon: React.ElementType; label: string }> = ({ value, icon: Icon, label }) => (
    <div className="flex items-center gap-2">
        <Icon className="w-3 h-3 text-slate-400" />
        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${value}%` }}
            />
        </div>
        <span className="text-xs text-slate-500 w-6">{value}</span>
    </div>
);

export const WellbeingHeatmap: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'critical' | 'warning' | 'good'>('all');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);

    const filteredBeneficiaries = mockBeneficiaries.filter(b => {
        const matchesSearch = b.name.includes(searchTerm) || b.room.includes(searchTerm);
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'critical' && b.wellbeingScore < 50) ||
            (filterStatus === 'warning' && b.wellbeingScore >= 50 && b.wellbeingScore < 80) ||
            (filterStatus === 'good' && b.wellbeingScore >= 80);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        critical: mockBeneficiaries.filter(b => b.wellbeingScore < 50).length,
        warning: mockBeneficiaries.filter(b => b.wellbeingScore >= 50 && b.wellbeingScore < 80).length,
        good: mockBeneficiaries.filter(b => b.wellbeingScore >= 80).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">خريطة الرفاهية</h1>
                <p className="text-slate-400">تصور بصري تفاعلي لحالة جميع المستفيدين</p>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center cursor-pointer hover:bg-red-500/30 transition-colors"
                    onClick={() => setFilterStatus(filterStatus === 'critical' ? 'all' : 'critical')}
                >
                    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
                    <p className="text-red-300/70 text-sm">حالة حرجة</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center cursor-pointer hover:bg-yellow-500/30 transition-colors"
                    onClick={() => setFilterStatus(filterStatus === 'warning' ? 'all' : 'warning')}
                >
                    <Eye className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-400">{stats.warning}</p>
                    <p className="text-yellow-300/70 text-sm">تحتاج متابعة</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center cursor-pointer hover:bg-green-500/30 transition-colors"
                    onClick={() => setFilterStatus(filterStatus === 'good' ? 'all' : 'good')}
                >
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-400">{stats.good}</p>
                    <p className="text-green-300/70 text-sm">حالة جيدة</p>
                </motion.div>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="البحث بالاسم أو رقم الغرفة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    <Filter className="w-4 h-4" />
                    الكل
                </button>
            </div>

            {/* Beneficiaries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredBeneficiaries.map((beneficiary, index) => (
                    <motion.div
                        key={beneficiary.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative rounded-2xl border p-4 cursor-pointer transition-all hover:scale-105 ${getScoreBg(beneficiary.wellbeingScore)} ${selectedBeneficiary === beneficiary.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedBeneficiary(selectedBeneficiary === beneficiary.id ? null : beneficiary.id)}
                    >
                        {/* Alerts Badge */}
                        {beneficiary.alerts > 0 && (
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                                {beneficiary.alerts}
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-bold text-white">{beneficiary.name}</h3>
                                <p className="text-slate-400 text-sm">{beneficiary.room} • {beneficiary.age} سنة</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendIcon trend={beneficiary.trend} />
                            </div>
                        </div>

                        {/* Score Circle */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getScoreColor(beneficiary.wellbeingScore)} flex items-center justify-center shadow-lg`}>
                                <span className="text-xl font-bold text-white">{beneficiary.wellbeingScore}</span>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <IndicatorBar value={beneficiary.indicators.health} icon={Heart} label="صحة" />
                                <IndicatorBar value={beneficiary.indicators.nutrition} icon={Utensils} label="تغذية" />
                                <IndicatorBar value={beneficiary.indicators.mood} icon={Smile} label="مزاج" />
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {selectedBeneficiary === beneficiary.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border-t border-slate-600/50 pt-3 mt-3 space-y-2"
                            >
                                <IndicatorBar value={beneficiary.indicators.safety} icon={Shield} label="سلامة" />
                                <IndicatorBar value={beneficiary.indicators.activity} icon={Activity} label="نشاط" />
                                <p className="text-slate-500 text-xs mt-2">آخر تحديث: {beneficiary.lastUpdate}</p>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default WellbeingHeatmap;
