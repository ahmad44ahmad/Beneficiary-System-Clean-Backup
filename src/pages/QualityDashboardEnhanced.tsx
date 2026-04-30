import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Award, TrendingUp, CheckCircle2, AlertTriangle, Target,
    BarChart3, BookOpen, ClipboardList,
    AlertOctagon, ChevronRight, Calendar, Star
} from 'lucide-react';
import { Section, PageHeader } from '../design-system/primitives';
import { brand } from '../design-system/tokens';
import { SAFE_PAIRS } from '../design-system/a11y-tokens';

// KPI Data
const kpis = [
    { id: 1, name: 'رضا المستفيدين', value: 92, target: 90, unit: '%', trend: 'up', color: 'green' as const },
    { id: 2, name: 'معدل الحوادث/1000 يوم', value: 0.8, target: 1.0, unit: '', trend: 'down', color: 'green' as const },
    { id: 3, name: 'نسبة إنجاز أهداف التأهيل', value: 78, target: 85, unit: '%', trend: 'up', color: 'gold' as const },
    { id: 4, name: 'معدل الامتثال للمعايير', value: 88, target: 95, unit: '%', trend: 'up', color: 'gold' as const },
];

// Audit Schedule
const audits = [
    { id: 1, department: 'القسم الطبي', date: '2026-01-20', status: 'scheduled', auditor: 'فريق الجودة' },
    { id: 2, department: 'التأهيل والتدريب', date: '2026-01-15', status: 'completed' as const, score: 94, auditor: 'أ. سعيد الغامدي' },
    { id: 3, department: 'الإعاشة والتغذية', date: '2026-01-10', status: 'completed' as const, score: 87, auditor: 'أ. خالد الزهراني' },
    { id: 4, department: 'الخدمات المساندة', date: '2026-02-01', status: 'scheduled', auditor: 'فريق الجودة' },
];

// Non-conformities
const ncrs = [
    { id: 1, title: 'عدم اكتمال توثيق الخطة الفردية', severity: 'minor' as const, status: 'open' as const, department: 'التأهيل', dueDate: '2026-01-25' },
    { id: 2, title: 'تأخر في تحديث سجلات التطعيم', severity: 'major' as const, status: 'in_progress' as const, department: 'الطبي', dueDate: '2026-01-18' },
    { id: 3, title: 'نقص في توثيق جولات السلامة', severity: 'minor' as const, status: 'closed' as const, department: 'السلامة', dueDate: '2026-01-10' },
];

const kpiColor = (key: 'green' | 'gold'): string =>
    key === 'green' ? brand.green.hex : brand.gold.hex;

const ncrSeverityPill = (severity: 'minor' | 'major'): { fg: string; bg: string; label: string } =>
    severity === 'major'
        ? { fg: '#FFFFFF', bg: '#DC2626', label: 'رئيسي' }
        : { fg: SAFE_PAIRS.badgeOnGold.fg, bg: SAFE_PAIRS.badgeOnGold.bg, label: 'ثانوي' };

const ncrStatusPill = (status: 'open' | 'in_progress' | 'closed'): { fg: string; bg: string; label: string } => {
    switch (status) {
        case 'closed':
            return { fg: '#FFFFFF', bg: brand.green.hex, label: 'مغلق' };
        case 'in_progress':
            return { fg: '#FFFFFF', bg: brand.teal.hex, label: 'قيد العمل' };
        case 'open':
            return { fg: '#FFFFFF', bg: '#DC2626', label: 'مفتوح' };
    }
};

