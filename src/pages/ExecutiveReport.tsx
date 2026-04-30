import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip,
    RadialBarChart, RadialBar, Legend, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Users, Shield, Heart, Brain, Target, Award, Zap,
    CheckCircle2, Clock, ArrowLeft, Sparkles, Leaf,
    BarChart3, Star
} from 'lucide-react';
import { Formal } from '../design-system/BrandLevelProvider';
import { brand } from '../design-system/tokens';
import { chartLabelStyle } from '../design-system/charts';

/**
 * ExecutiveReport — ministerial-briefing surface.
 *
 * Wrapped in <Formal> per the brand guideline (p. 30): briefings to
 * deputy minister and above use Formal level — gray + primary palette.
 * Charts inside the wrapper auto-pick the formal palette via the
 * BrandLevelProvider context.
 *
 * Phase 2 carry-over migration:
 *   - All [rgb(...)] arbitrary literals replaced with brand tokens.
 *   - Off-palette #ec4899 (pink) on the governance module replaced with
 *     brand cool-gray.
 *   - All decorative gradients (pseudo same-color and the single real
 *     gold→orange on the spending metric) flattened to solid brand
 *     colors per Formal-level rules ("no gradients on body content").
 *   - SVG <linearGradient> elements inside the AreaChart preserved —
 *     they drive a fill-opacity transition (5%→95%), not a hue shift,
 *     and the brand-book exception for charts applies.
 */

