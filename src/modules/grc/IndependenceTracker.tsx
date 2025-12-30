import React, { useState, useEffect } from 'react';
import {
    ArrowRight, AlertTriangle, TrendingUp, TrendingDown,
    Users, DollarSign, Heart, Scale, Building2,
    CheckCircle2, XCircle, AlertCircle, BarChart3,
    Home, Briefcase, Sun
} from 'lucide-react';
import { supabase } from '../../config/supabase';

// HRSD Official Colors
const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

interface ServicesGap {
    id: string;
    service_type: string;
    beneficiaries_needing: number;
    current_capacity: number;
    gap_count: number;
    gap_reason: string;
    responsible_agency: string;
    csr_dependency: boolean;
}

interface BudgetAnalysis {
    fiscal_year: string;
    rehabilitation_budget: number;
    personal_care_contracts: number;
    independence_ratio: number;
    dependency_ratio: number;
    analysis_notes: string;
}

interface HumanRightsItem {
    id: string;
    right_category: string;
    current_status: string;
    treated_as: string;
    agency_justification: string;
    actual_impact: string;
}

export const IndependenceTracker: React.FC = () => {
    const [servicesGap, setServicesGap] = useState<ServicesGap[]>([]);
    const [budget, setBudget] = useState<BudgetAnalysis | null>(null);
    const [humanRights, setHumanRights] = useState<HumanRightsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch services gap
            const { data: gapData } = await supabase
                .from('services_gap_analysis')
                .select('*');
            if (gapData) setServicesGap(gapData);

            // Fetch budget analysis
            const { data: budgetData } = await supabase
                .from('independence_budget_analysis')
                .select('*')
                .single();
            if (budgetData) setBudget(budgetData);

            // Fetch human rights compliance
            const { data: rightsData } = await supabase
                .from('human_rights_compliance')
                .select('*');
            if (rightsData) setHumanRights(rightsData);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getServiceIcon = (type: string) => {
        switch (type) {
            case 'home_care': return <Home className="w-5 h-5" />;
            case 'day_care': return <Sun className="w-5 h-5" />;
            case 'vocational_rehab': return <Briefcase className="w-5 h-5" />;
            default: return <Building2 className="w-5 h-5" />;
        }
    };

    const getServiceLabel = (type: string) => {
        switch (type) {
            case 'home_care': return 'الرعاية المنزلية';
            case 'day_care': return 'الرعاية النهارية';
            case 'vocational_rehab': return 'التأهيل المهني';
            default: return type;
        }
    };

    const getRightLabel = (category: string) => {
        switch (category) {
            case 'clothing_dignity': return 'كرامة الملبس';
            case 'skill_training': return 'التدريب على المهارات';
            case 'food_choice': return 'اختيار الطعام';
            default: return category;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
                    style={{ borderColor: `${HRSD.teal} transparent ${HRSD.teal} ${HRSD.teal}` }} />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">تتبع الاستقلالية</h1>
                        <p className="text-gray-500">تحليل فجوة الخدمات وميزانية التأهيل</p>
                    </div>
                </div>
            </div>

            {/* Budget Crisis Card */}
            {budget && (
                <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                        <h2 className="text-xl font-bold">فجوة الميزانية الحرجة</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {/* Dependency Spending */}
                        <div className="bg-white/20 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-5 h-5" />
                                <span className="text-sm opacity-90">إنفاق التبعية (يمنع الاستقلالية)</span>
                            </div>
                            <div className="text-4xl font-bold">
                                {budget.personal_care_contracts.toLocaleString()} <span className="text-lg">ريال</span>
                            </div>
                            <div className="mt-2 text-sm opacity-75">
                                عقود عمالة العناية الشخصية
                            </div>
                            <div className="mt-3 bg-white/10 rounded-lg p-2 text-center">
                                <span className="text-2xl font-bold">{budget.dependency_ratio}%</span>
                                <span className="text-sm mr-1">من الميزانية</span>
                            </div>
                        </div>

                        {/* Independence Spending */}
                        <div className="bg-white/20 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5" />
                                <span className="text-sm opacity-90">إنفاق الاستقلالية (تأهيل وتدريب)</span>
                            </div>
                            <div className="text-4xl font-bold">
                                {budget.rehabilitation_budget.toLocaleString()} <span className="text-lg">ريال</span>
                            </div>
                            <div className="mt-2 text-sm opacity-75">
                                برامج التأهيل والتدريب المهني
                            </div>
                            <div className="mt-3 bg-white/10 rounded-lg p-2 text-center">
                                <span className="text-2xl font-bold">{budget.independence_ratio}%</span>
                                <span className="text-sm mr-1">من الميزانية</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/10 rounded-lg text-sm">
                        💡 {budget.analysis_notes}
                    </div>
                </div>
            )}

            {/* Services Gap */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b flex items-center gap-2" style={{ backgroundColor: `${HRSD.navy}10` }}>
                    <Building2 className="w-5 h-5" style={{ color: HRSD.navy }} />
                    <h2 className="font-bold text-gray-800">فجوة الخدمات بالباحة</h2>
                </div>

                <div className="divide-y">
                    {servicesGap.map((gap) => (
                        <div key={gap.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: `${HRSD.orange}20` }}>
                                    {getServiceIcon(gap.service_type)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-800">{getServiceLabel(gap.service_type)}</h3>
                                        {gap.csr_dependency && (
                                            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                                معلق على CSR
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">{gap.gap_reason}</p>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-red-500" />
                                            <span className="text-gray-600">يحتاجون:</span>
                                            <span className="font-bold text-red-600">{gap.beneficiaries_needing}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-600">متوفر:</span>
                                            <span className="font-bold text-green-600">{gap.current_capacity}</span>
                                        </div>
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100">
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-gray-600">الفجوة:</span>
                                            <span className="font-bold text-red-600">{gap.gap_count}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-500">
                                        الجهة المسؤولة: <span className="font-medium">{gap.responsible_agency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Human Rights Compliance */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b flex items-center gap-2" style={{ backgroundColor: `${HRSD.teal}10` }}>
                    <Scale className="w-5 h-5" style={{ color: HRSD.teal }} />
                    <h2 className="font-bold text-gray-800">حقوق الإنسان vs رغبات اختيارية</h2>
                </div>

                <div className="p-4">
                    <table className="w-full">
                        <thead>
                            <tr className="text-right text-sm text-gray-500 border-b">
                                <th className="pb-3 font-medium">الحق</th>
                                <th className="pb-3 font-medium">الوضع الحالي</th>
                                <th className="pb-3 font-medium">يُعامل كـ</th>
                                <th className="pb-3 font-medium">التبرير</th>
                                <th className="pb-3 font-medium">الأثر الفعلي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {humanRights.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-3 font-medium text-gray-800">
                                        {getRightLabel(item.right_category)}
                                    </td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 text-xs rounded-lg bg-red-100 text-red-700">
                                            {item.current_status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {item.treated_as === 'preference' ? (
                                            <span className="flex items-center gap-1 text-yellow-600">
                                                <XCircle className="w-4 h-4" />
                                                رغبة
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                حق
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 text-sm text-gray-600">
                                        {item.agency_justification}
                                    </td>
                                    <td className="py-3">
                                        <span className="text-sm text-red-600 font-medium">
                                            {item.actual_impact}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Comparison Section */}
            <div className="bg-gradient-to-l from-[rgb(20,65,90)] to-[rgb(20,130,135)] rounded-2xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    مقارنة مع الخدمات الخارجية
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4">
                        <h3 className="font-bold mb-2">مبادرة تمكين (الضمان الاجتماعي)</h3>
                        <ul className="text-sm space-y-1 opacity-90">
                            <li>✅ برنامج مهني شهري مختلف</li>
                            <li>✅ الأمن السيبراني</li>
                            <li>✅ بيوت ذوي الإعاقة</li>
                            <li>✅ الرعاية الممتدة</li>
                        </ul>
                    </div>

                    <div className="bg-white/20 rounded-xl p-4">
                        <h3 className="font-bold mb-2">مركز التأهيل الشامل (الباحة)</h3>
                        <ul className="text-sm space-y-1 opacity-90">
                            <li>❌ لا رعاية منزلية</li>
                            <li>❌ لا رعاية نهارية داخلية</li>
                            <li>❌ لا تأهيل مهني</li>
                            <li>❌ معلق على CSR</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
