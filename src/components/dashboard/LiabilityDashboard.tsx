import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, AlertTriangle, CheckCircle, XCircle,
    Clock, TrendingUp, TrendingDown, Users,
    Activity, Utensils, Heart,
    Thermometer, Droplets, Navigation,
    ChevronLeft, Info
} from 'lucide-react';

// Types
interface OperationalMetric {
    id: string;
    name: string;
    value: number;
    target: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    trend: number;
    icon: React.ReactNode;
}

interface StructuralIssue {
    id: string;
    category: string;
    description: string;
    reported_at: Date;
    sla_hours: number;
    responsible_party: string;
    status: 'pending' | 'escalated' | 'resolved';
    severity: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
}

// SLA Timer Component
const SLATimer: React.FC<{ reportedAt: Date; slaHours: number; status: string }> = ({
    reportedAt,
    slaHours,
    status
}) => {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isOverdue, setIsOverdue] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const deadline = new Date(reportedAt.getTime() + slaHours * 60 * 60 * 1000);
            const diff = deadline.getTime() - now.getTime();

            if (diff <= 0) {
                setIsOverdue(true);
                const overdue = Math.abs(diff);
                const hours = Math.floor(overdue / (1000 * 60 * 60));
                const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`متأخر ${hours}س ${minutes}د`);
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeRemaining(`${hours}س ${minutes}د متبقية`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [reportedAt, slaHours]);

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isOverdue ? 'bg-[#DC2626]/15 text-[#B91C1C]' : 'bg-[#FCB614]/10 text-[#D49A0A]'
            }`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold">{timeRemaining}</span>
            {isOverdue && status !== 'resolved' && (
                <span className="text-xs bg-[#B91C1C] text-white px-2 py-0.5 rounded-full">تحويل المسؤولية</span>
            )}
        </div>
    );
};

// Metric Card
const MetricCard: React.FC<{ metric: OperationalMetric }> = ({ metric }) => {
    const statusColors = {
        excellent: 'border-[#2BB574] bg-[#2BB574]/10',
        good: 'border-[#269798] bg-[#269798]/10',
        warning: 'border-[#FCB614] bg-[#FCB614]/10',
        critical: 'border-[#DC2626] bg-[#DC2626]/10',
    };

    const statusIcons = {
        excellent: <CheckCircle className="w-5 h-5 text-[#1E9658]" />,
        good: <CheckCircle className="w-5 h-5 text-[#269798]" />,
        warning: <AlertTriangle className="w-5 h-5 text-[#D49A0A]" />,
        critical: <XCircle className="w-5 h-5 text-[#DC2626]" />,
    };

    return (
        <div className={`p-4 rounded-xl border-e-4 ${statusColors[metric.status]} hover-lift transition-all`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {metric.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">{metric.name}</h4>
                        <p className="text-xs text-gray-500">الهدف: {metric.target}%</p>
                    </div>
                </div>
                {statusIcons[metric.status]}
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <span className="text-3xl font-bold text-gray-900">{metric.value}%</span>
                </div>
                <div className={`flex items-center gap-1 text-sm ${metric.trend >= 0 ? 'text-[#1E9658]' : 'text-[#DC2626]'
                    }`}>
                    {metric.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{Math.abs(metric.trend)}%</span>
                </div>
            </div>

            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${metric.status === 'excellent' ? 'bg-[#2BB574]' :
                            metric.status === 'good' ? 'bg-[#269798]' :
                                metric.status === 'warning' ? 'bg-[#FCB614]' : 'bg-[#DC2626]'
                        }`}
                    style={{ width: `${metric.value}%` }}
                />
            </div>
        </div>
    );
};

