import React, { useState, useEffect, useCallback } from 'react';
import {
    AlertTriangle, X, Bell, Shield, Activity,
    ChevronRight, Volume2, VolumeX, CheckCircle
} from 'lucide-react';
import { supabase } from '../../config/supabase';

// Alert Types
export interface SystemAlert {
    id: string;
    type: 'infection' | 'fall_risk' | 'medication' | 'inspection_failed' | 'incident';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    beneficiary_name?: string;
    location?: string;
    created_at: string;
    acknowledged: boolean;
    acknowledged_by?: string;
    acknowledged_at?: string;
}

// Alert Configuration
const ALERT_CONFIG = {
    infection: { icon: Shield, color: 'red', sound: true },
    fall_risk: { icon: AlertTriangle, color: 'orange', sound: true },
    medication: { icon: Activity, color: 'purple', sound: true },
    inspection_failed: { icon: AlertTriangle, color: 'yellow', sound: false },
    incident: { icon: AlertTriangle, color: 'red', sound: true },
};

const SEVERITY_STYLES = {
    low: 'border-blue-300 bg-blue-50',
    medium: 'border-yellow-300 bg-yellow-50',
    high: 'border-orange-400 bg-orange-50',
    critical: 'border-red-500 bg-red-50 animate-pulse',
};

// Demo Alerts
const DEMO_ALERTS: SystemAlert[] = [
    {
        id: '1',
        type: 'fall_risk',
        severity: 'high',
        title: 'تنبيه خطر سقوط',
        message: 'المستفيد حصل على درجة خطر سقوط عالية (52/60)',
        beneficiary_name: 'محمد أحمد العمري',
        location: 'جناح الذكور - الدور الأول',
        created_at: new Date().toISOString(),
        acknowledged: false,
    },
    {
        id: '2',
        type: 'infection',
        severity: 'critical',
        title: 'تنبيه عدوى محتملة',
        message: 'تم تسجيل حالة عدوى تنفسية جديدة',
        beneficiary_name: 'فاطمة سعيد',
        location: 'جناح الإناث',
        created_at: new Date(Date.now() - 300000).toISOString(),
        acknowledged: false,
    },
];

// Sound Hook
const useAlertSound = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);

    const playSound = useCallback(() => {
        if (soundEnabled) {
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }, [soundEnabled]);

    return { soundEnabled, setSoundEnabled, playSound };
};

