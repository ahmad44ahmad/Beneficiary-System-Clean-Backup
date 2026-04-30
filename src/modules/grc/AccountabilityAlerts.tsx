import React, { useState, useEffect } from 'react';
import {
    AlertTriangle, ChevronDown, ChevronUp,
    Clock, Building2, CheckCircle2,
    ArrowRight, EyeOff
} from 'lucide-react';
import { getSupabaseClient } from '../../hooks/queries';


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
        const supabase = getSupabaseClient();
        if (!supabase) { setLoading(false); return; }
        try {
            const { data, error } = await supabase
                .from('accountability_gaps')
                .select('*')
                .eq('requires_attention', true)
                .eq('acknowledged', false)
                .order('severity', { ascending: true })
                .order('days_pending', { ascending: false });

            if (error) {
                // Table may not exist - ignore silently
                setGaps([]);
            } else if (data) {
                setGaps(data);
            }
        } catch {
            setGaps([]);
        } finally {
            setLoading(false);
        }
    };

    const acknowledgeGap = async (id: string) => {
        const supabase = getSupabaseClient();
        if (!supabase) return;
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

    /**
     * Severity → HRSD palette + one semantic exception.
     * critical = semantic red (life-safety), the rest stay in brand.
     */
    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-[#DC2626]';
            case 'high':     return 'bg-[#F7941D]'; // HRSD orange
            case 'medium':   return 'bg-[#FCB614]'; // HRSD gold
            case 'low':      return 'bg-[#269798]'; // HRSD teal
            default:         return 'bg-[#7A7A7A]'; // HRSD cool gray
        }
    };

    if (loading || gaps.length === 0) return null;

    const criticalCount = gaps.filter(g => g.severity === 'critical').length;
    const highCount = gaps.filter(g => g.severity === 'high').length;
    // The top strip uses HRSD navy as the authoritative surface, with a
    // semantic-red badge ONLY when there are critical items. This avoids
    // the previous "wall of red" that overwhelmed the dashboard.
    const hasCritical = criticalCount > 0;

    return (
        <div className="bg-hrsd-navy rounded-xl shadow-md overflow-hidden mb-6" dir="rtl">
            {/* Header */}
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-hrsd-navy-light transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${hasCritical ? 'bg-[#DC2626]' : 'bg-hrsd-gold'}`}>
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-white">
                        <h3 className="font-bold text-lg">تنبيهات المساءلة</h3>
                        <p className="text-sm text-white/75">
                            {gaps.length} قضية تستدعي النظر
                            {criticalCount > 0 && ` · ${criticalCount} حرجة`}
                            {highCount > 0 && ` · ${highCount} عالية`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {onDismiss && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="إخفاء التنبيهات"
                            aria-label="إخفاء التنبيهات"
                        >
                            <EyeOff className="w-5 h-5 text-white/80" />
                        </button>
                    )}
                    {expanded ? (
                        <ChevronUp className="w-5 h-5 text-white/80" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white/80" />
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
                                                    <span className="text-[#F7941D]">أُحيل لـ: {gap.redirected_to}</span>
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
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-hrsd-cool-gray italic border-r-2 border-[#F7941D]">
                                            "{gap.evidence_quote}"
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => acknowledgeGap(gap.id)}
                                    className="p-2 hover:bg-[#2BB574]/10 rounded-lg transition-colors text-[#2BB574]"
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
