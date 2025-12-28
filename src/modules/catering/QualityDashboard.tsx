
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingDown, AlertTriangle, CheckCircle, Award } from 'lucide-react';

export const QualityDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDeductions: 0,
        compliantPercentage: 0,
        topViolations: [] as any[],
        recentEvals: [] as any[]
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Total Deductions (This Month)
            const startOfMonth = new Date();
            startOfMonth.setDate(1);

            const { data: evals } = await supabase
                .from('contractor_evaluations')
                .select('total_penalty_amount, evaluation_date, id, supplier:catering_suppliers(name)')
                .gte('evaluation_date', startOfMonth.toISOString());

            const total = evals?.reduce((sum, e) => sum + (e.total_penalty_amount || 0), 0) || 0;

            // 2. Top Violations
            const { data: answers } = await supabase
                .from('evaluation_answers')
                .select('criteria:evaluation_criteria(category)')
                .eq('status', 'non_compliant');

            // Mock aggregation (since supabase simplified query doesn't do GROUP BY easily without RPC)
            const violationCounts: Record<string, number> = {};
            answers?.forEach((a: any) => {
                const cat = a.criteria?.category || 'General';
                violationCounts[cat] = (violationCounts[cat] || 0) + 1;
            });

            const topChartData = Object.entries(violationCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setStats({
                totalDeductions: total,
                compliantPercentage: 85, // Mocked for now until detailed calc
                topViolations: topChartData.length > 0 ? topChartData : [
                    { name: 'النظافة', count: 5 }, { name: 'الطعام', count: 3 } // Mock fallback
                ],
                recentEvals: evals?.slice(0, 5) || []
            });

        } catch (error) {
            console.error("Error fetching dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-gray-50 min-h-screen p-6" dir="rtl">
            <h1 className="text-2xl font-bold text-[#14415A] mb-6">لوحة قيادة الجودة</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-r-4 border-red-500">
                    <p className="text-gray-500 text-sm font-medium mb-1">إجمالي الحسومات (شهري)</p>
                    <h3 className="text-3xl font-bold text-[#14415A]">{stats.totalDeductions} ريال</h3>
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2">
                        <TrendingDown className="w-4 h-4" />
                        <span>+12% عن الشهر الماضي</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-r-4 border-green-500">
                    <p className="text-gray-500 text-sm font-medium mb-1">نسبة الامتثال</p>
                    <h3 className="text-3xl font-bold text-[#14415A]">{stats.compliantPercentage}%</h3>
                    <div className="flex items-center gap-1 text-green-500 text-xs mt-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>أداء جيد جداً</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-r-4 border-yellow-500">
                    <p className="text-gray-500 text-sm font-medium mb-1">عدد المخالفات</p>
                    <h3 className="text-3xl font-bold text-[#14415A]">
                        {stats.topViolations.reduce((a, b) => a + b.count, 0)}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-r-4 border-blue-500">
                    <p className="text-gray-500 text-sm font-medium mb-1">التقييم العام للمتعهد</p>
                    <div className="flex items-center gap-2">
                        <h3 className="text-3xl font-bold text-[#14415A]">4.5/5</h3>
                        <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-[#14415A] mb-6">أكثر المخالفات شيوعاً</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topViolations}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#14415A" radius={[5, 5, 0, 0]}>
                                    {stats.topViolations.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#14415A' : '#F5961E'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Evals */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-[#14415A] mb-6">آخر التقييمات</h3>
                    <table className="w-full text-right text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">التاريخ</th>
                                <th className="p-3">المتعهد</th>
                                <th className="p-3">الحسم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {stats.recentEvals.map((ev: any) => (
                                <tr key={ev.id}>
                                    <td className="p-3">{new Date(ev.evaluation_date).toLocaleDateString('ar-SA')}</td>
                                    <td className="p-3 font-medium">{ev.supplier?.name}</td>
                                    <td className="p-3 text-red-600 font-bold">{ev.total_penalty_amount} ريال</td>
                                </tr>
                            ))}
                            {stats.recentEvals.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-400">لا توجد بيانات حديثة</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
