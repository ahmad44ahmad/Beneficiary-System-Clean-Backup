import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, AlertCircle, Activity,
    TrendingUp, TrendingDown, Syringe, ClipboardCheck,
    ChevronLeft, Plus, RefreshCw, Calendar,
    ShieldCheck, Biohazard, HardHat, BedDouble, AlertTriangle
} from 'lucide-react';
import { ipcService, IPCStats } from '../../services/ipcService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';


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
    const iconBgClasses = {
        success: 'bg-[#2BB574]/15',
        warning: 'bg-[#FCB614]/10',
        error: 'bg-[#DC2626]/15',
        info: 'bg-[#269798]/15',
        primary: 'bg-[#2BB574]/15',
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
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-[#1E9658]' : 'text-[#DC2626]'}`}>
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
    if (!data.length) return <div className="flex items-center justify-center h-40 text-gray-400">لا توجد بيانات</div>;
    const maxValue = Math.max(...data.map(d => d.compliance)) || 1;

    return (
        <div className="flex items-end justify-between gap-2 h-40 px-2">
            {data.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                    <div
                        className="w-full bg-[#2BB574] rounded-t-lg transition-all hover:bg-[#1E9658]"
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
                            <div className="p-3 bg-[#2BB574]/15 rounded-xl">
                                <Shield className="w-8 h-8 text-[#1E9658]" />
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
                        className="px-4 py-2 bg-[#1E9658] text-white rounded-lg hover:bg-[#1E9658] flex items-center gap-2 shadow-md"
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
                            <Activity className="w-5 h-5 text-[#1E9658]" />
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
                        <ClipboardCheck className="w-5 h-5 text-[#1E9658]" />
                        الإجراءات السريعة
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/ipc/inspection')}
                            className="p-3 bg-[#2BB574]/10 rounded-xl text-[#1E9658] hover:bg-[#2BB574]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <ClipboardCheck size={28} />
                            <span className="font-medium text-sm">جولة تفتيش</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/incident/new')}
                            className="p-3 bg-[#DC2626]/10 rounded-xl text-[#B91C1C] hover:bg-[#DC2626]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <AlertCircle size={28} />
                            <span className="font-medium text-sm">إبلاغ حادثة</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/immunizations')}
                            className="p-3 bg-[#269798]/10 rounded-xl text-[#1B7778] hover:bg-[#269798]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <Syringe size={28} />
                            <span className="font-medium text-sm">التحصينات</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/ppe')}
                            className="p-3 bg-[#FCB614]/10 rounded-xl text-[#D49A0A] hover:bg-[#FCB614]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <HardHat size={28} />
                            <span className="font-medium text-sm">بروتوكول PPE</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/bicsl')}
                            className="p-3 bg-[#269798]/10 rounded-xl text-[#1B7778] hover:bg-[#269798]/10 transition-colors flex flex-col items-center gap-2"
                        >
                            <ShieldCheck size={28} />
                            <span className="font-medium text-sm">رخصة BICSL</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/exposure/new')}
                            className="p-3 bg-[#F7941D]/10 rounded-xl text-[#D67A0A] hover:bg-[#F7941D]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <Biohazard size={28} />
                            <span className="font-medium text-sm">تعرض مهني</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/outbreak')}
                            className="p-3 bg-[#DC2626]/10 rounded-xl text-[#B91C1C] hover:bg-[#DC2626]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <AlertTriangle size={28} />
                            <span className="font-medium text-sm">إدارة التفشي</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/isolation')}
                            className="p-3 bg-[#FCB614]/10 rounded-xl text-[#D49A0A] hover:bg-[#FCB614]/10 transition-colors flex flex-col items-center gap-2"
                        >
                            <BedDouble size={28} />
                            <span className="font-medium text-sm">دليل العزل</span>
                        </button>
                        <button
                            onClick={() => navigate('/ipc/analytics')}
                            className="p-3 bg-[#FCB614]/10 rounded-xl text-[#D49A0A] hover:bg-[#FCB614]/15 transition-colors flex flex-col items-center gap-2"
                        >
                            <Activity size={28} />
                            <span className="font-medium text-sm">التحليلات</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Alert Banner (if incidents exist) */}
            {stats && stats.activeIncidents > 0 && (
                <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-[#DC2626]" />
                        <div>
                            <p className="font-bold text-[#7F1D1D]">يوجد {stats.activeIncidents} حالة عدوى نشطة</p>
                            <p className="text-[#DC2626] text-sm">تتطلب المتابعة والإجراءات الفورية</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/ipc/incidents')}
                        className="px-4 py-2 bg-[#B91C1C] text-white rounded-lg hover:bg-[#B91C1C]"
                    >
                        عرض الحالات
                    </button>
                </div>
            )}
        </div>
    );
};

export default IPCDashboard;
