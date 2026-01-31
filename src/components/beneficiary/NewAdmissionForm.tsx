import React, { useState } from 'react';
import { User, Activity, FileText, Save, AlertCircle } from 'lucide-react';
import { MedicalProfile, VitalSigns, MedicalHistory } from '../../types/medical';
import { useMedicalWorkflow } from '../../hooks/useMedicalWorkflow';
import { Beneficiary } from '../../types';
import { supaService } from '../../services/supaService';

interface NewAdmissionFormProps {
    beneficiaries: Beneficiary[];
    onSave: (profile: MedicalProfile) => void;
    onCancel: () => void;
}

export const NewAdmissionForm: React.FC<NewAdmissionFormProps> = ({ beneficiaries, onSave, onCancel }) => {
    const [step, setStep] = useState(1);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

    // Form State
    const [vitals, setVitals] = useState<Partial<VitalSigns>>({});
    const [history, setHistory] = useState<Partial<MedicalHistory>>({
        chronicDiseases: [],
        surgeries: [],
        allergies: [],
        familyHistory: [],
        seizureHistory: { hasSeizures: false }
    });
    const [diagnosis, setDiagnosis] = useState<any>('Other');
    const [isEpileptic, setIsEpileptic] = useState(false);
    const [checkupComment, setCheckupComment] = useState('');

    // Validation Hook
    const validation = useMedicalWorkflow(
        { isEpileptic, primaryDiagnosis: diagnosis, history: history as MedicalHistory },
        vitals,
        checkupComment
    );

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validation.isValid) {
            alert('يرجى تصحيح الأخطاء قبل الحفظ');
            return;
        }

        setIsSubmitting(true);
        const newProfile: MedicalProfile = {
            id: Date.now().toString(),
            beneficiaryId: selectedBeneficiaryId,
            admissionDate: new Date().toISOString(),
            primaryDiagnosis: diagnosis,
            secondaryDiagnoses: [],
            isEpileptic,
            latestVitals: vitals as VitalSigns,
            history: history as MedicalHistory,
            currentMedications: [],
            infectionStatus: {
                suspectedInfection: validation.actions.recommendIsolation,
                isolationRecommended: validation.actions.recommendIsolation,
                vaccinationStatus: 'Pending'
            }
        };

        try {
            await supaService.saveMedicalProfile(newProfile);
            onSave(newProfile); // Update local state for immediate feedback
        } catch (error) {
            console.error("Failed to save medical profile:", error);
            alert("فشل حفظ الملف الطبي. تأكد من الاتصال بقاعدة البيانات.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large modal-max-width-900">
                <div className="modal-header">
                    <h2>نموذج التقييم الطبي عند القبول (Admission Evaluation)</h2>
                    <div className="steps-indicator flex gap-4 mt-2">
                        <span className={`step-badge ${step >= 1 ? 'active-step' : ''}`}>1. البيانات الشخصية</span>
                        <span className={`step-badge ${step >= 2 ? 'active-step' : ''}`}>2. العلامات الحيوية</span>
                        <span className={`step-badge ${step >= 3 ? 'active-step' : ''}`}>3. التاريخ المرضي</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="medical-form">
                    {/* Step 1: Personal Info & Diagnosis */}
                    {step === 1 && (
                        <div className="form-section fade-in">
                            <h3><User className="inline-icon" /> بيانات المستفيد والتشخيص</h3>
                            <div className="form-group">
                                <label>اختر المستفيد</label>
                                <select
                                    value={selectedBeneficiaryId}
                                    onChange={e => setSelectedBeneficiaryId(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                    title="اختيار المستفيد"
                                    aria-label="اختيار المستفيد"
                                >
                                    <option value="">-- اختر من القائمة --</option>
                                    {beneficiaries.map(b => (
                                        <option key={b.id} value={b.id}>{b.fullName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>التشخيص الأساسي</label>
                                    <select
                                        value={diagnosis}
                                        onChange={e => setDiagnosis(e.target.value)}
                                        className="w-full p-2 border rounded"
                                        title="التشخيص الأساسي"
                                        aria-label="التشخيص الأساسي"
                                    >
                                        <option value="CP">الشلل الدماغي (CP)</option>
                                        <option value="Downs">متلازمة داون</option>
                                        <option value="Autism">توحد</option>
                                        <option value="IntellectualDisability">إعاقة ذهنية</option>
                                        <option value="Other">أخرى</option>
                                    </select>
                                </div>
                                <div className="form-group checkbox-group pt-8">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isEpileptic}
                                            onChange={e => setIsEpileptic(e.target.checked)}
                                        />
                                        <span>هل يعاني من الصرع؟ (Epilepsy)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Vital Signs */}
                    {step === 2 && (
                        <div className="form-section fade-in">
                            <h3><Activity className="inline-icon" /> العلامات الحيوية (Vital Signs)</h3>

                            {validation.warnings.length > 0 && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                    <div className="flex">
                                        <AlertCircle className="h-6 w-6 text-red-500 ml-3" />
                                        <div>
                                            <p className="text-sm text-red-700 font-bold">تنبيهات طبية:</p>
                                            <ul className="list-disc list-inside text-sm text-red-600">
                                                {validation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>درجة الحرارة (C°)</label>
                                    <input
                                        type="number" step="0.1"
                                        value={vitals.temperature || ''}
                                        onChange={e => setVitals({ ...vitals, temperature: parseFloat(e.target.value) })}
                                        className={vitals.temperature && vitals.temperature > 38 ? 'border-red-500 bg-red-50' : ''}
                                        title="درجة الحرارة"
                                        placeholder="37.0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>النبض (bpm)</label>
                                    <input
                                        type="number"
                                        value={vitals.pulse || ''}
                                        onChange={e => setVitals({ ...vitals, pulse: parseInt(e.target.value) })}
                                        title="النبض"
                                        placeholder="70"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ضغط الدم (Systolic)</label>
                                    <input
                                        type="number"
                                        value={vitals.bloodPressureSystolic || ''}
                                        onChange={e => setVitals({ ...vitals, bloodPressureSystolic: parseInt(e.target.value) })}
                                        title="ضغط الدم الانقباضي"
                                        placeholder="120"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>ضغط الدم (Diastolic)</label>
                                    <input
                                        type="number"
                                        value={vitals.bloodPressureDiastolic || ''}
                                        onChange={e => setVitals({ ...vitals, bloodPressureDiastolic: parseInt(e.target.value) })}
                                        title="ضغط الدم الانبساطي"
                                        placeholder="80"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>تشبع الأكسجين (SpO2 %)</label>
                                    <input
                                        type="number"
                                        value={vitals.oxygenSaturation || ''}
                                        onChange={e => setVitals({ ...vitals, oxygenSaturation: parseInt(e.target.value) })}
                                        title="تشبع الأكسجين"
                                        placeholder="98"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>معدل التنفس</label>
                                    <input
                                        type="number"
                                        value={vitals.respiratoryRate || ''}
                                        onChange={e => setVitals({ ...vitals, respiratoryRate: parseInt(e.target.value) })}
                                        title="معدل التنفس"
                                        placeholder="16"
                                    />
                                </div>
                            </div>

                            {validation.errors['checkup'] && (
                                <div className="mt-4">
                                    <p className="text-red-600 text-sm mb-2">{validation.errors['checkup']}</p>
                                    <textarea
                                        className="w-full p-2 border border-red-300 rounded"
                                        placeholder="اكتب ملاحظة طبية لتبرير القيم غير الطبيعية..."
                                        value={checkupComment}
                                        onChange={e => setCheckupComment(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: History */}
                    {step === 3 && (
                        <div className="form-section fade-in">
                            <h3><FileText className="inline-icon" /> التاريخ المرضي (Past History)</h3>

                            {validation.actions.requireSeizureHistory && (
                                <div className="bg-yellow-50 p-4 rounded border border-yellow-200 mb-4">
                                    <h4 className="text-yellow-800 font-bold mb-2">مطلوب: تاريخ نوبات الصرع</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label>تاريخ آخر نوبة</label>
                                            <input
                                                type="date"
                                                value={history.seizureHistory?.lastSeizureDate || ''}
                                                onChange={e => setHistory({
                                                    ...history,
                                                    seizureHistory: { ...history.seizureHistory!, lastSeizureDate: e.target.value }
                                                })}
                                                required
                                                title="تاريخ آخر نوبة"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>التكرار (Frequency)</label>
                                            <input
                                                type="text"
                                                value={history.seizureHistory?.frequency || ''}
                                                onChange={e => setHistory({
                                                    ...history,
                                                    seizureHistory: { ...history.seizureHistory!, frequency: e.target.value }
                                                })}
                                                title="تكرار النوبات"
                                                placeholder="مرة شهرياً"
                                            />
                                        </div>
                                    </div>
                                    {validation.errors['seizureHistory'] && (
                                        <p className="text-red-600 text-sm mt-1">{validation.errors['seizureHistory']}</p>
                                    )}
                                </div>
                            )}

                            <div className="form-group">
                                <label>الأمراض المزمنة</label>
                                <textarea
                                    className="large-textarea"
                                    placeholder="اكتب كل مرض في سطر..."
                                    value={history.chronicDiseases?.join('\n')}
                                    onChange={e => setHistory({ ...history, chronicDiseases: e.target.value.split('\n') })}
                                />
                            </div>
                            <div className="form-group">
                                <label>العمليات الجراحية السابقة</label>
                                <textarea
                                    className="large-textarea"
                                    value={history.surgeries?.join('\n')}
                                    onChange={e => setHistory({ ...history, surgeries: e.target.value.split('\n') })}
                                    title="العمليات الجراحية"
                                    placeholder="اكتب كل عملية في سطر..."
                                />
                            </div>
                            <div className="form-group">
                                <label>الحساسية (Allergies)</label>
                                <textarea
                                    className="large-textarea"
                                    value={history.allergies?.join('\n')}
                                    onChange={e => setHistory({ ...history, allergies: e.target.value.split('\n') })}
                                    title="الحساسية"
                                    placeholder="اكتب كل نوع حساسية في سطر..."
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-actions flex justify-between mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={step === 1 ? onCancel : handleBack}
                            className="btn-secondary"
                        >
                            {step === 1 ? 'إلغاء' : 'السابق'}
                        </button>

                        {step < 3 ? (
                            <button type="button" onClick={handleNext} className="btn-primary">
                                التالي
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn-primary bg-green-600 hover:bg-green-700"
                                disabled={!validation.isValid}
                            >
                                <Save className="inline-icon ml-2" />
                                حفظ التقييم الطبي
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
