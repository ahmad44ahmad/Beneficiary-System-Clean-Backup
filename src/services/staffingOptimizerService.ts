/**
 * محرك مروءة (Muruah) — Staff Allocation & Burnout Prevention Engine.
 *
 * يحتسب «حدّة الجناح» (ward acuity) من خلال:
 *  - أوزان مخاطرة المستفيدين: عالٍ ×٣، متوسط ×٢، منخفض ×١.
 *  - عوامل الاحتراق الوظيفي: نسبة المريض/الممرض، الورديات المتتالية،
 *    ساعات العمل الإضافي خلال آخر ٧ أيام، الاختلال في تركيبة المهارات.
 *
 * منهجية وقاية الاحتراق مستندة إلى أبحاث Maslach Burnout Inventory:
 * عبء العمل + اختلال نسبة الكادر + ضغط الورديات يفسّر ~٣٥٪ من تباين الاحتراق.
 */

export interface BurnoutSignal {
    factor: string;
    severity: 'low' | 'moderate' | 'high';
    note: string;
}

export interface WardAcuity {
    wardId: string;
    wardName: string;
    totalBeneficiaries: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    totalAcuityScore: number;
    recommendedStaff: {
        rn: number;
        ca: number;
        shiftLeader: boolean;
    };
    currentStaff: {
        rn: number;
        ca: number;
    };
    status: 'optimal' | 'understaffed' | 'overstaffed';
    burnoutSignals: BurnoutSignal[];
    burnoutScore: number; // 0-100; >= 60 = ارتفاع خطر الاحتراق
    /** @deprecated استخدم totalBeneficiaries — موجود للحفاظ على التوافق */
    totalPatients: number;
}

interface WardSnapshot {
    wardId: string;
    wardName: string;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    currentRN: number;
    currentCA: number;
    consecutiveShiftsMax: number; // أعلى عدد ورديات متتالية لأي ممرّض في الجناح
    overtimeHrs7d: number; // ساعات العمل الإضافي للجناح خلال الأسبوع
    sickLeaveCount7d: number; // عدد الإجازات المرضية خلال الأسبوع
    isWomenSection: boolean;
}

const WARD_PRESETS: Record<string, WardSnapshot> = {
    'ward-A': {
        wardId: 'ward-A',
        wardName: 'الجناح الشمالي (ذكور — حالات شديدة)',
        highRiskCount: 8,
        mediumRiskCount: 10,
        lowRiskCount: 6,
        currentRN: 3,
        currentCA: 4,
        consecutiveShiftsMax: 5,
        overtimeHrs7d: 22,
        sickLeaveCount7d: 1,
        isWomenSection: false,
    },
    'ward-B': {
        wardId: 'ward-B',
        wardName: 'الجناح الجنوبي (ذكور — حالات متوسطة)',
        highRiskCount: 4,
        mediumRiskCount: 12,
        lowRiskCount: 8,
        currentRN: 3,
        currentCA: 5,
        consecutiveShiftsMax: 3,
        overtimeHrs7d: 8,
        sickLeaveCount7d: 0,
        isWomenSection: false,
    },
    'ward-W': {
        wardId: 'ward-W',
        wardName: 'القسم النسائي',
        highRiskCount: 5,
        mediumRiskCount: 9,
        lowRiskCount: 4,
        currentRN: 3,
        currentCA: 4,
        consecutiveShiftsMax: 4,
        overtimeHrs7d: 14,
        sickLeaveCount7d: 1,
        isWomenSection: true,
    },
};

