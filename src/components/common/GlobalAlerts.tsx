import React from 'react';
import { UnifiedBeneficiaryProfile } from '../../types/unified';
import { AlertTriangle, ShieldAlert, Info } from 'lucide-react';

interface GlobalAlertsProps {
    profile: UnifiedBeneficiaryProfile;
}

export const GlobalAlerts: React.FC<GlobalAlertsProps> = ({ profile }) => {
    const alerts = [];

    // 1. Isolation / Infection Control (High Priority)
    if (profile.requiresIsolation) {
        alerts.push({
            id: 'isolation',
            type: 'critical',
            title: 'ISOLATION PROTOCOL ACTIVE',
            message: 'Beneficiary has a suspected or confirmed infection. PPE is mandatory.',
            icon: <ShieldAlert className="w-5 h-5" />
        });
    }

    // 2. Behavioral Risk
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

    // 3. Medical Alerts (Diabetes/Seizures)
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
                        ${alert.type === 'critical' ? 'bg-red-50 border-red-200 text-red-800' : ''}
                        ${alert.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-800' : ''}
                        ${alert.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' : ''}
                    `}
                >
                    <div className="mt-0.5 shrink-0">
                        {alert.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wide">{alert.title}</h4>
                        <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
