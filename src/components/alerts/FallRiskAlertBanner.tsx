// ═══════════════════════════════════════════════════════════════════════════
// FallRiskAlertBanner - Real-time alert for high fall risk assessments
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useToast } from '../../context/ToastContext';

interface FallRiskAlert {
    id: string;
    beneficiaryId: string;
    beneficiaryName: string;
    score: number;
    timestamp: string;
}

/**
 * Shows a notification banner when high-risk fall assessments are detected
 * Integrates with Supabase realtime subscriptions
 */
export const FallRiskAlertBanner: React.FC = () => {
    const [alerts, setAlerts] = useState<FallRiskAlert[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        // Skip if Supabase is not configured
        if (!supabase) return;

        const channel = supabase
            .channel('fall-risk-alerts')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'fall_risk_assessments'
                },
                async (payload) => {
                    const assessment = payload.new as any;

                    // Only alert for high risk (score >= 45)
                    if (assessment.risk_score >= 45) {
                        // Fetch beneficiary name
                        let beneficiaryName = 'مستفيد';
                        try {
                            const { data } = await supabase
                                .from('beneficiaries')
                                .select('full_name')
                                .eq('id', assessment.beneficiary_id)
                                .single();

                            if (data?.full_name) {
                                beneficiaryName = data.full_name;
                            }
                        } catch {
                            // Use default name
                        }

                        const newAlert: FallRiskAlert = {
                            id: assessment.id,
                            beneficiaryId: assessment.beneficiary_id,
                            beneficiaryName,
                            score: assessment.risk_score,
                            timestamp: assessment.created_at || new Date().toISOString(),
                        };

                        setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep last 5
                        setIsVisible(true);

                        // Play alert sound (if available)
                        try {
                            const audio = new Audio('/alert.mp3');
                            audio.volume = 0.3;
                            audio.play().catch(() => { }); // Ignore if audio fails
                        } catch {
                            // Audio not available
                        }

                        // Show toast notification
                        showToast(
                            `⚠️ تنبيه: خطر سقوط مرتفع - ${beneficiaryName}`,
                            'error'
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [showToast]);

    const dismissAlert = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        if (alerts.length <= 1) {
            setIsVisible(false);
        }
    };

    const viewBeneficiary = (beneficiaryId: string) => {
        navigate(`/beneficiaries/${beneficiaryId}`);
    };

    if (!isVisible || alerts.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4"
                dir="rtl"
            >
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 bg-black/20">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 animate-pulse" />
                            <span className="font-bold">تنبيهات خطر السقوط</span>
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {alerts.length}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="إغلاق التنبيهات"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Alerts List */}
                    <div className="max-h-48 overflow-y-auto">
                        {alerts.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-4 py-3 border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{alert.beneficiaryName}</p>
                                        <p className="text-sm opacity-80">
                                            درجة الخطورة: <span className="font-bold">{alert.score}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => viewBeneficiary(alert.beneficiaryId)}
                                            className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                                        >
                                            عرض
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => dismissAlert(alert.id)}
                                            className="p-1 hover:bg-white/20 rounded-full"
                                            aria-label="إخفاء هذا التنبيه"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FallRiskAlertBanner;
