import React from 'react';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { useBeneficiaries } from '../hooks/useBeneficiaries';
import {
    LayoutDashboard,
    Users,
    FileCheck,
    Target,
    AlertTriangle,
    Clock,
    Activity,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { AccountabilityAlerts } from '../modules/grc/AccountabilityAlerts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RiskPredictionCard } from '../components/dashboard/RiskPredictionCard';

// Helper for Arabic translations of types
const typeTranslations: Record<string, string> = {
    medical: 'الخدمات الطبية',
    social: 'الرعاية الاجتماعية',
    psychological: 'الدعم النفسي',
    physiotherapy: 'العلاج الطبيعي',
    occupational: 'العلاج الوظيفي'
};

// Department type → HRSD palette accent. No purple/blue (off-palette);
// instead use teal/green/gold/orange/navy from the official set.
const typeColors: Record<string, string> = {
    medical: 'bg-[#269798]',       // HRSD teal
    social: 'bg-[#2BB574]',        // HRSD green
    psychological: 'bg-[#FCB614]', // HRSD gold (was off-palette purple)
    physiotherapy: 'bg-[#F7941D]', // HRSD orange
    occupational: 'bg-[#0F3144]',  // HRSD navy
};

export const Dashboard: React.FC = () => {
    const { kpis, departmentPerformance, alerts } = useDashboardMetrics();
    const { data: beneficiaries = [], isLoading: loading } = useBeneficiaries();

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
        <div className="p-6 bg-gray-50 dark:bg-transparent min-h-screen font-sans" dir="rtl">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                            <LayoutDashboard className="w-8 h-8 text-white" />
                        </div>
                        لوحة القياس التنفيذية (Executive Dashboard)
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 mr-16">نظرة شاملة على الأداء التشغيلي ومؤشرات الجودة (ISO 9001)</p>
                </div>
                <div className="text-left">
                    <div className="text-sm text-gray-400 dark:text-slate-500">آخر تحديث</div>
                    <div className="font-mono text-lg font-bold text-gray-700 dark:text-slate-300">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            </div>

            {/* Accountability Alerts - Top Priority */}
            <AccountabilityAlerts compact={false} />

            {/* 1. Real-Time KPIs (The Pulse) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Active Beneficiaries */}
                <Card className="p-6 border-r-4 border-r-[#269798] shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-hrsd-cool-gray dark:text-slate-400 mb-1">المستفيدين النشطين</p>
                            <h3 className="text-3xl font-bold text-hrsd-navy dark:text-white">{kpis.totalBeneficiaries}</h3>
                        </div>
                        <div className="p-2 bg-[#269798]/10 rounded-lg">
                            <Users className="w-6 h-6 text-[#269798]" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-[#2BB574]">
                        <TrendingUp className="w-3 h-3 ml-1" />
                        <span className="font-medium">100%</span>
                        <span className="text-hrsd-cool-gray mr-1">مكتمل البيانات</span>
                    </div>
                </Card>

                {/* Plan Compliance */}
                <Card className="p-6 border-r-4 border-r-[#2BB574] shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-hrsd-cool-gray dark:text-slate-400 mb-1">نسبة تغطية الخطط</p>
                            <h3 className="text-3xl font-bold text-hrsd-navy dark:text-white">{kpis.planComplianceRate}%</h3>
                        </div>
                        <div className="p-2 bg-[#2BB574]/10 rounded-lg">
                            <FileCheck className="w-6 h-6 text-[#2BB574]" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-hrsd-cool-gray">
                        {kpis.activePlansCount} خطة معتمدة من أصل {kpis.totalBeneficiaries}
                    </div>
                </Card>

                {/* Goal Achievement — switched from off-palette purple to HRSD gold. */}
                <Card className="p-6 border-r-4 border-r-[#FCB614] shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-hrsd-cool-gray dark:text-slate-400 mb-1">متوسط إنجاز الأهداف</p>
                            <h3 className="text-3xl font-bold text-hrsd-navy dark:text-white">{kpis.overallGoalAchievementRate}%</h3>
                        </div>
                        <div className="p-2 bg-[#FCB614]/10 rounded-lg">
                            <Target className="w-6 h-6 text-[#FCB614]" />
                        </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="h-full bg-[#FCB614] rounded-full transition-all"
                            style={{ width: `${kpis.overallGoalAchievementRate}%` }}
                        />
                    </div>
                </Card>

                {/* Critical Alerts — semantic red allowed for life-safety. */}
                <Card className="p-6 border-r-4 border-r-[#DC2626] shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-hrsd-cool-gray dark:text-slate-400 mb-1">حالات حرجة (High Risk)</p>
                            <h3 className="text-3xl font-bold text-[#DC2626]">{alerts.criticalCasesCount}</h3>
                        </div>
                        <div className="p-2 bg-[#DC2626]/10 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-[#DC2626] font-medium">
                        يتطلب تدخل فوري
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Department Performance (The Analysis) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-white dark:bg-slate-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                            أداء الأقسام (معدل إنجاز الأهداف)
                        </h3>
                        <div className="space-y-6">
                            {departmentPerformance.map((dept) => (
                                <div key={dept.type}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{typeTranslations[dept.type] || dept.type}</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{dept.avgProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`progress-bar rounded-full ${typeColors[dept.type] || 'bg-gray-500'}`}
                
                                            style={{ '--progress-width': `${dept.avgProgress}%` } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            ))}
                            {departmentPerformance.length === 0 && (
                                <p className="text-center text-gray-400 py-4">لا توجد بيانات كافية للتحليل</p>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-[#269798]/10 border border-[#269798]/30 flex items-center justify-between cursor-pointer hover:bg-[#269798]/15 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm">
                                    <FileCheck className="w-5 h-5 text-[#269798]" />
                                </div>
                                <span className="font-medium text-hrsd-navy">اعتماد الخطط الجديدة</span>
                            </div>
                            <span className="bg-[#269798] text-white text-xs font-bold px-2 py-1 rounded-full">{kpis.draftPlansCount}</span>
                        </Card>
                        <Card className="p-4 bg-[#FCB614]/10 border border-[#FCB614]/30 flex items-center justify-between cursor-pointer hover:bg-[#FCB614]/15 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm">
                                    <Target className="w-5 h-5 text-[#FCB614]" />
                                </div>
                                <span className="font-medium text-hrsd-navy">مراجعة الأهداف المتعثرة</span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 3. Operational Alerts (Risk Management) */}
                <div className="space-y-6">
                    {/* RISK PREDICTION ENGINE (Feature 3) */}
                    <div className="h-96">
                        <RiskPredictionCard beneficiaries={Object.values(beneficiaries)} />
                    </div>

                    <Card className="p-0 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <h3 className="font-bold text-hrsd-navy dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#F7941D]" />
                                المهام المعلقة
                            </h3>
                            <span className="bg-[#F7941D]/15 text-[#F7941D] text-xs font-bold px-2 py-0.5 rounded-full">
                                {alerts.pendingDirectorApprovals}
                            </span>
                        </div>
                        <div className="divide-y">
                            {alerts.pendingDirectorApprovals > 0 ? (
                                <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm text-hrsd-navy dark:text-white">اعتماد الخطة التأهيلية</span>
                                        <span className="text-xs text-hrsd-cool-gray">منذ يومين</span>
                                    </div>
                                    <p className="text-xs text-hrsd-cool-gray mb-2">المستفيد: لاحق يحيى (1401)</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-[#269798]/15 text-[#269798] px-1.5 py-0.5 rounded">طبي</span>
                                        <span className="text-[10px] bg-[#2BB574]/15 text-[#2BB574] px-1.5 py-0.5 rounded">اجتماعي</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-hrsd-cool-gray text-sm">
                                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#2BB574] opacity-60" />
                                    لا توجد مهام معلقة
                                </div>
                            )}

                            {/* Scheduled-task example — uses HRSD gold accent. */}
                            <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer border-l-4 border-l-[#FCB614]">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm text-hrsd-navy dark:text-white">تحديث بيانات الضمان الاجتماعي</span>
                                    <span className="text-xs text-hrsd-cool-gray">مجدول</span>
                                </div>
                                <p className="text-xs text-hrsd-cool-gray">مطلوب تحديث بيانات 5 مستفيدين</p>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-slate-800/50 text-center border-t dark:border-slate-700">
                            <button className="text-xs text-[#269798] font-medium hover:underline">عرض كل المهام</button>
                        </div>
                    </Card>

                    {/* System Status — light surface (was off-palette dark slate). */}
                    <Card className="p-4 bg-hrsd-navy text-white shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-sm text-hrsd-gold">حالة النظام</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-[#2BB574] rounded-full animate-pulse"></span>
                                <span className="text-xs text-white/70">متصل</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-xs text-white/80">
                            <div className="flex justify-between">
                                <span>قاعدة البيانات</span>
                                <span className="text-[#2BB574]">مستقرة</span>
                            </div>
                            <div className="flex justify-between">
                                <span>المزامنة السحابية</span>
                                <span className="text-[#2BB574]">تمت (10:00 ص)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>نسخة احتياطية</span>
                                <span className="text-[#FCB614]">جاري التجهيز…</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
