import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, AlertTriangle, CheckCircle2, Target, TrendingUp, FileText,
    ClipboardCheck, RefreshCw, AlertOctagon, Users, Calendar, ChevronRight,
    Activity, Zap, Lock, Eye, BarChart3
} from 'lucide-react';
import { supabase } from '../../config/supabase';

const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

// Mock data for initial display
const MOCK_RISKS = [
    { id: '1', title: 'خطر عدم الامتثال للمعايير الطبية', category: 'امتثال', level: 'high', probability: 'عالي', impact: 'عالي', status: 'active', owner: 'د. محمد بلال', updated: '2026-01-12' },
    { id: '2', title: 'خطر تسريب البيانات الشخصية', category: 'أمن معلومات', level: 'critical', probability: 'متوسط', impact: 'عالي جداً', status: 'active', owner: 'أحمد الشهري', updated: '2026-01-10' },
    { id: '3', title: 'خطر انقطاع الخدمات الأساسية', category: 'استمرارية', level: 'medium', probability: 'منخفض', impact: 'عالي', status: 'mitigated', owner: 'خالد الزهراني', updated: '2026-01-08' },
    { id: '4', title: 'خطر نقص الكوادر المؤهلة', category: 'موارد بشرية', level: 'medium', probability: 'متوسط', impact: 'متوسط', status: 'active', owner: 'سعيد الغامدي', updated: '2026-01-05' },
];

const MOCK_COMPLIANCE = [
    { id: '1', standard: 'ISO 9001:2015', requirement: 'توثيق العمليات', score: 92, status: 'compliant' },
    { id: '2', standard: 'معايير CBAHI', requirement: 'سلامة المرضى', score: 88, status: 'compliant' },
    { id: '3', standard: 'ISO 22301', requirement: 'استمرارية الأعمال', score: 45, status: 'partial' },
    { id: '4', standard: 'GDPR/PDPL', requirement: 'حماية البيانات', score: 78, status: 'partial' },
];

const MOCK_BCP = [
    { id: '1', name: 'سيناريو انقطاع الكهرباء', lastTest: '2025-12-15', status: 'tested', rto: '2 ساعة' },
    { id: '2', name: 'سيناريو الكوارث الطبيعية', lastTest: '2025-11-20', status: 'tested', rto: '24 ساعة' },
    { id: '3', name: 'سيناريو الهجمات السيبرانية', lastTest: null, status: 'pending', rto: '4 ساعات' },
];

