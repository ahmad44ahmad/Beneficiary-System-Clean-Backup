import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, AlertCircle, Users, Activity,
    TrendingUp, TrendingDown, Syringe, ClipboardCheck,
    ChevronLeft, Plus, RefreshCw, Calendar
} from 'lucide-react';
import { ipcService, IPCStats } from '../../services/ipcService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// HRSD 2025 Colors
const COLORS = {
    primary: '#007E4E',
    primaryLight: '#EAF5F0',
    gold: '#D4AF37',
    navy: '#003D5B',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0EA5E9',
};

// KPI Card Component
const KPICard: React.FC<{
    title: string;
    value: number | string;
    unit?: string;
    trend?: number;
    icon: React.ReactNode;
    color: 'success' | 'warning' | 'error' | 'info' | 'primary';
    onClick?: () => void;
}> = ({ title, value, unit = '%', trend, icon, color, onClick }) => {
    const colorClasses = {
        success: 'bg-green-50 text-green-600 border-green-200',
        warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        error: 'bg-red-50 text-red-600 border-red-200',
        info: 'bg-blue-50 text-blue-600 border-blue-200',
        primary: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };

    const iconBgClasses = {
        success: 'bg-green-100',
        warning: 'bg-yellow-100',
        error: 'bg-red-100',
        info: 'bg-blue-100',
        primary: 'bg-emerald-100',
    };

    return (
        <div
            className={`bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all cursor-pointer ${onClick ? 'hover:scale-[1.02]' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-800">{value}</span>
                        <span className="text-gray-500 text-sm">{unit}</span>
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span>{Math.abs(trend)}% عن الأسبوع الماضي</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Weekly Chart Component (Simple)
const WeeklyChart: React.FC<{ data: Array<{ week: string; compliance: number }> }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.compliance));

    return (
        <div className="flex items-end justify-between gap-2 h-40 px-2">
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                        className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600"
                        style={{
                            height: `${(item.compliance / maxValue) * 100}%`,
                            minHeight: '20px'
                        }}
                    />
                    <span className="text-xs text-gray-500 mt-2 text-center">{item.week}</span>
                    <span className="text-sm font-bold text-gray-700">{item.compliance}%</span>
                </div>
            ))}
        </div>
    );
};

export const IPCDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IPCStats | null>(null);
    const [weeklyData, setWeeklyData] = useState<Array<{ week: string; compliance: number; incidents: number }>>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsData, weekly] = await Promise.all([
                ipcService.getIPCStats(),
                ipcService.getWeeklyComplianceData()
            ]);
            setStats(statsData);
            setWeeklyData(weekly);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل بيانات مكافحة العدوى..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <Shield className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">درع السلامة</h1>
                                <p className="text-gray-500">لوحة قيادة مكافحة العدوى - BICSL</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        تحديث
                    </button>
                    <button
                        onClick={() => navigate('/ipc/inspection')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        جولة تفتيش جديدة
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <KPICard
                        title="معدل الامتثال الأسبوعي"
                        value={stats.avgComplianceRate}
                        trend={stats.complianceTrend}
                        icon={<Shield size={24} />}
                        color={stats.avgComplianceRate >= 85 ? 'success' : stats.avgComplianceRate >= 70 ? 'warning' : 'error'}
                        onClick={() => navigate('/ipc/inspections')}
                    />
                    <KPICard
                        title="الحالات النشطة"
                        value={stats.activeIncidents}
                        unit="حالة"
                        trend={stats.incidentsTrend}
                        icon={<AlertCircle size={24} />}
                        color={stats.activeIncidents === 0 ? 'success' : stats.activeIncidents <= 2 ? 'warning' : 'error'}
                        onClick={() => navigate('/ipc/incidents')}
                    />
                    <KPICard
                        title="نسبة التحصين"
                        value={stats.immunizationRate}
                        icon={<Syringe size={24} />}
                        color={stats.immunizationRate >= 90 ? 'success' : 'warning'}
                        onClick={() => navigate('/ipc/immunizations')}
                    />
                    <KPICard
                        title="متابعات معلقة"
                        value={stats.pendingFollowups}
                        unit="تفتيش"
                        icon={<ClipboardCheck size={24} />}
                        color={stats.pendingFollowups <= 3 ? 'info' : 'warning'}
                    />
                </div>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Compliance Trend */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-600" />
                            اتجاه الامتثال (آخر 4 أسابيع)
                        </h3>
                        <span className="text-sm text-gray-500">
                            <Calendar className="w-4 h-4 inline ml-1" />
                            {new Date().toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                    <WeeklyChart data={weeklyData} />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                        الإجراءات السريعة
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/ipc/inspection')}
                            className="p-4 bg-emerald-50 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <ClipboardCheck size={32} />
                            <span className="font-medium">جولة تفتيش</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/incident/new')}
                            className="p-4 bg-red-50 rounded-xl text-red-700 hover:bg-red-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <AlertCircle size={32} />
                            <span className="font-medium">إبلاغ حادثة</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/immunizations')}
                            className="p-4 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <Syringe size={32} />
                            <span className="font-medium">سجل التحصينات</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/analytics')}
                            className="p-4 bg-purple-50 rounded-xl text-purple-700 hover:bg-purple-100 transition-colors flex flex-col items-center gap-2"
                        >
                            <Activity size={32} />
                            <span className="font-medium">التحليلات</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Alert Banner (if incidents exist) */}
            {stats && stats.activeIncidents > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="font-bold text-red-800">يوجد {stats.activeIncidents} حالة عدوى نشطة</p>
                            <p className="text-red-600 text-sm">تتطلب المتابعة والإجراءات الفورية</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/ipc/incidents')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        عرض الحالات
                    </button>
                </div>
            )}
        </div>
    );
};

export default IPCDashboard;
