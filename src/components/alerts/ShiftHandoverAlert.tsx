// ═══════════════════════════════════════════════════════════════════════════
// ShiftHandoverAlert - Realtime shift change notifications
// Alerts staff when a new shift handover report is submitted
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, X, ChevronRight, Bell } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface ShiftHandover {
    id: string;
    shift_type: 'morning' | 'evening' | 'night';
    handover_by: string;
    handover_to: string;
    created_at: string;
    notes_count: number;
}

const SHIFT_LABELS = {
    morning: 'الفترة الصباحية',
    evening: 'الفترة المسائية',
    night: 'الفترة الليلية'
};

export const ShiftHandoverAlert: React.FC = () => {
    const [alert, setAlert] = useState<ShiftHandover | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) return;

        // Subscribe to new shift handovers
        const channel = supabase.channel('shift-handovers')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'shift_handovers'
                },
                async (payload) => {
                    const handover = payload.new as any;

                    // Fetch handover details
                    const { data } = await supabase
                        .from('shift_handover_notes')
                        .select('id')
                        .eq('handover_id', handover.id);

                    const alertData: ShiftHandover = {
                        id: handover.id,
                        shift_type: handover.shift_type || 'morning',
                        handover_by: handover.handover_by_name || 'موظف',
                        handover_to: handover.handover_to_name || 'الفريق',
                        created_at: handover.created_at,
                        notes_count: data?.length || 0
                    };

                    setAlert(alertData);
                    setIsVisible(true);

                    // Play notification sound
                    try {
                        const audio = new Audio('/notification.mp3');
                        audio.volume = 0.3;
                        audio.play().catch(() => { });
                    } catch (e) { }

                    showToast(`📋 تسليم فترة جديد من ${alertData.handover_by}`, 'info');

                    // Auto-hide after 10 seconds
                    setTimeout(() => setIsVisible(false), 10000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [showToast]);

    const handleDismiss = () => {
        setIsVisible(false);
        setAlert(null);
    };

    const handleNavigate = () => {
        navigate('/handover');
        setIsVisible(false);
    };

    if (!isVisible || !alert) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="fixed bottom-24 left-4 z-50 w-80"
                dir="rtl"
            >
                <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold">تسليم فترة جديد</h3>
                                <p className="text-xs text-white/80">
                                    {SHIFT_LABELS[alert.shift_type]}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Bell className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {alert.handover_by}
                                </p>
                                <p className="text-sm text-gray-500">
                                    سلّم إلى {alert.handover_to}
                                </p>
                            </div>
                        </div>

                        {alert.notes_count > 0 && (
                            <p className="text-sm text-amber-600 mb-3">
                                ⚠️ {alert.notes_count} ملاحظات تحتاج متابعة
                            </p>
                        )}

                        <button
                            onClick={handleNavigate}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                        >
                            عرض التسليم
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShiftHandoverAlert;