function deriveBurnoutSignals(snap: WardSnapshot, ratioImbalance: number): { signals: BurnoutSignal[]; score: number } {
    const signals: BurnoutSignal[] = [];
    let score = 0;

    if (snap.consecutiveShiftsMax >= 5) {
        signals.push({
            factor: 'ورديات متتالية',
            severity: 'high',
            note: `أعلى عدد ورديات متتالية: ${snap.consecutiveShiftsMax}`,
        });
        score += 30;
    } else if (snap.consecutiveShiftsMax >= 3) {
        signals.push({
            factor: 'ورديات متتالية',
            severity: 'moderate',
            note: `${snap.consecutiveShiftsMax} ورديات متتالية`,
        });
        score += 15;
    }

    if (snap.overtimeHrs7d >= 20) {
        signals.push({
            factor: 'ساعات إضافية أسبوعية',
            severity: 'high',
            note: `${snap.overtimeHrs7d} ساعة إضافية خلال آخر ٧ أيام`,
        });
        score += 25;
    } else if (snap.overtimeHrs7d >= 10) {
        signals.push({
            factor: 'ساعات إضافية أسبوعية',
            severity: 'moderate',
            note: `${snap.overtimeHrs7d} ساعة إضافية`,
        });
        score += 12;
    }

    if (ratioImbalance >= 0.5) {
        signals.push({
            factor: 'اختلال نسبة الكادر',
            severity: 'high',
            note: `نقص ${ratioImbalance.toFixed(1)} من الكادر المطلوب`,
        });
        score += 25;
    } else if (ratioImbalance >= 0.2) {
        signals.push({
            factor: 'اختلال نسبة الكادر',
            severity: 'moderate',
            note: `نقص ${ratioImbalance.toFixed(1)} من الكادر المطلوب`,
        });
        score += 12;
    }

    if (snap.sickLeaveCount7d > 0) {
        signals.push({
            factor: 'إجازات مرضية',
            severity: snap.sickLeaveCount7d >= 2 ? 'high' : 'moderate',
            note: `${snap.sickLeaveCount7d} إجازة مرضية خلال الأسبوع`,
        });
        score += snap.sickLeaveCount7d * 8;
    }

    return { signals, score: Math.min(score, 100) };
}

export const staffingOptimizerService = {
    calculateWardAcuity: async (wardId: string): Promise<WardAcuity> => {
        await new Promise(r => setTimeout(r, 600));

        const snap: WardSnapshot = WARD_PRESETS[wardId] ?? WARD_PRESETS['ward-A'];
        const totalBeneficiaries = snap.highRiskCount + snap.mediumRiskCount + snap.lowRiskCount;

        const totalAcuityScore =
            (snap.highRiskCount * 3) + (snap.mediumRiskCount * 2) + (snap.lowRiskCount * 1);

        // متطلّبات الكادر: نِسَب أكثر تحفّظاً للقسم النسائي بسبب طبيعة العبء
        const rnDivisor = snap.isWomenSection ? { high: 3, medium: 6, low: 10 } : { high: 4, medium: 8, low: 12 };
        const caDivisor = snap.isWomenSection ? { high: 2, medium: 4, low: 8 } : { high: 3, medium: 6, low: 10 };

        const requiredRNs =
            Math.ceil(snap.highRiskCount / rnDivisor.high) +
            Math.ceil(snap.mediumRiskCount / rnDivisor.medium) +
            Math.ceil(snap.lowRiskCount / rnDivisor.low);
        const requiredCAs =
            Math.ceil(snap.highRiskCount / caDivisor.high) +
            Math.ceil(snap.mediumRiskCount / caDivisor.medium) +
            Math.ceil(snap.lowRiskCount / caDivisor.low);

        let status: WardAcuity['status'] = 'optimal';
        if (snap.currentRN < requiredRNs || snap.currentCA < requiredCAs) status = 'understaffed';
        else if (snap.currentRN > requiredRNs + 1) status = 'overstaffed';

        // اختلال النسبة كمدخل لمحرّك الاحتراق
        const requiredTotal = requiredRNs + requiredCAs;
        const currentTotal = snap.currentRN + snap.currentCA;
        const ratioImbalance = requiredTotal > 0
            ? Math.max(0, (requiredTotal - currentTotal) / requiredTotal)
            : 0;

        const { signals: burnoutSignals, score: burnoutScore } = deriveBurnoutSignals(snap, ratioImbalance);

        return {
            wardId,
            wardName: snap.wardName,
            totalBeneficiaries,
            totalPatients: totalBeneficiaries, // backward-compat
            highRiskCount: snap.highRiskCount,
            mediumRiskCount: snap.mediumRiskCount,
            lowRiskCount: snap.lowRiskCount,
            totalAcuityScore,
            recommendedStaff: {
                rn: requiredRNs,
                ca: requiredCAs,
                shiftLeader: true,
            },
            currentStaff: { rn: snap.currentRN, ca: snap.currentCA },
            status,
            burnoutSignals,
            burnoutScore,
        };
    },
};
