import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    Target,
    TrendingUp,
    TrendingDown,
    Activity,
    FileText,
    Users,
    Zap,
    ArrowLeft,
    Plus,
    RefreshCcw,
    BarChart3,
    AlertOctagon,
    ClipboardCheck,
    Settings
} from 'lucide-react';

// HRSD Official Colors
const HRSD_COLORS = {
    orange: 'rgb(245, 150, 30)',    // Pantone 1375 C
    gold: 'rgb(250, 180, 20)',      // Pantone 1235 C
    green: 'rgb(45, 180, 115)',     // Pantone 3385 C
    teal: 'rgb(20, 130, 135)',      // Pantone 2237 C
    navy: 'rgb(20, 65, 90)',        // Pantone 3025 C
};

interface GRCStats {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    complianceScore: number;
    openIncidents: number;
    bcpScenarios: number;
}

export const GRCDashboard: React.FC = () => {
    const [stats, setStats] = useState<GRCStats>({
        totalRisks: 0,
        criticalRisks: 0,
        highRisks: 0,
        mediumRisks: 0,
        lowRisks: 0,
        complianceScore: 0,
        openIncidents: 0,
        bcpScenarios: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentRisks, setRecentRisks] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch risks
            const { data: risks } = await supabase
                .from('grc_risks')
                .select('*')
                .order('created_at', { ascending: false });

            // Calculate stats
            const criticalRisks = risks?.filter(r => r.risk_level === 'critical').length || 0;
            const highRisks = risks?.filter(r => r.risk_level === 'high').length || 0;
            const mediumRisks = risks?.filter(r => r.risk_level === 'medium').length || 0;
            const lowRisks = risks?.filter(r => r.risk_level === 'low').length || 0;

            // Fetch compliance
            const { data: compliance } = await supabase
                .from('grc_compliance_requirements')
                .select('compliance_status');

            const compliantCount = compliance?.filter(c => c.compliance_status === 'compliant').length || 0;
            const totalCompliance = compliance?.length || 1;
            const complianceScore = Math.round((compliantCount / totalCompliance) * 100);

            // Fetch incidents
            const { data: incidents } = await supabase
                .from('grc_safety_incidents')
                .select('*')
                .neq('status', 'closed');

            // Fetch BCP
            const { data: bcp } = await supabase
                .from('grc_bcp_scenarios')
                .select('*')
                .eq('status', 'active');

            setStats({
                totalRisks: risks?.length || 0,
                criticalRisks,
                highRisks,
                mediumRisks,
                lowRisks,
                complianceScore,
                openIncidents: incidents?.length || 0,
                bcpScenarios: bcp?.length || 0
            });
            setRecentRisks(risks?.slice(0, 5) || []);
        } catch (error) {
            console.error('Error fetching GRC data:', error);
        }
        setLoading(false);
    };

    const getRiskLevelBadge = (level: string) => {
        const styles: Record<string, string> = {
            critical: 'bg-red-600 text-white',
            high: 'bg-orange-500 text-white',
            medium: 'bg-yellow-500 text-white',
            low: 'bg-green-500 text-white'
        };
        const labels: Record<string, string> = {
            critical: 'حرج',
            high: 'عالي',
            medium: 'متوسط',
            low: 'منخفض'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[level] || 'bg-gray-500'}`}>
                {labels[level] || level}
            </span>
        );
    };

    // Risk Heat Map data
    const heatMapData = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ];

    const quickActions = [
        { title: 'سجل المخاطر', icon: AlertTriangle, link: '/grc/risks', color: HRSD_COLORS.orange },
        { title: 'الامتثال', icon: ClipboardCheck, link: '/grc/compliance', color: HRSD_COLORS.teal },
        { title: 'استمرارية الأعمال', icon: Shield, link: '/grc/bcp', color: HRSD_COLORS.navy },
        { title: 'حوادث السلامة', icon: AlertOctagon, link: '/grc/safety', color: HRSD_COLORS.green },
    ];

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header with HRSD Gradient */}
            <div className="bg-gradient-to-l from-[rgb(20,65,90)] to-[rgb(20,130,135)] rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white mb-2">
                            <ArrowLeft className="w-4 h-4" />
                            العودة للرئيسية
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Shield className="w-9 h-9 text-[rgb(250,180,20)]" />
                            الحوكمة والمخاطر والامتثال (GRC)
                        </h1>
                        <p className="text-white/80 mt-2">إدارة متكاملة للمخاطر والامتثال واستمرارية الأعمال</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 flex items-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        تحديث
                    </button>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <Target className="w-8 h-8 mx-auto mb-2 text-[rgb(245,150,30)]" />
                        <p className="text-3xl font-bold">{loading ? '...' : stats.totalRisks}</p>
                        <p className="text-sm text-white/70">إجمالي المخاطر</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[rgb(45,180,115)]" />
                        <p className="text-3xl font-bold">{loading ? '...' : stats.complianceScore}%</p>
                        <p className="text-sm text-white/70">نسبة الامتثال</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <AlertOctagon className="w-8 h-8 mx-auto mb-2 text-red-400" />
                        <p className="text-3xl font-bold">{loading ? '...' : stats.openIncidents}</p>
                        <p className="text-sm text-white/70">حوادث مفتوحة</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-[rgb(250,180,20)]" />
                        <p className="text-3xl font-bold">{loading ? '...' : stats.bcpScenarios}</p>
                        <p className="text-sm text-white/70">سيناريوهات BCP</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                    <Link
                        key={idx}
                        to={action.link}
                        className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all group border-r-4"
                        style={{ borderRightColor: action.color }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${action.color}20` }}
                        >
                            <action.icon className="w-6 h-6" style={{ color: action.color }} />
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-[rgb(20,130,135)]">
                            {action.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Risk Heat Map */}
                <div className="col-span-2 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" style={{ color: HRSD_COLORS.teal }} />
                        خريطة المخاطر الحرارية
                    </h2>
                    <div className="relative">
                        {/* Y-axis label */}
                        <div className="absolute -right-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500 font-medium">
                            الاحتمالية
                        </div>

                        <div className="mr-8">
                            {/* Heat map grid */}
                            <div className="grid grid-cols-5 gap-1">
                                {[5, 4, 3, 2, 1].map(likelihood => (
                                    [1, 2, 3, 4, 5].map(impact => {
                                        const score = likelihood * impact;
                                        let bgColor = 'bg-green-100';
                                        if (score >= 20) bgColor = 'bg-red-500';
                                        else if (score >= 12) bgColor = 'bg-orange-400';
                                        else if (score >= 6) bgColor = 'bg-yellow-400';
                                        else if (score >= 3) bgColor = 'bg-green-300';

                                        return (
                                            <div
                                                key={`${likelihood}-${impact}`}
                                                className={`${bgColor} h-14 rounded-lg flex items-center justify-center text-sm font-bold ${score >= 12 ? 'text-white' : 'text-gray-700'} hover:scale-105 transition-transform cursor-pointer`}
                                            >
                                                {score}
                                            </div>
                                        );
                                    })
                                ))}
                            </div>

                            {/* X-axis label */}
                            <div className="text-center mt-2 text-xs text-gray-500 font-medium">
                                التأثير →
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                            <span className="text-xs">حرج (20-25)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-orange-400"></div>
                            <span className="text-xs">عالي (12-19)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-yellow-400"></div>
                            <span className="text-xs">متوسط (6-11)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-300"></div>
                            <span className="text-xs">منخفض (1-5)</span>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" style={{ color: HRSD_COLORS.orange }} />
                        توزيع المخاطر
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                حرج
                            </span>
                            <span className="font-bold text-red-600">{stats.criticalRisks}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 transition-all"
                                style={{ width: `${(stats.criticalRisks / Math.max(stats.totalRisks, 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                عالي
                            </span>
                            <span className="font-bold text-orange-600">{stats.highRisks}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 transition-all"
                                style={{ width: `${(stats.highRisks / Math.max(stats.totalRisks, 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                متوسط
                            </span>
                            <span className="font-bold text-yellow-600">{stats.mediumRisks}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 transition-all"
                                style={{ width: `${(stats.mediumRisks / Math.max(stats.totalRisks, 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                منخفض
                            </span>
                            <span className="font-bold text-green-600">{stats.lowRisks}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all"
                                style={{ width: `${(stats.lowRisks / Math.max(stats.totalRisks, 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <Link
                        to="/grc/risks"
                        className="mt-6 block w-full text-center py-3 bg-gradient-to-l from-[rgb(20,65,90)] to-[rgb(20,130,135)] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
                    >
                        عرض سجل المخاطر
                    </Link>
                </div>
            </div>

            {/* Recent Risks Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="w-5 h-5" style={{ color: HRSD_COLORS.teal }} />
                        أحدث المخاطر المسجلة
                    </h2>
                    <Link
                        to="/grc/risks/new"
                        className="px-4 py-2 text-white rounded-lg flex items-center gap-2 text-sm"
                        style={{ backgroundColor: HRSD_COLORS.orange }}
                    >
                        <Plus className="w-4 h-4" />
                        إضافة خطر
                    </Link>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-gray-400">جاري التحميل...</div>
                ) : recentRisks.length === 0 ? (
                    <div className="py-8 text-center text-gray-400">
                        <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>لا توجد مخاطر مسجلة حتى الآن</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                                <th className="p-3 text-right">الرمز</th>
                                <th className="p-3 text-right">العنوان</th>
                                <th className="p-3 text-center">المستوى</th>
                                <th className="p-3 text-center">الحالة</th>
                                <th className="p-3 text-right">المسؤول</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentRisks.map((risk) => (
                                <tr key={risk.id} className="hover:bg-gray-50">
                                    <td className="p-3 font-mono text-sm">{risk.risk_code}</td>
                                    <td className="p-3 font-medium">{risk.title_ar}</td>
                                    <td className="p-3 text-center">{getRiskLevelBadge(risk.risk_level)}</td>
                                    <td className="p-3 text-center text-sm">{risk.status}</td>
                                    <td className="p-3 text-sm text-gray-600">{risk.risk_owner || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default GRCDashboard;
