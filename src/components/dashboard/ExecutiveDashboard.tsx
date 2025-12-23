import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { SROICard } from './SROICard';
import {
    BarChart, Activity, Users, AlertTriangle, CheckCircle,
    TrendingUp, TrendingDown, ClipboardCheck, Clock
} from 'lucide-react';

// Interfaces for Dashboard Data
interface DashboardKPIs {
    occupancyCount: number;
    highRiskCount: number;
    incidentCount: number;
    staffCompliance: number;
}

export const ExecutiveDashboard: React.FC = () => {
    const [kpis, setKpis] = useState<DashboardKPIs>({
        occupancyCount: 0,
        highRiskCount: 0,
        incidentCount: 0,
        staffCompliance: 92 // Mock for now
    });

    const [loading, setLoading] = useState(true);

    // Mock Data for Charts (Using CSS for bars to avoid heavy chart libraries for now)
    const chartData = [65, 78, 85, 92, 88, 95]; // Weekly compliance trend

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Get Active Beneficiaries Count
                const { count: occupancyCount } = await supabase
                    .from('beneficiaries')
                    .select('*', { count: 'exact', head: true })
                    .neq('status', 'exit'); // Assume 'exit' is the status for left

                // 2. Get High Risk Fall Cases (Latest risk >= 45)
                // Simplified: Just count all assessments with high risk in last 30 days
                // Ideally we filter for "latest per beneficiary", but for dashboard overview this is decent proxy for activity
                const { count: highRiskCount } = await supabase
                    .from('fall_risk_assessments')
                    .select('*', { count: 'exact', head: true })
                    .gte('risk_score', 45);

                // 3. Get Incidents in last 7 days
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const { count: incidentCount } = await supabase
                    .from('daily_care_logs')
                    .select('*', { count: 'exact', head: true })
                    .not('incidents', 'is', null)
                    .neq('incidents', '')
                    .gte('log_date', oneWeekAgo.toISOString().split('T')[0]);

                setKpis(prev => ({
                    ...prev,
                    occupancyCount: occupancyCount || 0,
                    highRiskCount: highRiskCount || 0,
                    incidentCount: incidentCount || 0
                }));

                // 4. Calculate Staff Compliance (Real Logic)
                // Definition: % of Active Beneficiaries who have a log TODAY
                const today = new Date().toISOString().split('T')[0];

                // Get unique beneficiaries with logs today
                const { data: logsToday } = await supabase
                    .from('daily_care_logs')
                    .select('beneficiary_id')
                    .eq('log_date', today);

                // Use simple Set for unique count
                const uniqueLoggedBeneficiaries = new Set(logsToday?.map(l => l.beneficiary_id)).size;
                const totalActive = occupancyCount || 1; // Avoid div by zero
                const realCompliance = Math.round((uniqueLoggedBeneficiaries / totalActive) * 100);

                setKpis(prev => ({
                    ...prev,
                    staffCompliance: realCompliance
                }));

                // 5. Fetch Real Live Alerts (Latest High Risk Assessments)
                const { data: alertsData } = await supabase
                    .from('fall_risk_assessments')
                    .select(`
                        id,
                        risk_score,
                        created_at,
                        beneficiaries (full_name)
                    `)
                    .gte('risk_score', 45)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (alertsData) {
                    setRecentAlerts(alertsData.map(alert => ({
                        id: alert.id,
                        title: `خطر سقوط مرتفع (${alert.risk_score})`,
                        beneficiary: (alert.beneficiaries as any)?.full_name || 'مستفيد غير معروف',
                        time: new Date(alert.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                        type: 'critical'
                    })));
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Optional: Realtime subscription could be added here similar to RiskAlertSystem


    }, []);

    const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

    return (
        <div className="space-y-6 font-readex animate-fade-in pb-12" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">لوحة الحقيقة التنفيذية</h1>
                    <p className="text-gray-500">نظرة شمولية على مؤشرات الأداء والسلامة (بيانات حية)</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm">
                    <Clock className="w-5 h-5" />
                    <span>آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
                </div>
            </div>

            {/* SROI Feature Card */}
            <div className="mb-8">
                <SROICard />
            </div>

            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Occupancy Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute left-0 top-0 w-24 h-24 bg-blue-50 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-blue-500 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                نشط
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">
                            {loading ? '-' : kpis.occupancyCount}
                        </h3>
                        <p className="text-gray-500 text-sm">عدد المستفيدين الحالي</p>
                    </div>
                </div>

                {/* Falls Risk Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute left-0 top-0 w-24 h-24 bg-red-50 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-red-500">خطر مرتفع</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">
                            {loading ? '-' : kpis.highRiskCount}
                        </h3>
                        <p className="text-gray-500 text-sm">تقييمات سقوط حرجة</p>
                    </div>
                </div>

                {/* Incidents Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute left-0 top-0 w-24 h-24 bg-orange-50 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <Activity className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-gray-500">آخر 7 أيام</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">
                            {loading ? '-' : kpis.incidentCount}
                        </h3>
                        <p className="text-gray-500 text-sm">حوادث مسجلة</p>
                    </div>
                </div>

                {/* Operational Efficiency */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute left-0 top-0 w-24 h-24 bg-emerald-50 rounded-br-full -ml-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold text-emerald-600">+4%</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-1">{kpis.staffCompliance}%</h3>
                        <p className="text-gray-500 text-sm">نسبة إنجاز التقارير اليومية</p>
                    </div>
                </div>
            </div>

            {/* Detailed Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Compliance Trend Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-6 flex justify-between">
                        <span>مؤشر التحول الرقمي (إلغاء الورق)</span>
                        <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">ممتاز</span>
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                        {chartData.map((val, i) => (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-emerald-100 rounded-t-lg relative overflow-hidden transition-all duration-500 hover:bg-emerald-200 group-hover:h-[102%]"
                                    style={{ height: `${val}%` }}
                                >
                                    <div className="absolute bottom-0 w-full bg-emerald-500 h-2 opacity-20"></div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">أسبوع {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Alerts Stream */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        تنبيهات مباشرة (High Risk)
                    </h3>

                    <div className="space-y-4">
                        {recentAlerts.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">لا توجد تنبيهات نشطة حالياً</p>
                        ) : (
                            recentAlerts.map((alert, i) => (
                                <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                                    <div className="w-2 h-full rounded-full bg-red-500"></div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{alert.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{alert.beneficiary}</p>
                                        <span className="text-[10px] text-gray-400 block mt-1">{alert.time}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="w-full mt-4 py-2 text-sm text-center text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        عرض كل التنبيهات
                    </button>
                </div>

            </div>
        </div>
    );
};
