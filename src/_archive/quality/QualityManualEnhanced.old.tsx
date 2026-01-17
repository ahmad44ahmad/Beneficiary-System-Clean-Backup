import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, FileText, Target, Shield, Heart, Activity, LineChart,
    Users, Building, CheckSquare, Award, ChevronDown, ChevronRight,
    Printer, Download, Search, Eye, Star
} from 'lucide-react';

const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

interface Chapter {
    id: string;
    number: number;
    title: string;
    icon: React.ElementType;
    color: string;
    sections: { id: string; title: string; content: string[] }[];
}

const chapters: Chapter[] = [
    {
        id: 'intro', number: 1, title: 'المقدمة التنفيذية', icon: Star, color: 'from-amber-500 to-orange-600',
        sections: [
            { id: 'vision', title: 'رؤية المركز', content: ['يمثل مركز التأهيل الشامل بالباحة نموذجاً رائداً في التحول من الرعاية الإيوائية التقليدية إلى التمكين الشامل.', 'المستهدف: الحصول على شهادة الأيزو 9001:2015 بحلول يونيو 2026.'] },
            { id: 'scope', title: 'نطاق التطبيق', content: ['يغطي النظام 145 مستفيد، و7 أقسام رئيسية، و25 وحدة فرعية.', 'يشمل جميع العمليات التشغيلية والإدارية والطبية والاجتماعية.'] },
        ]
    },
    {
        id: 'framework', number: 2, title: 'الإطار الاستراتيجي والتنظيمي', icon: Target, color: 'from-blue-500 to-cyan-600',
        sections: [
            { id: 'strategy', title: 'الأهداف الاستراتيجية', content: ['تحقيق أعلى معايير الجودة في خدمات التأهيل.', 'تمكين المستفيدين وتعزيز استقلاليتهم.', 'بناء بيئة آمنة ومحفزة للتعافي.'] },
            { id: 'structure', title: 'الهيكل التنظيمي', content: ['مدير المركز', 'مساعد المدير للشؤون الفنية', 'رؤساء الأقسام (الطبي، الاجتماعي، التأهيلي)', 'فريق الجودة وإدارة المخاطر'] },
        ]
    },
    {
        id: 'leadership', number: 3, title: 'القيادة والمسؤوليات', icon: Users, color: 'from-purple-500 to-indigo-600',
        sections: [
            { id: 'roles', title: 'مسؤوليات القيادة', content: ['الالتزام بسياسة الجودة ونشرها.', 'توفير الموارد اللازمة لتطبيق النظام.', 'مراجعة الأهداف والمؤشرات دورياً.'] },
            { id: 'authority', title: 'الصلاحيات والمسؤوليات', content: ['توزيع واضح للمهام والصلاحيات.', 'مصفوفة RACI لجميع العمليات الرئيسية.'] },
        ]
    },
    {
        id: 'planning', number: 4, title: 'التخطيط للجودة', icon: LineChart, color: 'from-green-500 to-emerald-600',
        sections: [
            { id: 'objectives', title: 'أهداف الجودة', content: ['تحقيق رضا المستفيدين بنسبة 90% أو أعلى.', 'تقليل معدل الحوادث بنسبة 25%.', 'تحسين كفاءة العمليات بنسبة 15%.'] },
            { id: 'risks', title: 'إدارة المخاطر والفرص', content: ['تحديد المخاطر المحتملة وتقييمها.', 'وضع خطط التخفيف والاستجابة.', 'مراجعة سجل المخاطر شهرياً.'] },
        ]
    },
    {
        id: 'operations', number: 5, title: 'العمليات التشغيلية', icon: Activity, color: 'from-rose-500 to-pink-600',
        sections: [
            { id: 'admission', title: 'QA-OPS-001 القبول والتسجيل', content: ['استقبال طلبات القبول وتقييمها.', 'إجراء التقييم الأولي الشامل.', 'إعداد الخطة الفردية للمستفيد.'] },
            { id: 'care', title: 'QA-OPS-002 تقديم الرعاية', content: ['المتابعة اليومية للحالة الصحية.', 'تقديم الخدمات الطبية والتمريضية.', 'توثيق جميع التدخلات في السجل الإلكتروني.'] },
            { id: 'rehab', title: 'QA-OPS-003 التأهيل والتدريب', content: ['تنفيذ برامج العلاج الطبيعي والوظيفي.', 'تقديم البرامج التعليمية والمهنية.', 'قياس التقدم وتحديث الخطط.'] },
        ]
    },
    {
        id: 'safety', number: 6, title: 'السلامة ومكافحة العدوى', icon: Shield, color: 'from-red-500 to-orange-600',
        sections: [
            { id: 'ipc', title: 'QA-IPC-001 بروتوكول مكافحة العدوى', content: ['نظافة اليدين والتعقيم.', 'إدارة النفايات الطبية.', 'عزل الحالات المعدية.'] },
            { id: 'fallprevention', title: 'QA-SAF-001 منع السقوط', content: ['تقييم خطر السقوط لكل مستفيد.', 'تطبيق إجراءات الوقاية.', 'الإبلاغ الفوري عن الحوادث.'] },
        ]
    },
    {
        id: 'improvement', number: 7, title: 'التحسين المستمر', icon: Award, color: 'from-teal-500 to-cyan-600',
        sections: [
            { id: 'audit', title: 'التدقيق الداخلي', content: ['جدول تدقيق سنوي معتمد.', 'فريق مدققين مؤهلين.', 'تقارير التدقيق والإجراءات التصحيحية.'] },
            { id: 'kpi', title: 'مؤشرات الأداء', content: ['KPI-001: معدل رضا المستفيدين', 'KPI-002: معدل الحوادث لكل 1000 يوم مستفيد', 'KPI-003: نسبة إنجاز أهداف التأهيل'] },
        ]
    },
];

