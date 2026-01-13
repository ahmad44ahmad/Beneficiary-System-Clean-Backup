import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Award, TrendingUp, CheckCircle2, AlertTriangle, Target, Users,
    BarChart3, FileText, Activity, Shield, BookOpen, ClipboardList,
    AlertOctagon, ChevronRight, Calendar, Star
} from 'lucide-react';

const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

// KPI Data
const kpis = [
    { id: 1, name: 'رضا المستفيدين', value: 92, target: 90, unit: '%', trend: 'up', color: 'green' },
    { id: 2, name: 'معدل الحوادث/1000 يوم', value: 0.8, target: 1.0, unit: '', trend: 'down', color: 'green' },
    { id: 3, name: 'نسبة إنجاز أهداف التأهيل', value: 78, target: 85, unit: '%', trend: 'up', color: 'yellow' },
    { id: 4, name: 'معدل الامتثال للمعايير', value: 88, target: 95, unit: '%', trend: 'up', color: 'yellow' },
];

// Audit Schedule
const audits = [
    { id: 1, department: 'القسم الطبي', date: '2026-01-20', status: 'scheduled', auditor: 'فريق الجودة' },
    { id: 2, department: 'التأهيل والتدريب', date: '2026-01-15', status: 'completed', score: 94, auditor: 'أ. سعيد الغامدي' },
    { id: 3, department: 'الإعاشة والتغذية', date: '2026-01-10', status: 'completed', score: 87, auditor: 'أ. خالد الزهراني' },
    { id: 4, department: 'الخدمات المساندة', date: '2026-02-01', status: 'scheduled', auditor: 'فريق الجودة' },
];

// Non-conformities
const ncrs = [
    { id: 1, title: 'عدم اكتمال توثيق الخطة الفردية', severity: 'minor', status: 'open', department: 'التأهيل', dueDate: '2026-01-25' },
    { id: 2, title: 'تأخر في تحديث سجلات التطعيم', severity: 'major', status: 'in_progress', department: 'الطبي', dueDate: '2026-01-18' },
    { id: 3, title: 'نقص في توثيق جولات السلامة', severity: 'minor', status: 'closed', department: 'السلامة', dueDate: '2026-01-10' },
];

