import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, XCircle, ChevronDown, ChevronUp,
    Clock, Building2, FileWarning, CheckCircle2,
    ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../../config/supabase';

// HRSD Colors
const HRSD = {
    orange: 'rgb(245, 150, 30)',
    gold: 'rgb(250, 180, 20)',
    green: 'rgb(45, 180, 115)',
    teal: 'rgb(20, 130, 135)',
    navy: 'rgb(20, 65, 90)',
};

interface AccountabilityGap {
    id: string;
    issue_code: string;
    issue_title: string;
    issue_description: string;
    responsible_agency: string;
    redirected_to: string | null;
    is_misdirected: boolean;
    official_response: string;
    actual_delivery: string;
    evasion_type: string;
    severity: string;
    days_pending: number;
    evidence_quote: string;
    requires_attention: boolean;
    acknowledged: boolean;
}

interface Props {
    onDismiss?: () => void;
    compact?: boolean;
}

export const AccountabilityAlerts: React.FC<Props> = ({ onDismiss, compact = false }) => {
    const [gaps, setGaps] = useState<AccountabilityGap[]>([]);
    const [expanded, setExpanded] = useState(!compact);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGaps();
    }, []);

    const fetchGaps = async () => {
        try {
            const { data } = await supabase
                .from('accountability_gaps')
                .select('*')
                .eq('requires_attention', true)
                .eq('acknowledged', false)
                .order('severity', { ascending: true })
                .order('days_pending', { ascending: false });

            if (data) setGaps(data);
        } catch (error) {
            console.error('Error fetching accountability gaps:', error);
        } finally {
            setLoading(false);
        }
    };

    const acknowledgeGap = async (id: string) => {
        await supabase
            .from('accountability_gaps')
            .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
            .eq('id', id);

        setGaps(gaps.filter(g => g.id !== id));
    };

    const getEvasionLabel = (type: string) => {
        switch (type) {
            case 'forward_escape': return 'هروب للأمام';
            case 'misdirection': return 'تحويل لجهة أخرى';
            case 'false_promise': return 'وعد كاذب';
            case 'silence': return 'صمت وتجاهل';
            case 'partial_delivery': return 'تنفيذ جزئي';
            default: return type;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500';
            case 'high': return 'bg-orange-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    if (loading || gaps.length === 0) return null;

    const criticalCount = gaps.filter(g => g.severity === 'critical').length;
    const highCount = gaps.filter(g => g.severity === 'high').length;

    return (
        <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-xl shadow-lg overflow-hidden mb-6" dir="rtl">
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-600/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white">
                        <h3 className="font-bold text-lg">تنبيهات المساءلة</h3>
                        <p className="text-sm opacity-90">
                            {gaps.length} قضية تستدعي النظر
                            {criticalCount > 0 && ` • ${criticalCount} حرجة`}
                            {highCount > 0 && ` • ${highCount} عالية`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onDismiss && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <EyeOff className="w-5 h-5 text-white" />
                        </button>
                    )}
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-white" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="bg-white p-4 space-y-3 max-h-96 overflow-y-auto">
                    {gaps.map((gap) => (
                        <div
                            key={gap.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs text-white rounded-full ${getSeverityColor(gap.severity)}`}>
                                            {gap.severity === 'critical' ? 'حرج' :
                                                gap.severity === 'high' ? 'عالي' :
                                                    gap.severity === 'medium' ? 'متوسط' : 'منخفض'}
                                        </span>
                                        <span className="text-xs text-gray-500">{gap.issue_code}</span>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                            {getEvasionLabel(gap.evasion_type)}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-gray-800 mb-1">{gap.issue_title}</h4>

                                    <div className="text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4" />
                                            <span>المسؤول: {gap.responsible_agency}</span>
                                            {gap.is_misdirected && gap.redirected_to && (
                                                <>
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span className="text-orange-600">أُحيل لـ: {gap.redirected_to}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{gap.days_pending} يوم بدون حل</span>
                                        </div>
                                    </div>

                                    {gap.evidence_quote && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600 italic border-r-2 border-orange-400">
                                            "{gap.evidence_quote}"
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => acknowledgeGap(gap.id)}
                                    className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                                    title="تم الاطلاع"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
