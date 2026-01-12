import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Shield,
    Brain,
    Heart,
    Users,
    Activity,
    ArrowLeft,
    CheckCircle2,
    Zap,
    Target,
    BarChart3,
    Clock,
    Award,
    Leaf
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 6);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Brain,
            title: 'الذكاء الاصطناعي',
            description: 'تنبؤات ذكية بالمخاطر قبل حدوثها',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: Shield,
            title: 'درع السلامة',
            description: 'مكافحة العدوى وحماية المستفيدين',
            color: 'from-emerald-500 to-teal-600'
        },
        {
            icon: Target,
            title: 'محرك التمكين',
            description: 'أهداف SMART لتأهيل المستفيدين',
            color: 'from-orange-500 to-amber-600'
        },
        {
            icon: Activity,
            title: 'المؤشرات الذكية',
            description: 'لوحات قياس تنفيذية متقدمة',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: Heart,
            title: 'ملف الكرامة',
            description: 'رعاية شخصية تحترم كل مستفيد',
            color: 'from-rose-500 to-pink-600'
        },
        {
            icon: BarChart3,
            title: 'التحليلات المتقدمة',
            description: 'رؤى استراتيجية مبنية على البيانات',
            color: 'from-violet-500 to-purple-600'
        }
    ];

    const stats = [
        { value: '145+', label: 'مستفيد نشط', icon: Users },
        { value: '94%', label: 'نسبة الامتثال', icon: CheckCircle2 },
        { value: '24/7', label: 'مراقبة مستمرة', icon: Clock },
        { value: 'ISO', label: 'معايير عالمية', icon: Award }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[rgb(20,65,90)] via-[rgb(15,55,80)] to-[rgb(10,45,65)] overflow-hidden" dir="rtl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-[rgb(45,180,115)] rounded-full opacity-10 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-[rgb(245,150,30)] rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[rgb(250,180,20)] rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="px-8 py-6">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                                <img
                                    src="/assets/hrsd-logo.png"
                                    alt="شعار وزارة الموارد البشرية"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[rgb(250,180,20)]">مركز التأهيل الشامل</h1>
                                <p className="text-[rgb(45,180,115)] text-sm">وزارة الموارد البشرية والتنمية الاجتماعية</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-white/60 text-sm">منطقة الباحة</span>
                            <div className="w-2 h-2 bg-[rgb(45,180,115)] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className={`px-8 py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-7xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
                            <Sparkles className="w-4 h-4 text-[rgb(250,180,20)]" />
                            <span className="text-white/90 text-sm">نظام بصيرة 3.0 | محرك القرارات الذكي</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            <span className="bg-gradient-to-l from-[rgb(245,150,30)] via-[rgb(250,180,20)] to-[rgb(45,180,115)] bg-clip-text text-transparent">
                                بصيرة
                            </span>
                            <br />
                            <span className="text-3xl md:text-4xl font-medium text-white/90">
                                رؤية ذكية لرعاية استثنائية
                            </span>
                        </h1>

                        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
                            منصة متكاملة تجمع بين الذكاء الاصطناعي وأفضل ممارسات الرعاية الاجتماعية
                            لتحويل مركز التأهيل الشامل إلى نموذج عالمي في خدمة المستفيدين
                        </p>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group inline-flex items-center gap-3 bg-gradient-to-l from-[rgb(245,150,30)] to-[rgb(250,180,20)] text-[rgb(20,65,90)] px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-[rgb(245,150,30)]/30 transition-all duration-300 hover:scale-105"
                        >
                            <span>ابدأ الآن</span>
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <stat.icon className="w-8 h-8 text-[rgb(45,180,115)] mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-white/60 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="px-8 py-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">مزايا المنصة</h2>
                            <p className="text-white/60">تقنيات متقدمة في خدمة المستفيدين</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 cursor-pointer ${activeFeature === index ? 'ring-2 ring-[rgb(245,150,30)] bg-white/10' : ''}`}
                                    onMouseEnter={() => setActiveFeature(index)}
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-white/60 leading-relaxed">{feature.description}</p>

                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity -z-10 blur-xl`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Vision 2030 Section */}
                <section className="px-8 py-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-gradient-to-l from-[rgb(45,180,115)]/20 to-[rgb(20,130,135)]/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[rgb(45,180,115)]/30 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 text-center md:text-right">
                                    <div className="inline-flex items-center gap-2 bg-[rgb(45,180,115)]/20 px-4 py-2 rounded-full mb-6">
                                        <Leaf className="w-4 h-4 text-[rgb(45,180,115)]" />
                                        <span className="text-[rgb(45,180,115)] text-sm font-medium">رؤية 2030</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                        نحو مجتمع حيوي واقتصاد مزدهر
                                    </h3>
                                    <p className="text-white/70 leading-relaxed mb-6">
                                        نظام بصيرة يدعم أهداف رؤية المملكة 2030 من خلال تعزيز جودة الحياة
                                        وتمكين ذوي الإعاقة ليكونوا أعضاء فاعلين في المجتمع
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Zap className="w-4 h-4 text-[rgb(250,180,20)]" />
                                            <span className="text-sm">كفاءة تشغيلية</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Heart className="w-4 h-4 text-[rgb(245,150,30)]" />
                                            <span className="text-sm">رعاية إنسانية</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Target className="w-4 h-4 text-[rgb(45,180,115)]" />
                                            <span className="text-sm">تمكين فعّال</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-48 h-48 flex-shrink-0">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[rgb(45,180,115)] to-[rgb(20,130,135)] flex items-center justify-center shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-white">2030</div>
                                            <div className="text-white/80 text-sm">رؤية المملكة</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-8 py-8 border-t border-white/10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-white/40 text-sm text-center md:text-right">
                            © 2026 مركز التأهيل الشامل بالباحة | وزارة الموارد البشرية والتنمية الاجتماعية
                        </div>
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/designer-credit.jpg"
                                alt="تصميم وتطوير"
                                className="h-12 rounded-lg opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WelcomePage;