// Issue Card
const IssueCard: React.FC<{ issue: StructuralIssue }> = ({ issue }) => {
    const severityColors = {
        high: 'border-[#DC2626] bg-[#DC2626]/10',
        medium: 'border-[#F7941D] bg-[#F7941D]/10',
        low: 'border-[#FCB614] bg-[#FCB614]/10',
    };

    const statusBadges = {
        pending: 'bg-[#FCB614]/10 text-[#D49A0A]',
        escalated: 'bg-[#DC2626]/15 text-[#B91C1C]',
        resolved: 'bg-[#2BB574]/15 text-[#1E9658]',
    };

    return (
        <div className={`p-4 rounded-xl border-e-4 ${severityColors[issue.severity]} hover-lift transition-all`}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        {issue.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 text-sm">{issue.category}</h4>
                        <p className="text-xs text-gray-600">{issue.description}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadges[issue.status]}`}>
                    {issue.status === 'pending' ? 'معلق' :
                        issue.status === 'escalated' ? 'تم التصعيد' : 'محلول'}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <SLATimer
                    reportedAt={issue.reported_at}
                    slaHours={issue.sla_hours}
                    status={issue.status}
                />
                <div className="text-xs text-gray-500">
                    المسؤول: <span className="font-bold text-gray-700">{issue.responsible_party}</span>
                </div>
            </div>
        </div>
    );
};

export const LiabilityDashboard: React.FC = () => {
    const navigate = useNavigate();

    // Demo data - Replace with actual Supabase queries
    const operationalMetrics: OperationalMetric[] = [
        {
            id: '1',
            name: 'التزام الموظفين',
            value: 92,
            target: 90,
            status: 'excellent',
            trend: 5,
            icon: <Users className="w-5 h-5 text-[#269798]" />
        },
        {
            id: '2',
            name: 'جودة العناية الشخصية',
            value: 88,
            target: 85,
            status: 'good',
            trend: 3,
            icon: <Heart className="w-5 h-5 text-[#DC2626]" />
        },
        {
            id: '3',
            name: 'إكمال الأنشطة',
            value: 76,
            target: 80,
            status: 'warning',
            trend: -2,
            icon: <Activity className="w-5 h-5 text-[#D67A0A]" />
        },
        {
            id: '4',
            name: 'جودة الغذاء',
            value: 94,
            target: 90,
            status: 'excellent',
            trend: 8,
            icon: <Utensils className="w-5 h-5 text-[#1E9658]" />
        },
    ];

    const structuralIssues: StructuralIssue[] = [
        {
            id: '1',
            category: 'نظام التكييف',
            description: 'عطل في المكيف الرئيسي - الجناح الشرقي',
            reported_at: new Date(Date.now() - 50 * 60 * 60 * 1000), // 50 hours ago
            sla_hours: 48,
            responsible_party: 'إدارة المشاريع',
            status: 'escalated',
            severity: 'high',
            icon: <Thermometer className="w-5 h-5 text-[#DC2626]" />
        },
        {
            id: '2',
            category: 'تسرب مياه',
            description: 'تسرب في السقف - دورة المياه الرئيسية',
            reported_at: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
            sla_hours: 48,
            responsible_party: 'المقاول الخارجي',
            status: 'pending',
            severity: 'medium',
            icon: <Droplets className="w-5 h-5 text-[#269798]" />
        },
        {
            id: '3',
            category: 'المصعد',
            description: 'المصعد رقم 2 معطل منذ أسبوع',
            reported_at: new Date(Date.now() - 168 * 60 * 60 * 1000), // 1 week ago
            sla_hours: 48,
            responsible_party: 'شركة الصيانة',
            status: 'escalated',
            severity: 'high',
            icon: <Navigation className="w-5 h-5 text-[#DC2626]" />
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-[#1B7778] to-[#1B7778] rounded-xl">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">لوحة فصل المسؤوليات</h1>
                        <p className="text-gray-500">نظام الحماية الدفاعية - توثيق رقمي للمسؤوليات</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-[#269798]/10 border border-[#269798]/30 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#269798] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#0F3144]">
                        <p className="font-bold mb-1">📊 هذه اللوحة تفصل بوضوح:</p>
                        <p>• <span className="font-bold text-[#1E9658]">الأخضر (يسار)</span>: المسؤوليات التشغيلية تحت سيطرتنا</p>
                        <p>• <span className="font-bold text-[#DC2626]">الأحمر (يمين)</span>: المشاكل الهيكلية خارج سيطرتنا - ستُحوّل المسؤولية تلقائياً للجهات المعنية بعد 48 ساعة</p>
                    </div>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT COLUMN - Operational (Under Control) */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-[#1E9658] to-[#1E9658] text-white p-4 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">المسؤوليات التشغيلية</h2>
                                <p className="text-sm text-[#2BB574]/40">تحت سيطرتنا المباشرة ✓</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {operationalMetrics.map(metric => (
                            <MetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>

                    <div className="bg-[#2BB574]/10 border border-[#2BB574]/20 rounded-xl p-4">
                        <p className="text-sm text-[#14532D]">
                            ✅ <span className="font-bold">الخلاصة:</span> أي قصور في هذه المؤشرات هو مسؤوليتنا المباشرة
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN - Structural (External) */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-[#B91C1C] to-[#B91C1C] text-white p-4 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">المشاكل الهيكلية</h2>
                                <p className="text-sm text-[#DC2626]/40">خارج سيطرتنا - موثقة ومُصعّدة ⚠️</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {structuralIssues.map(issue => (
                            <IssueCard key={issue.id} issue={issue} />
                        ))}
                    </div>

                    <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-4">
                        <p className="text-sm text-[#7F1D1D]">
                            ⚠️ <span className="font-bold">تنبيه:</span> جميع البلاغات المتأخرة عن 48 ساعة يتم تحويل مسؤوليتها تلقائياً للجهات المعنية مع إشعار الوزارة
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics Summary */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">مؤشرات تشغيلية ممتازة</p>
                    <p className="text-2xl font-bold text-[#1E9658]">
                        {operationalMetrics.filter(m => m.status === 'excellent').length}/{operationalMetrics.length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">قضايا هيكلية معلقة</p>
                    <p className="text-2xl font-bold text-[#DC2626]">
                        {structuralIssues.filter(i => i.status !== 'resolved').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">تم التصعيد للوزارة</p>
                    <p className="text-2xl font-bold text-[#D67A0A]">
                        {structuralIssues.filter(i => i.status === 'escalated').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-gray-500 text-sm">متوسط الأداء التشغيلي</p>
                    <p className="text-2xl font-bold text-[#269798]">
                        {Math.round(operationalMetrics.reduce((sum, m) => sum + m.value, 0) / operationalMetrics.length)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiabilityDashboard;
