import { useState, useEffect } from 'react';
import { MedicalProfile, VitalSigns } from '../types/medical';

interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    warnings: string[];
    actions: {
        recommendIsolation: boolean;
        requireSeizureHistory: boolean;
    };
}

export const useMedicalWorkflow = (
    profile: Partial<MedicalProfile>,
    currentVitals?: Partial<VitalSigns>,
    checkupComment?: string
) => {
    const [validation, setValidation] = useState<ValidationResult>({
        isValid: true,
        errors: {},
        warnings: [],
        actions: { recommendIsolation: false, requireSeizureHistory: false }
    });

    useEffect(() => {
        validateWorkflow();
    }, [profile, currentVitals, checkupComment]);

    const validateWorkflow = () => {
        const errors: Record<string, string> = {};
        const warnings: string[] = [];
        let recommendIsolation = false;
        let requireSeizureHistory = false;

        // Rule 1: Daily Checkup Validation
        if (currentVitals) {
            const isAbnormal =
                (currentVitals.temperature && (currentVitals.temperature < 36 || currentVitals.temperature > 37.5)) ||
                (currentVitals.bloodPressureSystolic && (currentVitals.bloodPressureSystolic > 140 || currentVitals.bloodPressureSystolic < 90)) ||
                (currentVitals.pulse && (currentVitals.pulse > 100 || currentVitals.pulse < 60));

            if (isAbnormal && !checkupComment) {
                errors['checkup'] = 'لا يمكن حفظ الفحص اليومي بوجود علامات حيوية غير طبيعية دون كتابة ملاحظة طبية.';
            }
        }

        // Rule 2: Epilepsy & Seizure History
        if (profile.isEpileptic || profile.primaryDiagnosis === 'Other') {
            // Assuming 'Other' might trigger a check, but strictly if isEpileptic is true
            if (profile.isEpileptic) {
                requireSeizureHistory = true;
                if (!profile.history?.seizureHistory?.lastSeizureDate) {
                    errors['seizureHistory'] = 'يجب تعبئة تاريخ آخر نوبة للمرضى المشخصين بالصرع.';
                }
            }
        }

        // Rule 3: Infection Control (Temp > 38)
        if (currentVitals?.temperature && currentVitals.temperature > 38) {
            recommendIsolation = true;
            warnings.push('درجة الحرارة مرتفعة (>38). تم تفعيل بروتوكول الاشتباه بالعدوى. يوصى بالعزل فوراً.');
        }

        setValidation({
            isValid: Object.keys(errors).length === 0,
            errors,
            warnings,
            actions: {
                recommendIsolation,
                requireSeizureHistory
            }
        });
    };

    return validation;
};