// Single Alert Card
const AlertCard: React.FC<{
    alert: SystemAlert;
    onAcknowledge: (id: string) => void;
    onDismiss: (id: string) => void;
}> = ({ alert, onAcknowledge, onDismiss }) => {
    const config = ALERT_CONFIG[alert.type];
    const Icon = config.icon;

    return (
        <div
            className={`rounded-xl border-2 p-4 mb-3 shadow-lg transition-all ${SEVERITY_STYLES[alert.severity]}`}
            dir="rtl"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-${config.color}-100`}>
                        <Icon className={`w-5 h-5 text-${config.color}-600`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{alert.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${alert.severity === 'critical' ? 'bg-red-500 text-white' :
                                    alert.severity === 'high' ? 'bg-orange-500 text-white' :
                                        alert.severity === 'medium' ? 'bg-yellow-500 text-white' :
                                            'bg-blue-500 text-white'
                                }`}>
                                {alert.severity === 'critical' ? 'حرج' :
                                    alert.severity === 'high' ? 'مرتفع' :
                                        alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        {alert.beneficiary_name && (
                            <p className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">المستفيد:</span> {alert.beneficiary_name}
                            </p>
                        )}
                        {alert.location && (
                            <p className="text-xs text-gray-400 mt-1">{alert.location}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                            {new Date(alert.created_at).toLocaleTimeString('ar-SA', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onDismiss(alert.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!alert.acknowledged && (
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center justify-center gap-1"
                    >
                        <CheckCircle className="w-4 h-4" />
                        تم الاطلاع
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 flex items-center gap-1">
                        <ChevronRight className="w-4 h-4" />
                        التفاصيل
                    </button>
                </div>
            )}
        </div>
    );
};

// Main Component
export const RealTimeAlerts: React.FC = () => {
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const { soundEnabled, setSoundEnabled, playSound } = useAlertSound();

    // Initialize with demo alerts
    useEffect(() => {
        setAlerts(DEMO_ALERTS);
        setUnreadCount(DEMO_ALERTS.filter(a => !a.acknowledged).length);
    }, []);

    // Subscribe to Supabase Realtime
    useEffect(() => {
        if (!supabase) return;

        // Subscribe to IPC incidents
        const incidentChannel = supabase
            .channel('ipc_incidents_channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ipc_incidents' },
                (payload) => {
                    const newIncident = payload.new as any;
                    const newAlert: SystemAlert = {
                        id: `incident-${newIncident.id}`,
                        type: 'incident',
                        severity: newIncident.severity_level === 'critical' ? 'critical' :
                            newIncident.severity_level === 'severe' ? 'high' :
                                newIncident.severity_level === 'moderate' ? 'medium' : 'low',
                        title: 'تنبيه حادثة عدوى جديدة',
                        message: `تم تسجيل حالة: ${newIncident.incident_category}`,
                        location: newIncident.location_id,
                        created_at: new Date().toISOString(),
                        acknowledged: false,
                    };

                    setAlerts(prev => [newAlert, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    playSound();
                }
            )
            .subscribe();

        // Subscribe to fall risk assessments
        const fallRiskChannel = supabase
            .channel('fall_risk_channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'fall_risk_assessments' },
                (payload) => {
                    const assessment = payload.new as any;
                    if (assessment.total_score >= 45) {
                        const newAlert: SystemAlert = {
                            id: `fall-${assessment.id}`,
                            type: 'fall_risk',
                            severity: assessment.total_score >= 50 ? 'critical' : 'high',
                            title: 'تنبيه خطر سقوط عالي',
                            message: `درجة خطر السقوط: ${assessment.total_score}/60`,
                            beneficiary_name: assessment.beneficiary_id,
                            created_at: new Date().toISOString(),
                            acknowledged: false,
                        };

                        setAlerts(prev => [newAlert, ...prev]);
                        setUnreadCount(prev => prev + 1);
                        playSound();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(incidentChannel);
            supabase.removeChannel(fallRiskChannel);
        };
    }, [playSound]);

    const handleAcknowledge = (id: string) => {
        setAlerts(prev => prev.map(a =>
            a.id === id ? { ...a, acknowledged: true, acknowledged_at: new Date().toISOString() } : a
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleDismiss = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        const alert = alerts.find(a => a.id === id);
        if (alert && !alert.acknowledged) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const clearAll = () => {
        setAlerts([]);
        setUnreadCount(0);
    };

    return (
        <>
            {/* Floating Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200"
            >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-red-500' : 'text-gray-500'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Alerts Panel */}
            {isOpen && (
                <div className="fixed top-16 left-4 z-50 w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl border overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-l from-red-600 to-orange-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                <h3 className="font-bold">التنبيهات الفورية</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg"
                                    title={soundEnabled ? 'كتم الصوت' : 'تفعيل الصوت'}
                                >
                                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <p className="text-white/80 text-sm mt-1">
                                لديك {unreadCount} تنبيهات غير مقروءة
                            </p>
                        )}
                    </div>

                    {/* Alerts List */}
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        {alerts.length > 0 ? (
                            <>
                                {alerts.map(alert => (
                                    <AlertCard
                                        key={alert.id}
                                        alert={alert}
                                        onAcknowledge={handleAcknowledge}
                                        onDismiss={handleDismiss}
                                    />
                                ))}
                                <button
                                    onClick={clearAll}
                                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    مسح الكل
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">لا توجد تنبيهات حالياً</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Critical Alert Overlay */}
            {alerts.some(a => a.severity === 'critical' && !a.acknowledged) && (
                <div className="fixed bottom-4 right-4 left-4 z-40" dir="rtl">
                    {alerts.filter(a => a.severity === 'critical' && !a.acknowledged).slice(0, 1).map(alert => (
                        <div
                            key={alert.id}
                            className="bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-8 h-8" />
                                <div>
                                    <p className="font-bold">{alert.title}</p>
                                    <p className="text-sm text-red-100">{alert.message}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAcknowledge(alert.id)}
                                className="px-4 py-2 bg-white text-red-600 rounded-lg font-bold hover:bg-red-50"
                            >
                                تم الاطلاع
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default RealTimeAlerts;
