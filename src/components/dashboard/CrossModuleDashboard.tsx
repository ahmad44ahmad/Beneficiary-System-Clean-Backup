import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Target, Users, Activity,
    TrendingUp, AlertCircle, Heart, ChevronRight,
    CheckCircle, Clock
} from 'lucide-react';
import { ipcService } from '../../services/ipcService';
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
            className={`${bgClass} rounded-2xl p-5 cursor-pointer hover-lift btn-ripple animate-slide-up opacity-0`}
            style={{ animationDelay: `${delay * 0.1}s`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        {icon}
                    </div>
                    <h3 className="font-bold text-white">{title}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-white/80">{stat.label}</p>
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
}> = ({ type, title, severity, time }) => {
    const severityColors = {
        high: 'border-red-400 bg-red-50',
        medium: 'border-yellow-400 bg-yellow-50',
        low: 'border-blue-400 bg-blue-50',
    };

    const icons = {
        infection: <Shield className="w-4 h-4 text-red-500" />,
        fall: <AlertCircle className="w-4 h-4 text-orange-500" />,
        goal: <Target className="w-4 h-4 text-green-500" />,
    };

    return (
        <div className={`flex items-center gap-3 p-3 rounded-lg border-r-4 ${severityColors[severity]}`}>
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
        </div>
    );
};

export const CrossModuleDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [ipcStats, setIpcStats] = useState<any>(null);
    const [empowermentStats, setEmpowermentStats] = useState<any>(null);
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
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-600" />
                    نظرة شاملة على الوحدات
                </h2>
                <span className="text-sm text-gray-500">
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
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        التنبيهات الأخيرة
                    </h3>
                    <button
                        onClick={() => {/* Open alerts panel */ }}
                        className="text-sm text-emerald-600 hover:underline"
                    >
                        عرض الكل
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {(empowermentStats?.achievedGoals || 0) + Math.floor((ipcStats?.avgComplianceRate || 0) / 10)}
                        </p>
                        <p className="text-xs text-gray-500">إنجازات اليوم</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {(ipcStats?.pendingFollowups || 0) + (empowermentStats?.inProgressGoals || 0)}
                        </p>
                        <p className="text-xs text-gray-500">مهام معلقة</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{ipcStats?.activeIncidents || 0}</p>
                        <p className="text-xs text-gray-500">تنبيهات حرجة</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {Math.round(((ipcStats?.avgComplianceRate || 0) + (empowermentStats?.avgProgress || 0)) / 2)}%
                        </p>
                        <p className="text-xs text-gray-500">مؤشر الأداء</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrossModuleDashboard;
