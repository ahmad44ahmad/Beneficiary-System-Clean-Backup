import { Beneficiary } from '../types';
import { supabase } from '../config/supabase';

export interface ConscienceDecision {
    proposedAction: string;
    actionType: string;
    ethicalScore: number; // 0-100
    dignityImpact: 'positive' | 'neutral' | 'negative';
    autonomyImpact?: 'preserved' | 'limited' | 'violated';
    requiresHumanApproval: boolean;
    alternatives: string[];
    reasoning: string[];
    beneficiaryId?: string;
    context?: any;
}

export const ETHICAL_PRINCIPLES = {
    DIGNITY_FIRST: 'الكرامة فوق السلامة إلا في الخطر المحقق',
    MINIMAL_INTERVENTION: 'أقل تدخل ممكن',
    TRANSPARENCY: 'المستفيد يعرف ما يحدث',
    HUMAN_IN_LOOP: 'القرارات الكبرى تحتاج إنساناً',
};

export interface SystemAction {
    type: 'ISOLATION' | 'RESTRAINT' | 'MEDICATION_CHANGE' | 'TRANSFER' | 'DISCHARGE';
    reason: string;
    initiatedBy: string;
}

const isRamadan = (): boolean => {
    // Basic check - in real app would check Hijri calendar API
    return false;
};

export async function evaluateAction(action: SystemAction, beneficiary: Beneficiary): Promise<ConscienceDecision> {
    let score = 100;
    const alternatives: string[] = [];
    const reasoning: string[] = [];

    // فحص تأثير الكرامة
    if (action.type === 'ISOLATION') {
        score -= 30;
        reasoning.push('العزل يقيد حرية المستفيد وقد يؤثر على كرامته.');
        alternatives.push('مراقبة مكثفة بدلاً من العزل');
        alternatives.push('تعيين مرافق شخصي');
    }

    if (action.type === 'RESTRAINT') {
        score -= 50;
        reasoning.push('التقييد الجسدي هو الملاذ الأخير فقط.');
        alternatives.push('تهدئة لفظية');
        alternatives.push('إزالة المثيرات البيئية');
    }

    // فحص السياق الثقافي
    if (action.type === 'ISOLATION' && isRamadan()) {
        score -= 15;
        reasoning.push('العزل في رمضان يحرم المستفيد من الأجواء الروحانية والاجتماعية.');
        alternatives.push('مشاركة مشروطة في الإفطار الجماعي');
    }

    return {
        proposedAction: action.type,
        actionType: action.type,
        ethicalScore: score,
        dignityImpact: score > 70 ? 'neutral' : (score > 40 ? 'negative' : 'negative'),
        requiresHumanApproval: score < 60,
        alternatives,
        reasoning,
        beneficiaryId: beneficiary.id
    };
}

// Log decision to Supabase
export async function logDecision(decision: ConscienceDecision, finalAction: string, humanApprover?: string) {
    try {
        await supabase.from('conscience_log').insert({
            beneficiary_id: decision.beneficiaryId,
            proposed_action: decision.proposedAction,
            action_type: decision.actionType,
            ethical_score: decision.ethicalScore,
            dignity_impact: decision.dignityImpact,
            autonomy_impact: decision.autonomyImpact,
            requires_human_approval: decision.requiresHumanApproval,
            alternatives: decision.alternatives,
            decision: humanApprover ? 'approved' : 'auto_approved',
            human_approver: humanApprover,
            final_action: finalAction,
            context: decision.context
        });
    } catch (error) {
        console.error('Failed to log conscience decision:', error);
    }
}
