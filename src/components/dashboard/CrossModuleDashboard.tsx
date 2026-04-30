import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Target, Users, Activity,
    TrendingUp, AlertCircle, ChevronRight,
    CheckCircle, Clock
} from 'lucide-react';
import { ipcService, IPCStats } from '../../services/ipcService';
import { empowermentService } from '../../services/empowermentService';

// Unified Module Card
interface ModuleCardProps {
    title: string;
    icon: React.ReactNode;
    stats: Array<{ label: string; value: string | number; color?: string }>;
    bgClass: string;
    linkTo: string;
}

const ModuleCard: React.FC<ModuleCardProps & { delay?: number }> = ({ title, icon, stats, bgClass, linkTo, delay = 0 }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(linkTo)}
            className={`${bgClass} rounded-2xl p-6 cursor-pointer hover-lift btn-ripple animate-slide-up opacity-0 shadow-lg`}
            style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                        {icon}
                    </div>
                    <h3 className="font-bold text-white text-lg">{title}</h3>
                </div>
                <ChevronRight className="w-6 h-6 text-white/70" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20 hover:bg-white/25 transition-all">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/90 mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Alert Item
const AlertItem: React.FC<{
    type: 'infection' | 'fall' | 'goal';
    title: string;
    severity: 'high' | 'medium' | 'low';
    time: string;
}> = ({ type, severity, title, time }) => {
    const severityColors = {
        high: 'border-e-red-500 bg-gradient-to-l from-[#DC2626]/10 to-transparent',
        medium: 'border-e-yellow-500 bg-gradient-to-l from-[#FCB614]/10 to-transparent',
        low: 'border-e-blue-500 bg-gradient-to-l from-[#269798]/10 to-transparent',
    };

    const icons = {
        infection: <Shield className="w-5 h-5 text-[#DC2626]" />,
        fall: <AlertCircle className="w-5 h-5 text-[#D67A0A]" />,
        goal: <Target className="w-5 h-5 text-[#1E9658]" />,
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border-e-4 ${severityColors[severity]} hover-lift`}>
            <div className="p-2 bg-white rounded-xl shadow-sm">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{time}</p>
            </div>
        </div>
    );
};

export const CrossModuleDashboard: React.FC = () => {
    const [ipcStats, setIpcStats] = useState<IPCStats | null>(null);
    const [empowermentStats, setEmpowermentStats] = useState<{
        totalGoals: number;
        achievedGoals: number;
        inProgressGoals: number;
        avgProgress: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const [ipc, empowerment] = await Promise.all([
                    ipcService.getIPCStats(),
                    empowermentService.getEmpowermentStats(),
                ]);
                setIpcStats(ipc);
                setEmpowermentStats(empowerment);
            } finally {
                setLoading(false);
            }
        };

        fetchAllStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6" dir="rtl">
                {/* Skeleton Header */}
                <div className="flex items-center justify-between">
                    <div className="skeleton skeleton-title w-48"></div>
                    <div className="skeleton w-24 h-5"></div>
                </div>
                {/* Skeleton Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton skeleton-card h-44 rounded-2xl"></div>
                    ))}
                </div>
                {/* Skeleton Alerts */}
                <div className="skeleton h-32 rounded-2xl"></div>
                {/* Skeleton Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="skeleton h-20 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Section Title */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#2BB574]/10 to-[#269798]/10 rounded-xl">
                        <Activity className="w-7 h-7 text-[#1E9658]" />
                    </div>
                    نظرة شاملة على الوحدات
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    آخر تحديث: {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* IPC Module */}
                <ModuleCard
                    title="درع السلامة (IPC)"
                    icon={<Shield className="w-6 h-6 text-white animate-float" />}
                    bgClass="gradient-ipc"
                    linkTo="/ipc"
                    delay={1}
                    stats={[
                        { label: 'معدل الامتثال', value: `${ipcStats?.avgComplianceRate || 0}%` },
                        { label: 'حالات نشطة', value: ipcStats?.activeIncidents || 0 },
                        { label: 'نسبة التحصين', value: `${ipcStats?.immunizationRate || 0}%` },
                        { label: 'معلّقة', value: ipcStats?.pendingFollowups || 0 },
                    ]}
                />

                {/* Empowerment Module */}
                <ModuleCard
                    title="محرك التمكين"
                    icon={<Target className="w-6 h-6 text-white animate-float" />}
                    bgClass="gradient-empowerment"
                    linkTo="/empowerment"
                    delay={2}
                    stats={[
                        { label: 'إجمالي الأهداف', value: empowermentStats?.totalGoals || 0 },
                        { label: 'محققة', value: empowermentStats?.achievedGoals || 0 },
                        { label: 'قيد التنفيذ', value: empowermentStats?.inProgressGoals || 0 },
                        { label: 'متوسط التقدم', value: `${empowermentStats?.avgProgress || 0}%` },
                    ]}
                />

                {/* Family Portal */}
                <ModuleCard
                    title="بوابة الأسرة"
                    icon={<Users className="w-6 h-6 text-white animate-float" />}
                    bgClass="gradient-family"
                    linkTo="/family"
                    delay={3}
                    stats={[
                        { label: 'أسر مسجلة', value: 45 },
                        { label: 'زيارات هذا الشهر', value: 12 },
                        { label: 'رسائل جديدة', value: 3 },
                        { label: 'تقييم الرضا', value: '92%' },
                    ]}
                />
            </div>

            {/* Recent Alerts Row */}
            <div className="hrsd-card">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                        <AlertCircle className="w-6 h-6 text-[#DC2626]" />
                        التنبيهات الأخيرة
                    </h3>
                    <button
                        onClick={() => {/* Open alerts panel */ }}
                        className="text-sm text-[#1E9658] hover:text-[#1E9658] font-semibold hover:underline transition-colors"
                    >
                        عرض الكل
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AlertItem
                        type="infection"
                        title="حالة عدوى تنفسية - جناح الإناث"
                        severity="high"
                        time="منذ 15 دقيقة"
                    />
                    <AlertItem
                        type="fall"
                        title="خطر سقوط عالي - محمد العمري"
                        severity="medium"
                        time="منذ ساعة"
                    />
                    <AlertItem
                        type="goal"
                        title="هدف جديد محقق - المشي 30م"
                        severity="low"
                        time="اليوم"
                    />
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="hrsd-card p-4 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#2BB574]/10 to-[#2BB574]/10 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-[#1E9658]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {(empowermentStats?.achievedGoals || 0) + Math.floor((ipcStats?.avgComplianceRate || 0) / 10)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">إنجازات اليوم</p>
                    </div>
                </div>
                <div className="hrsd-card p-4 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#FCB614]/10 to-[#FCB614]/10 rounded-xl">
                        <Clock className="w-6 h-6 text-[#D49A0A]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {(ipcStats?.pendingFollowups || 0) + (empowermentStats?.inProgressGoals || 0)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">مهام معلقة</p>
                    </div>
                </div>
                <div className="hrsd-card p-4 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#DC2626]/10 to-[#DC2626]/10 rounded-xl">
                        <AlertCircle className="w-6 h-6 text-[#DC2626]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{ipcStats?.activeIncidents || 0}</p>
                        <p className="text-xs text-gray-500 font-medium">تنبيهات حرجة</p>
                    </div>
                </div>
                <div className="hrsd-card p-4 flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#269798]/10 to-[#269798]/10 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-[#269798]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {Math.round(((ipcStats?.avgComplianceRate || 0) + (empowermentStats?.avgProgress || 0)) / 2)}%
                        </p>
                        <p className="text-xs text-gray-500 font-medium">مؤشر الأداء</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossModuleDashboard;
