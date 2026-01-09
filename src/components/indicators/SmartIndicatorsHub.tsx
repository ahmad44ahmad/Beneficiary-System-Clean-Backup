import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain, Scale, TrendingUp, ChevronLeft,
    AlertTriangle, Activity, Zap, Heart, DollarSign,
    BarChart3, Shield, Users, RefreshCw, CheckCircle,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { supabase } from '../../config/supabase';

interface IndicatorCard {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    path: string;
    gradientClass: string;
    mainValue: string;
    mainLabel: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
    status: 'critical' | 'warning' | 'good';
    category: 'center' | 'ministry' | 'both';
    sparklineData?: number[];
}

// Mini Sparkline Component
const Sparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = 'rgba(20, 130, 135, 0.8)' }) => {
    const max = Math.max(...data);
    const heights = data.map(v => (v / max) * 100);

    return (
        <div className="sparkline-container">
            {heights.map((h, i) => (
                <div
                    key={i}
                    className="sparkline-bar"
                    style={{ height: `${h}%`, background: color }}
                />
            ))}
        </div>
    );
};

// Health Score Gauge Component
const HealthGauge: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 70) return 'rgb(45, 180, 115)';
        if (s >= 50) return 'rgb(250, 180, 20)';
        return 'rgb(239, 68, 68)';
    };

    return (
        <div className="health-gauge flex flex-col items-center">
            <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="health-gauge-circle health-gauge-bg" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="health-gauge-circle"
                    style={{
                        stroke: getColor(score),
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
                <text x="50" y="45" textAnchor="middle" className="text-2xl font-bold fill-gray-800">{score}</text>
                <text x="50" y="62" textAnchor="middle" className="text-xs fill-gray-500">من 100</text>
            </svg>
            <p className="text-sm font-medium text-gray-700 mt-2">{label}</p>
        </div>
    );
};

export const SmartIndicatorsHub: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [overallHealth, setOverallHealth] = useState(68);

    const indicators: IndicatorCard[] = [
        {
            id: 'early-warning',
            title: 'الطوارئ الوقائي',
            subtitle: 'نظام الإنذار المبكر',
            icon: AlertTriangle,
            path: '/indicators/early-warning',
            gradientClass: 'gradient-danger',
            mainValue: '105',
            mainLabel: 'نقاط الخطر',
            trend: 'down',
            trendValue: '-12%',
            status: 'critical',
            category: 'both',
            sparklineData: [125, 115, 140, 145, 170, 188, 143, 103, 105],
        },
        {
            id: 'biological',
            title: 'التدقيق البيولوجي',
            subtitle: 'كشف الفساد عبر ربط المخزون',
            icon: Scale,
            path: '/indicators/biological',
            gradientClass: 'gradient-primary',
            mainValue: '-24%',
            mainLabel: 'فجوة غير مبررة',
            status: 'critical',
            category: 'center',
            sparklineData: [20, 18, 22, 24, 21, 25, 24],
        },
        {
            id: 'satisfaction',
            title: 'الرضا الآني',
            subtitle: 'توقع مشاكل العلاقات العامة',
            icon: Heart,
            path: '/indicators/satisfaction',
            gradientClass: 'gradient-warning',
            mainValue: '72%',
            mainLabel: 'نسبة الرضا',
            trend: 'down',
            trendValue: '-8%',
            status: 'warning',
            category: 'center',
            sparklineData: [85, 82, 78, 75, 70, 72],
        },
        {
            id: 'behavioral',
            title: 'التنبؤ السلوكي',
            subtitle: 'منع الانفجار السلوكي بالذكاء الاصطناعي',
            icon: Brain,
            path: '/indicators/behavioral',
            gradientClass: 'gradient-primary',
            mainValue: '87%',
            mainLabel: 'دقة التنبؤ',
            status: 'warning',
            category: 'center',
            sparklineData: [80, 82, 85, 83, 86, 87],
        },
        {
            id: 'cost',
            title: 'التكلفة/المستفيد',
            subtitle: 'تحليل التكاليف والخصخصة',
            icon: DollarSign,
            path: '/indicators/cost',
            gradientClass: 'gradient-warning',
            mainValue: '380',
            mainLabel: 'ريال/مستفيد/يوم',
            trend: 'stable',
            status: 'good',
            category: 'both',
            sparklineData: [365, 372, 380, 375, 378, 380],
        },
        {
            id: 'hr',
            title: 'الموارد البشرية',
            subtitle: 'ربط الغياب بجودة الخدمة',
            icon: Users,
            path: '/indicators/hr',
            gradientClass: 'gradient-family',
            mainValue: '85%',
            mainLabel: 'نسبة الحضور',
            status: 'warning',
            category: 'center',
            sparklineData: [92, 88, 85, 90, 78, 75, 85],
        },
        {
            id: 'benchmark',
            title: 'المقارنة المرجعية',
            subtitle: 'مقارنة مع معايير الوزارة',
            icon: BarChart3,
            path: '/indicators/benchmark',
            gradientClass: 'gradient-info',
            mainValue: '72%',
            mainLabel: 'الأداء العام',
            status: 'warning',
            category: 'ministry',
            sparklineData: [65, 68, 70, 69, 71, 72],
        },
        {
            id: 'iso',
            title: 'الامتثال ISO 22301',
            subtitle: 'معايير استمرارية الأعمال',
            icon: Shield,
            path: '/indicators/iso',
            gradientClass: 'gradient-primary',
            mainValue: '52%',
            mainLabel: 'نسبة الامتثال',
            trend: 'up',
            trendValue: '+5%',
            status: 'warning',
            category: 'ministry',
            sparklineData: [35, 40, 45, 48, 50, 52],
        },
    ];

    useEffect(() => {
        // Calculate overall health based on indicators
        setTimeout(() => {
            const criticalCount = indicators.filter(i => i.status === 'critical').length;
            const warningCount = indicators.filter(i => i.status === 'warning').length;
            const goodCount = indicators.filter(i => i.status === 'good').length;
            const health = Math.round(((goodCount * 100) + (warningCount * 60) + (criticalCount * 20)) / indicators.length);
            setOverallHealth(health);
            setLoading(false);
        }, 500);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'critical':
                return <span className="status-dot status-dot-critical mr-2"></span>;
            case 'warning':
                return <span className="status-dot status-dot-warning mr-2"></span>;
            default:
                return <span className="status-dot status-dot-success mr-2"></span>;
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category) {
            case 'center':
                return <span className="text-xs bg-hrsd-teal/10 text-hrsd-teal px-2 py-0.5 rounded">إدارة المركز</span>;
            case 'ministry':
                return <span className="text-xs bg-hrsd-navy/10 text-hrsd-navy px-2 py-0.5 rounded">الوزارة</span>;
            default:
                return <span className="text-xs bg-hrsd-gold/10 text-hrsd-gold-dark px-2 py-0.5 rounded">المركز + الوزارة</span>;
        }
    };

    const getTrendIcon = (trend?: string) => {
        switch (trend) {
            case 'up':
                return <ArrowUpRight className="w-4 h-4 text-hrsd-green" />;
            case 'down':
                return <ArrowDownRight className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    // Summary stats
    const criticalCount = indicators.filter(i => i.status === 'critical').length;
    const warningCount = indicators.filter(i => i.status === 'warning').length;
    const goodCount = indicators.filter(i => i.status === 'good').length;

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-3 gradient-primary rounded-xl animate-glow">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-hierarchy-title text-gray-900">المؤشرات الذكية</h1>
                            <p className="text-hierarchy-small text-gray-500">تحليل متقدم بالذكاء الاصطناعي لحماية المركز</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-500"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span className="text-sm hidden md:inline">تحديث</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            ) : (
                <>
                    {/* Executive Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {/* Health Gauge */}
                        <div className="hrsd-card flex items-center justify-center col-span-1">
                            <HealthGauge score={overallHealth} label="صحة المركز" />
                        </div>

                        {/* Quick Stats */}
                        <div className="hrsd-card col-span-1 md:col-span-3">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-hrsd-teal" />
                                ملخص الحالة
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <p className="text-3xl font-bold text-gray-900">{indicators.length}</p>
                                    <p className="text-xs text-gray-500">مؤشرات نشطة</p>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-xl">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="status-dot status-dot-critical"></span>
                                        <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">حرج</p>
                                </div>
                                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="status-dot status-dot-warning"></span>
                                        <p className="text-3xl font-bold text-hrsd-gold">{warningCount}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">تحذير</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-xl">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="status-dot status-dot-success"></span>
                                        <p className="text-3xl font-bold text-hrsd-green">{goodCount}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">جيد</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Alerts Banner */}
                    {criticalCount > 0 && (
                        <div className="mb-6 p-4 gradient-danger rounded-xl text-white flex items-center justify-between animate-pulse-soft">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6" />
                                <div>
                                    <p className="font-bold">⚠️ تنبيه: {criticalCount} مؤشرات في حالة حرجة</p>
                                    <p className="text-sm text-white/80">يرجى مراجعة المؤشرات الحمراء فوراً</p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/indicators/early-warning')}
                                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            >
                                عرض التفاصيل
                            </button>
                        </div>
                    )}

                    {/* Indicator Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {indicators.map((indicator, idx) => (
                            <div
                                key={indicator.id}
                                onClick={() => navigate(indicator.path)}
                                className={`hrsd-card cursor-pointer hover-lift animate-slide-up opacity-0`}
                                style={{ animationDelay: `${idx * 0.05}s`, animationFillMode: 'forwards' }}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-3 ${indicator.gradientClass} rounded-xl`}>
                                        <indicator.icon className="w-5 h-5 text-white" />
                                    </div>
                                    {getStatusBadge(indicator.status)}
                                </div>

                                {/* Title */}
                                <h3 className="text-hierarchy-card-title text-gray-900 mb-1">{indicator.title}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-1">{indicator.subtitle}</p>

                                {/* Main Value */}
                                <div className="flex items-end justify-between mb-3">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{indicator.mainValue}</p>
                                        <p className="text-xs text-gray-500">{indicator.mainLabel}</p>
                                    </div>
                                    {indicator.trend && (
                                        <div className="flex items-center gap-1">
                                            {getTrendIcon(indicator.trend)}
                                            <span className={`text-xs font-medium ${indicator.trend === 'up' ? 'text-hrsd-green' : indicator.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                                                {indicator.trendValue}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Sparkline */}
                                {indicator.sparklineData && (
                                    <div className="mb-3">
                                        <Sparkline
                                            data={indicator.sparklineData}
                                            color={indicator.status === 'critical' ? 'rgba(239, 68, 68, 0.6)' : indicator.status === 'warning' ? 'rgba(250, 180, 20, 0.6)' : 'rgba(45, 180, 115, 0.6)'}
                                        />
                                    </div>
                                )}

                                {/* Category & Action */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    {getCategoryBadge(indicator.category)}
                                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SmartIndicatorsHub;
