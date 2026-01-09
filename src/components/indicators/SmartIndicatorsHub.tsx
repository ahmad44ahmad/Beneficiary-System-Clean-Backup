import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain, Scale, TrendingUp, ChevronLeft,
    AlertTriangle, Activity, Zap, Heart, DollarSign,
    BarChart3, Shield, Users
} from 'lucide-react';

interface IndicatorCard {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    path: string;
    color: string;
    stats: { label: string; value: string }[];
    status: 'critical' | 'warning' | 'good';
    category: 'center' | 'ministry' | 'both';
}

export const SmartIndicatorsHub: React.FC = () => {
    const navigate = useNavigate();

    const indicators: IndicatorCard[] = [
        // المؤشرات الموجودة
        {
            id: 'biological',
            title: 'التدقيق البيولوجي',
            subtitle: 'كشف الفساد عبر ربط المخزون بالصحة',
            icon: Scale,
            path: '/indicators/biological',
            color: 'from-hrsd-teal to-hrsd-teal-dark',
            stats: [
                { label: 'تنبيهات نشطة', value: '3' },
                { label: 'فجوة غير مبررة', value: '-24%' },
            ],
            status: 'critical',
            category: 'center',
        },
        {
            id: 'behavioral',
            title: 'التنبؤ السلوكي',
            subtitle: 'منع الانفجار السلوكي بالذكاء الاصطناعي',
            icon: Brain,
            path: '/indicators/behavioral',
            color: 'from-hrsd-navy to-hrsd-teal-dark',
            stats: [
                { label: 'مستوى الخطر', value: 'عالي' },
                { label: 'دقة التنبؤ', value: '87%' },
            ],
            status: 'warning',
            category: 'center',
        },
        // المؤشرات الجديدة
        {
            id: 'early-warning',
            title: 'الطوارئ الوقائي',
            subtitle: 'نظام الإنذار المبكر للكوارث المحتملة',
            icon: AlertTriangle,
            path: '/indicators/early-warning',
            color: 'from-red-500 to-red-600',
            stats: [
                { label: 'نقاط الخطر', value: '105' },
                { label: 'المستوى', value: 'أحمر' },
            ],
            status: 'critical',
            category: 'both',
        },
        {
            id: 'satisfaction',
            title: 'الرضا الآني',
            subtitle: 'توقع مشاكل العلاقات العامة قبل التصعيد',
            icon: Heart,
            path: '/indicators/satisfaction',
            color: 'from-pink-500 to-rose-600',
            stats: [
                { label: 'نسبة الرضا', value: '72%' },
                { label: 'شكاوى معلقة', value: '5' },
            ],
            status: 'warning',
            category: 'center',
        },
        {
            id: 'cost',
            title: 'التكلفة/المستفيد',
            subtitle: 'تحليل التكاليف وجاهزية الخصخصة',
            icon: DollarSign,
            path: '/indicators/cost',
            color: 'from-hrsd-gold to-hrsd-orange',
            stats: [
                { label: 'تكلفة يومية', value: '380 ر.س' },
                { label: 'مقترح الخصخصة', value: '437 ر.س' },
            ],
            status: 'good',
            category: 'both',
        },
        {
            id: 'hr',
            title: 'الموارد البشرية',
            subtitle: 'ربط الغياب بجودة الخدمة',
            icon: Users,
            path: '/indicators/hr',
            color: 'from-hrsd-orange to-amber-600',
            stats: [
                { label: 'الحضور اليوم', value: '85%' },
                { label: 'أقسام متأثرة', value: '2' },
            ],
            status: 'warning',
            category: 'center',
        },
        {
            id: 'benchmark',
            title: 'المقارنة المرجعية',
            subtitle: 'مقارنة أداء المركز مع معايير الوزارة',
            icon: BarChart3,
            path: '/indicators/benchmark',
            color: 'from-hrsd-teal to-cyan-600',
            stats: [
                { label: 'الأداء العام', value: '72%' },
                { label: 'مؤشرات ممتازة', value: '3/8' },
            ],
            status: 'warning',
            category: 'ministry',
        },
        {
            id: 'iso',
            title: 'الامتثال ISO 22301',
            subtitle: 'قياس التوافق مع معايير استمرارية الأعمال',
            icon: Shield,
            path: '/indicators/iso',
            color: 'from-hrsd-navy to-indigo-700',
            stats: [
                { label: 'نسبة الامتثال', value: '52%' },
                { label: 'بنود حرجة', value: '3' },
            ],
            status: 'warning',
            category: 'ministry',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical':
                return <span className="badge-danger">حرج</span>;
            case 'warning':
                return <span className="badge-warning">تحذير</span>;
            default:
                return <span className="badge-success">جيد</span>;
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'center':
                return <span className="text-xs bg-hrsd-teal/10 text-hrsd-teal px-2 py-0.5 rounded">إدارة المركز</span>;
            case 'ministry':
                return <span className="text-xs bg-hrsd-navy/10 text-hrsd-navy px-2 py-0.5 rounded">الوزارة</span>;
            default:
                return <span className="text-xs bg-hrsd-gold/10 text-hrsd-gold-dark px-2 py-0.5 rounded">المركز + الوزارة</span>;
        }
    };

    // Summary stats
    const criticalCount = indicators.filter(i => i.status === 'critical').length;
    const warningCount = indicators.filter(i => i.status === 'warning').length;
    const goodCount = indicators.filter(i => i.status === 'good').length;

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">المؤشرات الذكية</h1>
                        <p className="text-hierarchy-small text-gray-500">تحليل متقدم بالذكاء الاصطناعي لحماية المركز</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-hrsd-teal-light/20 border border-hrsd-teal rounded-xl p-4 flex items-start gap-3">
                    <Zap className="w-5 h-5 text-hrsd-teal flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-hrsd-navy">
                        <p className="font-bold mb-1">🧠 8 مؤشرات ذكية</p>
                        <p>نظام تحليل متقدم يستخدم الذكاء الاصطناعي لربط البيانات المختلفة واكتشاف الأنماط الخفية التي تشير إلى مشاكل محتملة قبل حدوثها.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="hrsd-card-stat border-l-hrsd-teal">
                    <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-hrsd-teal" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{indicators.length}</p>
                            <p className="text-hierarchy-label text-gray-500">مؤشرات نشطة</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-red-500">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                            <p className="text-hierarchy-label text-gray-500">حرج</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-hrsd-gold">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-hrsd-gold" />
                        <div>
                            <p className="text-2xl font-bold text-hrsd-gold">{warningCount}</p>
                            <p className="text-hierarchy-label text-gray-500">تحذير</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-hrsd-green">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-hrsd-green" />
                        <div>
                            <p className="text-2xl font-bold text-hrsd-green">{goodCount}</p>
                            <p className="text-hierarchy-label text-gray-500">جيد</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {indicators.map((indicator) => (
                    <div
                        key={indicator.id}
                        onClick={() => navigate(indicator.path)}
                        className="hrsd-card cursor-pointer hover:shadow-xl transition-all group"
                    >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 bg-gradient-to-br ${indicator.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                <indicator.icon className="w-6 h-6 text-white" />
                            </div>
                            {getStatusBadge(indicator.status)}
                        </div>

                        {/* Title */}
                        <h3 className="text-hierarchy-card-title text-gray-900 mb-1">{indicator.title}</h3>
                        <p className="text-hierarchy-small text-gray-500 mb-3 line-clamp-2">{indicator.subtitle}</p>

                        {/* Category */}
                        <div className="mb-3">
                            {getCategoryBadge(indicator.category)}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {indicator.stats.map((stat, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                                    <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        <button className="w-full py-2 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium hover:bg-hrsd-teal hover:text-white transition-all flex items-center justify-center gap-2">
                            <span>عرض التفاصيل</span>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartIndicatorsHub;