const ExecutiveReportContent: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [_activeKPI, setActiveKPI] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveKPI(prev => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // بيانات المخططات
    const moduleProgress = [
        { name: 'إدارة المستفيدين', progress: 95, color: brand.green.hex },
        { name: 'الملف الطبي', progress: 88, color: brand.teal.hex },
        { name: 'درع السلامة (IPC)', progress: 92, color: brand.gold.hex },
        { name: 'محرك التمكين', progress: 85, color: brand.gold.hex },
        { name: 'الحوكمة والمخاطر', progress: 90, color: brand.coolGray.hex },
        { name: 'المؤشرات الذكية', progress: 94, color: brand.teal.hex },
    ];

    const kpiData = [
        { name: 'الجودة', value: 94, fill: brand.green.hex },
        { name: 'السلامة', value: 89, fill: brand.teal.hex },
        { name: 'الرضا', value: 87, fill: brand.gold.hex },
        { name: 'التمكين', value: 82, fill: brand.orange.hex },
    ];

    const monthlyTrend = [
        { month: 'يناير', امتثال: 78, رضا: 72, سلامة: 80 },
        { month: 'فبراير', امتثال: 82, رضا: 75, سلامة: 83 },
        { month: 'مارس', امتثال: 85, رضا: 78, سلامة: 85 },
        { month: 'أبريل', امتثال: 88, رضا: 82, سلامة: 87 },
        { month: 'مايو', امتثال: 91, رضا: 85, سلامة: 89 },
        { month: 'يونيو', امتثال: 94, رضا: 87, سلامة: 92 },
    ];

    const impactMetrics = [
        { category: 'توفير الوقت', value: 40, unit: '%', icon: Clock, color: brand.teal.hex },
        { category: 'تقليل الأخطاء', value: 65, unit: '%', icon: Shield, color: brand.green.hex },
        { category: 'رضا المستفيدين', value: 87, unit: '%', icon: Heart, color: brand.orange.hex },
        { category: 'كفاءة الإنفاق', value: 35, unit: '%', icon: TrendingUp, color: brand.gold.hex },
    ];

    const achievements = [
        { title: '145 مستفيد نشط', subtitle: 'تتم متابعتهم يومياً', icon: Users, color: brand.teal.hex },
        { title: '0 حوادث سقوط', subtitle: 'خلال الربع الأخير', icon: Shield, color: brand.green.hex },
        { title: '94% امتثال', subtitle: 'لمعايير الجودة', icon: Award, color: brand.gold.hex },
        { title: '16 وحدة ذكية', subtitle: 'مفعلة في النظام', icon: Brain, color: brand.orange.hex },
    ];

    const strategicGoals = [
        { goal: 'شهادة ISO 9001', status: 'in_progress', progress: 75 },
        { goal: 'شهادة مواءمة ذهبية', status: 'in_progress', progress: 68 },
        { goal: 'صفر حوادث مهنية', status: 'achieved', progress: 100 },
        { goal: 'رضا 90%+', status: 'in_progress', progress: 87 },
    ];

    return (
        <div className="min-h-screen bg-white" dir="rtl">
            {/* Hero Section */}
            <section
                className={`relative overflow-hidden text-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ backgroundColor: brand.navy.hex }}
            >
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                                <img src="/assets/hrsd-logo.png" alt="الشعار" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-bold" style={{ color: brand.gold.hex }}>مركز التأهيل الشامل</h3>
                                <p className="text-white/60 text-sm">منطقة الباحة</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            <span className="text-sm">لوحة القيادة</span>
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4" style={{ color: brand.gold.hex }} />
                            <span className="text-sm">نظام بصيرة 3.0 | التقرير التنفيذي</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            لمحة سريعة
                        </h1>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            نظرة شاملة على أداء المركز والتحول الرقمي في خدمة المستفيدين
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {achievements.map((item, index) => (
                            <div
                                key={index}
                                className={`bg-white/10 rounded-2xl p-6 border border-white/10 text-center transition-all duration-500 hover:bg-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: item.color }}
                                >
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{item.title}</div>
                                <div className="text-white/60 text-sm">{item.subtitle}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">

                {/* KPI Overview */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Radial Progress Chart */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: brand.teal.hex }}
                            >
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold" style={{ color: brand.navy.hex }}>مؤشرات الأداء الرئيسية</h2>
                                <p className="text-sm" style={{ color: brand.coolGray.hex }}>نسب الإنجاز الحالية</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={kpiData} startAngle={180} endAngle={0}>
                                    <RadialBar background dataKey="value" cornerRadius={10} />
                                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={chartLabelStyle} />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {kpiData.map((item, index) => (
                                <div key={index} className="text-center p-2 rounded-lg" style={{ backgroundColor: `${item.fill}15` }}>
                                    <div className="text-2xl font-bold" style={{ color: item.fill }}>{item.value}%</div>
                                    <div className="text-xs" style={{ color: brand.coolGray.hex }}>{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: brand.green.hex }}
                            >
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold" style={{ color: brand.navy.hex }}>اتجاه التحسن</h2>
                                <p className="text-sm" style={{ color: brand.coolGray.hex }}>آخر 6 أشهر</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyTrend}>
                                    <defs>
                                        <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={brand.green.hex} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={brand.green.hex} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={brand.gold.hex} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={brand.gold.hex} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: brand.coolGray.hex }} />
                                    <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: brand.coolGray.hex }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="امتثال" stroke={brand.green.hex} strokeWidth={2} fill="url(#colorCompliance)" />
                                    <Area type="monotone" dataKey="رضا" stroke={brand.gold.hex} strokeWidth={2} fill="url(#colorSatisfaction)" />
                                    <Area type="monotone" dataKey="سلامة" stroke={brand.teal.hex} strokeWidth={2} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.green.hex }}></div>
                                <span className="text-sm" style={{ color: brand.coolGray.hex }}>الامتثال</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.gold.hex }}></div>
                                <span className="text-sm" style={{ color: brand.coolGray.hex }}>الرضا</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.teal.hex }}></div>
                                <span className="text-sm" style={{ color: brand.coolGray.hex }}>السلامة</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Module Progress */}
                <section className="bg-white rounded-3xl p-8 border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: brand.gold.hex }}
                        >
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold" style={{ color: brand.navy.hex }}>تقدم الوحدات</h2>
                            <p className="text-sm" style={{ color: brand.coolGray.hex }}>نسبة اكتمال كل وحدة في النظام</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moduleProgress.map((module, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium" style={{ color: brand.navy.hex }}>{module.name}</span>
                                    <span className="text-lg font-bold" style={{ color: module.color }}>{module.progress}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: isVisible ? `${module.progress}%` : '0%',
                                            backgroundColor: module.color,
                                            transitionDelay: `${index * 100}ms`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Impact Metrics */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: brand.navy.hex }}>الأثر المحقق</h2>
                        <p style={{ color: brand.coolGray.hex }}>التحسينات الملموسة منذ تفعيل النظام</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {impactMetrics.map((metric, index) => (
                            <div
                                key={index}
                                className={`relative overflow-hidden bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-500 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ backgroundColor: metric.color }}
                                ></div>
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: metric.color }}
                                >
                                    <metric.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold" style={{ color: brand.navy.hex }}>{metric.value}</span>
                                    <span className="text-xl" style={{ color: brand.coolGray.hex }}>{metric.unit}</span>
                                </div>
                                <div className="font-medium" style={{ color: brand.coolGray.hex }}>{metric.category}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Strategic Goals */}
                <section
                    className="rounded-3xl p-8 text-white"
                    style={{ backgroundColor: brand.navy.hex }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: brand.orange.hex }}
                        >
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">الأهداف الاستراتيجية</h2>
                            <p className="text-white/60 text-sm">التقدم نحو رؤية 2030</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {strategicGoals.map((goal, index) => (
                            <div key={index} className="bg-white/10 rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {goal.status === 'achieved' ? (
                                            <CheckCircle2 className="w-6 h-6" style={{ color: brand.green.hex }} />
                                        ) : (
                                            <Clock className="w-6 h-6" style={{ color: brand.gold.hex }} />
                                        )}
                                        <span className="font-bold text-lg">{goal.goal}</span>
                                    </div>
                                    <span className="text-2xl font-bold" style={{ color: brand.gold.hex }}>{goal.progress}%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${goal.progress}%`,
                                            backgroundColor: goal.status === 'achieved' ? brand.green.hex : brand.orange.hex,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vision 2030 Alignment */}
                <section
                    className="rounded-3xl p-8 border"
                    style={{
                        backgroundColor: `${brand.green.hex}0d`,
                        borderColor: `${brand.green.hex}33`,
                    }}
                >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                                style={{ backgroundColor: `${brand.green.hex}33` }}
                            >
                                <Leaf className="w-4 h-4" style={{ color: brand.green.hex }} />
                                <span className="text-sm font-medium" style={{ color: brand.green.hex }}>المواءمة مع رؤية 2030</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4" style={{ color: brand.navy.hex }}>مجتمع حيوي واقتصاد مزدهر</h3>
                            <p className="leading-relaxed mb-6" style={{ color: brand.coolGray.hex }}>
                                نظام بصيرة يساهم في تحقيق أهداف الرؤية من خلال تمكين ذوي الإعاقة
                                وتحسين جودة الخدمات وكفاءة الإنفاق الحكومي
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm border border-gray-100">
                                    <Zap className="w-4 h-4" style={{ color: brand.gold.hex }} />
                                    <span style={{ color: brand.coolGray.hex }}>كفاءة تشغيلية</span>
                                </span>
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm border border-gray-100">
                                    <Heart className="w-4 h-4" style={{ color: brand.orange.hex }} />
                                    <span style={{ color: brand.coolGray.hex }}>رعاية إنسانية</span>
                                </span>
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm border border-gray-100">
                                    <Target className="w-4 h-4" style={{ color: brand.teal.hex }} />
                                    <span style={{ color: brand.coolGray.hex }}>تمكين فعّال</span>
                                </span>
                            </div>
                        </div>
                        <div
                            className="w-40 h-40 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: brand.teal.hex }}
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">2030</div>
                                <div className="text-white/80 text-sm">رؤية المملكة</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center py-8">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: brand.navy.hex }}>استكشف النظام بالتفصيل</h3>
                    <p className="mb-8 max-w-xl mx-auto" style={{ color: brand.coolGray.hex }}>
                        انتقل إلى لوحة القيادة التنفيذية للتعمق في البيانات والتقارير التفصيلية
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
                        style={{
                            backgroundColor: brand.gold.hex,
                            color: brand.navy.hex,
                        }}
                    >
                        <span>الدخول للوحة القيادة</span>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-sm" style={{ color: brand.coolGray.hex }}>
                        © 2026 مركز التأهيل الشامل بالباحة | وزارة الموارد البشرية والتنمية الاجتماعية
                    </div>
                    <img
                        src="/assets/designer-credit.jpg"
                        alt="تصميم وتطوير"
                        className="h-10 rounded-lg opacity-80"
                    />
                </div>
            </footer>
        </div>
    );
};

export const ExecutiveReport: React.FC = () => (
    <Formal>
        <ExecutiveReportContent />
    </Formal>
);

export default ExecutiveReport;
