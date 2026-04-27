import { create } from 'zustand';

export interface VitalsAlert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    beneficiaryName: string;
    beneficiaryId: string;
    location: string;
    timestamp: string; // HH:MM
    createdAt: string; // ISO
    acknowledged: boolean;
    acknowledgedAt?: string; // ISO — to compute response speed
    acknowledgedBy?: string;
    suggestedAction: string;
    /** ٤٥ ثانية يعني الكادر ردّ في زمن نموذجي */
    responseSeconds?: number;
}

interface VitalsAlertsState {
    alerts: VitalsAlert[];
}

interface VitalsAlertsActions {
    push: (alert: Omit<VitalsAlert, 'id' | 'createdAt' | 'acknowledged'>) => void;
    acknowledge: (id: string, by: string) => void;
    resolve: (id: string) => void;
    clear: () => void;
}

const MAX_ALERTS = 30;

export const useVitalsAlertsStore = create<VitalsAlertsState & VitalsAlertsActions>()((set) => ({
    alerts: [],

    push: (alert) => set((state) => {
        // إذا فيه تنبيه نشط لنفس المستفيد ونفس النوع خلال آخر دقيقتين، تجاهل (لتجنّب الإغراق)
        const recent = state.alerts.find(a =>
            a.beneficiaryId === alert.beneficiaryId &&
            a.title === alert.title &&
            !a.acknowledged &&
            (Date.now() - new Date(a.createdAt).getTime()) < 120_000
        );
        if (recent) return state;

        const next: VitalsAlert = {
            ...alert,
            id: `va_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            acknowledged: false,
        };
        const updated = [next, ...state.alerts].slice(0, MAX_ALERTS);
        return { alerts: updated };
    }),

    acknowledge: (id, by) => set((state) => ({
        alerts: state.alerts.map(a => {
            if (a.id !== id || a.acknowledged) return a;
            const ackAt = new Date();
            const responseSeconds = Math.max(0, Math.round((ackAt.getTime() - new Date(a.createdAt).getTime()) / 1000));
            return {
                ...a,
                acknowledged: true,
                acknowledgedAt: ackAt.toISOString(),
                acknowledgedBy: by,
                responseSeconds,
            };
        }),
    })),

    resolve: (id) => set((state) => ({ alerts: state.alerts.filter(a => a.id !== id) })),

    clear: () => set({ alerts: [] }),
}));