export const QualityDashboardEnhanced: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'audits' | 'ncr'>('overview');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">إدارة الجودة والتميز المؤسسي</h1>
                            <p className="text-slate-400">نظام متكامل للجودة والتدقيق والتحسين المستمر</p>
                        </div>
                    </div>
                    <Link to="/quality/manual" className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <BookOpen className="w-5 h-5" />
                        دليل الجودة
                    </Link>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
                {[
                    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                    { id: 'kpis', label: 'المؤشرات', icon: Target },
                    { id: 'audits', label: 'التدقيق', icon: ClipboardList },
                    { id: 'ncr', label: 'عدم المطابقة', icon: AlertOctagon },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                            <Star className="w-8 h-8 text-green-400 mb-3" />
                            <p className="text-4xl font-bold text-green-400">92%</p>
                            <p className="text-slate-400 text-sm">رضا المستفيدين</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                            <CheckCircle2 className="w-8 h-8 text-blue-400 mb-3" />
                            <p className="text-4xl font-bold text-blue-400">88%</p>
                            <p className="text-slate-400 text-sm">الامتثال للمعايير</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <ClipboardList className="w-8 h-8 text-purple-400 mb-3" />
                            <p className="text-4xl font-bold text-purple-400">4</p>
                            <p className="text-slate-400 text-sm">تدقيقات هذا الشهر</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl p-6 border border-orange-500/30">
                            <AlertTriangle className="w-8 h-8 text-orange-400 mb-3" />
                            <p className="text-4xl font-bold text-orange-400">2</p>
                            <p className="text-slate-400 text-sm">ملاحظات مفتوحة</p>
                        </motion.div>
                    </div>

                    {/* Quick Overview */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* KPIs Summary */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Target className="w-5 h-5 text-green-400" />
                                    مؤشرات الأداء الرئيسية
                                </h3>
                                <button onClick={() => setActiveTab('kpis')} className="text-teal-400 text-sm flex items-center gap-1 hover:text-teal-300">
                                    عرض الكل <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {kpis.slice(0, 3).map(kpi => (
                                    <div key={kpi.id} className="bg-slate-700/50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{kpi.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${kpi.color === 'green' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                    {kpi.value}{kpi.unit}
                                                </span>
                                                <TrendingUp className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${kpi.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${(kpi.value / kpi.target) * 100}%` }} />
                                            </div>
                                            <span className="text-xs text-slate-400">هدف: {kpi.target}{kpi.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Upcoming Audits */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                    جدول التدقيق
                                </h3>
                                <button onClick={() => setActiveTab('audits')} className="text-teal-400 text-sm flex items-center gap-1 hover:text-teal-300">
                                    عرض الكل <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {audits.map(audit => (
                                    <div key={audit.id} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{audit.department}</p>
                                            <p className="text-slate-400 text-sm">{new Date(audit.date).toLocaleDateString('ar-SA')}</p>
                                        </div>
                                        {audit.status === 'completed' ? (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                                                {audit.score}%
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                                                مجدول
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* KPIs Tab */}
            {activeTab === 'kpis' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold mb-6">مؤشرات الأداء الرئيسية (KPIs)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {kpis.map(kpi => (
                                <div key={kpi.id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-lg">{kpi.name}</h4>
                                        <TrendingUp className={`w-6 h-6 ${kpi.trend === 'up' ? 'text-green-400' : 'text-red-400 rotate-180'}`} />
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className={`text-4xl font-bold ${kpi.color === 'green' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {kpi.value}
                                        </span>
                                        <span className="text-slate-400 mb-1">{kpi.unit}</span>
                                        <span className="text-slate-500 text-sm mb-1 mr-auto">الهدف: {kpi.target}{kpi.unit}</span>
                                    </div>
                                    <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${kpi.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-yellow-500 to-amber-400'}`} style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Audits Tab */}
            {activeTab === 'audits' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">جدول التدقيق الداخلي</h3>
                            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium">+ جدولة تدقيق</button>
                        </div>
                        <div className="space-y-3">
                            {audits.map(audit => (
                                <div key={audit.id} className={`bg-slate-700/30 rounded-xl p-5 border ${audit.status === 'completed' ? 'border-green-500/30' : 'border-blue-500/30'}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg">{audit.department}</h4>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                                                <span>التاريخ: {new Date(audit.date).toLocaleDateString('ar-SA')}</span>
                                                <span>المدقق: {audit.auditor}</span>
                                            </div>
                                        </div>
                                        {audit.status === 'completed' ? (
                                            <div className="text-center">
                                                <div className={`text-3xl font-bold ${audit.score! >= 90 ? 'text-green-400' : audit.score! >= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {audit.score}%
                                                </div>
                                                <span className="text-green-400 text-xs">مكتمل</span>
                                            </div>
                                        ) : (
                                            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl font-medium">مجدول</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* NCR Tab */}
            {activeTab === 'ncr' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">سجل عدم المطابقة (NCR)</h3>
                            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl font-medium">+ تسجيل ملاحظة</button>
                        </div>
                        <div className="space-y-3">
                            {ncrs.map(ncr => (
                                <div key={ncr.id} className={`bg-slate-700/30 rounded-xl p-5 border ${ncr.status === 'closed' ? 'border-green-500/30' : ncr.severity === 'major' ? 'border-red-500/30' : 'border-yellow-500/30'}`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${ncr.severity === 'major' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {ncr.severity === 'major' ? 'رئيسي' : 'ثانوي'}
                                                </span>
                                                <span className="text-slate-400 text-sm">{ncr.department}</span>
                                            </div>
                                            <h4 className="font-bold">{ncr.title}</h4>
                                            <p className="text-slate-400 text-sm mt-1">تاريخ الاستحقاق: {new Date(ncr.dueDate).toLocaleDateString('ar-SA')}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${ncr.status === 'closed' ? 'bg-green-500/20 text-green-400' : ncr.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {ncr.status === 'closed' ? 'مغلق' : ncr.status === 'in_progress' ? 'قيد العمل' : 'مفتوح'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default QualityDashboardEnhanced;
