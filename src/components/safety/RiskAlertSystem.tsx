
import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface RiskAlert {
    id: string;
    beneficiary_id: string;
    risk_score: number;
    created_at: string;
    beneficiaryName?: string;
}

export const RiskAlertSystem: React.FC = () => {
    const [alerts, setAlerts] = useState<RiskAlert[]>([]);

    useEffect(() => {
        // Initializing Risk Alert System

        const channel = supabase
            .channel('risk-alerts')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'fall_risk_assessments' },
                async (payload) => {
                    // New risk assessment received
                    const newRecord = payload.new;

                    // Only alert for High Risk (Score >= 45)
                    if (newRecord.risk_score >= 45) {

                        // Fetch beneficiary name
                        let beneficiaryName = 'Unknown';
                        try {
                            const { data } = await supabase
                                .from('beneficiaries')
                                .select('full_name') // adjust column name if needed
                                .eq('id', newRecord.beneficiary_id)
                                .single();

                            if (data) beneficiaryName = data.full_name;
                        } catch (err) {
                            console.error('Error fetching beneficiary details', err);
                        }

                        const newAlert: RiskAlert = {
                            id: newRecord.id,
                            beneficiary_id: newRecord.beneficiary_id,
                            risk_score: newRecord.risk_score,
                            created_at: newRecord.created_at,
                            beneficiaryName
                        };

                        setAlerts(prev => [newAlert, ...prev]);

                        // Play Alert Sound (Data URI for simple beep)
                        try {
                            // Simple high-pitch beep
                            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                            const oscillator = audioCtx.createOscillator();
                            const gainNode = audioCtx.createGain();

                            oscillator.connect(gainNode);
                            gainNode.connect(audioCtx.destination);

                            oscillator.type = 'sine';
                            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
                            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5);

                            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
                            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

                            oscillator.start();
                            oscillator.stop(audioCtx.currentTime + 0.5);
                        } catch (e) {
                            console.error('Audio play failed', e);
                        }
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // Connected to Realtime
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg space-y-3 px-4 pointer-events-none">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className="bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border-4 border-red-400 animate-bounce pointer-events-auto"
                    dir="rtl"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-full">
                            <ShieldAlert className="w-8 h-8 text-yellow-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg leading-tight">تحذير: خطر سقوط مرتفع!</h4>
                            <p className="text-red-100 text-sm mt-1">
                                المستفيد: <span className="font-bold text-white">{alert.beneficiaryName || alert.beneficiary_id}</span>
                            </p>
                            <p className="text-xs text-red-200 mt-0.5">
                                درجة الخطر: {alert.risk_score} (High Risk)
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setAlerts(p => p.filter(a => a.id !== alert.id))}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            ))}
        </div>
    );
};
