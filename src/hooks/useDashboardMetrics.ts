import { useMemo } from 'react';
import { useUnifiedData } from '../context/UnifiedDataContext';
import { GoalType } from '../types/rehab';

export const useDashboardMetrics = () => {
    const { beneficiaries } = useUnifiedData();

    return useMemo(() => {
        // 1. Real-Time KPIs
        const totalBeneficiaries = beneficiaries.length;
        const activeBeneficiaries = beneficiaries.filter(b => b.status === 'active').length;

        // Plan Compliance: Beneficiaries with an active rehab plan
        const activePlansCount = beneficiaries.filter(b => b.activeRehabPlan?.status === 'active').length;
        // Draft plans (simulated logic: if no active plan, maybe they have a draft? 
        // For demo, let's assume if not active, it's draft or missing. 
        // Or we can check if they have a plan but status is draft. 
        // Since our type puts the plan in 'activeRehabPlan', let's just count those with 'draft' status there if any, 
        // or assume missing ones are 'pending'.
        const draftPlansCount = beneficiaries.filter(b => b.activeRehabPlan?.status === 'draft').length;

        const planComplianceRate = totalBeneficiaries > 0 ? Math.round((activePlansCount / totalBeneficiaries) * 100) : 0;

        // Goal Achievement Rate
        let totalGoals = 0;
        let totalProgress = 0;
        const goalsByType: Record<string, { total: number; completed: number; progressSum: number }> = {
            medical: { total: 0, completed: 0, progressSum: 0 },
            social: { total: 0, completed: 0, progressSum: 0 },
            psychological: { total: 0, completed: 0, progressSum: 0 },
            physiotherapy: { total: 0, completed: 0, progressSum: 0 },
            occupational: { total: 0, completed: 0, progressSum: 0 }
        };

        beneficiaries.forEach(b => {
            if (b.activeRehabPlan && b.activeRehabPlan.goals) {
                b.activeRehabPlan.goals.forEach(goal => {
                    totalGoals++;
                    totalProgress += goal.progress;

                    // Normalize type to lowercase just in case
                    const type = goal.type.toLowerCase();
                    if (!goalsByType[type]) {
                        goalsByType[type] = { total: 0, completed: 0, progressSum: 0 };
                    }

                    goalsByType[type].total++;
                    goalsByType[type].progressSum += goal.progress;

                    if (goal.status === 'completed' || goal.progress === 100) {
                        goalsByType[type].completed++;
                    }
                });
            }
        });

        const overallGoalAchievementRate = totalGoals > 0 ? Math.round(totalProgress / totalGoals) : 0;

        // 2. Department Performance (Average Progress by Type)
        const departmentPerformance = Object.entries(goalsByType).map(([type, data]) => ({
            type,
            avgProgress: data.total > 0 ? Math.round(data.progressSum / data.total) : 0,
            totalGoals: data.total
        })).filter(d => d.totalGoals > 0);

        // 3. Operational Alerts
        // Pending Approvals: Plans waiting for Director
        const pendingDirectorApprovals = beneficiaries.filter(b =>
            b.activeRehabPlan?.approvals.some(a => a.role === 'director' && a.status === 'pending')
        ).length;

        // Critical Cases: High Risk Level
        const criticalCasesCount = beneficiaries.filter(b => b.riskLevel === 'high' || b.riskLevel === 'critical').length;

        return {
            kpis: {
                totalBeneficiaries,
                activeBeneficiaries,
                planComplianceRate,
                overallGoalAchievementRate,
                activePlansCount,
                draftPlansCount
            },
            departmentPerformance,
            alerts: {
                pendingDirectorApprovals,
                criticalCasesCount
            }
        };
    }, [beneficiaries]);
};
