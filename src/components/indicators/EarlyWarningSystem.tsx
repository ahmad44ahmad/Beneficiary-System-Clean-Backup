import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, Shield, ChevronLeft, TrendingUp,
    AlertOctagon, Wrench, Activity, Users, RefreshCw
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RiskScoreData {
    score_date: string;
    overdue_maintenance_count: number;
    fall_incidents_week: number;
    active_critical_alerts: number;
    critical_accountability_gaps: number;
    poor_condition_assets: number;
    total_risk_score: number;
    risk_level: string;
}

export const EarlyWarningSystem: React.FC = () => {
    const navigate = useNavigate();
    const [riskData, setRiskData] = useState<RiskScoreData[]>([]);
    const [currentRisk, setCurrentRisk] = useState<RiskScoreData | null>(null);
    const [loading, setLoading] = useState(true);

    // Demo data
    const demoData: RiskScoreData[] = [
        { score_date: '2026-01-01', overdue_maintenance_count: 3, fall_incidents_week: 1, active_critical_alerts: 2, critical_accountability_gaps: 4, poor_condition_assets: 5, total_risk_score: 125, risk_level: 'أحمر' },
        { score_date: '2026-01-02', overdue_maintenance_count: 4, fall_incidents_week: 0, active_critical_alerts: 2, critical_accountability_gaps: 4, poor_condition_assets: 5, total_risk_score: 115, risk_level: 'أحمر' },
        { score_date: '2026-01-03', overdue_maintenance_count: 4, fall_incidents_week: 1, active_critical_alerts: 3, critical_accountability_gaps: 4, poor_condition_assets: 5, total_risk_score: 140, risk_level: 'أحمر' },
        { score_date: '2026-01-04', overdue_maintenance_count: 5, fall_incidents_week: 1, active_critical_alerts: 3, critical_accountability_gaps: 4, poor_condition_assets: 5, total_risk_score: 145, risk_level: 'أحمر' },
        { score_date: '2026-01-05', overdue_maintenance_count: 5, fall_incidents_week: 2, active_critical_alerts: 4, critical_accountability_gaps: 4, poor_condition_assets: 5, total_risk_score: 170, risk_level: 'أحمر' },
        { score_date: '2026-01-06', overdue_maintenance_count: 6, fall_incidents_week: 2, active_critical_alerts: 4, critical_accountability_gaps: 4, poor_condition_assets: 6, total_risk_score: 188, risk_level: 'أحمر' },
        { score_date: '2026-01-07', overdue_maintenance_count: 6, fall_incidents_week: 0, active_critical_alerts: 3, critical_accountability_gaps: 4, poor_condition_assets: 6, total_risk_score: 143, risk_level: 'أحمر' },
        { score_date: '2026-01-08', overdue_maintenance_count: 5, fall_incidents_week: 0, active_critical_alerts: 2, critical_accountability_gaps: 3, poor_condition_assets: 6, total_risk_score: 103, risk_level: 'أحمر' },
        { score_date: '2026-01-09', overdue_maintenance_count: 4, fall_incidents_week: 1, active_critical_alerts: 2, critical_accountability_gaps: 3, poor_condition_assets: 5, total_risk_score: 105, risk_level: 'أحمر' },
    ];

    useEffect(() => {
        const fetchRiskData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('risk_score_log')
                .select('*')
                .order('score_date', { ascending: true })
                .limit(14);

            if (error || !data || data.length === 0) {
                setRiskData(demoData);
                setCurrentRisk(demoData[demoData.length - 1]);
            } else {
                setRiskData(data);
                setCurrentRisk(data[data.length - 1]);
            }
            setLoading(false);
        };
        fetchRiskData();
    }, []);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'أحمر': return 'from-red-600 to-red-700';
            case 'برتقالي': return 'from-orange-500 to-orange-600';
            case 'أصفر': return 'from-yellow-500 to-yellow-600';
            default: return 'from-hrsd-green to-hrsd-green-dark';
        }
    };

    const getRiskTextColor = (level: string) => {
        switch (level) {
            case 'أحمر': return 'text-red-600';
            case 'برتقالي': return 'text-orange-500';
            case 'أصفر': return 'text-yellow-600';
            default: return 'text-hrsd-green';
        }
    };

    const topRisks = currentRisk ? [
        { icon: Wrench, label: 'صيانة متأخرة', value: currentRisk.overdue_maintenance_count, weight: 5, color: 'text-orange-600' },
        { icon: Activity, label: 'حوادث سقوط', value: currentRisk.fall_incidents_week, weight: 10, color: 'text-red-600' },
        { icon: AlertOctagon, label: 'تنبيهات حرجة', value: currentRisk.active_critical_alerts, weight: 15, color: 'text-red-700' },
        { icon: Shield, label: 'فجوات مساءلة', value: currentRisk.critical_accountability_gaps, weight: 20, color: 'text-purple-600' },
        { icon: Users, label: 'أصول بحالة سيئة', value: currentRisk.poor_condition_assets, weight: 3, color: 'text-gray-600' },
    ].sort((a, b) => (b.value * b.weight) - (a.value * a.weight)) : [];

    const recommendations = [
        { priority: 1, action: 'إصلاح طلبات الصيانة المتأخرة فوراً', impact: 'خفض 20 نقطة' },
        { priority: 2, action: 'معالجة الفجوات الحرجة مع الوزارة', impact: 'خفض 60 نقطة' },
        { priority: 3, action: 'مراجعة بروتوكول منع السقوط', impact: 'خفض 10 نقاط' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className={`p-3 bg-gradient-to-br ${currentRisk ? getRiskColor(currentRisk.risk_level) : 'from-gray-500 to-gray-600'} rounded-xl`}>
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر الطوارئ الوقائي</h1>
                        <p className="text-hierarchy-small text-gray-500">نظام الإنذار المبكر للكوارث المحتملة</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mr-auto p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            ) : (
                <>
                    {/* Main Risk Gauge */}
                    <div className={`bg-gradient-to-r ${currentRisk ? getRiskColor(currentRisk.risk_level) : ''} rounded-2xl p-6 text-white mb-6`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm mb-1">مستوى الخطر الحالي</p>
                                <p className="text-5xl font-bold">{currentRisk?.total_risk_score || 0}</p>
                                <p className="text-xl mt-1">نقطة</p>
                            </div>
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                                    <AlertTriangle className="w-12 h-12" />
                                </div>
                                <p className="mt-2 text-lg font-bold">{currentRisk?.risk_level || 'غير معروف'}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-white/80 text-sm">المعيار</p>
                                <div className="space-y-1 mt-2 text-sm">
                                    <p>0-30: أخضر ✅</p>
                                    <p>31-60: أصفر ⚠️</p>
                                    <p>61-90: برتقالي 🟠</p>
                                    <p>&gt;90: أحمر 🔴</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Risk Components */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        {topRisks.map((risk, idx) => (
                            <div key={idx} className="hrsd-card text-center">
                                <risk.icon className={`w-8 h-8 mx-auto mb-2 ${risk.color}`} />
                                <p className="text-2xl font-bold text-gray-900">{risk.value}</p>
                                <p className="text-hierarchy-small text-gray-500">{risk.label}</p>
                                <p className="text-xs text-gray-400 mt-1">×{risk.weight} = {risk.value * risk.weight} نقطة</p>
                            </div>
                        ))}
                    </div>

                    {/* Trend Chart */}
                    <div className="hrsd-card mb-6">
                        <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-hrsd-teal" />
                            اتجاه المخاطر (آخر 14 يوم)
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={riskData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="score_date" tickFormatter={(v) => new Date(v).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })} />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(v) => new Date(v).toLocaleDateString('ar-SA')}
                                    formatter={(value: number) => [`${value} نقطة`, 'مستوى الخطر']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_risk_score"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recommendations */}
                    <div className="hrsd-card">
                        <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-hrsd-green" />
                            توصيات وقائية فورية
                        </h3>
                        <div className="space-y-3">
                            {recommendations.map((rec, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 rounded-full bg-hrsd-teal text-white flex items-center justify-center font-bold">
                                        {rec.priority}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{rec.action}</p>
                                    </div>
                                    <span className="badge-success">{rec.impact}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EarlyWarningSystem;
