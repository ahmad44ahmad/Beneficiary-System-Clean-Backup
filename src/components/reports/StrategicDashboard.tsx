import React, { useState } from 'react';
import { FileText, Printer, BookOpen, ChevronLeft, Target, Shield, Heart, Activity, LineChart } from 'lucide-react';
import { Button } from '../ui/Button';

export const StrategicDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState('exec-summary');

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto font-sans" dir="rtl">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-24 bg-white rounded-xl shadow-soft border border-gray-100 p-4">
                    <h3 className="font-bold text-lg text-primary-dark mb-4 border-b pb-2">فهرس التقرير</h3>
                    <nav className="space-y-1">
                        {[
                            { id: 'exec-summary', label: '1. الملخص التنفيذي', icon: FileText },
                            { id: 'strategic-context', label: '2. السياق الاستراتيجي', icon: Target },
                            { id: 'deep-diagnosis', label: '3. التشخيص العميق', icon: Activity },
                            { id: 'theoretical-framework', label: '4. الإطار النظري', icon: BookOpen },
                            { id: 'roadmap', label: '5. خارطة الطريق', icon: LineChart },
                            { id: 'technical-detail', label: '6. التفصيل الفني', icon: Activity },
                            { id: 'spending-efficiency', label: '7. كفاءة الإنفاق', icon: LineChart },
                            { id: 'conclusion', label: '8. الخاتمة والتوصيات', icon: Heart },
                            { id: 'references', label: '9. المراجع والمصادر', icon: BookOpen },
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
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-6 pt-4 border-t">
                        <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary-50"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4" />
                            طباعة التقرير
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8 print:w-full print:p-0">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 shadow-soft border-t-8 border-primary text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/assets/organization-logo.jpg" alt="Logo" className="h-24 object-contain" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">التقرير الاستراتيجي الشامل</h1>
                    <h2 className="text-xl text-primary-dark font-medium mb-4">خارطة طريق التكامل والاعتماد للتميز المؤسسي</h2>
                    <div className="text-sm text-gray-500 flex justify-center gap-4">
                        <span>كبير استشاريي التميز المؤسسي والجودة</span>
                        <span>•</span>
                        <span>10 ديسمبر 2025</span>
                    </div>
                </div>

                {/* 1. الملخص التنفيذي */}
                <section id="exec-summary" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-dark font-bold text-xl">1</div>
                        <h2 className="text-2xl font-bold text-gray-800">الملخص التنفيذي</h2>
                    </div>
                    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                        <h3 className="font-bold text-lg text-secondary-700">هندسة التحول في زمن الرؤية</h3>
                        <p>
                            في خضم التحولات الجيواستراتيجية والاقتصادية التي تشهدها المملكة العربية السعودية تحت مظلة "رؤية 2030"، تقف وزارة الموارد البشرية والتنمية الاجتماعية (MHRSD) أمام استحقاق تاريخي يتمثل في إعادة تعريف العلاقة بين الدولة والمستفيد. لم يعد الهدف مجرد تقديم "الخدمة" بمعناها التقليدي، بل "تمكين" الفرد ليكون عنصراً منتجاً وفاعلاً. هذا التقرير، الذي يمتد عبر تحليل عميق للوثائق التشغيلية والاستراتيجية، يقدم خارطة طريق تنفيذية لا تهدف فقط إلى نيل الشهادات الدولية (ISO)، بل إلى استخدام هذه المعايير كأدوات "إزميل ومطرقة" لإعادة تشكيل الهيكل التشغيلي للوزارة ومرافقها.
                        </p>

                        <h3 className="font-bold text-lg text-secondary-700 mt-6">الانفصام الاستراتيجي</h3>
                        <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-l-lg">
                            <p className="text-red-900 font-medium">كشف المسح العميق (Deep Dive) للملفات التشغيلية، وتحديداً في مراكز التأهيل الشامل، عن فجوة جوهرية.</p>
                            <p className="text-sm text-red-800 mt-2">
                                فبينما تتحدث الاستراتيجيات العليا عن "التمكين" و"الحقوق" و"جودة الحياة"، لا تزال التروس التشغيلية في الميدان تدور وفق "النموذج الطبي" (Medical Model) الصرف، حيث يُختزل المستفيد في تقرير طبي ورقم سرير، وتُقاس الجودة بنظافة الأرضيات واكتمال التواقيع الورقية، وهو ما يولد ظاهرة "وهم الإنجاز".
                            </p>
                        </div>

                        <p className="mt-4">
                            تقترح خارطة الطريق المرفقة حلاً جذرياً لهذه المعضلة عبر منهجية <strong>"نظام الإدارة المتكامل" (IMS)</strong> القائم على مبدأ "الجهد الواحد لنتائج متعددة". بدلاً من التعامل مع كل معيار (الجودة، السلامة، رضا المستفيد، المواءمة) كجزيرة منعزلة، يتم دمجها في نسيج واحد. فإجراء "تقييم المخاطر" الواحد سيغطي متطلبات ISO 9001 (مخاطر العمليات)، وISO 45001 (مخاطر السلامة)، وقرار الحماية السلوكية (المخاطر النفسية)، ومتطلبات "مواءمة" (مخاطر الوصول). هذا النهج لا يوفر الموارد فحسب، بل يضمن أن "كفاءة الإنفاق" ليست مجرد خفض للتكاليف، بل تعظيم للأثر الاجتماعي والاقتصادي لكل ريال يتم إنفاقه.
                        </p>
                    </div>
                </section>

                {/* 2. السياق الاستراتيجي */}
                <section id="strategic-context" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xl">2</div>
                        <h2 className="text-2xl font-bold text-gray-800">السياق الاستراتيجي</h2>
                    </div>
                    <div className="prose max-w-none text-gray-700 leading-relaxed space-y-4">
                        <h3 className="font-bold text-lg text-teal-700">قراءة في عقل الوزارة الجديد</h3>
                        <p>لفهم التحديات التشغيلية، يجب أولاً تشريح العقل الاستراتيجي الذي يوجه الوزارة حالياً، استناداً إلى وثائق التحول والاستراتيجيات الوطنية.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-2">2.1 التحول من "التشغيل" إلى "التنظيم والتمكين"</h4>
                                <p className="text-sm">تشير وثيقة "برامج التحول في وزارة الموارد البشرية" بوضوح إلى تغيير جذري في النموذج التشغيلي (Operating Model). الهدف هو تقليص القوى العاملة المباشرة في تقديم الخدمة من حوالي 21,000 موظف إلى أدوار إشرافية وتنظيمية، مع إسناد الخدمات التشغيلية للقطاعين الخاص وغير الربحي.</p>
                                <p className="text-sm mt-2 text-teal-700 font-medium">← الجودة هي اللغة المشتركة لضبط آلاف الموردين.</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-2">2.2 استراتيجية 2025: محاور التمكين وكفاءة الإنفاق</h4>
                                <ul className="list-disc list-inside text-sm space-y-2">
                                    <li><strong>مجتمع حيوي ممكّن:</strong> الانتقال من "الضمان" كراتب إلى "التمكين" كمسار حياة.</li>
                                    <li><strong>بيئة عمل متميزة:</strong> الوزارة كقدوة (Role Model) في السلامة والمواءمة.</li>
                                    <li><strong>كفاءة الإنفاق:</strong> الاستثمار في الوقاية (ISO 45001) لمنع الهدر المالي الناتج عن الحوادث.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. التشخيص العميق */}
                <section id="deep-diagnosis" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xl">3</div>
                        <h2 className="text-2xl font-bold text-gray-800">التشخيص العميق</h2>
                    </div>
                    <p className="mb-6 text-gray-600">بناءً على التكليف، تم إجراء مسح دقيق للملفات المتاحة، وتحديداً تلك المتعلقة بالعمليات اليومية في مراكز التأهيل والمستندات الطبية والإدارية.</p>

                    <div className="space-y-6">
                        <div className="flex gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                            <Activity className="w-8 h-8 text-blue-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900">3.1 تحليل "المؤشرات الطبية": هيمنة النموذج السريري</h4>
                                <p className="text-sm text-gray-600 mt-1">يعتمد النظام على مؤشرات عناية مركزة (CLABSI, CAUTI) بدلاً من مؤشرات تأهيلية، مما يحول المركز إلى "عنبر عزل".</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                            <Shield className="w-8 h-8 text-green-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900">3.2 تحليل "السلامة والصحة المهنية": بين الورق والواقع</h4>
                                <p className="text-sm text-gray-600 mt-1">التعامل مع السلامة كـ "رد فعل" (Reactive). الغائب هو "تقييم المخاطر الاستباقي". عدم تفعيل القرار الوزاري رقم 20912.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                            <Heart className="w-8 h-8 text-red-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900">3.3 تحليل "رضا المستفيد": أزمة الصوت الصامت</h4>
                                <p className="text-sm text-gray-600 mt-1">غياب نظام إدارة شكاوى فعال (ISO 10002). الشكوى "مشكلة" وليست "فرصة". قياس "جودة الخدمة" بدلاً من "جودة الأثر".</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                            <Target className="w-8 h-8 text-purple-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900">3.4 تحليل "التحول في الوزارة": الطموح مقابل الأدوات</h4>
                                <p className="text-sm text-gray-600 mt-1">طموح لتبني نماذج عالمية (NDIS) وتقنيات (VR). لكنها لا تزال "مشاريع تجريبية" تفتقر إلى بنية تحتية للجودة لتحويلها لإجراءات قياسية.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. الإطار النظري */}
                <section id="theoretical-framework" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold text-xl">4</div>
                        <h2 className="text-2xl font-bold text-gray-800">الإطار النظري: فلسفة "الجهد الواحد لنتائج متعددة"</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-900 border-b-2 border-primary">
                                    <th className="p-4 font-bold">مجال العمل</th>
                                    <th className="p-4 font-bold">الإجراء الموحد</th>
                                    <th className="p-4 font-bold bg-blue-50">ISO 9001 (الجودة)</th>
                                    <th className="p-4 font-bold bg-green-50">ISO 45001 (السلامة)</th>
                                    <th className="p-4 font-bold bg-yellow-50">Mowaamah (التمكين)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-4 font-bold">إدارة البنية التحتية</td>
                                    <td className="p-4">جولة تفتيش موحدة (شهرياً)</td>
                                    <td className="p-4 bg-blue-50/30">ملاءمة البيئة للخدمة</td>
                                    <td className="p-4 bg-green-50/30">كشف مخاطر السقوط والحريق</td>
                                    <td className="p-4 bg-yellow-50/30">التحقق من معايير الوصول الشامل</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold">الموارد البشرية</td>
                                    <td className="p-4">سجل الجدارات والتدريب</td>
                                    <td className="p-4 bg-blue-50/30">كفاءة أداء المهام</td>
                                    <td className="p-4 bg-green-50/30">الوعي بالمخاطر والطوارئ</td>
                                    <td className="p-4 bg-yellow-50/30">إتيكيت التعامل مع ذوي الإعاقة</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold">القيادة والحوكمة</td>
                                    <td className="p-4">مراجعة الإدارة الموحدة</td>
                                    <td className="p-4 bg-blue-50/30">مراجعة مؤشرات الأداء</td>
                                    <td className="p-4 bg-green-50/30">مراجعة حوادث السلامة</td>
                                    <td className="p-4 bg-yellow-50/30">مؤشرات التقدم في التمكين</td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold">إدارة المستفيدين</td>
                                    <td className="p-4">الملف الموحد (رقمي)</td>
                                    <td className="p-4 bg-blue-50/30">ضبط الخدمة وتوثيقها</td>
                                    <td className="p-4 bg-green-50/30">الحالات الصحية والحساسية</td>
                                    <td className="p-4 bg-yellow-50/30">احتياجات الدعم (I-CAN)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 5. خارطة الطريق */}
                <section id="roadmap" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">5</div>
                        <h2 className="text-2xl font-bold text-gray-800">خارطة الطريق (18-24 شهراً)</h2>
                    </div>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">

                        {/* Phase 1 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                1
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900">المرحلة الأولى: التأسيس والتوافق</div>
                                    <time className="font-caveat font-medium text-indigo-500">الشهور 1-8</time>
                                </div>
                                <div className="text-slate-500 text-sm">
                                    الهدف: "تنظيف البيت الداخلي" وضمان الامتثال (Do No Harm).
                                    <ul className="list-disc list-inside mt-2">
                                        <li><strong>الحوكمة:</strong> تأسيس "مكتب إدارة النظام المتكامل" (IMS Office).</li>
                                        <li><strong>السلامة الشاملة:</strong> توسيع المخاطر لتشمل النفسية والاجتماعية.</li>
                                        <li><strong>البنية التحتية:</strong> مسح هندسي شامل وإغلاق حالات عدم المطابقة.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                2
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900">المرحلة الثانية: التحول الرقمي وإعادة الهندسة</div>
                                    <time className="font-caveat font-medium text-indigo-500">الشهور 9-16</time>
                                </div>
                                <div className="text-slate-500 text-sm">
                                    الهدف: الانتقال من "إدارة الورق" إلى "إدارة البيانات".
                                    <ul className="list-disc list-inside mt-2">
                                        <li><strong>هندسة الرحلة:</strong> استبدال التقييم الطبي بـ (I-CAN).</li>
                                        <li><strong>صوت المستفيد:</strong> أدوات قياس رضا متعددة الوسائط.</li>
                                        <li><strong>الابتكار:</strong> دراسة جدوى الواقع الافتراضي (VR).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-purple-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                3
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900">المرحلة الثالثة: التميز وقياس الأثر</div>
                                    <time className="font-caveat font-medium text-indigo-500">الشهور 17-24</time>
                                </div>
                                <div className="text-slate-500 text-sm">
                                    الهدف: الحصول على الاعتماد الدولي وقياس العائد الاجتماعي.
                                    <ul className="list-disc list-inside mt-2">
                                        <li><strong>التدقيق المدمج:</strong> ISO 9001, 45001, 10002 وشهادة "مواءمة".</li>
                                        <li><strong>التمويل بالنتائج:</strong> تفعيل "سندات الأثر الاجتماعي".</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 6, 7, 8, 9 Sections - Grouped for brevity in code but full in UI */}
                <section id="technical-detail" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-gray-200 text-gray-700 flex items-center justify-center text-sm">6</span>
                        التفصيل الفني
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border p-4 rounded-lg">
                            <h4 className="font-bold text-primary mb-2">الموارد البشرية</h4>
                            <p className="text-sm text-gray-600 mb-2"><strong>الحالي:</strong> تدريب روتيني.</p>
                            <p className="text-sm text-gray-900"><strong>الهدف:</strong> دمج مدونة السلوك في العقود. جدارات "تيسير الوصول".</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h4 className="font-bold text-primary mb-2">المشتريات والعقود</h4>
                            <p className="text-sm text-gray-600 mb-2"><strong>الحالي:</strong> تركيز على السعر.</p>
                            <p className="text-sm text-gray-900"><strong>الهدف:</strong> بنود صارمة للسلامة (ISO 45001) ومواءمة الأدوات.</p>
                        </div>
                        <div className="border p-4 rounded-lg">
                            <h4 className="font-bold text-primary mb-2">الصيانة والتشغيل</h4>
                            <p className="text-sm text-gray-600 mb-2"><strong>الحالي:</strong> صيانة تصحيحية.</p>
                            <p className="text-sm text-gray-900"><strong>الهدف:</strong> صيانة وقائية. قائمة فحص "مواءمة" للمنحدرات.</p>
                        </div>
                    </div>
                </section>

                <section id="spending-efficiency" className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-gray-200 text-gray-700 flex items-center justify-center text-sm">7</span>
                        كفاءة الإنفاق (ROI)
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex items-start gap-2 bg-green-50 p-3 rounded">
                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                            <div>
                                <span className="font-bold block text-green-800">تقليل تكلفة الجودة الرديئة (COPQ)</span>
                                <span className="text-sm text-green-700">تقليل تكلفة "إعادة العمل" التي تلتهم 15-20% من الميزانية.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-2 bg-green-50 p-3 rounded">
                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                            <div>
                                <span className="font-bold block text-green-800">الوفورات الطبية</span>
                                <span className="text-sm text-green-700">تقليل نفقات التنويم عبر بروتوكولات العدوى الصارمة.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-2 bg-green-50 p-3 rounded">
                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                            <div>
                                <span className="font-bold block text-green-800">تحرير الموارد</span>
                                <span className="text-sm text-green-700">التحول الرقمي يوفر وقت الموظفين للتركيز على الرعاية.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-2 bg-green-50 p-3 rounded">
                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                            <div>
                                <span className="font-bold block text-green-800">الاستدامة وجذب الاستثمار</span>
                                <span className="text-sm text-green-700">نظام الجودة شرط أساسي لمشاريع الخصخصة.</span>
                            </div>
                        </li>
                    </ul>
                </section>

                <section id="conclusion" className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-8 shadow-sm border border-primary-100 scroll-mt-24">
                    <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 rounded bg-primary-200 text-primary-900 flex items-center justify-center text-sm">8</span>
                        الخاتمة والتوصيات
                    </h2>
                    <p className="text-lg text-primary-800 mb-6 font-medium">
                        إن وزارة الموارد البشرية والتنمية الاجتماعية، بتبنيها لهذه الخارطة، لا تقوم فقط بمشروع "تحسين جودة"، بل تعيد صياغة العقد الاجتماعي مع المستفيدين.
                    </p>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 border-b pb-2">التوصيات التنفيذية العاجلة</h4>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li><strong className="text-primary-700">قرار التوحيد:</strong> إصدار قرار وزاري بدمج اللجان في "مجلس التميز المؤسسي" الموحد.</li>
                            <li><strong className="text-primary-700">المشروع التجريبي:</strong> اختيار مركز تأهيل (مركز الباحة) لتطبيق النموذج المتكامل لمدة 6 أشهر.</li>
                            <li><strong className="text-primary-700">تحديث العقود:</strong> البدء فوراً بمراجعة عقود التشغيل والصيانة القادمة.</li>
                            <li><strong className="text-primary-700">التدريب التحويلي:</strong> إطلاق برنامج لمدراء المراكز حول "قيادة التغيير" و"ثقافة التمكين".</li>
                        </ol>
                    </div>
                </section>

                <section id="references" className="bg-gray-50 rounded-xl p-8 border border-gray-200 scroll-mt-24">
                    <h2 className="text-xl font-bold text-gray-600 mb-4">9. المراجع والمصادر</h2>
                    <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                        <li>بحث استراتيجي: نحو نموذج ريادي لتمكين الأشخاص ذوي الإعاقة.</li>
                        <li>برامج التحول في وزارة الموارد البشرية والتنمية الاجتماعية.</li>
                        <li>دليل الإجراءات التشغيلية لنظام الجودة (مركز الباحة).</li>
                        <li>مبادرة وطنية لتمكين ذوي الإعاقة ونظام NDIS.</li>
                        <li>دراسة الجدوى الاقتصادية للواقع الافتراضي (VR).</li>
                        <li>أدلة قياس رضا المستفيدين.</li>
                        <li>دليل إجراءات مكافحة العدوى والمؤشرات الطبية.</li>
                        <li>قرار وزاري 20912 ضوابط الحماية من التعديات السلوكية.</li>
                        <li>الملخص الإرشادي لحوكمة المؤسسات ISO 37000.</li>
                        <li>شرح نظام الأحوال الشخصية.</li>
                    </ul>
                    <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
                        © 2025 وزارة الموارد البشرية والتنمية الاجتماعية - جميع الحقوق محفوظة
                    </div>
                </section>
            </main>
        </div>
    );
};
