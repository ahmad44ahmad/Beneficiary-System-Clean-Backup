import React, { useState } from 'react';
import { FileText, Printer, BookOpen, Target, Shield, Heart, Activity, LineChart, Users, Building, AlertTriangle, CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';

export const QualityManual: React.FC = () => {
    const [activeSection, setActiveSection] = useState('intro');

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 font-sans text-right" dir="rtl">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-72 flex-shrink-0">
                <div className="sticky top-4 bg-white rounded-xl shadow-soft border border-gray-100 p-4 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                    <h3 className="font-bold text-lg text-primary-dark mb-4 border-b pb-2">فهرس الدليل</h3>
                    <nav className="space-y-1">
                        {[
                            { id: 'intro', label: 'المقدمة التنفيذية', icon: FileText },
                            { id: 'part1', label: '1. الإطار الاستراتيجي والتنظيمي', icon: Target },
                            { id: 'part2', label: '2. الأقسام الفنية الكبرى', icon: Building },
                            { id: 'part3', label: '3. نظام ISO 9001 وخارطة الطريق', icon: Shield },
                            { id: 'part4', label: '4. العمليات والإجراءات', icon: Activity },
                            { id: 'part5', label: '5. مؤشرات الأداء (BSC)', icon: LineChart },
                            { id: 'part6', label: '6. مبادرة IHSAN وبصيرة', icon: CheckSquare },
                            { id: 'part7', label: '7. السلامة والصحة المهنية', icon: AlertTriangle },
                            { id: 'part8', label: '8. نظام التميز المؤسسي', icon: Users },
                            { id: 'part9', label: '9. النماذج والاستمارات', icon: FileText },
                            { id: 'part10', label: '10. الخطط الاستراتيجية 2030', icon: Target },
                            { id: 'part11', label: '11. البنية الرقمية', icon: Activity },
                            { id: 'part12', label: '12. الاعتبارات التشغيلية', icon: Users },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeSection === item.id
                                        ? 'bg-primary-50 text-primary-dark shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-primary' : 'text-gray-400'}`} />
                                <span className="truncate" title={item.label}>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="mt-6 pt-4 border-t sticky bottom-0 bg-white">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary-50"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4" />
                            طباعة الدليل
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8 bg-gray-50/50 rounded-2xl print:w-full print:bg-white">

                {/* Header Section */}
                <div className="bg-white rounded-2xl p-8 shadow-soft border-t-8 border-primary text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/assets/organization-logo.jpg" alt="Logo" className="h-24 object-contain" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">الدليل الشامل لنظام الجودة</h1>
                    <h2 className="text-xl text-primary-dark font-medium mb-4">مركز التأهيل الشامل بمنطقة الباحة</h2>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="bg-primary-50 text-primary-800 px-3 py-1 rounded-full">إصدار: ديسمبر 2025</span>
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">مدير الجودة: أحمد الشهري</span>
                    </div>
                </div>

                {/* Intro */}
                <section id="intro" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <BookOpen className="text-primary w-6 h-6" />
                        المقدمة التنفيذية
                    </h2>
                    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg">
                        <p className="mb-4">
                            يمثل مركز التأهيل الشامل بالباحة نموذجاً ريادياً في <strong>التحول من الرعاية الإيوائية التقليدية إلى التمكين الشامل</strong>، مستنداً إلى منظومة جودة متكاملة تجمع بين معايير <strong>ISO 9001:2015</strong> ونموذج التميز الأوروبي <strong>EFQM</strong> ومبادئ <strong>رؤية المملكة 2030</strong>. يضم النظام <strong>أكثر من 127 عملية</strong> موثقة موزعة على <strong>7 أقسام إدارية</strong> و<strong>25 وحدة فرعية</strong>، مع استهداف الحصول على شهادة الأيزو بحلول <strong>يونيو 2026</strong>.
                        </p>
                        <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-l-lg my-4">
                            <p className="font-bold text-blue-900">مفهوم "الخيط الذهبي":</p>
                            <p className="text-blue-800 text-sm mt-1">
                                يربط المركز بين ثلاثة محاور: <strong>الغاية</strong> (تمكين ذوي الإعاقة)، <strong>التميز</strong> (نموذج EFQM)، و<strong>الامتثال</strong> (ISO 9001:2015)، محققاً بذلك التكامل بين الرؤية الاستراتيجية والتطبيق التشغيلي اليومي.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Part 1: Strategic Frame */}
                <section id="part1" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-sm font-bold">1</span>
                        الإطار الاستراتيجي والتنظيمي
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-primary mb-3">الرؤية</h3>
                            <p className="text-gray-700 italic">"أن نكون مركزاً رائداً في تقديم خدمات التأهيل الشامل عالية الجودة، محققين التمكين والاستقلالية للأشخاص ذوي الإعاقة، ومساهمين في بناء مجتمع دامج يحترم التنوع الإنساني."</p>
                        </div>
                        <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-xl border border-primary-100">
                            <h3 className="font-bold text-primary mb-3">الشعار الاستراتيجي</h3>
                            <p className="text-2xl font-bold text-primary-800 text-center py-4">"من حراسة العجز إلى هندسة القدرة"</p>
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-4">الهيكل التنظيمي (4 مستويات)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-right">المستوى</th>
                                    <th className="p-3 text-right">الوحدة التنظيمية</th>
                                    <th className="p-3 text-right">المسؤوليات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-3 font-bold">الأول</td>
                                    <td className="p-3">مساعد مدير عام الفرع</td>
                                    <td className="p-3 text-gray-600">الإشراف العام على المركز</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold">الثاني</td>
                                    <td className="p-3">مدير مركز التأهيل</td>
                                    <td className="p-3 text-gray-600">القيادة والتوجيه الاستراتيجي</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold">الثالث</td>
                                    <td className="p-3">6 أقسام + السكرتارية</td>
                                    <td className="p-3 text-gray-600">التنفيذ والإشراف التشغيلي</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold">الرابع</td>
                                    <td className="p-3">الوحدات الفرعية (13+)</td>
                                    <td className="p-3 text-gray-600">تقديم الخدمات المباشرة</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Part 2: Technical Departments */}
                <section id="part2" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-sm font-bold">2</span>
                        الأقسام الفنية الثلاثة الكبرى
                    </h2>

                    <div className="space-y-6">
                        <div className="border border-green-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <Activity className="w-10 h-10 text-green-600 bg-green-50 p-2 rounded-lg" />
                                <div>
                                    <h3 className="text-xl font-bold text-green-900 mb-2">1. القسم الصحي (الخدمات الطبية)</h3>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li><strong className="text-gray-900">وحدة العلاج الطبي:</strong> أطباء، تمريض، أسنان، تغذية. (د. محمد بلال، د. أيمن علي)</li>
                                            <li><strong className="text-gray-900">وحدة العلاج التأهيلي:</strong> علاج طبيعي (أحمد الشهري)، وظيفي، نفسي، تخاطب.</li>
                                        </ul>
                                        <div className="bg-green-50 p-3 rounded">
                                            <strong>أهم العمليات:</strong> المرور اليومي، متابعة الصرع، الحالات الطارئة، جلسات التأهيل.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <Users className="w-10 h-10 text-blue-600 bg-blue-50 p-2 rounded-lg" />
                                <div>
                                    <h3 className="text-xl font-bold text-blue-900 mb-2">2. القسم الاجتماعي</h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                        <div>
                                            <strong className="block text-gray-900 mb-1">وحدة التأهيل المجتمعي</strong>
                                            برامج الدمج، الأنشطة، التدريب، المناسبات العالمية.
                                        </div>
                                        <div>
                                            <strong className="block text-gray-900 mb-1">وحدة المتابعة الداخلية</strong>
                                            ملفات الحالات، الخطط العلاجية، الأخصائيات والمراقبات.
                                        </div>
                                        <div>
                                            <strong className="block text-gray-900 mb-1">وحدة الإرشاد الأسري</strong>
                                            دعم الأسر، الزيارات، الرعاية اللاحقة.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-orange-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <Building className="w-10 h-10 text-orange-600 bg-orange-50 p-2 rounded-lg" />
                                <div>
                                    <h3 className="text-xl font-bold text-orange-900 mb-2">3. قسم الخدمات المساندة</h3>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {['الاتصالات الإدارية', 'الموارد البشرية', 'تقنية المعلومات', 'الأمن والسلامة', 'العلاقات العامة والإعلام'].map(tag => (
                                            <span key={tag} className="bg-orange-50 text-orange-800 px-2 py-1 rounded border border-orange-200">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Part 3: ISO 9001 */}
                <section id="part3" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-sm font-bold">3</span>
                            نظام ISO 9001:2015 وخارطة الطريق
                        </h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">استهداف: يونيو 2026</span>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-3">سياق المنظمة</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <strong className="block text-gray-900 mb-1">السياق الخارجي</strong>
                                <p className="text-sm text-gray-600">تحديات منطقة الباحة الجبلية، التحول الوطني نحو التمكين، لوائح الحقوق.</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <strong className="block text-gray-900 mb-1">السياق الداخلي</strong>
                                <p className="text-sm text-gray-600">ثقافة العمل الجماعي، المرافق المجهزة، كفاءة الكوادر.</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-bold text-gray-900 mb-3">الأطراف المعنية</h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'المستفيدون', val: 'رعاية آمنة وتأهيل فعال' },
                                { label: 'الأسر', val: 'شفافية واطمئنان' },
                                { label: 'الوزارة', val: 'امتثال وكفاءة إنفاق' },
                                { label: 'الموظفون', val: 'بيئة آمنة وتطوير' },
                                { label: 'المجتمع', val: 'مسؤولية وشراكة' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white border rounded px-3 py-2 text-sm shadow-sm flex-grow">
                                    <span className="block font-bold text-primary">{item.label}</span>
                                    <span className="text-xs text-gray-500">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Part 4: Processes */}
                <section id="part4" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-sm font-bold">4</span>
                        العمليات والإجراءات التشغيلية (127+)
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">أعلى الأقسام من حيث عدد العمليات</h3>
                            <div className="space-y-2">
                                {[
                                    { name: 'العلاج الطبي', count: 7, pct: 5.5 },
                                    { name: 'التخاطب', count: 6, pct: 4.7 },
                                    { name: 'الصيانة والخدمات', count: 6, pct: 4.7 },
                                    { name: 'الأنشطة والبرامج', count: 6, pct: 4.7 },
                                    { name: 'العلاج الطبيعي', count: 6, pct: 4.7 },
                                ].map(proc => (
                                    <div key={proc.name} className="flex items-center gap-2 text-sm">
                                        <div className="w-32">{proc.name}</div>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div className="bg-teal-500 h-full" style={{ width: `${proc.pct * 10}%` }}></div>
                                        </div>
                                        <div className="text-xs font-bold w-6">{proc.count}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-900 mb-3 text-sm">التوزيع الزمني للعمليات</h3>
                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="bg-white p-2 rounded shadow-sm border">
                                    <div className="text-2xl font-bold text-primary">25</div>
                                    <div className="text-xs text-gray-500">عملية مستمرة</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm border">
                                    <div className="text-2xl font-bold text-blue-600">23</div>
                                    <div className="text-xs text-gray-500">عملية يومية</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm border">
                                    <div className="text-2xl font-bold text-purple-600">18</div>
                                    <div className="text-xs text-gray-500">عملية شهرية</div>
                                </div>
                                <div className="bg-white p-2 rounded shadow-sm border">
                                    <div className="text-2xl font-bold text-orange-600">10</div>
                                    <div className="text-xs text-gray-500">عملية ربعية</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Part 5: BSC */}
                <section id="part5" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-700 text-sm font-bold">5</span>
                        مؤشرات الأداء - بطاقة الأداء المتوازن (BSC)
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-red-100 rounded-lg overflow-hidden">
                            <div className="bg-red-50 p-3 border-b border-red-100 font-bold text-red-800 text-sm flex items-center gap-2">
                                <Shield className="w-4 h-4" /> العمليات الداخلية (السلامة)
                            </div>
                            <div className="p-3 text-sm space-y-2">
                                <div className="flex justify-between"><span>معدل السقوط</span><span className="font-bold text-red-600">&lt; 1 / 1000 يوم</span></div>
                                <div className="flex justify-between"><span>تقرحات الفراش</span><span className="font-bold text-red-600">&lt; 2%</span></div>
                                <div className="flex justify-between"><span>الالتزام ببروتوكول العدوى</span><span className="font-bold text-green-600">100%</span></div>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-lg overflow-hidden">
                            <div className="bg-blue-50 p-3 border-b border-blue-100 font-bold text-blue-800 text-sm flex items-center gap-2">
                                <Heart className="w-4 h-4" /> رضا المستفيدين
                            </div>
                            <div className="p-3 text-sm space-y-2">
                                <div className="flex justify-between"><span>رضا المستفيدين</span><span className="font-bold text-blue-600">&gt; 90%</span></div>
                                <div className="flex justify-between"><span>الاستجابة للشكاوى</span><span className="font-bold text-blue-600">48 ساعة</span></div>
                                <div className="flex justify-between"><span>نصافي نقاط الترويج (NPS)</span><span className="font-bold text-blue-600">+50</span></div>
                            </div>
                        </div>

                        <div className="border border-green-100 rounded-lg overflow-hidden">
                            <div className="bg-green-50 p-3 border-b border-green-100 font-bold text-green-800 text-sm flex items-center gap-2">
                                <LineChart className="w-4 h-4" /> المالي
                            </div>
                            <div className="p-3 text-sm space-y-2">
                                <div className="flex justify-between"><span>الالتزام بالميزانية</span><span className="font-bold text-green-600">95-100%</span></div>
                                <div className="flex justify-between"><span>تكلفة الخدمة/مستفيد</span><span className="font-bold text-green-600">-5% سنوياً</span></div>
                            </div>
                        </div>

                        <div className="border border-purple-100 rounded-lg overflow-hidden">
                            <div className="bg-purple-50 p-3 border-b border-purple-100 font-bold text-purple-800 text-sm flex items-center gap-2">
                                <Users className="w-4 h-4" /> التعلم والنمو
                            </div>
                            <div className="p-3 text-sm space-y-2">
                                <div className="flex justify-between"><span>اكتمال خطط التدريب</span><span className="font-bold text-purple-600">100%</span></div>
                                <div className="flex justify-between"><span>رضا الموظفين</span><span className="font-bold text-purple-600">&ge; 85%</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Part 6: Basira */}
                <section id="part6" className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white rounded-xl p-8 shadow-sm scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
                        <span className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center text-yellow-400 text-sm font-bold">6</span>
                        مبادرة واحة الإحسان الذكية (IHSAN)
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2">رؤية المبادرة</h3>
                            <p className="text-indigo-200 text-sm mb-4">
                                تحويل مركز الباحة إلى أول منطقة تنظيمية تجريبية (Regulatory Sandbox) لتطبيق "النموذج السعودي للتمكين المستدام".
                            </p>
                            <div className="space-y-4">
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                    <div className="font-bold text-sm text-yellow-400 mb-1">نظام بصيرة (Basira cOS)</div>
                                    <p className="text-xs text-slate-300">أول نظام تشغيل ذكي للمراكز يعتمد على البيانات الحية والذكاء الاصطناعي التنبؤي.</p>
                                </div>
                                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                    <div className="font-bold text-sm text-yellow-400 mb-1">نتائج المحاكاة</div>
                                    <div className="flex justify-between text-xs mt-2">
                                        <span>العائد الاجتماعي: <strong>1:5.56</strong></span>
                                        <span>مؤشر الإحسان: <strong>+32%</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h3 className="font-bold text-sm mb-3 text-center border-b border-white/10 pb-2">الجدول الزمني لتنفيذ بصيرة (9 أسابيع)</h3>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex justify-between"><span>1. التجهيز والإعداد</span><span className="text-green-400">أسبوع 1</span></div>
                                <div className="flex justify-between"><span>2. التطوير والاختبار</span><span className="text-green-400">أسبوع 2-3</span></div>
                                <div className="flex justify-between"><span>3. العرض والموافقة</span><span className="text-green-400">أسبوع 4</span></div>
                                <div className="flex justify-between"><span>4. التجربة الفعلية (Pilot)</span><span className="text-green-400">أسبوع 5-8</span></div>
                                <div className="flex justify-between text-yellow-400 font-bold"><span>5. الاعتماد والتعميم</span><span>أسبوع 9+</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Sections Placeholder (7-12) */}
                <div className="grid md:grid-cols-2 gap-6">
                    <section id="part7" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            7. السلامة والصحة المهنية
                        </h3>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                            <li>شراكة استراتيجية مع الهلال الأحمر.</li>
                            <li>سياسة المناولة الآمنة (هندسة الرفع).</li>
                            <li>خطط إخلاء شخصية (PEEPs) لكل نزيل.</li>
                            <li>مصفوفة مخاطر شاملة (حريق، زلازل، عدوى).</li>
                        </ul>
                    </section>

                    <section id="part8" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            8. نظام التميز المؤسسي
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">اعتماد نموذج <strong>EFQM</strong>.</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex justify-between border-b pb-1"><span>هدف EFQM 2028</span><span className="font-bold">500 نقطة</span></li>
                            <li className="flex justify-between border-b pb-1"><span>جائزة الملك عبدالعزيز</span><span className="font-bold">مستهدف</span></li>
                        </ul>
                    </section>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <section id="part9" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            9. النماذج والاستارات
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2 py-1 bg-gray-100 rounded">اجتماعية (11)</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">نفسية (8)</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">تربية خاصة (6)</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">طبية (6)</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">تغذية (10)</span>
                        </div>
                    </section>
                    <section id="part10" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 scroll-mt-24">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-teal-500" />
                            10. الخطط الاستراتيجية 2030
                        </h3>
                        <p className="text-sm font-bold text-primary mb-1">مانيفستو التمكين:</p>
                        <ul className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                            <li>من الوصاية إلى الاختيار (Autonomy).</li>
                            <li>الإعاقة ليست قدراً.</li>
                            <li>الاستثمار في الاستقلالية.</li>
                        </ul>
                    </section>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm pt-8 border-t mt-8">
                    <p>جميع الحقوق محفوظة © 2025 - مركز التأهيل الشامل بمنطقة الباحة</p>
                    <p className="mt-1">وزارة الموارد البشرية والتنمية الاجتماعية</p>
                </div>

            </main>
        </div>
    );
};
