import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Target,
    Shield,
    Users,
    AlertTriangle,
    CheckCircle2,
    ArrowRight,
    RefreshCcw,
    Building2,
    Utensils,
    Wrench,
    FileText,
    Activity
} from 'lucide-react';

interface ModuleStatus {
    name: string;
    nameEn: string;
    icon: React.ElementType;
    route: string;
    progress: number;
    status: 'complete' | 'in_progress' | 'pending';
    kpi: string;
}

export const StrategicKPIDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalBeneficiaries: 0,
        activeCases: 0,
        completedTasks: 0,
        pendingRisks: 0,
        overallCompliance: 0,
        sroiScore: 0
    });

    const modules: ModuleStatus[] = [
        {
            name: 'إدارة المستفيدين',
            nameEn: 'Beneficiary Management',
            icon: Users,
            route: '/beneficiaries',
            progress: 100,
            status: 'complete',
            kpi: 'ملفات رقمية كاملة'
        },
        {
            name: 'الإعاشة',
            nameEn: 'Catering & Nutrition',
            icon: Utensils,
            route: '/catering',
            progress: 100,
            status: 'complete',
            kpi: 'تحليل AI • فواتير رقمية'
        },
        {
            name: 'التشغيل والصيانة',
            nameEn: 'Operations & Maintenance',
            icon: Wrench,
            route: '/operations',
            progress: 60,
            status: 'in_progress',
            kpi: 'سجل الأصول • المخلفات'
        },
        {
            name: 'الجودة',
            nameEn: 'Quality Assurance',
            icon: CheckCircle2,
            route: '/quality',
            progress: 80,
            status: 'in_progress',
            kpi: 'تقييم المقاولين'
        },
        {
            name: 'المخاطر',
            nameEn: 'Risk Management',
            icon: Shield,
            route: '/basira',
            progress: 40,
            status: 'in_progress',
            kpi: 'سجل المخاطر'
        },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch beneficiaries count
            const { count: beneficiaryCount } = await supabase
                .from('beneficiaries')
                .select('*', { count: 'exact', head: true });

            // Calculate mock SROI (Social Return on Investment)
            const sroiScore = 2.4; // ر.س 2.4 لكل ريال مستثمر

            setStats({
                totalBeneficiaries: beneficiaryCount || 0,
                activeCases: Math.floor((beneficiaryCount || 0) * 0.85),
                completedTasks: 156,
                pendingRisks: 3,
                overallCompliance: 87,
                sroiScore
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete': return 'bg-green-500';
            case 'in_progress': return 'bg-amber-500';
            case 'pending': return 'bg-gray-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'complete': return 'مكتمل';
            case 'in_progress': return 'قيد التطوير';
            case 'pending': return 'قادم';
            default: return status;
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-hrsd-primary flex items-center gap-3">
                        <BarChart3 className="w-8 h-8" />
                        لوحة المؤشرات الاستراتيجية
                    </h1>
                    <p className="text-gray-500 mt-1">العائد الاجتماعي على الاستثمار (SROI) • رؤية 2030</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                    <RefreshCcw className="w-4 h-4" />
                    تحديث
                </button>
            </div>

            {/* SROI Hero Card */}
            <div className="bg-gradient-to-br from-hrsd-primary to-[rgb(20,100,130)] rounded-2xl shadow-xl p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center md:border-l border-white/20 md:pl-8">
                        <Target className="w-12 h-12 mx-auto mb-3 text-hrsd-gold" />
                        <p className="text-sm uppercase tracking-wide opacity-80">العائد الاجتماعي SROI</p>
                        <p className="text-5xl font-bold mt-2">{stats.sroiScore}</p>
                        <p className="text-sm opacity-80 mt-1">ريال لكل ريال مستثمر</p>
                    </div>
                    <div className="text-center md:border-l border-white/20 md:pl-8">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                        <p className="text-sm uppercase tracking-wide opacity-80">نسبة الامتثال</p>
                        <p className="text-5xl font-bold mt-2">{stats.overallCompliance}%</p>
                        <p className="text-sm opacity-80 mt-1">معايير الحوكمة</p>
                    </div>
                    <div className="text-center">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                        <p className="text-sm uppercase tracking-wide opacity-80">المهام المكتملة</p>
                        <p className="text-5xl font-bold mt-2">{stats.completedTasks}</p>
                        <p className="text-sm opacity-80 mt-1">هذا الشهر</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-md text-center">
                    <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-3xl font-bold">{loading ? '...' : stats.totalBeneficiaries}</p>
                    <p className="text-sm text-gray-500">إجمالي المستفيدين</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-green-500 mb-2" />
                    <p className="text-3xl font-bold">{loading ? '...' : stats.activeCases}</p>
                    <p className="text-sm text-gray-500">حالات نشطة</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md text-center">
                    <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-3xl font-bold">{loading ? '...' : stats.pendingRisks}</p>
                    <p className="text-sm text-gray-500">مخاطر قيد المعالجة</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-md text-center">
                    <TrendingUp className="w-8 h-8 mx-auto text-hrsd-primary mb-2" />
                    <p className="text-3xl font-bold text-green-600">+12%</p>
                    <p className="text-sm text-gray-500">تحسن الأداء</p>
                </div>
            </div>

            {/* Module Progress */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-hrsd-primary" />
                    تقدم الوحدات النظامية
                </h2>
                <div className="space-y-4">
                    {modules.map((module, idx) => (
                        <Link
                            key={idx}
                            to={module.route}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-hrsd-primary/30 hover:shadow-md transition-all group"
                        >
                            <div className={`p-3 rounded-xl ${getStatusColor(module.status)} text-white`}>
                                <module.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-gray-800">{module.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${module.status === 'complete' ? 'bg-green-100 text-green-800' :
                                            module.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {getStatusLabel(module.status)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{module.kpi}</p>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getStatusColor(module.status)} transition-all`}
                                        style={{ width: `${module.progress}%` }}
                                    />
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-hrsd-primary group-hover:translate-x-[-4px] transition-all" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Compliance Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-hrsd-primary" />
                        معايير الامتثال
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">هيئة عقارات الدولة</span>
                            <span className="text-green-600 font-medium">متوافق</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">نظام أصول (وزارة المالية)</span>
                            <span className="text-amber-600 font-medium">قيد التطبيق</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">معايير IPSAS المحاسبية</span>
                            <span className="text-green-600 font-medium">متوافق</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">ISO 9001:2015</span>
                            <span className="text-amber-600 font-medium">قيد التقييم</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-hrsd-primary" />
                        رؤية 2030 - المواءمة
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">تمكين ذوي الإعاقة</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">التحول الرقمي</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[90%]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">الاستدامة المالية</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[70%]" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">جودة الحياة</span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[80%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategicKPIDashboard;
