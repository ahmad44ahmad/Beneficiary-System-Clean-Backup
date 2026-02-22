import React, { useState, useMemo } from 'react';
import {
    Trophy,
    BookOpen,
    FileText,
    Star,
    TrendingUp,
    Users,
    Search,
    Award,
    CheckCircle2,
    ArrowRight,
    RefreshCw,
    ClipboardCheck,
    PlayCircle,
    Settings2,
    ChevronDown,
    ChevronUp,
    Shield,
    AlertTriangle,
    Building2,
    Heart,
    Activity,
    Stethoscope,
    Target,
    Layers
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { qualityProcesses } from '../../data/qualityProcesses';

export const QualityExcellenceHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'guide' | 'champions' | 'sops'>('guide');

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-[#14415A]">
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        مركز التميز المؤسسي
                    </h1>
                    <p className="text-gray-500 mt-2">
                        بوابة التميز الشامل: الدليل الذهبي، أبطال الجودة، ومكتبة العمليات
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'guide' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('guide')}
                        className="flex items-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        الدليل الذهبي
                    </Button>
                    <Button
                        variant={activeTab === 'champions' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('champions')}
                        className="flex items-center gap-2"
                    >
                        <Trophy className="w-4 h-4" />
                        دوري الأبطال
                    </Button>
                    <Button
                        variant={activeTab === 'sops' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('sops')}
                        className="flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" />
                        مكتبة العمليات
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px]">
                {activeTab === 'guide' && <GoldenGuideView />}
                {activeTab === 'champions' && <ChampionsLeagueView />}
                {activeTab === 'sops' && <SopLibraryView />}
            </div>
        </div>
    );
};

// --- Sub-Components ---

