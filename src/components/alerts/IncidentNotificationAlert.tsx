// IncidentNotificationAlert - Realtime incident notifications
// Alerts staff when a new safety incident is reported

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronRight, MapPin } from 'lucide-react';
import { useRealtimeCallback } from '../../hooks/queries';
import { useToastStore } from '../../stores/useToastStore';
import { useNavigate } from 'react-router-dom';

interface Incident {
    id: string;
    incident_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
    description: string;
    reported_by: string;
    created_at: string;
}

const SEVERITY_CONFIG = {
    low: { label: 'منخفض', color: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-600' },
    medium: { label: 'متوسط', color: 'bg-amber-500', bgLight: 'bg-amber-100', text: 'text-amber-600' },
    high: { label: 'مرتفع', color: 'bg-orange-500', bgLight: 'bg-orange-100', text: 'text-orange-600' },
    critical: { label: 'حرج', color: 'bg-red-500', bgLight: 'bg-red-100', text: 'text-red-600' }
};

const INCIDENT_TYPES: Record<string, string> = {
    fall: 'سقوط',
    injury: 'إصابة',
    medication_error: 'خطأ دوائي',
    infection: 'عدوى',
    behavioral: 'حادث سلوكي',
    equipment: 'عطل معدات',
    security: 'أمني',
    other: 'أخرى'
};

export const IncidentNotificationAlert: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const showToast = useToastStore((s) => s.showToast);
    const navigate = useNavigate();

    const handleIncidentInsert = useCallback((payload: { new: Record<string, unknown> }) => {
        const incident = payload.new as {
            id: string;
            incident_type: string;
            severity: 'low' | 'medium' | 'high' | 'critical';
            location: string | null;
            description: string | null;
            reported_by_name: string | null;
            created_at: string;
        };

        // Only alert for medium, high, or critical incidents
        if (['medium', 'high', 'critical'].includes(incident.severity)) {
            const newIncident: Incident = {
                id: incident.id,
                incident_type: incident.incident_type || 'other',
                severity: incident.severity || 'medium',
                location: incident.location || 'غير محدد',
                description: incident.description || '',
                reported_by: incident.reported_by_name || 'موظف',
                created_at: incident.created_at
            };

            setIncidents(prev => [newIncident, ...prev.slice(0, 2)]);
            setIsVisible(true);

            // Play alert sound for high/critical
            if (['high', 'critical'].includes(incident.severity)) {
                try {
                    const audio = new Audio('/alert.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(() => { });
                } catch { /* ignored */ }
            }

            const severityLabel = SEVERITY_CONFIG[incident.severity as keyof typeof SEVERITY_CONFIG]?.label || '';
            showToast(
                `حادث ${severityLabel}: ${INCIDENT_TYPES[incident.incident_type] || incident.incident_type}`,
                'error'
            );
        }
    }, [showToast]);

    useRealtimeCallback('incidents', 'INSERT', handleIncidentInsert, 'incidents-alerts');

    const handleDismiss = (id: string) => {
        setIncidents(prev => {
            const remaining = prev.filter(i => i.id !== id);
            if (remaining.length === 0) setIsVisible(false);
            return remaining;
        });
    };

    const handleDismissAll = () => {
        setIncidents([]);
        setIsVisible(false);
    };

    const handleNavigate = () => {
        navigate('/ipc/incidents');
        setIsVisible(false);
    };

    if (!isVisible || incidents.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                dir="rtl"
            >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="p-2 bg-white/20 rounded-lg"
                            >
                                <AlertTriangle className="w-5 h-5" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold">تنبيه حوادث</h3>
                                <p className="text-xs text-white/80">
                                    {incidents.length} حادث يتطلب انتباه
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismissAll}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Incidents List */}
                    <div className="bg-white p-3 space-y-2 max-h-60 overflow-y-auto">
                        {incidents.map(incident => {
                            const config = SEVERITY_CONFIG[incident.severity];
                            return (
                                <motion.div
                                    key={incident.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-start justify-between p-3 ${config.bgLight} rounded-xl border ${incident.severity === 'critical' ? 'border-red-200' : 'border-orange-200'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 ${config.color} rounded-lg`}>
                                            <AlertTriangle className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">
                                                {INCIDENT_TYPES[incident.incident_type] || incident.incident_type}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {incident.location}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded ${config.bgLight} ${config.text} text-xs`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDismiss(incident.id)}
                                        className="p-1 hover:bg-white rounded-lg text-gray-400"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Footer */}
                    <button
                        onClick={handleNavigate}
                        className="w-full px-4 py-3 bg-red-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                    >
                        عرض جميع الحوادث
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IncidentNotificationAlert;
