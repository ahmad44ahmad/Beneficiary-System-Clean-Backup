import { differenceInDays } from 'date-fns';

// Minimal interface locally if not found globally, or import it
export interface Alert {
    id: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    createdAt: Date | string;
    escalated: boolean;
    assignedTo?: string;
    status: 'open' | 'resolved' | 'pending';
}

const ESCALATION_RULES = {
    CRITICAL: { days: 1, escalateTo: 'DIRECTOR' },
    HIGH: { days: 3, escalateTo: 'DEPARTMENT_HEAD' },
    MEDIUM: { days: 7, escalateTo: 'SUPERVISOR' },
    LOW: { days: 14, escalateTo: 'TEAM_LEAD' },
};

export async function checkAndEscalate(alert: Alert) {
    const assignees: Record<string, string> = {
        'DIRECTOR': 'director@basira.gov.sa',
        'DEPARTMENT_HEAD': 'head@basira.gov.sa',
        'SUPERVISOR': 'supervisor@basira.gov.sa',
        'TEAM_LEAD': 'lead@basira.gov.sa'
    };

    const created = new Date(alert.createdAt);
    const now = new Date();
    const daysSinceCreation = differenceInDays(now, created);

    const rule = ESCALATION_RULES[alert.priority];

    if (rule && daysSinceCreation >= rule.days && !alert.escalated) {
        await escalateAlert(alert.id, rule.escalateTo);
        await notifyUser(assignees[rule.escalateTo], alert);
        return true;
    }
    return false;
}

// Mock implementation of escalation side-effects
async function escalateAlert(alertId: string, newRole: string) {
    console.log(`[ESCALATION] Alert ${alertId} escalated to ${newRole}`);
    // In real app: await supabase.from('alerts').update({ escalated: true, assigned_role: newRole }).eq('id', alertId);
}

async function notifyUser(email: string, alert: Alert) {
    console.log(`[NOTIFICATION] Sending email to ${email} regarding alert ${alert.id}`);
    // In real app: await sendEmailService.send(...)
}
