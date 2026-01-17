// ═══════════════════════════════════════════════════════════════════════════
// MedicationReminderAlert - Realtime overdue medication alerts
// Shows notifications when medications are overdue for administration
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, X, ChevronRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface OverdueMedication {
    id: string;
    beneficiary_id: string;
    beneficiary_name: string;
    medication_name: string;
    scheduled_time: string;
    minutes_overdue: number;
}

export const MedicationReminderAlert: React.FC = () => {
    const [overdueAlerts, setOverdueAlerts] = useState<OverdueMedication[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) return;

        // Check for overdue medications every minute
        const checkOverdue = async () => {
            try {
                const now = new Date();
                const currentTime = now.toTimeString().slice(0, 5); // HH:MM

                const { data, error } = await supabase
                    .from('medication_schedules')
                    .select(`
                        id,
                        beneficiary_id,
                        medication_name,
                        scheduled_time,
                        beneficiaries!inner(full_name)
                    `)
                    .eq('status', 'pending')
                    .lt('scheduled_time', currentTime);

                if (error) {
                    if (import.meta.env.DEV) {
                        console.log('[MedicationReminder] Query error, table may not exist:', error.message);
                    }
                    return;
                }

                if (data && data.length > 0) {
                    const alerts: OverdueMedication[] = data.map(item => {
                        const scheduledParts = item.scheduled_time.split(':');
                        const nowParts = [now.getHours(), now.getMinutes()];
                        const minutesOverdue = (nowParts[0] * 60 + nowParts[1]) -
                            (parseInt(scheduledParts[0]) * 60 + parseInt(scheduledParts[1]));

                        return {
                            id: item.id,
                            beneficiary_id: item.beneficiary_id,
                            beneficiary_name: (item as any).beneficiaries?.full_name || 'مستفيد',
                            medication_name: item.medication_name,
                            scheduled_time: item.scheduled_time,
                            minutes_overdue: minutesOverdue
                        };
                    });

                    setOverdueAlerts(alerts);
                    if (alerts.length > 0 && !isMinimized) {
                        setIsVisible(true);
                    }
                }
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.log('[MedicationReminder] Check failed:', err);
                }
            }
        };

        // Check immediately and then every minute
        checkOverdue();
        const interval = setInterval(checkOverdue, 60000);

        return () => clearInterval(interval);
    }, [isMinimized]);

    const handleDismissAlert = (id: string) => {
        setOverdueAlerts(prev => prev.filter(a => a.id !== id));
        if (overdueAlerts.length <= 1) {
            setIsVisible(false);
        }
    };

    const handleDismissAll = () => {
        setOverdueAlerts([]);
        setIsVisible(false);
        setIsMinimized(true);
    };

    const handleNavigate = () => {
        navigate('/medical/medications');
        setIsVisible(false);
    };

    if (!isVisible || overdueAlerts.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                dir="rtl"
            >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Pill className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">أدوية متأخرة</h3>
                                <p className="text-xs text-white/80">
                                    {overdueAlerts.length} دواء يحتاج صرف
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismissAll}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            aria-label="إغلاق"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Alerts List */}
                    <div className="bg-white p-3 space-y-2 max-h-60 overflow-y-auto">
                        {overdueAlerts.slice(0, 3).map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {alert.medication_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {alert.beneficiary_name} • متأخر {alert.minutes_overdue} دقيقة
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDismissAlert(alert.id)}
                                    className="p-1 hover:bg-amber-200 rounded-lg text-amber-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}

                        {overdueAlerts.length > 3 && (
                            <p className="text-center text-sm text-gray-500">
                                و {overdueAlerts.length - 3} أدوية أخرى
                            </p>
                        )}
                    </div>

                    {/* Action Footer */}
                    <button
                        onClick={handleNavigate}
                        className="w-full px-4 py-3 bg-amber-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
                    >
                        عرض جميع الأدوية
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MedicationReminderAlert;
