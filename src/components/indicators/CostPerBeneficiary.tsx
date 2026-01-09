import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign, ChevronLeft, TrendingUp, PieChart as PieChartIcon,
    Users, Utensils, Zap, Droplets, Wrench, RefreshCw
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface CostData {
    cost_month: string;
    cost_category: string;
    amount: number;
    beneficiary_count: number;
}

export const CostPerBeneficiary: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [costData, setCostData] = useState<CostData[]>([]);

    // Demo data
    const demoCostData: CostData[] = [
        { cost_month: '2025-10-01', cost_category: 'رواتب', amount: 450000, beneficiary_count: 120 },
        { cost_month: '2025-10-01', cost_category: 'غذاء', amount: 85000, beneficiary_count: 120 },
        { cost_month: '2025-10-01', cost_category: 'كهرباء', amount: 35000, beneficiary_count: 120 },
        { cost_month: '2025-10-01', cost_category: 'مياه', amount: 8000, beneficiary_count: 120 },
        { cost_month: '2025-10-01', cost_category: 'صيانة', amount: 25000, beneficiary_count: 120 },
        { cost_month: '2025-11-01', cost_category: 'رواتب', amount: 450000, beneficiary_count: 118 },
        { cost_month: '2025-11-01', cost_category: 'غذاء', amount: 82000, beneficiary_count: 118 },
        { cost_month: '2025-11-01', cost_category: 'كهرباء', amount: 38000, beneficiary_count: 118 },
        { cost_month: '2025-11-01', cost_category: 'مياه', amount: 7500, beneficiary_count: 118 },
        { cost_month: '2025-11-01', cost_category: 'صيانة', amount: 42000, beneficiary_count: 118 },
        { cost_month: '2025-12-01', cost_category: 'رواتب', amount: 455000, beneficiary_count: 122 },
        { cost_month: '2025-12-01', cost_category: 'غذاء', amount: 88000, beneficiary_count: 122 },
        { cost_month: '2025-12-01', cost_category: 'كهرباء', amount: 32000, beneficiary_count: 122 },
        { cost_month: '2025-12-01', cost_category: 'مياه', amount: 8500, beneficiary_count: 122 },
        { cost_month: '2025-12-01', cost_category: 'صيانة', amount: 18000, beneficiary_count: 122 },
    ];

    useEffect(() => {
        const fetchCosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('cost_tracking')
                .select('*')
                .order('cost_month', { ascending: true });

            if (error || !data || data.length === 0) {
                setCostData(demoCostData);
            } else {
                setCostData(data);
            }
            setLoading(false);
        };
        fetchCosts();
    }, []);

    // Calculate monthly totals
    const monthlyTotals = costData.reduce((acc, item) => {
        const month = item.cost_month;
        if (!acc[month]) {
            acc[month] = { total: 0, beneficiaries: item.beneficiary_count, categories: {} };
        }
        acc[month].total += item.amount;
        acc[month].categories[item.cost_category] = item.amount;
        return acc;
    }, {} as Record<string, { total: number; beneficiaries: number; categories: Record<string, number> }>);

    const latestMonth = Object.keys(monthlyTotals).sort().pop() || '';
    const latestData = monthlyTotals[latestMonth] || { total: 0, beneficiaries: 1, categories: {} };
    const dailyCostPerBeneficiary = latestData.total / latestData.beneficiaries / 30;

    // Prepare chart data
    const barChartData = Object.entries(monthlyTotals).map(([month, data]) => ({
        month: new Date(month).toLocaleDateString('ar-SA', { month: 'short' }),
        total: Math.round(data.total / data.beneficiaries / 30),
        beneficiaries: data.beneficiaries,
    }));

    const pieChartData = Object.entries(latestData.categories).map(([category, amount]) => ({
        name: category,
        value: amount,
    }));

    const COLORS = ['rgb(20, 130, 135)', 'rgb(245, 150, 30)', 'rgb(45, 180, 115)', 'rgb(20, 65, 90)', 'rgb(250, 180, 20)'];

    const categoryIcons: Record<string, React.ReactNode> = {
        'رواتب': <Users className="w-5 h-5" />,
        'غذاء': <Utensils className="w-5 h-5" />,
        'كهرباء': <Zap className="w-5 h-5" />,
        'مياه': <Droplets className="w-5 h-5" />,
        'صيانة': <Wrench className="w-5 h-5" />,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-gold to-hrsd-orange rounded-xl">
                        <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر التكلفة/المستفيد</h1>
                        <p className="text-hierarchy-small text-gray-500">تحليل التكاليف وجاهزية الخصخصة</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mr-auto p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            ) : (
                <>
                    {/* Main Cost Card */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-2xl p-6 text-white col-span-1 md:col-span-2">
                            <p className="text-white/80 text-sm mb-2">تكلفة المستفيد اليومية</p>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold">{Math.round(dailyCostPerBeneficiary)}</span>
                                <span className="text-2xl mb-1">ريال/يوم</span>
                            </div>
                            <p className="text-sm mt-4 text-white/80">
                                إجمالي شهري: {latestData.total.toLocaleString()} ريال
                            </p>
                            <p className="text-sm text-white/80">
                                عدد المستفيدين: {latestData.beneficiaries}
                            </p>
                        </div>

                        <div className="hrsd-card">
                            <p className="text-hierarchy-small text-gray-500 mb-2">تكلفة سنوية متوقعة</p>
                            <p className="text-3xl font-bold text-hrsd-navy">
                                {Math.round(dailyCostPerBeneficiary * 365 * latestData.beneficiaries / 1000000).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-500">مليون ريال</p>
                        </div>

                        <div className="hrsd-card">
                            <p className="text-hierarchy-small text-gray-500 mb-2">سعر الخصخصة المقترح</p>
                            <p className="text-3xl font-bold text-hrsd-gold">
                                {Math.round(dailyCostPerBeneficiary * 1.15)}
                            </p>
                            <p className="text-sm text-gray-500">ريال/مستفيد/يوم (+15%)</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-hrsd-teal" />
                                اتجاه التكلفة اليومية
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => [`${value} ريال`, 'تكلفة/مستفيد/يوم']} />
                                    <Bar dataKey="total" fill="rgb(20, 130, 135)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-hrsd-gold" />
                                توزيع التكاليف
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} ريال`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="hrsd-card">
                        <h3 className="text-hierarchy-subheading text-gray-800 mb-4">تفصيل التكاليف حسب الفئة</h3>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            {Object.entries(latestData.categories).map(([category, amount], idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS[idx % COLORS.length] + '20', color: COLORS[idx % COLORS.length] }}>
                                        {categoryIcons[category] || <DollarSign className="w-5 h-5" />}
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">{amount.toLocaleString()}</p>
                                    <p className="text-hierarchy-small text-gray-500">{category}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {Math.round(amount / latestData.beneficiaries / 30)} ريال/مستفيد/يوم
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CostPerBeneficiary;
