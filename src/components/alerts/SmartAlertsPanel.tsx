import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Bell, CheckCircle, Clock, Heart,
    Pill, Shield, Activity, X, ChevronDown, ChevronUp,
    Filter, Search, Volume2, VolumeX, Eye, MessageSquare
} from 'lucide-react';
import { supabase } from '../../config/supabase';

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

const SEVERITY_CONFIG = {
    critical: { color: 'red', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/50', textColor: 'text-red-400', label: 'حرج' },
    high: { color: 'orange', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/50', textColor: 'text-orange-400', label: 'مرتفع' },
    medium: { color: 'yellow', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50', textColor: 'text-yellow-400', label: 'متوسط' },
    low: { color: 'blue', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50', textColor: 'text-blue-400', label: 'منخفض' },
};

const TYPE_CONFIG: Record<string, { icon: any; label: string }> = {
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
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
    const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [resolveNote, setResolveNote] = useState('');

    // Fetch alerts from Supabase
    useEffect(() => {
        const fetchAlerts = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('alerts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.warn('Failed to fetch alerts:', error.message);
                    setLoading(false);
                    return;
                }

                if (data && data.length > 0) {
                    // Transform database alerts to component format
                    const transformedAlerts: SmartAlert[] = data.map((a: any) => ({
                        id: a.id,
                        type: a.alert_type || 'vitals',
                        severity: a.severity || 'medium',
                        title: a.title || 'تنبيه',
                        message: a.message || a.description || '',
                        beneficiaryName: a.beneficiary_name || 'غير محدد',
                        beneficiaryId: a.beneficiary_id || '',
                        location: a.location || 'غير محدد',
                        timestamp: a.created_at ? new Date(a.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : '',
                        acknowledged: a.status === 'acknowledged' || a.status === 'resolved',
                        acknowledgedBy: a.acknowledged_by,
                        suggestedAction: a.suggested_action || 'يرجى التحقق من الحالة'
                    }));
                    setAlerts(transformedAlerts);
                }
            } catch (err) {
                console.warn('Error fetching alerts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [location.key]);

    const filteredAlerts = alerts.filter(alert => {
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
        const matchesType = filterType === 'all' || alert.type === filterType;
        return matchesSeverity && matchesType;
    });

    const handleAcknowledge = (alertId: string) => {
        setAlerts(prev => prev.map(a =>
            a.id === alertId ? { ...a, acknowledged: true, acknowledgedBy: 'المستخدم الحالي' } : a
        ));
    };

    const handleResolve = (alertId: string) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        setSelectedAlert(null);
        setResolveNote('');
    };

    const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;
    const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg relative">
                        <Bell className="w-7 h-7 text-white" />
                        {unacknowledgedCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                                {unacknowledgedCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">لوحة التنبيهات الذكية</h1>
                        <p className="text-slate-400 text-sm">مركز إدارة التنبيهات والاستجابة</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {criticalCount > 0 && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-xl px-4 py-2 flex items-center gap-2 animate-pulse">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">{criticalCount} تنبيهات حرجة</span>
                        </div>
                    )}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`p-3 rounded-xl transition-colors ${soundEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-500'}`}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map(severity => (
                        <button
                            key={severity}
                            onClick={() => setFilterSeverity(severity)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterSeverity === severity
                                ? severity === 'all' ? 'bg-slate-600 text-white' : `${SEVERITY_CONFIG[severity as AlertSeverity].bgColor} ${SEVERITY_CONFIG[severity as AlertSeverity].textColor}`
                                : 'text-slate-400 hover:text-white'}`}
                        >
                            {severity === 'all' ? 'الكل' : SEVERITY_CONFIG[severity].label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1">
                    {(['all', 'vitals', 'medication', 'fall', 'behavior', 'infection'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${filterType === type ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`rounded-2xl border-2 ${severityConfig.borderColor} ${severityConfig.bgColor} overflow-hidden ${alert.severity === 'critical' && !alert.acknowledged ? 'animate-pulse' : ''}`}
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setSelectedAlert(isExpanded ? null : alert.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${severityConfig.bgColor} border ${severityConfig.borderColor} flex items-center justify-center`}>
                                                <typeConfig.icon className={`w-6 h-6 ${severityConfig.textColor}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white">{alert.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityConfig.bgColor} ${severityConfig.textColor}`}>
                                                        {severityConfig.label}
                                                    </span>
                                                    {alert.acknowledged && (
                                                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                                            تم الاطلاع
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <span>{alert.beneficiaryName}</span>
                                                    <span>•</span>
                                                    <span>{alert.location}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {alert.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
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
                                            className="border-t border-slate-700"
                                        >
                                            <div className="p-4 space-y-4">
                                                {/* Suggested Action */}
                                                <div className="bg-slate-800/50 rounded-xl p-4">
                                                    <p className="text-slate-400 text-sm mb-1">الإجراء المقترح:</p>
                                                    <p className="text-white font-medium">{alert.suggestedAction}</p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3">
                                                    {!alert.acknowledged && (
                                                        <button
                                                            onClick={() => handleAcknowledge(alert.id)}
                                                            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                                        >
                                                            <Eye className="w-5 h-5" />
                                                            تم الاطلاع
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleResolve(alert.id)}
                                                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                        تم الحل
                                                    </button>
                                                </div>

                                                {/* Notes */}
                                                <div>
                                                    <label className="text-slate-400 text-sm mb-2 block">ملاحظات الحل:</label>
                                                    <textarea
                                                        value={resolveNote}
                                                        onChange={(e) => setResolveNote(e.target.value)}
                                                        placeholder="أضف ملاحظات حول الإجراء المتخذ..."
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 resize-none h-20 focus:outline-none focus:border-blue-500"
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
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد تنبيهات</h3>
                    <p className="text-slate-400">جميع الأمور تحت السيطرة</p>
                </div>
            )}
        </div>
    );
};

export default SmartAlertsPanel;
