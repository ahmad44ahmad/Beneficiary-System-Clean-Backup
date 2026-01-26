import React from 'react';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useGRCStats } from '../hooks/useGrcStats';
import { useUnifiedData } from '../context/UnifiedDataContext';
import {
    LayoutDashboard,
    Users,
    FileCheck,
    Target,
    AlertTriangle,
    Clock,
    Activity,
    TrendingUp,
    CheckCircle2,
    Shield,
    FileWarning
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { AccountabilityAlerts } from '../modules/grc/AccountabilityAlerts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Helper for Arabic translations of types
const typeTranslations: Record<string, string> = {
    medical: 'الخدمات الطبية',
    social: 'الرعاية الاجتماعية',
    psychological: 'الدعم النفسي',
    physiotherapy: 'العلاج الطبيعي',
    occupational: 'العلاج الوظيفي'
};

const typeColors: Record<string, string> = {
    medical: 'bg-blue-500',
    social: 'bg-green-500',
    psychological: 'bg-purple-500',
    physiotherapy: 'bg-orange-500',
    occupational: 'bg-teal-500'
};

export const Dashboard: React.FC = () => {
    const { kpis, departmentPerformance, alerts } = useDashboardMetrics();
    const { loading } = useUnifiedData();

    if (loading) {
        return (
            <LoadingSpinner
                fullScreen={true}
                size="lg"
                message="جاري تحميل البيانات..."
            />
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <LayoutDashboard className="w-8 h-8 text-blue-600" />
                        لوحة القياس التنفيذية (Executive Dashboard)
                    </h1>
                    <p className="text-gray-500 mt-1 mr-11">نظرة شاملة على الأداء التشغيلي ومؤشرات الجودة (ISO 9001)</p>
                </div>
                <div className="text-left">
                    <div className="text-sm text-gray-400">آخر تحديث</div>
                    <div className="font-mono text-lg font-bold text-gray-700">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            {/* Accountability Alerts - Top Priority */}
            <AccountabilityAlerts compact={false} />

            {/* 1. Real-Time KPIs (The Pulse) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Active Beneficiaries */}
                <Card className="p-6 border-r-4 border-r-blue-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">المستفيدين النشطين</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.totalBeneficiaries}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-green-600">
                        <TrendingUp className="w-3 h-3 ml-1" />
                        <span className="font-medium">100%</span>
                        <span className="text-gray-400 mr-1">مكتمل البيانات</span>
                    </div>
                </Card>

                {/* Plan Compliance */}
                <Card className="p-6 border-r-4 border-r-green-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">نسبة تغطية الخطط</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.planComplianceRate}%</h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                        {kpis.activePlansCount} خطة معتمدة من أصل {kpis.totalBeneficiaries}
                    </div>
                </Card>

                {/* Goal Achievement */}
                <Card className="p-6 border-r-4 border-r-purple-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">متوسط إنجاز الأهداف</p>
                            <h3 className="text-3xl font-bold text-gray-900">{kpis.overallGoalAchievementRate}%</h3>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Target className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${kpis.overallGoalAchievementRate}%` }}
                        ></div>
                    </div>
                </Card>

                {/* Critical Alerts */}
                <Card className="p-6 border-r-4 border-r-red-500 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">حالات حرجة (High Risk)</p>
                            <h3 className="text-3xl font-bold text-red-600">{alerts.criticalCasesCount}</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-red-500 font-medium animate-pulse">
                        يتطلب تدخل فوري
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Department Performance (The Analysis) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-white shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-500" />
                            أداء الأقسام (معدل إنجاز الأهداف)
                        </h3>
                        <div className="space-y-6">
                            {departmentPerformance.map((dept) => (
                                <div key={dept.type}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700">{typeTranslations[dept.type] || dept.type}</span>
                                        <span className="text-sm font-bold text-gray-900">{dept.avgProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${typeColors[dept.type] || 'bg-gray-500'}`}
                                            style={{ width: `${dept.avgProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            {departmentPerformance.length === 0 && (
                                <p className="text-center text-gray-400 py-4">لا توجد بيانات كافية للتحليل</p>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions / Recent Activity Placeholder */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-blue-50 border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <FileCheck className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="font-medium text-blue-900">اعتماد الخطط الجديدة</span>
                            </div>
                            <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{kpis.draftPlansCount}</span>
                        </Card>
                        <Card className="p-4 bg-purple-50 border border-purple-100 flex items-center justify-between cursor-pointer hover:bg-purple-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <Target className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="font-medium text-purple-900">مراجعة الأهداف المتعثرة</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 3. Operational Alerts (Risk Management) */}
                <div className="space-y-6">
                    <Card className="p-0 bg-white shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                المهام المعلقة
                            </h3>
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                {alerts.pendingDirectorApprovals}
                            </span>
                        </div>
                        <div className="divide-y">
                            {alerts.pendingDirectorApprovals > 0 ? (
                                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm text-gray-900">اعتماد الخطة التأهيلية</span>
                                        <span className="text-xs text-gray-400">منذ يومين</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">المستفيد: لاحق يحيى (1401)</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">طبي</span>
                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">اجتماعي</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                                    لا توجد مهام معلقة
                                </div>
                            )}

                            {/* Static Example for "System Health" or other alerts */}
                            <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-yellow-400">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm text-gray-900">تحديث بيانات الضمان الاجتماعي</span>
                                    <span className="text-xs text-gray-400">مجدول</span>
                                </div>
                                <p className="text-xs text-gray-500">مطلوب تحديث بيانات 5 مستفيدين</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 text-center border-t">
                            <button className="text-xs text-blue-600 font-medium hover:underline">عرض كل المهام</button>
                        </div>
                    </Card>

                    {/* System Status / Mini Calendar */}
                    <Card className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-sm">حالة النظام</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-gray-300">متصل</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-xs text-gray-300">
                            <div className="flex justify-between">
                                <span>قاعدة البيانات</span>
                                <span className="text-green-400">مستقرة</span>
                            </div>
                            <div className="flex justify-between">
                                <span>المزامنة السحابية</span>
                                <span className="text-green-400">تمت (10:00 ص)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>نسخة احتياطية</span>
                                <span className="text-blue-400">جاري التجهيز...</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
