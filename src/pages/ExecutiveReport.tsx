import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
    RadialBarChart, RadialBar, Legend, AreaChart, Area, LineChart, Line
} from 'recharts';
import {
    TrendingUp, Users, Shield, Heart, Brain, Target, Award, Zap,
    CheckCircle2, AlertTriangle, Clock, ArrowLeft, Sparkles, Leaf,
    BarChart3, Activity, FileText, Building2, Star, ThumbsUp
} from 'lucide-react';

export const ExecutiveReport: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [activeKPI, setActiveKPI] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveKPI(prev => (prev + 1) % 4);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // بيانات المخططات
    const moduleProgress = [
        { name: 'إدارة المستفيدين', progress: 95, color: '#10b981' },
        { name: 'الملف الطبي', progress: 88, color: '#3b82f6' },
        { name: 'درع السلامة (IPC)', progress: 92, color: '#8b5cf6' },
        { name: 'محرك التمكين', progress: 85, color: '#f59e0b' },
        { name: 'الحوكمة والمخاطر', progress: 90, color: '#ec4899' },
        { name: 'المؤشرات الذكية', progress: 94, color: '#06b6d4' },
    ];

    const kpiData = [
        { name: 'الجودة', value: 94, fill: '#10b981' },
        { name: 'السلامة', value: 89, fill: '#3b82f6' },
        { name: 'الرضا', value: 87, fill: '#f59e0b' },
        { name: 'التمكين', value: 82, fill: '#8b5cf6' },
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
        { category: 'توفير الوقت', value: 40, unit: '%', icon: Clock, color: 'from-blue-500 to-cyan-500' },
        { category: 'تقليل الأخطاء', value: 65, unit: '%', icon: Shield, color: 'from-green-500 to-emerald-500' },
        { category: 'رضا المستفيدين', value: 87, unit: '%', icon: Heart, color: 'from-rose-500 to-pink-500' },
        { category: 'كفاءة الإنفاق', value: 35, unit: '%', icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    ];

    const achievements = [
        { title: '145 مستفيد نشط', subtitle: 'تتم متابعتهم يومياً', icon: Users, color: 'bg-blue-500' },
        { title: '0 حوادث سقوط', subtitle: 'خلال الربع الأخير', icon: Shield, color: 'bg-green-500' },
        { title: '94% امتثال', subtitle: 'لمعايير الجودة', icon: Award, color: 'bg-purple-500' },
        { title: '16 وحدة ذكية', subtitle: 'مفعلة في النظام', icon: Brain, color: 'bg-orange-500' },
    ];

    const strategicGoals = [
        { goal: 'شهادة ISO 9001', status: 'in_progress', progress: 75 },
        { goal: 'شهادة مواءمة ذهبية', status: 'in_progress', progress: 68 },
        { goal: 'صفر حوادث مهنية', status: 'achieved', progress: 100 },
        { goal: 'رضا 90%+', status: 'in_progress', progress: 87 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir="rtl">
            {/* Hero Section */}
            <section className={`relative overflow-hidden bg-gradient-to-br from-[rgb(20,65,90)] via-[rgb(15,55,80)] to-[rgb(10,45,65)] text-white transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-[rgb(45,180,115)] rounded-full opacity-10 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-[rgb(245,150,30)] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                                <img src="/assets/hrsd-logo.png" alt="الشعار" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="text-[rgb(250,180,20)] font-bold">مركز التأهيل الشامل</h3>
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
                            <Sparkles className="w-4 h-4 text-[rgb(250,180,20)]" />
                            <span className="text-sm">نظام بصيرة 3.0 | التقرير التنفيذي</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-l from-[rgb(245,150,30)] to-[rgb(45,180,115)] bg-clip-text text-transparent">
                                لمحة سريعة
                            </span>
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
                                className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center transition-all duration-500 hover:bg-white/15 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
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
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">مؤشرات الأداء الرئيسية</h2>
                                <p className="text-gray-500 text-sm">نسب الإنجاز الحالية</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={kpiData} startAngle={180} endAngle={0}>
                                    <RadialBar background dataKey="value" cornerRadius={10} />
                                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {kpiData.map((item, index) => (
                                <div key={index} className="text-center p-2 rounded-lg" style={{ backgroundColor: `${item.fill}15` }}>
                                    <div className="text-2xl font-bold" style={{ color: item.fill }}>{item.value}%</div>
                                    <div className="text-xs text-gray-600">{item.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">اتجاه التحسن</h2>
                                <p className="text-gray-500 text-sm">آخر 6 أشهر</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyTrend}>
                                    <defs>
                                        <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="امتثال" stroke="#10b981" strokeWidth={2} fill="url(#colorCompliance)" />
                                    <Area type="monotone" dataKey="رضا" stroke="#f59e0b" strokeWidth={2} fill="url(#colorSatisfaction)" />
                                    <Area type="monotone" dataKey="سلامة" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">الامتثال</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm text-gray-600">الرضا</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm text-gray-600">السلامة</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Module Progress */}
                <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">تقدم الوحدات</h2>
                            <p className="text-gray-500 text-sm">نسبة اكتمال كل وحدة في النظام</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {moduleProgress.map((module, index) => (
                            <div key={index} className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-800">{module.name}</span>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">الأثر المحقق</h2>
                        <p className="text-gray-500">التحسينات الملموسة منذ تفعيل النظام</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {impactMetrics.map((metric, index) => (
                            <div
                                key={index}
                                className={`relative overflow-hidden bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-l ${metric.color}`}></div>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <metric.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold text-gray-900">{metric.value}</span>
                                    <span className="text-xl text-gray-500">{metric.unit}</span>
                                </div>
                                <div className="text-gray-600 font-medium">{metric.category}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Strategic Goals */}
                <section className="bg-gradient-to-br from-[rgb(20,65,90)] to-[rgb(10,45,65)] rounded-3xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-[rgb(245,150,30)] rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">الأهداف الاستراتيجية</h2>
                            <p className="text-white/60 text-sm">التقدم نحو رؤية 2030</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {strategicGoals.map((goal, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {goal.status === 'achieved' ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <Clock className="w-6 h-6 text-amber-400" />
                                        )}
                                        <span className="font-bold text-lg">{goal.goal}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-[rgb(250,180,20)]">{goal.progress}%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${goal.status === 'achieved' ? 'bg-green-400' : 'bg-[rgb(245,150,30)]'}`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vision 2030 Alignment */}
                <section className="bg-gradient-to-l from-[rgb(45,180,115)]/10 to-[rgb(20,130,135)]/10 rounded-3xl p-8 border border-[rgb(45,180,115)]/20">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-[rgb(45,180,115)]/20 px-4 py-2 rounded-full mb-4">
                                <Leaf className="w-4 h-4 text-[rgb(45,180,115)]" />
                                <span className="text-[rgb(45,180,115)] text-sm font-medium">المواءمة مع رؤية 2030</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">مجتمع حيوي واقتصاد مزدهر</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                نظام بصيرة يساهم في تحقيق أهداف الرؤية من خلال تمكين ذوي الإعاقة
                                وتحسين جودة الخدمات وكفاءة الإنفاق الحكومي
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm shadow-sm">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    كفاءة تشغيلية
                                </span>
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm shadow-sm">
                                    <Heart className="w-4 h-4 text-rose-500" />
                                    رعاية إنسانية
                                </span>
                                <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm shadow-sm">
                                    <Target className="w-4 h-4 text-blue-500" />
                                    تمكين فعّال
                                </span>
                            </div>
                        </div>
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[rgb(45,180,115)] to-[rgb(20,130,135)] flex items-center justify-center shadow-2xl flex-shrink-0">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">2030</div>
                                <div className="text-white/80 text-sm">رؤية المملكة</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center py-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">استكشف النظام بالتفصيل</h3>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                        انتقل إلى لوحة القيادة التنفيذية للتعمق في البيانات والتقارير التفصيلية
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-3 bg-gradient-to-l from-[rgb(245,150,30)] to-[rgb(250,180,20)] text-[rgb(20,65,90)] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <span>الدخول للوحة القيادة</span>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-gray-500 text-sm">
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

export default ExecutiveReport;
