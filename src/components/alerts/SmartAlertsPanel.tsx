import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Bell, CheckCircle, Clock, Heart,
    Pill, Shield, Activity, ChevronDown, ChevronUp,
    Volume2, VolumeX, Eye
} from 'lucide-react';
import { useRealtimeTableSubscription, queryKeys, getSupabaseClient } from '../../hooks/queries';
import { useVitalsAlertsStore } from '../../stores/useVitalsAlertsStore';
import { seedDemoVitalsAlerts } from '../../services/iotService';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertType = 'vitals' | 'medication' | 'fall' | 'behavior' | 'infection' | 'medical' | 'safety' | 'behavioral' | 'nutrition';

interface SmartAlert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    title: string;
    message: string;
    beneficiaryName: string;
    beneficiaryId: string;
    location: string;
    timestamp: string;
    acknowledged: boolean;
    acknowledgedBy?: string;
    resolvedAt?: string;
    suggestedAction: string;
}

// Fallback mock alerts if database is empty
const defaultAlerts: SmartAlert[] = [
    { id: '1', type: 'vitals', severity: 'critical', title: 'ارتفاع حاد في الحرارة', message: 'درجة الحرارة 39.5°C - تجاوز الحد الأعلى', beneficiaryName: 'محمد العمري', beneficiaryId: 'B001', location: 'غرفة 101', timestamp: '10:45', acknowledged: false, suggestedAction: 'قياس العلامات الحيوية فوراً وإبلاغ الطبيب' },
    { id: '2', type: 'fall', severity: 'high', title: 'خطر سقوط مرتفع', message: 'درجة خطر السقوط 52/60', beneficiaryName: 'فاطمة سعيد', beneficiaryId: 'B002', location: 'غرفة 102', timestamp: '10:30', acknowledged: false, suggestedAction: 'تفعيل بروتوكول منع السقوط والمراقبة المستمرة' },
    { id: '3', type: 'medication', severity: 'high', title: 'تأخر في إعطاء الدواء', message: 'دواء الأنسولين متأخر 45 دقيقة', beneficiaryName: 'خالد الدوسري', beneficiaryId: 'B003', location: 'غرفة 107', timestamp: '10:15', acknowledged: true, acknowledgedBy: 'نايف الغامدي', suggestedAction: 'إعطاء الدواء فوراً مع قياس السكر' },
    { id: '4', type: 'behavior', severity: 'medium', title: 'تغير في السلوك', message: 'لوحظ انعزال وقلة تفاعل', beneficiaryName: 'نورة محمد', beneficiaryId: 'B004', location: 'غرفة 104', timestamp: '09:45', acknowledged: false, suggestedAction: 'تقييم نفسي واجتماعي' },
    { id: '5', type: 'infection', severity: 'critical', title: 'اشتباه عدوى تنفسية', message: 'أعراض: سعال، حرارة، ضيق تنفس', beneficiaryName: 'سعود العتيبي', beneficiaryId: 'B005', location: 'غرفة 105', timestamp: '09:30', acknowledged: false, suggestedAction: 'عزل فوري وإبلاغ فريق IPC' },
];

/**
 * Severity → HRSD-compliant tones.
 * - critical: semantic red #DC2626 (life-safety exception, not in brand palette)
 * - high:     HRSD orange  #F7941D (Pantone 2011C)
 * - medium:   HRSD gold    #FCB614 (Pantone 7409C)
 * - low:      HRSD teal    #269798 (Pantone 2235C)
 */
const SEVERITY_CONFIG = {
    critical: { hex: '#DC2626', bgColor: 'bg-[#DC2626]/10', borderColor: 'border-[#DC2626]/40', textColor: 'text-[#DC2626]', label: 'حرج' },
    high:     { hex: '#F7941D', bgColor: 'bg-[#F7941D]/10', borderColor: 'border-[#F7941D]/40', textColor: 'text-[#D67A0A]', label: 'مرتفع' },
    medium:   { hex: '#FCB614', bgColor: 'bg-[#FCB614]/10', borderColor: 'border-[#FCB614]/40', textColor: 'text-[#D49A0A]', label: 'متوسط' },
    low:      { hex: '#269798', bgColor: 'bg-[#269798]/10', borderColor: 'border-[#269798]/40', textColor: 'text-[#269798]', label: 'منخفض' },
};

const TYPE_CONFIG: Record<string, { icon: React.FC<{ className?: string }>; label: string }> = {
    vitals: { icon: Heart, label: 'علامات حيوية' },
    medication: { icon: Pill, label: 'أدوية' },
    fall: { icon: AlertTriangle, label: 'سقوط' },
    behavior: { icon: Activity, label: 'سلوك' },
    behavioral: { icon: Activity, label: 'سلوك' },
    infection: { icon: Shield, label: 'عدوى' },
    medical: { icon: Heart, label: 'طبي' },
    safety: { icon: AlertTriangle, label: 'سلامة' },
    nutrition: { icon: Pill, label: 'تغذية' },
};

