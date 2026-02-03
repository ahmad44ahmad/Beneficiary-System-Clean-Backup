import { UnifiedBeneficiaryProfile } from '../types';

export interface RiskAnalysisResult {
    score: number; // 0-100
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    trend: 'stable' | 'increasing' | 'decreasing';
}

/**
 * FEATURE 3: PREDICTIVE RISK ENGINE
 * Simulated AI Logic to calculate risk based on static and dynamic factors
 */
export const calculateRiskScore = (beneficiary: UnifiedBeneficiaryProfile): RiskAnalysisResult => {
    let score = 0;
    const factors: string[] = [];

    // 1. Diagnosis Analysis
    const diagnosis = (beneficiary.medicalDiagnosis || '').toLowerCase();
    const alerts = beneficiary.alerts || [];

    if (diagnosis.includes('epilepsy') || diagnosis.includes('صرع') || alerts.includes('epilepsy')) {
        score += 30;
        factors.push('تشخيص الصرع (مخاطر تشنج)');
    }

    if (diagnosis.includes('diabetes') || diagnosis.includes('سكري') || alerts.includes('diabetic')) {
        score += 15;
        factors.push('مرض السكري (متابعة الانسولين)');
    }

    // 2. Mobility Risks
    if (beneficiary.bedridden || alerts.includes('fallRisk')) {
        score += 25;
        factors.push('خطر السقوط / طريح فراش');
    }

    // 3. Behavioral/Psychological
    if (beneficiary.psychiatricDiagnosis) {
        score += 10;
        factors.push('متابعة نفسية');
    }

    // 4. Simulated "Recent Incidents" (Randomized for Demo if no real data)
    // In a real app, this would query the incident_reports table
    const hasRecentIncident = Math.random() > 0.8; // 20% chance of simulated recent incident
    if (hasRecentIncident) {
        score += 20;
        factors.push('حادث عرضي حديث (خلال 30 يوم)');
    }

    // Cap score at 100
    score = Math.min(score, 100);

    // Determine Level
    let level: RiskAnalysisResult['level'] = 'low';
    if (score >= 80) level = 'critical';
    else if (score >= 50) level = 'high';
    else if (score >= 20) level = 'medium';

    return {
        score,
        level,
        factors,
        trend: Math.random() > 0.5 ? 'stable' : 'increasing' // Simulated trend
    };
};

export const getWardTensionScore = (beneficiaries: UnifiedBeneficiaryProfile[]): number => {
    if (!beneficiaries.length) return 0;

    // Aggregate individual risks to estimate ward tension
    const totalRisk = beneficiaries.reduce((acc, curr) => {
        return acc + calculateRiskScore(curr).score;
    }, 0);

    return Math.round(totalRisk / beneficiaries.length);
};
