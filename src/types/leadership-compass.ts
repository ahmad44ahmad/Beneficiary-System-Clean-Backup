/**
 * بوصلة القيادة (Leadership Compass) — domain types
 *
 * Strategic-level decision surface per docs/strategic-decision-room-proposal.md.
 * Audience: مساعد التنمية، المدير العام، فأعلى (per Ahmad 2026-04-22).
 *
 * Core philosophy: helper over display.
 *   - Data serves the decision, not the other way around.
 *   - Every decision preserved (no DELETE) — institutional learning.
 *   - Honest Mirror surfaces structural issues, not individual blame.
 */

// ─── Level in the ministry hierarchy ──────────────────────────────────────────
export type DecisionLevel = 'center' | 'branch' | 'sector' | 'agency' | 'ministry';

export const DECISION_LEVEL_LABELS: Record<DecisionLevel, string> = {
    center: 'المركز',
    branch: 'الفرع',
    sector: 'القطاع',
    agency: 'الوكالة',
    ministry: 'الوزارة',
};

// ─── Decision categories ──────────────────────────────────────────────────────
export type DecisionCategory =
    | 'budget'
    | 'policy'
    | 'expansion'
    | 'escalation'
    | 'partnership'
    | 'intervention'
    | 'governance'
    | 'other';

export const DECISION_CATEGORY_LABELS: Record<DecisionCategory, string> = {
    budget: 'ميزانيّة',
    policy: 'سياسة',
    expansion: 'تعميم/توسعة',
    escalation: 'تصعيد مخاطرة',
    partnership: 'شراكة استراتيجيّة',
    intervention: 'تدخُّل خاصّ',
    governance: 'حوكمة',
    other: 'أخرى',
};

// ─── Status lifecycle ─────────────────────────────────────────────────────────
export type DecisionStatus =
    | 'draft'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'delayed'
    | 'more_evidence'
    | 'expired'
    | 'superseded';

export const DECISION_STATUS_LABELS: Record<DecisionStatus, string> = {
    draft: 'مسوَّدة',
    pending: 'مُعلَّق',
    approved: 'موافَق',
    rejected: 'مرفوض',
    delayed: 'مُؤجَّل',
    more_evidence: 'طلب أدلّة',
    expired: 'انقضى',
    superseded: 'استُبدِل',
};

// ─── Urgency ──────────────────────────────────────────────────────────────────
export type DecisionUrgency = 'low' | 'medium' | 'high' | 'critical';

export const URGENCY_LABELS: Record<DecisionUrgency, string> = {
    low: 'منخفضة',
    medium: 'متوسّطة',
    high: 'مرتفعة',
    critical: 'حرجة',
};

export const URGENCY_TONES: Record<DecisionUrgency, {
    bg: string; text: string; border: string;
}> = {
    low:      { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-300' },
    medium:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-300' },
    high:     { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-400' },
    critical: { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-400' },
};

// ─── Alternative option ───────────────────────────────────────────────────────
export interface DecisionAlternative {
    title: string;
    pros: string[];
    cons: string[];
    estimatedCost?: number;
    estimatedImpact?: string;
}

// ─── Evidence item ────────────────────────────────────────────────────────────
export type EvidenceType = 'data' | 'precedent' | 'risk' | 'policy' | 'expert';

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
    data: 'بيانات',
    precedent: 'سابقة',
    risk: 'مخاطرة',
    policy: 'سياسة',
    expert: 'رأي مختصّ',
};

export interface Evidence {
    type: EvidenceType;
    summary: string;
    source?: string;
    linkTo?: string; // e.g. /reports/monthly/2026-03 or /beneficiary/104
}

// ─── Consequences ─────────────────────────────────────────────────────────────
export interface Consequence {
    impact: string;
    risk?: string;
    timeline?: string;
}

export interface DecisionConsequences {
    ifApproved?: Consequence;
    ifDelayed?: Consequence;
    ifRejected?: Consequence;
}

// ─── Outcome (learning loop) ──────────────────────────────────────────────────
export interface DecisionOutcome {
    actualImpact?: string;
    actualCost?: number;
    varianceNotes?: string;
    measuredAt: string; // ISO date
}

// ─── Complete Strategic Decision ──────────────────────────────────────────────
export interface StrategicDecision {
    id: string;
    level: DecisionLevel;
    category: DecisionCategory;

    title: string;
    question: string;
    recommendation: string;
    recommendationReason?: string;

    alternatives: DecisionAlternative[];
    evidence: Evidence[];
    consequences: DecisionConsequences;

    estimatedCostSar?: number;
    estimatedSroi?: number;
    affectedBeneficiariesCount?: number;

    barrierTypesAddressed?: string[]; // ['B1', 'B4', ...]

    deadline?: string;
    urgency: DecisionUrgency;

    recommendedByRole?: string;
    recommendedByUserId?: string;
    ownerRole: string;

    status: DecisionStatus;
    decidedAt?: string;
    decidedByUserId?: string;
    decisionNotes?: string;

    outcome3mo?: DecisionOutcome;
    outcome6mo?: DecisionOutcome;
    outcome12mo?: DecisionOutcome;
    outcomeLesson?: string;

    createdAt: string;
    updatedAt: string;
}

// ─── Honest Mirror Finding ────────────────────────────────────────────────────
export type MirrorSeverity = 'info' | 'watch' | 'concern' | 'urgent';

export const MIRROR_SEVERITY_LABELS: Record<MirrorSeverity, string> = {
    info: 'معلومة',
    watch: 'للمراقبة',
    concern: 'قلق',
    urgent: 'عاجل',
};

export const MIRROR_SEVERITY_TONES: Record<MirrorSeverity, {
    bg: string; text: string; border: string; icon: string;
}> = {
    info:    { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-300', icon: 'ℹ️' },
    watch:   { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-300',   icon: '👁️' },
    concern: { bg: 'bg-amber-50',   text: 'text-amber-800',   border: 'border-amber-400', icon: '⚠️' },
    urgent:  { bg: 'bg-rose-50',    text: 'text-rose-800',    border: 'border-rose-500',  icon: '🔴' },
};

export interface HonestMirrorFinding {
    id: string;
    ruleCode: string;
    ruleDescription: string;
    findingHeadline: string;
    findingDetail?: string;
    supportingData?: Record<string, unknown>;
    severity: MirrorSeverity;
    suggestedAction?: string;
    relatedDecisionId?: string;
    status: 'open' | 'acknowledged' | 'addressed' | 'dismissed';
    firstSeenAt: string;
    lastConfirmedAt: string;
    resolvedAt?: string;
}

// ─── Helper: compute days until deadline ──────────────────────────────────────
export function daysUntilDeadline(deadline?: string): number | null {
    if (!deadline) return null;
    const d = new Date(deadline);
    const now = new Date();
    const ms = d.getTime() - now.getTime();
    return Math.ceil(ms / 86_400_000);
}

// ─── Helper: is decision overdue? ─────────────────────────────────────────────
export function isOverdue(decision: StrategicDecision): boolean {
    if (!decision.deadline) return false;
    if (decision.status !== 'pending' && decision.status !== 'more_evidence') return false;
    return new Date(decision.deadline).getTime() < Date.now();
}
