import React from 'react';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { AlertTriangle, ShieldAlert, Info, Wind, Syringe, Shirt, Utensils } from 'lucide-react';
import { Button } from '../ui/Button';

interface GlobalAlertsProps {
    profile: UnifiedBeneficiaryProfile;
}

export const GlobalAlerts: React.FC<GlobalAlertsProps> = ({ profile }) => {
    const alerts = [];

    // 1. Infection Control (Actionable)
    const isolationTag = profile.smartTags.find(t => t.id.startsWith('isolation-'));
    if (isolationTag) {
        alerts.push({
            id: 'isolation',
            type: 'critical',
            title: isolationTag.label.toUpperCase(),
            message: isolationTag.description,
            icon: <ShieldAlert className="w-5 h-5" />,
            action: (
                <div className="mt-3 bg-white/50 p-3 rounded-md">
                    <p className="text-xs font-bold mb-2">REQUIRED PPE & PROTOCOLS:</p>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1" title="N95/Mask"><Wind className="w-4 h-4" /> Mask</div>
                        <div className="flex items-center gap-1" title="Gloves"><Syringe className="w-4 h-4" /> Gloves</div>
                        <div className="flex items-center gap-1" title="Gown"><Shirt className="w-4 h-4" /> Gown</div>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="bg-[#DC2626]/15 border-[#DC2626]/30 hover:bg-[#DC2626]/20 text-[#7F1D1D]" onClick={() => alert('Laundry notified: Wash separately')}>
                            <Shirt className="w-3 h-3 me-1" /> Notify Laundry
                        </Button>
                        <Button size="sm" variant="outline" className="bg-[#DC2626]/15 border-[#DC2626]/30 hover:bg-[#DC2626]/20 text-[#7F1D1D]" onClick={() => alert('Kitchen notified: Disposable utensils')}>
                            <Utensils className="w-3 h-3 me-1" /> Disposable Utensils
                        </Button>
                    </div>
                </div>
            )
        });
    }

    // 2. Evacuation Priority
    const evacTag = profile.smartTags.find(t => t.id.startsWith('evac-'));
    if (evacTag) {
        alerts.push({
            id: 'evac',
            type: 'warning',
            title: evacTag.label.toUpperCase(),
            message: evacTag.description,
            icon: <AlertTriangle className="w-5 h-5" />
        });
    }

    // 3. Behavioral Risk
    const behavioralTag = profile.smartTags.find(t => t.id === 'aggressive');
    if (behavioralTag) {
        alerts.push({
            id: 'behavior',
            type: 'warning',
            title: 'Behavioral Risk',
            message: 'History of aggression reported. Approach with caution.',
            icon: <AlertTriangle className="w-5 h-5" />
        });
    }

    // 4. Medical Alerts
    const medicalTags = profile.smartTags.filter(t => t.id === 'diabetic' || t.id === 'epilepsy');
    if (medicalTags.length > 0) {
        alerts.push({
            id: 'medical',
            type: 'info',
            title: 'Medical Attention Required',
            message: `Beneficiary has: ${medicalTags.map(t => t.label).join(', ')}. Check care plan.`,
            icon: <Info className="w-5 h-5" />
        });
    }

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-3 mb-6">
            {alerts.map(alert => (
                <div
                    key={alert.id}
                    className={`
                        p-4 rounded-md border flex items-start gap-3 shadow-sm
                        ${alert.type === 'critical' ? 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#7F1D1D]' : ''}
                        ${alert.type === 'warning' ? 'bg-[#F7941D]/10 border-[#F7941D]/30 text-[#92400E]' : ''}
                        ${alert.type === 'info' ? 'bg-[#269798]/10 border-[#269798]/30 text-[#1B7778]' : ''}
                    `}
                >
                    <div className="mt-0.5 shrink-0">
                        {alert.icon}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm uppercase tracking-wide">{alert.title}</h4>
                        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                        {alert.action && alert.action}
                    </div>
                </div>
            ))}
        </div>
    );
};
