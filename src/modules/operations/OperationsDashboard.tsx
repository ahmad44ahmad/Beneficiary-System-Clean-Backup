import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Wrench,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    Trash2,
    Calendar,
    Settings,
    ClipboardList,
    Building2,
    ArrowLeft,
    Plus,
    BarChart3
} from 'lucide-react';

interface DashboardStats {
    totalAssets: number;
    activeAssets: number;
    pendingMaintenance: number;
    completedThisMonth: number;
    overduePreventive: number;
    wasteThisMonth: number;
}

export const OperationsDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalAssets: 0,
        activeAssets: 0,
        pendingMaintenance: 0,
        completedThisMonth: 0,
        overduePreventive: 0,
        wasteThisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentRequests, setRecentRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const today = new Date();
        const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

        try {
            // Fetch asset stats
            const { data: assets, count: totalAssets } = await supabase
                .from('om_assets')
                .select('*', { count: 'exact' });

            const activeAssets = assets?.filter(a => a.status === 'active').length || 0;

            // Fetch maintenance requests
            const { data: requests } = await supabase
                .from('om_maintenance_requests')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            const pendingMaintenance = requests?.filter(r => r.status === 'pending' || r.status === 'in_progress').length || 0;
            const completedThisMonth = requests?.filter(r =>
                r.status === 'completed' && r.completed_at >= monthStart
            ).length || 0;

            // Fetch overdue preventive
            const { data: preventive } = await supabase
                .from('om_preventive_schedules')
                .select('*')
                .lt('next_due_date', today.toISOString().split('T')[0])
                .eq('status', 'active');

            // Fetch waste records
            const { data: waste } = await supabase
                .from('om_waste_records')
                .select('quantity')
                .gte('record_date', monthStart);

            const wasteThisMonth = waste?.reduce((sum, w) => sum + (w.quantity || 0), 0) || 0;

            setStats({
                totalAssets: totalAssets || 0,
                activeAssets,
                pendingMaintenance,
                completedThisMonth,
                overduePreventive: preventive?.length || 0,
                wasteThisMonth
            });
            setRecentRequests(requests || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const kpiCards = [
        {
            title: 'إجمالي الأصول',
            value: stats.totalAssets,
            subtitle: `${stats.activeAssets} أصل نشط`,
            icon: Building2,
            color: 'bg-blue-500',
            trend: null
        },
        {
            title: 'طلبات الصيانة المعلقة',
            value: stats.pendingMaintenance,
            subtitle: 'بحاجة للمتابعة',
            icon: Wrench,
            color: 'bg-amber-500',
            trend: null
        },
        {
            title: 'مكتملة هذا الشهر',
            value: stats.completedThisMonth,
            subtitle: 'طلب صيانة',
            icon: CheckCircle2,
            color: 'bg-green-500',
            trend: '+12%'
        },
        {
            title: 'صيانة وقائية متأخرة',
            value: stats.overduePreventive,
            subtitle: 'تحتاج إجراء فوري',
            icon: AlertTriangle,
            color: stats.overduePreventive > 0 ? 'bg-red-500' : 'bg-slate-400',
            trend: null
        },
        {
            title: 'المخلفات هذا الشهر',
            value: `${stats.wasteThisMonth} كجم`,
            subtitle: 'إجمالي النفايات',
            icon: Trash2,
            color: 'bg-purple-500',
            trend: '-5%'
        }
    ];

    const quickActions = [
        { title: 'طلب صيانة جديد', icon: Plus, link: '/operations/maintenance/new', color: 'bg-hrsd-primary' },
        { title: 'سجل الأصول', icon: Building2, link: '/operations/assets', color: 'bg-blue-600' },
        { title: 'الصيانة الوقائية', icon: Calendar, link: '/operations/preventive', color: 'bg-green-600' },
        { title: 'إدارة المخلفات', icon: Trash2, link: '/operations/waste', color: 'bg-purple-600' },
        { title: 'تقييم المقاولين', icon: ClipboardList, link: '/operations/evaluations', color: 'bg-amber-600' },
    ];

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-indigo-100 text-indigo-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-gray-100 text-gray-800'
        };
        const labels: Record<string, string> = {
            pending: 'قيد الانتظار',
            approved: 'معتمد',
            in_progress: 'قيد التنفيذ',
            completed: 'مكتمل',
            cancelled: 'ملغي'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للرئيسية
                    </Link>
                    <h1 className="text-3xl font-bold text-hrsd-primary flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        وحدة التشغيل والصيانة
                    </h1>
                    <p className="text-gray-500 mt-1">إدارة الأصول والصيانة والمخلفات</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/operations/maintenance/new"
                        className="px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        طلب صيانة جديد
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-lg ${kpi.color} text-white`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            {kpi.trend && (
                                <span className={`text-sm font-medium ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-gray-800">{loading ? '...' : kpi.value}</p>
                            <p className="text-sm text-gray-500">{kpi.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{kpi.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-hrsd-primary" />
                    إجراءات سريعة
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link
                            key={idx}
                            to={action.link}
                            className={`${action.color} text-white rounded-xl p-4 text-center hover:opacity-90 transition-opacity shadow-md`}
                        >
                            <action.icon className="w-8 h-8 mx-auto mb-2" />
                            <span className="text-sm font-medium">{action.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Maintenance Requests */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-hrsd-primary" />
                        آخر طلبات الصيانة
                    </h2>
                    <Link to="/operations/maintenance" className="text-hrsd-primary hover:underline text-sm">
                        عرض الكل
                    </Link>
                </div>
                {loading ? (
                    <div className="text-center py-8 text-gray-400">جاري التحميل...</div>
                ) : recentRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Wrench className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        لا توجد طلبات صيانة حتى الآن
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-3 text-right">رقم الطلب</th>
                                    <th className="p-3 text-right">العنوان</th>
                                    <th className="p-3 text-center">النوع</th>
                                    <th className="p-3 text-center">الأولوية</th>
                                    <th className="p-3 text-center">الحالة</th>
                                    <th className="p-3 text-right">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-mono text-sm">{req.request_number}</td>
                                        <td className="p-3">{req.title}</td>
                                        <td className="p-3 text-center text-sm">{req.request_type}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-1 rounded text-xs ${req.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                                    req.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                                        req.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">{getStatusBadge(req.status)}</td>
                                        <td className="p-3 text-sm text-gray-500">
                                            {new Date(req.created_at).toLocaleDateString('ar-SA')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperationsDashboard;