export const QualityDashboardEnhanced: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'audits' | 'ncr'>('overview');

    return (
        <div className="min-h-screen bg-white p-6" dir="rtl">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <PageHeader
                    title={
                        <span className="flex items-center gap-3">
                            <span
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: brand.green.hex }}
                            >
                                <Award className="w-6 h-6 text-white" />
                            </span>
                            <span>إدارة الجودة والتميز المؤسسي</span>
                        </span>
                    }
                    subtitle="نظام متكامل للجودة والتدقيق والتحسين المستمر"
                    accent="green"
                    actions={
                        <Link
                            to="/quality/manual"
                            className="px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-opacity hover:opacity-90"
                            style={{ backgroundColor: brand.teal.hex, color: '#FFFFFF' }}
                        >
                            <BookOpen className="w-5 h-5" />
                            دليل الجودة
                        </Link>
                    }
                />
            </motion.div>

            {/* Tabs */}
            <div
                className="flex gap-2 mb-6 rounded-xl p-1 w-fit border border-gray-200"
                style={{ backgroundColor: '#F9FAFB' }}
            >
                {[
                    { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                    { id: 'kpis', label: 'المؤشرات', icon: Target },
                    { id: 'audits', label: 'التدقيق', icon: ClipboardList },
                    { id: 'ncr', label: 'عدم المطابقة', icon: AlertOctagon },
                ].map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all"
                            style={
                                isActive
                                    ? { backgroundColor: brand.green.hex, color: '#FFFFFF' }
                                    : { color: brand.coolGray.hex }
                            }
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Star, value: '92%', label: 'رضا المستفيدين', color: brand.green.hex },
                            { icon: CheckCircle2, value: '88%', label: 'الامتثال للمعايير', color: brand.teal.hex },
                            { icon: ClipboardList, value: '4', label: 'تدقيقات هذا الشهر', color: brand.gold.hex },
                            { icon: AlertTriangle, value: '2', label: 'ملاحظات مفتوحة', color: brand.orange.hex },
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-2xl p-6 border bg-white"
                                style={{ borderColor: `${stat.color}55` }}
                            >
                                <stat.icon className="w-8 h-8 mb-3" style={{ color: stat.color }} />
                                <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-sm" style={{ color: brand.coolGray.hex }}>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <Section
                                title={
                                    <span className="flex items-center gap-2">
                                        <Target className="w-5 h-5" style={{ color: brand.green.hex }} />
                                        مؤشرات الأداء الرئيسية
                                    </span>
                                }
                                actions={
                                    <button
                                        onClick={() => setActiveTab('kpis')}
                                        className="text-sm flex items-center gap-1 hover:underline"
                                        style={{ color: brand.teal.hex }}
                                    >
                                        عرض الكل <ChevronRight className="w-4 h-4" />
                                    </button>
                                }
                            >
                                <div className="space-y-4">
                                    {kpis.slice(0, 3).map(kpi => {
                                        const accent = kpiColor(kpi.color);
                                        return (
                                            <div key={kpi.id} className="rounded-xl p-4 border border-gray-100" style={{ backgroundColor: '#F9FAFB' }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium" style={{ color: brand.navy.hex }}>{kpi.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold" style={{ color: accent }}>
                                                            {kpi.value}{kpi.unit}
                                                        </span>
                                                        <TrendingUp
                                                            className={`w-4 h-4 ${kpi.trend === 'down' ? 'rotate-180' : ''}`}
                                                            style={{ color: kpi.trend === 'up' ? brand.green.hex : '#DC2626' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${(kpi.value / kpi.target) * 100}%`,
                                                                backgroundColor: accent,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs" style={{ color: brand.coolGray.hex }}>هدف: {kpi.target}{kpi.unit}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Section>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Section
                                title={
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" style={{ color: brand.gold.hex }} />
                                        جدول التدقيق
                                    </span>
                                }
                                actions={
                                    <button
                                        onClick={() => setActiveTab('audits')}
                                        className="text-sm flex items-center gap-1 hover:underline"
                                        style={{ color: brand.teal.hex }}
                                    >
                                        عرض الكل <ChevronRight className="w-4 h-4" />
                                    </button>
                                }
                            >
                                <div className="space-y-3">
                                    {audits.map(audit => (
                                        <div
                                            key={audit.id}
                                            className="rounded-xl p-4 flex items-center justify-between border border-gray-100"
                                            style={{ backgroundColor: '#F9FAFB' }}
                                        >
                                            <div>
                                                <p className="font-medium" style={{ color: brand.navy.hex }}>{audit.department}</p>
                                                <p className="text-sm" style={{ color: brand.coolGray.hex }}>{new Date(audit.date).toLocaleDateString('ar-SA')}</p>
                                            </div>
                                            {audit.status === 'completed' ? (
                                                <span
                                                    className="px-3 py-1 rounded-full text-sm font-bold"
                                                    style={{ backgroundColor: brand.green.hex, color: '#FFFFFF' }}
                                                >
                                                    {audit.score}%
                                                </span>
                                            ) : (
                                                <span
                                                    className="px-3 py-1 rounded-full text-sm font-medium"
                                                    style={{ backgroundColor: brand.teal.hex, color: '#FFFFFF' }}
                                                >
                                                    مجدول
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* KPIs Tab */}
            {activeTab === 'kpis' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <Section title="مؤشرات الأداء الرئيسية (KPIs)">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {kpis.map(kpi => {
                                const accent = kpiColor(kpi.color);
                                return (
                                    <div
                                        key={kpi.id}
                                        className="rounded-xl p-6 border border-gray-200 bg-white"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-lg" style={{ color: brand.navy.hex }}>{kpi.name}</h4>
                                            <TrendingUp
                                                className={`w-6 h-6 ${kpi.trend === 'down' ? 'rotate-180' : ''}`}
                                                style={{ color: kpi.trend === 'up' ? brand.green.hex : '#DC2626' }}
                                            />
                                        </div>
                                        <div className="flex items-end gap-2 mb-4">
                                            <span className="text-4xl font-bold" style={{ color: accent }}>
                                                {kpi.value}
                                            </span>
                                            <span style={{ color: brand.coolGray.hex }} className="mb-1">{kpi.unit}</span>
                                            <span style={{ color: brand.coolGray.hex }} className="text-sm mb-1 mr-auto">الهدف: {kpi.target}{kpi.unit}</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all"
                                                style={{
                                                    width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`,
                                                    backgroundColor: accent,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                </motion.div>
            )}

            {/* Audits Tab */}
            {activeTab === 'audits' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <Section
                        title="جدول التدقيق الداخلي"
                        actions={
                            <button
                                className="px-4 py-2 rounded-xl font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: brand.green.hex, color: '#FFFFFF' }}
                            >
                                + جدولة تدقيق
                            </button>
                        }
                    >
                        <div className="space-y-3">
                            {audits.map(audit => {
                                const isCompleted = audit.status === 'completed';
                                return (
                                    <div
                                        key={audit.id}
                                        className="rounded-xl p-5 border bg-white"
                                        style={{ borderColor: isCompleted ? `${brand.green.hex}55` : `${brand.teal.hex}55` }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg" style={{ color: brand.navy.hex }}>{audit.department}</h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm" style={{ color: brand.coolGray.hex }}>
                                                    <span>التاريخ: {new Date(audit.date).toLocaleDateString('ar-SA')}</span>
                                                    <span>المدقق: {audit.auditor}</span>
                                                </div>
                                            </div>
                                            {isCompleted ? (
                                                <div className="text-center shrink-0">
                                                    <div
                                                        className="text-3xl font-bold"
                                                        style={{
                                                            color: audit.score! >= 90 ? brand.green.hex
                                                                : audit.score! >= 80 ? brand.gold.hex
                                                                : '#DC2626',
                                                        }}
                                                    >
                                                        {audit.score}%
                                                    </div>
                                                    <span className="text-xs" style={{ color: brand.green.hex }}>مكتمل</span>
                                                </div>
                                            ) : (
                                                <span
                                                    className="px-4 py-2 rounded-xl font-medium shrink-0"
                                                    style={{ backgroundColor: brand.teal.hex, color: '#FFFFFF' }}
                                                >
                                                    مجدول
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                </motion.div>
            )}

            {/* NCR Tab */}
            {activeTab === 'ncr' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <Section
                        title="سجل عدم المطابقة (NCR)"
                        actions={
                            <button
                                className="px-4 py-2 rounded-xl font-medium transition-opacity hover:opacity-90"
                                style={{ backgroundColor: brand.orange.hex, color: '#FFFFFF' }}
                            >
                                + تسجيل ملاحظة
                            </button>
                        }
                    >
                        <div className="space-y-3">
                            {ncrs.map(ncr => {
                                const sev = ncrSeverityPill(ncr.severity);
                                const stat = ncrStatusPill(ncr.status);
                                const borderHex = ncr.status === 'closed'
                                    ? brand.green.hex
                                    : ncr.severity === 'major'
                                        ? '#DC2626'
                                        : brand.gold.hex;
                                return (
                                    <div
                                        key={ncr.id}
                                        className="rounded-xl p-5 border bg-white"
                                        style={{ borderColor: `${borderHex}55` }}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <span
                                                        className="px-2 py-1 rounded text-xs font-bold"
                                                        style={{ backgroundColor: sev.bg, color: sev.fg }}
                                                    >
                                                        {sev.label}
                                                    </span>
                                                    <span className="text-sm" style={{ color: brand.coolGray.hex }}>{ncr.department}</span>
                                                </div>
                                                <h4 className="font-bold" style={{ color: brand.navy.hex }}>{ncr.title}</h4>
                                                <p className="text-sm mt-1" style={{ color: brand.coolGray.hex }}>تاريخ الاستحقاق: {new Date(ncr.dueDate).toLocaleDateString('ar-SA')}</p>
                                            </div>
                                            <span
                                                className="px-3 py-1 rounded-lg text-xs font-bold shrink-0"
                                                style={{ backgroundColor: stat.bg, color: stat.fg }}
                                            >
                                                {stat.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                </motion.div>
            )}
        </div>
    );
};

export default QualityDashboardEnhanced;
