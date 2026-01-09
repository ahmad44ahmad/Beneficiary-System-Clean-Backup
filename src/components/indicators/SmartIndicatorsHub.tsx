import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain, Scale, TrendingUp, ChevronLeft,
    AlertTriangle, Activity, Zap
} from 'lucide-react';

export const SmartIndicatorsHub: React.FC = () => {
    const navigate = useNavigate();

    const indicators = [
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
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical':
                return <span className="badge-danger">حرج</span>;
            case 'warning':
                return <span className="badge-warning">تحذير</span>;
            default:
                return <span className="badge-success">طبيعي</span>;
        }
    };

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
                        <p className="font-bold mb-1">🧠 المؤشرات الذكية</p>
                        <p>نظام تحليل متقدم يستخدم الذكاء الاصطناعي لربط البيانات المختلفة واكتشاف الأنماط الخفية التي تشير إلى مشاكل محتملة قبل حدوثها.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="hrsd-card-stat border-l-red-500">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <div>
                            <p className="text-2xl font-bold text-red-600">2</p>
                            <p className="text-hierarchy-label text-gray-500">تنبيهات حرجة</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-hrsd-gold">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-hrsd-gold" />
                        <div>
                            <p className="text-2xl font-bold text-hrsd-gold">5</p>
                            <p className="text-hierarchy-label text-gray-500">تحذيرات</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-hrsd-teal">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-hrsd-teal" />
                        <div>
                            <p className="text-2xl font-bold text-hrsd-teal">87%</p>
                            <p className="text-hierarchy-label text-gray-500">دقة التحليل</p>
                        </div>
                    </div>
                </div>
                <div className="hrsd-card-stat border-l-hrsd-green">
                    <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-hrsd-green" />
                        <div>
                            <p className="text-2xl font-bold text-hrsd-green">2</p>
                            <p className="text-hierarchy-label text-gray-500">مؤشرات نشطة</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicator Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {indicators.map((indicator) => (
                    <div
                        key={indicator.id}
                        onClick={() => navigate(indicator.path)}
                        className="hrsd-card cursor-pointer hover:shadow-xl transition-all group"
                    >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 bg-gradient-to-br ${indicator.color} rounded-xl group-hover:scale-110 transition-transform`}>
                                    <indicator.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-hierarchy-subheading text-gray-900">{indicator.title}</h3>
                                    <p className="text-hierarchy-small text-gray-500">{indicator.subtitle}</p>
                                </div>
                            </div>
                            {getStatusBadge(indicator.status)}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {indicator.stats.map((stat, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-hierarchy-label text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Action Button */}
                        <button className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg text-gray-700 font-medium hover:from-hrsd-teal hover:to-hrsd-teal-dark hover:text-white transition-all flex items-center justify-center gap-2">
                            <span>عرض التفاصيل</span>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Coming Soon */}
            <div className="mt-8 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-6 border border-dashed border-gray-300">
                <div className="text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-hierarchy-heading text-gray-500 mb-2">مؤشرات إضافية قريباً</h3>
                    <p className="text-hierarchy-small text-gray-400">
                        نعمل على إضافة مؤشرات ذكية جديدة: تحليل المزاج، توقع الاحتياجات الطبية، وأكثر...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SmartIndicatorsHub;
