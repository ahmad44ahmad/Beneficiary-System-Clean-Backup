import React, { useEffect } from 'react';
import { Utensils, AlertTriangle, CheckCircle2, CloudFog, Loader2, FileText } from 'lucide-react';
import { useCateringLogic } from './useCateringLogic';
import { useNavigate } from 'react-router-dom';

// HRSD Colors
const COLORS = {
    primary: '#F5961E', // Pantone 1375 C
    secondary: '#FAB414', // Pantone 1235 C
    success: '#2DB473', // Pantone 3385 C
    teal: '#148287', // Pantone 2237 C
    navy: '#14415A', // Pantone 3025 C
};

export const CateringDashboard: React.FC = () => {
    const { loading, kpis, todaysMeals, refresh } = useCateringLogic();
    const navigate = useNavigate();

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen" dir="rtl">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#14415A]">لوحة قيادة الإعاشة والتغذية</h1>
                    <p className="text-gray-600">نظام إدارة الوجبات والمخزون الغذائي</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/catering/daily-log')}
                        className="px-4 py-2 bg-[#F5961E] text-white rounded-lg hover:bg-[#d98210] transition-colors font-medium flex items-center gap-2"
                    >
                        <Utensils className="w-5 h-5" />
                        تسجيل وجبات اليوم
                    </button>
                    <button
                        onClick={() => navigate('/catering/reports')}
                        className="px-4 py-2 bg-[#14415A] text-white rounded-lg hover:bg-[#0f3246] transition-colors font-medium flex items-center gap-2"
                    >
                        <FileText className="w-5 h-5" />
                        الجداول والتقارير
                    </button>
                    <div className="h-8 w-px bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => navigate('/catering/quality')}
                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        مراقبة الجودة
                    </button>
                    <button
                        onClick={() => navigate('/catering/quality-dashboard')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                    >
                        <Utensils className="w-5 h-5" />
                        لوحة القيادة
                    </button>
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'الوجبات المقدمة اليوم', value: kpis.totalMealsServed, color: COLORS.teal, icon: Utensils },
                    { label: 'خطط غذائية خاصة', value: kpis.specialDietsCount, color: COLORS.primary, icon: AlertTriangle },
                    { label: 'نسبة الاستهلاك (الرضا)', value: `${kpis.satisfactionRate}%`, color: COLORS.success, icon: CheckCircle2 },
                    { label: 'نسبة الهدر', value: `${kpis.wasteRate}%`, color: COLORS.navy, icon: CloudFog },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-t-4" style={{ borderColor: kpi.color }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
                                <h3 className="text-3xl font-bold" style={{ color: kpi.color }}>
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : kpi.value}
                                </h3>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50">
                                <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Log / Menu */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#14415A] mb-4">سجل الوجبات الأخير</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : todaysMeals.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">المستفيد</th>
                                        <th className="px-4 py-3">الوجبة</th>
                                        <th className="px-4 py-3">الحالة</th>
                                        <th className="px-4 py-3">الاستهلاك</th>
                                        <th className="px-4 py-3">الوقت</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {todaysMeals.map((meal) => (
                                        <tr key={meal.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{meal.beneficiary_name}</td>
                                            <td className="px-4 py-3">{meal.meal_type}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${meal.status === 'consumed' ? 'bg-green-100 text-green-800' :
                                                    meal.status === 'refused' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {meal.status === 'consumed' ? 'تــــم' :
                                                        meal.status === 'refused' ? 'رفـــض' : 'معلــق'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div className="bg-[#148287] h-2.5 rounded-full" style={{ width: `${meal.consumption}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-sm">{meal.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="border border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center text-gray-400">
                            <Utensils className="w-12 h-12 mb-2 opacity-20" />
                            <p>لا توجد وجبات مسجلة لليوم بعد</p>
                            <button onClick={() => navigate('/catering/daily-log')} className="mt-4 text-[#F5961E] hover:underline text-sm">ابدأ التسجيل الآن</button>
                        </div>
                    )}
                </div>

                {/* Alerts/Inventory */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-[#14415A] mb-4">تنبيهات المخاطر</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border-r-4 border-red-500">
                            <strong>نقص في المخزون:</strong> مياه شرب (عبوات)
                        </div>
                        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm border-r-4 border-yellow-500">
                            <strong>تذكير:</strong> تحديث بيانات الحساسية للمستفيدين الجدد
                        </div>
                        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border-r-4 border-blue-500">
                            <strong>قائمة الغد:</strong> تم اعتماد القائمة (أرز كبسة + دجاج)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