export const QualityManualEnhanced: React.FC = () => {
    const [activeChapter, setActiveChapter] = useState<string>('intro');
    const [expandedSections, setExpandedSections] = useState<string[]>(['vision']);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(s => s !== sectionId) : [...prev, sectionId]);
    };

    const currentChapter = chapters.find(c => c.id === activeChapter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white" dir="rtl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[rgb(20,65,90)] via-[rgb(20,130,135)] to-[rgb(45,180,115)] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <BookOpen className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">الدليل الشامل لنظام إدارة الجودة</h1>
                                <p className="text-white/80 mt-1">مركز التأهيل الشامل بمنطقة الباحة • QM-2026-v3.0</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">ISO 9001:2015</span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">EFQM 2030</span>
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">معايير CBAHI</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                                <Printer className="w-5 h-5" />
                            </button>
                            <button className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    {/* Sidebar - Chapter Navigation */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-80 flex-shrink-0">
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 sticky top-6">
                            <div className="relative mb-4">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="بحث في الدليل..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:border-teal-500"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-slate-400 mb-3 px-2">فهرس الدليل</h3>
                            <div className="space-y-1">
                                {chapters.map(chapter => (
                                    <button
                                        key={chapter.id}
                                        onClick={() => setActiveChapter(chapter.id)}
                                        className={`w-full text-right px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeChapter === chapter.id ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/50 text-white' : 'hover:bg-slate-700/50 text-slate-400'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${chapter.color} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-sm font-bold text-white">{chapter.number}</span>
                                        </div>
                                        <span className="text-sm font-medium">{chapter.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
                        {currentChapter && (
                            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                                {/* Chapter Header */}
                                <div className={`bg-gradient-to-r ${currentChapter.color} p-6`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <currentChapter.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-white/70 text-sm">الفصل {currentChapter.number}</span>
                                            <h2 className="text-2xl font-bold">{currentChapter.title}</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Sections */}
                                <div className="p-6 space-y-4">
                                    {currentChapter.sections.map(section => (
                                        <div key={section.id} className="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection(section.id)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-slate-600/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Eye className="w-5 h-5 text-teal-400" />
                                                    <span className="font-bold">{section.title}</span>
                                                </div>
                                                {expandedSections.includes(section.id) ? (
                                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                                )}
                                            </button>
                                            <AnimatePresence>
                                                {expandedSections.includes(section.id) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="border-t border-slate-600"
                                                    >
                                                        <div className="p-5 space-y-3">
                                                            {section.content.map((item, idx) => (
                                                                <div key={idx} className="flex items-start gap-3">
                                                                    <CheckSquare className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                                                                    <p className="text-slate-300 leading-relaxed">{item}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QualityManualEnhanced;