const GoldenGuideView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#14415A] to-[#1E6B5C] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm mb-4 border border-white/20">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            الإصدار 1.0 - 2026
                        </div>
                        <h2 className="text-3xl font-bold mb-4">الدليل الذهبي للتميز المؤسسي والامتثال</h2>
                        <p className="text-gray-100 text-lg leading-relaxed mb-6 opacity-90">
                            خارطة طريق شاملة لتحويل مراكز التأهيل الاجتماعي من الرعاية التقليدية إلى التمكين المستدام وفق نموذج الباحة للتميز.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                <span className="font-bold text-yellow-400">ISO 9001</span>
                                <span className="text-xs opacity-70">إدارة الجودة</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                <span className="font-bold text-yellow-400">ISO 22301</span>
                                <span className="text-xs opacity-70">استمرارية الأعمال</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                                <span className="font-bold text-yellow-400">ISO 31000</span>
                                <span className="text-xs opacity-70">إدارة المخاطر</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden md:block">
                        {/* Decorative elements representing IEF */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm p-4">
                                <div className="text-yellow-400 text-2xl font-bold mb-1">127</div>
                                <div className="text-sm opacity-80">عملية موثقة</div>
                            </Card>
                            <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm p-4">
                                <div className="text-yellow-400 text-2xl font-bold mb-1">31</div>
                                <div className="text-sm opacity-80">خطر مُقيّم</div>
                            </Card>
                            <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm p-4">
                                <div className="text-yellow-400 text-2xl font-bold mb-1">0</div>
                                <div className="text-sm opacity-80">حوادث سلامة</div>
                            </Card>
                            <Card className="bg-white/10 border-white/10 text-white backdrop-blur-sm p-4">
                                <div className="text-yellow-400 text-2xl font-bold mb-1">95%</div>
                                <div className="text-sm opacity-80">نسبة التوثيق</div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roadmap Timeline */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#14415A]">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    خارطة الطريق: 12 شهراً للتميز
                </h3>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden md:block" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        {[
                            { q: 'Q1', title: 'التأسيس والتشخيص', status: 'completed', items: ['مصفوفة العمليات', 'سجل المخاطر', 'تحليل الفجوات'] },
                            { q: 'Q2', title: 'البناء والتوثيق', status: 'active', items: ['SOPs', 'خطط الاستمرارية', 'التدريب'] },
                            { q: 'Q3', title: 'التشغيل والمراقبة', status: 'pending', items: ['التدقيق الداخلي', 'مراجعة الإدارة', 'قياس الأثر'] },
                            { q: 'Q4', title: 'الاعتماد والاستدامة', status: 'pending', items: ['التدقيق الخارجي', 'شهادة ISO', 'نظام التحفيز'] },
                        ].map((phase, idx) => (
                            <div key={idx} className={`bg-white border rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${phase.status === 'active' ? 'ring-2 ring-green-500 border-transparent' : ''}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-2xl font-black ${phase.status === 'completed' ? 'text-green-600' : phase.status === 'active' ? 'text-blue-600' : 'text-gray-300'}`}>
                                        {phase.q}
                                    </span>
                                    {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-2">{phase.title}</h4>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    {phase.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* PDCA Cycle Visualization */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#14415A]">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                    دورة التحسين المستمر (PDCA)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            phase: 'Plan',
                            ar: 'خطط',
                            icon: ClipboardCheck,
                            color: 'bg-blue-500',
                            bgLight: 'bg-blue-50',
                            textColor: 'text-blue-700',
                            description: 'تحديد الفرص وتخطيط التغيير',
                            activities: ['تحليل الفجوات', 'تحديد الأهداف', 'تخطيط الموارد', 'تصميم العمليات']
                        },
                        {
                            phase: 'Do',
                            ar: 'نفذ',
                            icon: PlayCircle,
                            color: 'bg-green-500',
                            bgLight: 'bg-green-50',
                            textColor: 'text-green-700',
                            description: 'اختبار التغيير وتنفيذه على نطاق صغير',
                            activities: ['تنفيذ الخطة', 'جمع البيانات', 'توثيق العمليات', 'تدريب الموظفين']
                        },
                        {
                            phase: 'Check',
                            ar: 'تحقق',
                            icon: CheckCircle2,
                            color: 'bg-amber-500',
                            bgLight: 'bg-amber-50',
                            textColor: 'text-amber-700',
                            description: 'مراجعة الاختبار وتحليل النتائج',
                            activities: ['قياس الأداء', 'تحليل النتائج', 'مقارنة بالأهداف', 'تحديد الانحرافات']
                        },
                        {
                            phase: 'Act',
                            ar: 'صحح',
                            icon: Settings2,
                            color: 'bg-red-500',
                            bgLight: 'bg-red-50',
                            textColor: 'text-red-700',
                            description: 'اتخاذ إجراءات بناءً على ما تعلمته',
                            activities: ['توحيد أفضل الممارسات', 'تصحيح الانحرافات', 'نشر التحسينات', 'بدء دورة جديدة']
                        },
                    ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div key={idx} className={`${item.bgLight} border rounded-xl p-4 relative overflow-hidden group hover:shadow-md transition-all`}>
                                <div className={`absolute top-0 right-0 w-16 h-16 ${item.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`font-bold ${item.textColor}`}>{item.ar}</div>
                                        <div className="text-xs text-gray-500">{item.phase}</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                                <ul className="text-xs text-gray-500 space-y-1">
                                    {item.activities.map((act, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                            {act}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 text-center">
                        <span className="font-bold text-[#14415A]">دورة PDCA</span> هي نموذج من أربع خطوات لتنفيذ التغيير. مثل الدائرة التي ليس لها نهاية، يجب تكرار دورة PDCA مراراً للتحسين المستمر.
                    </p>
                </div>
            </Card>

            {/* FOCUS-PDSA Methodology */}
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-[#14415A]">
                    <Search className="w-5 h-5 text-purple-600" />
                    منهجية FOCUS-PDSA للتحسين المستمر
                </h3>
                <p className="text-sm text-gray-500 mb-6">المحرك التشغيلي والمنهج العلمي للتحسين المستمر - من النوايا الحسنة إلى التغيير المنهجي المدروس</p>

                {/* Phase 1: FOCUS */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div>
                        <h4 className="font-bold text-purple-700">المرحلة الأولى: التشخيص والتركيز (FOCUS)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {[
                            { letter: 'F', ar: 'حدد', en: 'Find', desc: 'حدد فرصة للتحسين بناءً على البيانات', icon: '🔍' },
                            { letter: 'O', ar: 'نظم', en: 'Organize', desc: 'نظم فريق عمل متعدد التخصصات', icon: '👥' },
                            { letter: 'C', ar: 'وضح', en: 'Clarify', desc: 'وضح المعرفة الحالية للعملية', icon: '📊' },
                            { letter: 'U', ar: 'افهم', en: 'Understand', desc: 'افهم أسباب التباين (RCA)', icon: '🧠' },
                            { letter: 'S', ar: 'اختر', en: 'Select', desc: 'اختر التحسين المناسب للاختبار', icon: '✅' },
                        ].map((step, idx) => (
                            <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center hover:shadow-md transition-all">
                                <div className="text-2xl mb-1">{step.icon}</div>
                                <div className="text-purple-700 font-bold text-lg">{step.letter}</div>
                                <div className="text-purple-600 font-medium text-sm">{step.ar}</div>
                                <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phase 2: PDSA */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div>
                        <h4 className="font-bold text-teal-700">المرحلة الثانية: التجريب والتعلم (PDSA)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[
                            { letter: 'P', ar: 'خطط', en: 'Plan', desc: 'وضع خطة دقيقة للتجربة', color: 'bg-blue-50 border-blue-100 text-blue-700' },
                            { letter: 'D', ar: 'نفذ', en: 'Do', desc: 'تطبيق الحل على نطاق تجريبي', color: 'bg-green-50 border-green-100 text-green-700' },
                            { letter: 'S', ar: 'ادرس', en: 'Study', desc: 'تحليل البيانات والنتائج', color: 'bg-amber-50 border-amber-100 text-amber-700' },
                            { letter: 'A', ar: 'تصرف', en: 'Act', desc: 'التبني أو التعديل أو التخلي', color: 'bg-red-50 border-red-100 text-red-700' },
                        ].map((step, idx) => (
                            <div key={idx} className={`${step.color} border rounded-lg p-4 text-center hover:shadow-md transition-all`}>
                                <div className={`font-bold text-2xl`}>{step.letter}</div>
                                <div className="font-medium">{step.ar}</div>
                                <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TQM Integration Note */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-lg border border-purple-100">
                    <div className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-700">
                                <span className="font-bold text-[#14415A]">القيمة الاستراتيجية:</span> تُمثل FOCUS-PDSA "الآلية التنفيذية" لفلسفة كايزن (Kaizen) والتحسين المستمر.
                                تضمن اختبار الأفكار الجديدة على نطاق صغير قبل التعميم، مما يقلل المخاطر ويضمن قرارات مبنية على الدليل.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Comprehensive Quality Framework Sections */}
            <QualityAccordionSection />
        </div>
    );
};

// Accordion Section Component for Quality Framework
const QualityAccordionSection = () => {
    const [openSections, setOpenSections] = useState<string[]>(['tqm']);

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const sections = [
        {
            id: 'tqm',
            title: 'إطار إدارة الجودة الشاملة (TQM)',
            icon: Award,
            color: 'text-blue-600 bg-blue-50',
            content: <TQMContent />
        },
        {
            id: 'kpis',
            title: 'مؤشرات الأداء الرئيسية (KPIs)',
            icon: Target,
            color: 'text-green-600 bg-green-50',
            content: <KPIsContent />
        },
        {
            id: 'ipc',
            title: 'مكافحة العدوى (IPC)',
            icon: Shield,
            color: 'text-red-600 bg-red-50',
            content: <IPCContent />
        },
        {
            id: 'fms',
            title: 'إدارة المرافق والسلامة (FMS)',
            icon: Building2,
            color: 'text-orange-600 bg-orange-50',
            content: <FMSContent />
        },
        {
            id: 'roles',
            title: 'الهيكل التنظيمي والأدوار الوظيفية',
            icon: Users,
            color: 'text-purple-600 bg-purple-50',
            content: <RolesContent />
        },
        {
            id: 'risk',
            title: 'إدارة المخاطر والإبلاغ عن الحوادث (OVR)',
            icon: AlertTriangle,
            color: 'text-amber-600 bg-amber-50',
            content: <RiskManagementContent />
        }
    ];

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#14415A] flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5" />
                الإطار الشامل للتميز المؤسسي
            </h3>
            {sections.map(section => (
                <Card key={section.id} className="overflow-hidden">
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-[#14415A]">{section.title}</span>
                        </div>
                        {openSections.includes(section.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </button>
                    {openSections.includes(section.id) && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-in fade-in duration-300">
                            {section.content}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
};

// TQM Content
const TQMContent = () => (
    <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
            تتبنى المراكز فلسفة إدارة الجودة الشاملة لضمان التحسين المستمر في جميع العمليات والخدمات.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
                { title: 'التركيز على المستفيد', desc: 'وضع احتياجات المستفيدين في صميم كل قرار', icon: Heart },
                { title: 'مشاركة الموظفين', desc: 'الجودة مسؤولية الجميع ويُشجع جميع الموظفين', icon: Users },
                { title: 'النهج القائم على العمليات', desc: 'إدارة الأنشطة كعمليات متكاملة ومترابطة', icon: RefreshCw },
                { title: 'التحسين المستمر', desc: 'تطبيق FOCUS-PDSA لتحليل وتحسين العمليات', icon: TrendingUp },
            ].map((item, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                    <item.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-bold text-sm text-blue-800">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </div>
            ))}
        </div>
    </div>
);

// KPIs Content
const KPIsContent = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medical KPIs */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    المؤشرات الطبية
                </h4>
                <div className="space-y-2">
                    {[
                        { name: 'تقرحات الفراش', target: '< 2 لكل 1000 يوم' },
                        { name: 'معدل السقوط', target: 'حسب CBAHI' },
                        { name: 'التطعيمات الوقائية', target: '100%' },
                        { name: 'نزول الوزن غير المخطط', target: 'مراقبة مستمرة' },
                        { name: 'معدل الوفيات الشهرية', target: 'حسب المعايير الوطنية' },
                    ].map((kpi, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded px-3 py-2 text-sm">
                            <span className="text-gray-700">{kpi.name}</span>
                            <span className="font-mono text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">{kpi.target}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Operational KPIs */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    المؤشرات التشغيلية
                </h4>
                <div className="space-y-2">
                    {[
                        { name: 'رضا المستفيدين وذويهم', target: 'تقرير ربع سنوي' },
                        { name: 'شكاوى المستفيدين', target: 'تقرير ربع سنوي' },
                        { name: 'توفر الكادر الطبي', target: 'تقرير ربع سنوي' },
                        { name: 'دوران الموظفين', target: 'تقرير ربع سنوي' },
                    ].map((kpi, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded px-3 py-2 text-sm">
                            <span className="text-gray-700">{kpi.name}</span>
                            <span className="font-mono text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{kpi.target}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// IPC Content
const IPCContent = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
                { title: 'نظافة الأيدي', desc: 'اللحظات الخمس لنظافة اليدين', icon: '🧤', color: 'bg-blue-50 border-blue-200' },
                { title: 'معدات الوقاية', desc: 'القفازات، الأقنعة، الأردية', icon: '🛡️', color: 'bg-green-50 border-green-200' },
                { title: 'احتياطات العزل', desc: 'التلامسية، الرذاذية، الهوائية', icon: '🚪', color: 'bg-amber-50 border-amber-200' },
                { title: 'إدارة النفايات', desc: 'فرز مرمز بالألوان', icon: '🗑️', color: 'bg-red-50 border-red-200' },
            ].map((item, idx) => (
                <div key={idx} className={`${item.color} border rounded-lg p-3 text-center`}>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                </div>
            ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">اللحظات الخمس لنظافة اليدين</h4>
            <div className="flex flex-wrap gap-2">
                {['قبل ملامسة المريض', 'قبل الإجراء المعقم', 'بعد التعرض لسوائل الجسم', 'بعد ملامسة المريض', 'بعد ملامسة محيط المريض'].map((moment, idx) => (
                    <span key={idx} className="bg-white border border-gray-300 px-2 py-1 rounded text-xs text-gray-700">
                        {idx + 1}. {moment}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

// FMS Content
const FMSContent = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fire Safety - RACE */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h4 className="font-bold text-red-800 mb-3">🔥 بروتوكول RACE للحرائق</h4>
                <div className="space-y-2">
                    {[
                        { letter: 'R', ar: 'الإنقاذ', en: 'Rescue' },
                        { letter: 'A', ar: 'الإنذار', en: 'Alarm' },
                        { letter: 'C', ar: 'الحصر', en: 'Contain' },
                        { letter: 'E', ar: 'الإطفاء/الإخلاء', en: 'Extinguish/Evacuate' },
                    ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white rounded px-3 py-2">
                            <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">{step.letter}</span>
                            <span className="font-medium text-gray-800">{step.ar}</span>
                            <span className="text-xs text-gray-500">({step.en})</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Building Requirements */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h4 className="font-bold text-orange-800 mb-3">🏢 متطلبات المبنى</h4>
                <div className="space-y-2 text-sm">
                    {[
                        'ممرات وأبواب واسعة للكراسي المتحركة',
                        'أنظمة كشف الدخان والحرائق',
                        'مخارج طوارئ واضحة ومضاءة',
                        'مولدات كهربائية احتياطية',
                        'سياسة عدم التدخين',
                    ].map((req, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white rounded px-3 py-2">
                            <CheckCircle2 className="w-4 h-4 text-orange-600" />
                            <span className="text-gray-700">{req}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Roles Content
const RolesContent = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
                { title: 'مدير المركز', desc: 'المسؤولية الشاملة عن التشغيل والامتثال', icon: '👔', level: 'إدارة عليا' },
                { title: 'المدير الطبي', desc: 'الإشراف على جميع الخدمات الطبية', icon: '🩺', level: 'إدارة عليا' },
                { title: 'مدير الجودة والسلامة', desc: 'مراقبة KPIs والتحقيق في الحوادث', icon: '📊', level: 'إدارة عليا' },
                { title: 'مدير الحالة', desc: 'تنسيق خطط الرعاية (1:50)', icon: '📋', level: 'تنسيقي' },
                { title: 'أخصائي التمريض', desc: 'الرعاية المباشرة والتوثيق', icon: '👩‍⚕️', level: 'تنفيذي' },
                { title: 'أخصائي العلاج الطبيعي', desc: 'التقييم والخطط العلاجية', icon: '🏃', level: 'تنفيذي' },
            ].map((role, idx) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">{role.icon}</span>
                        <div>
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded">{role.level}</span>
                            <h4 className="font-bold text-purple-800 mt-1">{role.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{role.desc}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-purple-100 rounded-lg p-3 text-center">
            <p className="text-sm text-purple-800">
                <strong>جميع الكوادر الصحية</strong> يجب أن يحصلوا على ترخيص من الهيئة السعودية للتخصصات الصحية
            </p>
        </div>
    </div>
);

// Risk Management Content
const RiskManagementContent = () => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
                { title: 'الأخطاء الوشيكة', en: 'Near Misses', desc: 'أحداث كادت أن تسبب ضرراً', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
                { title: 'حوادث بسيطة/متوسطة', en: 'Minor/Moderate', desc: 'أحداث نتج عنها ضرر طفيف', color: 'bg-orange-50 border-orange-200 text-orange-800' },
                { title: 'أحداث جسيمة', en: 'Sentinel Events', desc: 'وفاة أو ضرر جسدي/نفسي جسيم', color: 'bg-red-50 border-red-200 text-red-800' },
            ].map((type, idx) => (
                <div key={idx} className={`${type.color} border rounded-lg p-4 text-center`}>
                    <h4 className="font-bold">{type.title}</h4>
                    <p className="text-xs opacity-75 mt-1">({type.en})</p>
                    <p className="text-xs mt-2">{type.desc}</p>
                </div>
            ))}
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                تحليل السبب الجذري (RCA)
            </h4>
            <p className="text-sm text-gray-700">
                يتم إجراء تحليل منهجي لتحديد العوامل الكامنة التي أدت إلى وقوع الحادث، ووضع إجراءات تصحيحية ووقائية.
                يجب إبلاغ الوزارة عن أي طارئ جسيم في غضون <strong>24 ساعة</strong>.
            </p>
        </div>
    </div>
);

const ChampionsLeagueView = () => {
    const [selectedMonth, setSelectedMonth] = useState('فبراير');

    const teams = [
        { id: 1, name: 'فريق التميز (الإدارة والخدمات)', score: 1250, badge: '👑', color: 'bg-yellow-100 text-yellow-700', members: 12, streak: 3 },
        { id: 2, name: 'فريق الرعاية (الصحة والتأهيل)', score: 980, badge: '🥈', color: 'bg-gray-100 text-gray-700', members: 15, streak: 0 },
        { id: 3, name: 'فريق الأمان (السلامة والصيانة)', score: 850, badge: '🥉', color: 'bg-orange-100 text-orange-700', members: 8, streak: 1 },
        { id: 4, name: 'فريق التمكين (التأهيل والبرامج)', score: 720, badge: '4️⃣', color: 'bg-blue-100 text-blue-700', members: 10, streak: 0 },
        { id: 5, name: 'فريق الابتكار (تقنية المعلومات)', score: 680, badge: '5️⃣', color: 'bg-purple-100 text-purple-700', members: 6, streak: 2 },
    ];

    const topPerformers = [
        { name: 'أحمد محمد', role: 'مشرف تمريض', points: 350, achievement: 'Zero Missing (3 أسابيع)', badge: '🏆' },
        { name: 'سارة العلي', role: 'أخصائية اجتماعية', points: 310, achievement: 'اقتراح Kaizen منفذ', badge: '💡' },
        { name: 'خالد الزهراني', role: 'مسؤول سلامة', points: 280, achievement: '3 بلاغات Near-Miss', badge: '🛡️' },
        { name: 'نورة القحطاني', role: 'أخصائية تمريض', points: 250, achievement: '100% التزام بنظافة الأيدي', badge: '🧤' },
        { name: 'محمد العتيبي', role: 'أخصائي علاج طبيعي', points: 230, achievement: 'تحسين خطط التأهيل', badge: '⭐' },
        { name: 'فاطمة الغامدي', role: 'مسؤولة جودة', points: 210, achievement: 'إغلاق 5 NCRs في شهر', badge: '📋' },
    ];

    const badges = [
        { name: 'حارس القلعة', icon: '🏰', desc: 'الالتزام 100% بسجلات السلامة لمدة شهر كامل', count: 5, color: 'bg-[#14415A]', points: 50 },
        { name: 'صانع التغيير', icon: '💡', desc: 'تقديم فكرة Kaizen تم اعتمادها وتنفيذها', count: 2, color: 'bg-[#1E6B5C]', points: 100 },
        { name: 'صقر المراقبة', icon: '🦅', desc: 'الإبلاغ عن 3+ أحداث Near-Miss في شهر', count: 3, color: 'bg-amber-700', points: 75 },
        { name: 'بطل النظافة', icon: '🧤', desc: 'امتثال 100% في جولات نظافة الأيدي', count: 8, color: 'bg-blue-700', points: 40 },
        { name: 'نجم التوثيق', icon: '📝', desc: 'إكمال جميع السجلات بدون ملاحظات لمدة شهر', count: 4, color: 'bg-purple-700', points: 60 },
    ];

    const monthlyChallenges = [
        { title: 'تحدي صفر عدوى', desc: 'لا حالات عدوى مكتسبة في القسم', reward: 200, icon: '🦠', status: 'active', progress: 85 },
        { title: 'تحدي التوثيق الكامل', desc: 'إكمال 100% من السجلات اليومية', reward: 150, icon: '📊', status: 'active', progress: 72 },
        { title: 'تحدي الإبلاغ الاستباقي', desc: 'الإبلاغ عن 5 ملاحظات Near-Miss على الأقل', reward: 100, icon: '👁️', status: 'active', progress: 60 },
    ];

    const scoringCriteria = [
        { action: 'تسليم تقرير التفتيش اليومي بدون ملاحظات', points: 10 },
        { action: 'الإبلاغ عن حدث Near-Miss', points: 25 },
        { action: 'اقتراح Kaizen مقبول', points: 100 },
        { action: 'إكمال تدريب IPC', points: 30 },
        { action: 'مشاركة في جولة تفتيش', points: 15 },
        { action: 'إغلاق NCR/CAPA في الموعد', points: 50 },
        { action: 'امتثال 100% في نظافة الأيدي (أسبوعي)', points: 20 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Month Selector */}
            <div className="flex items-center gap-3 justify-between">
                <div className="flex gap-2">
                    {['يناير', 'فبراير'].map(month => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                selectedMonth === month ? 'bg-[#14415A] text-white shadow-md' : 'bg-white border text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {month} 2026
                        </button>
                    ))}
                </div>
                <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg">
                    🏆 بطل يناير: <strong className="text-[#14415A]">فريق التميز</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-[#14415A]">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                ترتيب الفرق - شهر {selectedMonth}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {teams.map((team, idx) => (
                                <div key={team.id} className="relative group">
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:scale-[1.01]">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${team.color} font-bold`}>
                                            {team.badge}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800">{team.name}</h4>
                                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{team.members} عضو</span>
                                                    {team.streak > 0 && (
                                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">🔥 {team.streak} أشهر متتالية</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-[#14415A]">{team.score.toLocaleString()} نقطة</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-[#148287]'}`}
                                                    style={{ width: `${(team.score / 1500) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {idx === 0 && (
                                        <div className="absolute -top-3 -right-3 rotate-12">
                                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-lg">المتصدر!</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Monthly Challenges */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-[#14415A] mb-4">
                            <Target className="w-5 h-5 text-orange-500" />
                            تحديات شهر {selectedMonth}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {monthlyChallenges.map((challenge, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all">
                                    <div className="text-2xl mb-2">{challenge.icon}</div>
                                    <h4 className="font-bold text-gray-800 text-sm mb-1">{challenge.title}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{challenge.desc}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                                        <div
                                            className="h-full bg-[#148287] rounded-full transition-all duration-500"
                                            style={{ width: `${challenge.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">{challenge.progress}% مكتمل</span>
                                        <span className="font-bold text-yellow-600">🏅 {challenge.reward} نقطة</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Badges Gallery */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-[#14415A] mb-4">
                            <Award className="w-5 h-5 text-yellow-500" />
                            أوسمة التميز
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {badges.map((badge, idx) => (
                                <div key={idx} className={`${badge.color} text-white rounded-xl p-4 hover:scale-[1.02] transition-all`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/10 rounded-lg text-2xl">{badge.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-sm">وسام "{badge.name}"</h4>
                                            <p className="text-xs opacity-70">{badge.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-80">{badge.count} حاصلين عليه</span>
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">+{badge.points} نقطة</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Scoring Criteria */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-[#14415A] mb-4">
                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                            نظام احتساب النقاط
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {scoringCriteria.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-green-50 transition-colors">
                                    <span className="text-sm text-gray-700">{item.action}</span>
                                    <span className="font-bold text-[#148287] text-sm whitespace-nowrap mr-3">+{item.points} نقطة</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Top Performers Sidebar */}
                <div className="space-y-6">
                    <Card className="p-6 border-t-4 border-t-yellow-400">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            نجوم الجودة
                        </h3>
                        <div className="space-y-3">
                            {topPerformers.map((person, idx) => (
                                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                                            {person.name.charAt(0)}
                                        </div>
                                        {idx < 3 && (
                                            <span className="absolute -top-1 -right-1 text-xs">
                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-bold text-gray-800 text-sm">{person.name}</h5>
                                        <p className="text-xs text-gray-500 mb-1">{person.role}</p>
                                        <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-medium border border-green-100">
                                            <span>{person.badge}</span>
                                            {person.achievement}
                                        </div>
                                    </div>
                                    <div className="font-bold text-[#148287] text-sm">
                                        +{person.points}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="p-6 bg-gradient-to-br from-[#14415A] to-[#1E6B5C] text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-yellow-400" />
                            إحصائيات الشهر
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sm opacity-80">إجمالي النقاط الموزعة</span>
                                <span className="font-bold text-yellow-400">4,480</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sm opacity-80">أوسمة ممنوحة</span>
                                <span className="font-bold text-yellow-400">22</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sm opacity-80">أفكار Kaizen مقدمة</span>
                                <span className="font-bold text-yellow-400">7</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sm opacity-80">بلاغات Near-Miss</span>
                                <span className="font-bold text-yellow-400">12</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sm opacity-80">نسبة المشاركة</span>
                                <span className="font-bold text-yellow-400">78%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const SopLibraryView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, _setSelectedDept] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const PAGE_SIZE = 20;

    // Get unique departments
    const _departments = useMemo(() => {
        const depts = new Set(qualityProcesses.map(p => p.department));
        return Array.from(depts);
    }, []);

    // Filter processes based on search and department
    const filteredProcesses = useMemo(() => {
        return qualityProcesses.filter(p => {
            const matchesSearch = searchTerm === '' ||
                p.name.includes(searchTerm) ||
                p.department.includes(searchTerm) ||
                p.responsible.includes(searchTerm) ||
                p.kpi.includes(searchTerm);
            const matchesDept = selectedDept === null || p.department === selectedDept;
            return matchesSearch && matchesDept;
        });
    }, [searchTerm, selectedDept]);

    // Pagination
    const totalPages = Math.ceil(filteredProcesses.length / PAGE_SIZE);
    const paginatedProcesses = filteredProcesses.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return (
        <div>
            <Card className="p-0 overflow-hidden">
                {/* Search Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2 text-[#14415A]">
                                <BookOpen className="w-5 h-5 text-[#148287]" />
                                مكتبة الإجراءات القياسية (SOPs)
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {filteredProcesses.length} عملية {selectedDept ? `في ${selectedDept}` : 'موثقة ومعتمدة'} — عرض {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredProcesses.length)}
                            </p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72">
                                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="بحث بالاسم، القسم، المسؤول، أو المؤشر..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#148287] text-sm bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SOP List */}
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                    {paginatedProcesses.map((process) => (
                        <div key={process.id}>
                            <div
                                onClick={() => setExpandedId(expandedId === process.id ? null : process.id)}
                                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-800 text-sm group-hover:text-[#148287] transition-colors">{process.name}</h4>
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">SOP-{process.id.padStart(3, '0')}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                            <span>القسم: {process.department}</span>
                                            <span>•</span>
                                            <span>المسؤول: {process.responsible}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                                        {process.frequency}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {process.duration}
                                    </span>
                                    {expandedId === process.id ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            {/* Expanded Details */}
                            {expandedId === process.id && (
                                <div className="px-4 pb-4 bg-blue-50/30 border-t border-blue-100 animate-in fade-in duration-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                                                <ArrowRight className="w-3 h-3 text-green-500" />
                                                المدخلات
                                            </div>
                                            <p className="text-sm text-gray-700">{process.inputs}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                                المخرجات
                                            </div>
                                            <p className="text-sm text-gray-700">{process.outputs}</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-100 md:col-span-2">
                                            <div className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
                                                <Target className="w-3 h-3 text-purple-500" />
                                                مؤشر الأداء (KPI)
                                            </div>
                                            <p className="text-sm text-gray-700">{process.kpi}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="bg-white rounded-lg p-3 border border-gray-100 flex-1">
                                                <div className="text-xs font-bold text-gray-500 mb-1">التكرار</div>
                                                <p className="text-sm font-medium text-green-700">{process.frequency}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-gray-100 flex-1">
                                                <div className="text-xs font-bold text-gray-500 mb-1">المدة</div>
                                                <p className="text-sm font-medium text-blue-700">{process.duration}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                                            <div className="text-xs font-bold text-gray-500 mb-1">المسؤول</div>
                                            <p className="text-sm font-medium text-[#14415A]">{process.responsible}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            السابق
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                        currentPage === page
                                            ? 'bg-[#148287] text-white shadow-md'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white border rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            التالي
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredProcesses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>لا توجد عمليات مطابقة لمعايير البحث</p>
                    </div>
                )}
            </Card>
        </div>
    );
};