export const GRCDashboardEnhanced: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'compliance' | 'bcp'>('overview');
    const [loading, setLoading] = useState(false);

    const stats = {
        totalRisks: MOCK_RISKS.length,
        criticalRisks: MOCK_RISKS.filter(r => r.level === 'critical').length,
        highRisks: MOCK_RISKS.filter(r => r.level === 'high').length,
        complianceScore: 76,
        bcpScenarios: MOCK_BCP.length,
        bcpTested: MOCK_BCP.filter(b => b.status === 'tested').length,
    };

    const getRiskLevelConfig = (level: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            critical: { bg: 'bg-red-500', text: 'text-white', label: 'حرج' },
            high: { bg: 'bg-orange-500', text: 'text-white', label: 'عالي' },
            medium: { bg: 'bg-yellow-500', text: 'text-white', label: 'متوسط' },
            low: { bg: 'bg-green-500', text: 'text-white', label: 'منخفض' },
        };
        return config[level] || config.medium;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[rgb(20,130,135)] to-[rgb(20,65,90)] rounded-2xl flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">الحوكمة والمخاطر والامتثال</h1>
                            <p className="text-slate-400">GRC - إطار متكامل لإدارة المخاطر المؤسسية</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-left">
                            <p className="text-slate-400 text-sm">آخر تحديث</p>
                            <p className="font-bold">{new Date().toLocaleDateString('ar-SA')}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
                {[
                    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                    { id: 'risks', label: 'سجل المخاطر', icon: AlertTriangle },
                    { id: 'compliance', label: 'الامتثال', icon: ClipboardCheck },
                    { id: 'bcp', label: 'استمرارية الأعمال', icon: RefreshCw },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-500/30">
                            <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                            <p className="text-4xl font-bold text-red-400">{stats.criticalRisks + stats.highRisks}</p>
                            <p className="text-slate-400 text-sm">مخاطر عالية/حرجة</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30">
                            <Shield className="w-8 h-8 text-blue-400 mb-3" />
                            <p className="text-4xl font-bold text-blue-400">{stats.totalRisks}</p>
                            <p className="text-slate-400 text-sm">إجمالي المخاطر</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-500/30">
                            <CheckCircle2 className="w-8 h-8 text-green-400 mb-3" />
                            <p className="text-4xl font-bold text-green-400">{stats.complianceScore}%</p>
                            <p className="text-slate-400 text-sm">نسبة الامتثال</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <RefreshCw className="w-8 h-8 text-purple-400 mb-3" />
                            <p className="text-4xl font-bold text-purple-400">{stats.bcpTested}/{stats.bcpScenarios}</p>
                            <p className="text-slate-400 text-sm">سيناريوهات BCP مختبرة</p>
                        </motion.div>
                    </div>

                    {/* Quick Overview Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Top Risks */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                                    أبرز المخاطر
                                </h3>
                                <button onClick={() => setActiveTab('risks')} className="text-teal-400 text-sm flex items-center gap-1 hover:text-teal-300">
                                    عرض الكل <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {MOCK_RISKS.slice(0, 3).map(risk => {
                                    const config = getRiskLevelConfig(risk.level);
                                    return (
                                        <div key={risk.id} className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium">{risk.title}</p>
                                                <p className="text-slate-400 text-sm">{risk.category}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Compliance Status */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-green-400" />
                                    حالة الامتثال
                                </h3>
                                <button onClick={() => setActiveTab('compliance')} className="text-teal-400 text-sm flex items-center gap-1 hover:text-teal-300">
                                    عرض الكل <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {MOCK_COMPLIANCE.map(comp => (
                                    <div key={comp.id} className="bg-slate-700/50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-medium">{comp.standard}</p>
                                            <span className={`text-sm font-bold ${comp.score >= 80 ? 'text-green-400' : comp.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {comp.score}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${comp.score >= 80 ? 'bg-green-500' : comp.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${comp.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Risks Tab */}
            {activeTab === 'risks' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">سجل المخاطر المؤسسية</h3>
                            <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl font-medium">+ إضافة خطر</button>
                        </div>
                        <div className="space-y-3">
                            {MOCK_RISKS.map(risk => {
                                const config = getRiskLevelConfig(risk.level);
                                return (
                                    <div key={risk.id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600 hover:border-teal-500/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>{config.label}</span>
                                                    <span className="text-slate-400 text-sm">{risk.category}</span>
                                                </div>
                                                <h4 className="font-bold text-lg mb-2">{risk.title}</h4>
                                                <div className="flex items-center gap-6 text-sm text-slate-400">
                                                    <span>الاحتمالية: {risk.probability}</span>
                                                    <span>الأثر: {risk.impact}</span>
                                                    <span>المسؤول: {risk.owner}</span>
                                                    <span>آخر تحديث: {risk.updated}</span>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs ${risk.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {risk.status === 'active' ? 'نشط' : 'تم التخفيف'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Compliance Score */}
                    <div className="bg-gradient-to-r from-[rgb(20,65,90)] to-[rgb(20,130,135)] rounded-2xl p-8">
                        <div className="flex items-center gap-8">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke={HRSD.green} strokeWidth="8" strokeDasharray={`${stats.complianceScore * 2.83} 283`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold">{stats.complianceScore}%</span>
                                    <span className="text-sm text-white/70">الامتثال</span>
                                </div>
                            </div>
                            <div className="flex-1 grid grid-cols-4 gap-4">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-400" />
                                    <p className="text-2xl font-bold">2</p>
                                    <p className="text-xs text-white/70">ممتثل</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                                    <p className="text-2xl font-bold">2</p>
                                    <p className="text-xs text-white/70">جزئي</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <AlertOctagon className="w-6 h-6 mx-auto mb-2 text-red-400" />
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-xs text-white/70">غير ممتثل</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <FileText className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-2xl font-bold">4</p>
                                    <p className="text-xs text-white/70">معايير</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance List */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-xl font-bold mb-4">متطلبات الامتثال</h3>
                        <div className="space-y-3">
                            {MOCK_COMPLIANCE.map(comp => (
                                <div key={comp.id} className="bg-slate-700/30 rounded-xl p-5 border border-slate-600">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold">{comp.standard}</h4>
                                            <p className="text-slate-400 text-sm">{comp.requirement}</p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${comp.status === 'compliant' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {comp.status === 'compliant' ? 'ممتثل' : 'جزئي'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-slate-600 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${comp.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${comp.score}%` }} />
                                        </div>
                                        <span className="font-bold text-lg">{comp.score}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* BCP Tab */}
            {activeTab === 'bcp' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 border border-purple-500/30">
                        <div className="flex items-center gap-4 mb-4">
                            <RefreshCw className="w-8 h-8 text-purple-400" />
                            <div>
                                <h3 className="text-xl font-bold">استمرارية الأعمال</h3>
                                <p className="text-purple-300/70">Business Continuity Planning</p>
                            </div>
                        </div>
                        <p className="text-slate-300">خطط استمرارية الأعمال تضمن استمرار العمليات الحيوية في حالات الطوارئ والكوارث.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {MOCK_BCP.map(scenario => (
                            <motion.div key={scenario.id} whileHover={{ scale: 1.02 }} className={`rounded-2xl p-6 border ${scenario.status === 'tested' ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <Zap className={`w-8 h-8 ${scenario.status === 'tested' ? 'text-green-400' : 'text-yellow-400'}`} />
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${scenario.status === 'tested' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {scenario.status === 'tested' ? 'تم الاختبار' : 'بانتظار الاختبار'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-lg mb-2">{scenario.name}</h4>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <p>RTO: <span className="text-white font-medium">{scenario.rto}</span></p>
                                    <p>آخر اختبار: <span className="text-white font-medium">{scenario.lastTest || 'لم يتم'}</span></p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default GRCDashboardEnhanced;