export const SmartAlertsPanel: React.FC = () => {
    const location = useLocation();
    const [alerts, setAlerts] = useState<SmartAlert[]>(defaultAlerts);
    const [, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
    const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [resolveNotes, setResolveNotes] = useState<Record<string, string>>({});

    // Fetch alerts using TanStack Query
    const { data: fetchedAlerts } = useQuery<SmartAlert[]>({
        queryKey: [...queryKeys.alerts.list(), location.key],
        queryFn: async () => {
            const supabase = getSupabaseClient();
            if (!supabase) return defaultAlerts;

            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) return defaultAlerts;

            return data.map((a: Record<string, unknown>) => ({
                id: a.id as string,
                type: (a.alert_type as AlertType) || 'vitals',
                severity: (a.severity as AlertSeverity) || 'medium',
                title: (a.title as string) || 'تنبيه',
                message: (a.message as string) || (a.description as string) || '',
                beneficiaryName: (a.beneficiary_name as string) || 'غير محدد',
                beneficiaryId: (a.beneficiary_id as string) || '',
                location: (a.location as string) || 'غير محدد',
                timestamp: a.created_at ? new Date(a.created_at as string).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : '',
                acknowledged: a.status === 'acknowledged' || a.status === 'resolved',
                acknowledgedBy: a.acknowledged_by as string | undefined,
                suggestedAction: (a.suggested_action as string) || 'يرجى التحقق من الحالة'
            }));
        },
        staleTime: 0,
    });

    // Sync fetched alerts into local state
    useEffect(() => {
        if (fetchedAlerts) {
            setAlerts(fetchedAlerts);
            setLoading(false);
        }
    }, [fetchedAlerts]);

    // Subscribe to realtime changes on alerts table
    useRealtimeTableSubscription('alerts', queryKeys.alerts.list());

    // Live vitals alerts from IoT (وSeed for demo)
    const vitalsAlerts = useVitalsAlertsStore(s => s.alerts);
    const ackVitalsAlert = useVitalsAlertsStore(s => s.acknowledge);
    const resolveVitalsAlert = useVitalsAlertsStore(s => s.resolve);

    useEffect(() => { seedDemoVitalsAlerts(); }, []);

    // ادمج تنبيهات العلامات الحيوية مع التنبيهات المخزّنة
    const mergedAlerts: SmartAlert[] = [
        ...vitalsAlerts.map((v): SmartAlert => ({
            id: `live-${v.id}`,
            type: 'vitals',
            severity: v.severity,
            title: v.title,
            message: v.message,
            beneficiaryName: v.beneficiaryName,
            beneficiaryId: v.beneficiaryId,
            location: v.location,
            timestamp: v.timestamp,
            acknowledged: v.acknowledged,
            acknowledgedBy: v.acknowledgedBy,
            suggestedAction: v.suggestedAction,
        })),
        ...alerts,
    ];

    const filteredAlerts = mergedAlerts.filter(alert => {
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
        const matchesType = filterType === 'all' || alert.type === filterType;
        return matchesSeverity && matchesType;
    });

    const handleAcknowledge = (alertId: string) => {
        if (alertId.startsWith('live-')) {
            ackVitalsAlert(alertId.replace('live-', ''), 'المستخدم الحالي');
            return;
        }
        setAlerts(prev => prev.map(a =>
            a.id === alertId ? { ...a, acknowledged: true, acknowledgedBy: 'المستخدم الحالي' } : a
        ));
    };

    const handleResolve = (alertId: string) => {
        if (alertId.startsWith('live-')) {
            resolveVitalsAlert(alertId.replace('live-', ''));
        } else {
            setAlerts(prev => prev.filter(a => a.id !== alertId));
        }
        setSelectedAlert(null);
        setResolveNotes(prev => {
            const next = { ...prev };
            delete next[alertId];
            return next;
        });
    };

    const unacknowledgedCount = mergedAlerts.filter(a => !a.acknowledged).length;
    const criticalCount = mergedAlerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

    return (
        <div className="min-h-screen bg-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-hrsd-navy rounded-2xl flex items-center justify-center relative">
                        <Bell className="w-7 h-7 text-hrsd-gold" />
                        {unacknowledgedCount > 0 && (
                            <span className="absolute -top-2 -end-2 w-6 h-6 bg-[#DC2626] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {unacknowledgedCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-hrsd-navy">لوحة التنبيهات الذكية</h1>
                        <p className="text-hrsd-cool-gray text-sm">مركز إدارة التنبيهات والاستجابة</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {criticalCount > 0 && (
                        <div className="bg-[#DC2626]/10 border border-[#DC2626]/40 rounded-xl px-4 py-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                            <span className="text-[#DC2626] font-medium">{criticalCount} تنبيهات حرجة</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-3 rounded-xl transition-colors ${
                            soundEnabled
                                ? 'bg-[#269798]/10 text-[#269798] border border-[#269798]/30'
                                : 'bg-gray-100 text-hrsd-cool-gray border border-gray-200'
                        }`}
                        aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map(severity => {
                        const isActive = filterSeverity === severity;
                        const cfg = severity !== 'all' ? SEVERITY_CONFIG[severity] : null;
                        return (
                            <button
                                key={severity}
                                type="button"
                                onClick={() => setFilterSeverity(severity)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? severity === 'all'
                                            ? 'bg-hrsd-navy text-white'
                                            : `${cfg!.bgColor} ${cfg!.textColor} border ${cfg!.borderColor}`
                                        : 'text-hrsd-cool-gray hover:text-hrsd-navy'
                                }`}
                            >
                                {severity === 'all' ? 'الكل' : SEVERITY_CONFIG[severity].label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                    {(['all', 'vitals', 'medication', 'fall', 'behavior', 'infection'] as const).map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                                filterType === type
                                    ? 'bg-hrsd-navy text-white'
                                    : 'text-hrsd-cool-gray hover:text-hrsd-navy'
                            }`}
                        >
                            {type !== 'all' && React.createElement(TYPE_CONFIG[type].icon, { className: 'w-3 h-3' })}
                            {type === 'all' ? 'جميع الأنواع' : TYPE_CONFIG[type].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredAlerts.map((alert, index) => {
                        const severityConfig = SEVERITY_CONFIG[alert.severity];
                        const typeConfig = TYPE_CONFIG[alert.type];
                        const isExpanded = selectedAlert === alert.id;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                transition={{ delay: index * 0.04 }}
                                className={`rounded-2xl border-2 bg-white ${severityConfig.borderColor} overflow-hidden`}
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setSelectedAlert(isExpanded ? null : alert.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${severityConfig.bgColor} border ${severityConfig.borderColor} flex items-center justify-center flex-shrink-0`}>
                                                <typeConfig.icon className={`w-6 h-6 ${severityConfig.textColor}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="font-bold text-hrsd-navy">{alert.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${severityConfig.bgColor} ${severityConfig.textColor}`}>
                                                        {severityConfig.label}
                                                    </span>
                                                    {alert.acknowledged && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#2BB574]/10 text-[#1E9658] border border-[#2BB574]/30">
                                                            تم الاطلاع
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-hrsd-cool-gray text-sm mb-2">{alert.message}</p>
                                                <div className="flex items-center gap-4 text-sm text-hrsd-cool-gray flex-wrap">
                                                    <span className="text-hrsd-navy font-medium">{alert.beneficiaryName}</span>
                                                    <span>·</span>
                                                    <span>{alert.location}</span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {alert.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-hrsd-cool-gray"
                                            aria-label={isExpanded ? 'طيّ' : 'توسيع'}
                                        >
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-gray-200"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Suggested Action */}
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <p className="text-hrsd-cool-gray text-sm mb-1">الإجراء المقترح:</p>
                                                    <p className="text-hrsd-navy font-medium">{alert.suggestedAction}</p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    {!alert.acknowledged && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAcknowledge(alert.id)}
                                                            className="flex-1 py-3 bg-[#269798] hover:bg-[#1B7778] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                            تم الاطلاع
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleResolve(alert.id)}
                                                        className="flex-1 py-3 bg-[#2BB574] hover:bg-[#1E9658] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        تم الحل
                                                    </button>
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <label className="text-hrsd-navy text-sm font-medium mb-2 block">ملاحظات الحل:</label>
                                                    <textarea
                                                        value={resolveNotes[alert.id] || ''}
                                                        onChange={(e) => setResolveNotes(prev => ({ ...prev, [alert.id]: e.target.value }))}
                                                        placeholder="أضف ملاحظات حول الإجراء المتّخذ…"
                                                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-hrsd-navy placeholder-gray-400 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/30 focus:border-hrsd-teal"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredAlerts.length === 0 && (
                <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 text-[#2BB574] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-hrsd-navy mb-2">لا توجد تنبيهات</h3>
                    <p className="text-hrsd-cool-gray">جميع الأمور تحت السيطرة</p>
                </div>
            )}
        </div>
    );
};

export default SmartAlertsPanel;
