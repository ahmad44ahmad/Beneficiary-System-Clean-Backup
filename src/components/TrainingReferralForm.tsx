import React, { useState } from 'react';
import { Beneficiary, TrainingReferral } from '../types';

interface TrainingReferralFormProps {
    beneficiary: Beneficiary;
    onSave: (referral: TrainingReferral) => void;
    onCancel: () => void;
}

export const TrainingReferralForm: React.FC<TrainingReferralFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<TrainingReferral>>({
        beneficiaryId: beneficiary.id,
        referralDate: new Date().toISOString().split('T')[0],
        goals: {
            educationalIntegration: false,
            socialIntegration: false,
            returnToFamily: false,
            vocationalPrep: false,
            skillDevelopment: false,
            talentDevelopment: false
        },
        currentPerformance: {
            selfCare: '',
            socialSkills: '',
            cognitiveSkills: '',
            motorSkills: ''
        },
        notes: ''
    });

    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            goals: {
                ...prev.goals!,
                [name]: checked
            }
        }));
    };

    const handlePerformanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            currentPerformance: {
                ...prev.currentPerformance!,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as TrainingReferral
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>نموذج تحويل للالتحاق بالبرامج التدريبية (نموذج 4)</h2>
                <div className="beneficiary-info">
                    <p><strong>المستفيد:</strong> {beneficiary.fullName}</p>
                    <p><strong>التشخيص:</strong> {beneficiary.medicalDiagnosis}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>تاريخ التحويل</label>
                        <input
                            type="date"
                            value={formData.referralDate}
                            onChange={e => setFormData({ ...formData, referralDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-section">
                        <h3>أهداف التحويل</h3>
                        <div className="checkbox-grid">
                            <label><input type="checkbox" name="educationalIntegration" checked={formData.goals?.educationalIntegration} onChange={handleGoalChange} /> دمج تعليمي</label>
                            <label><input type="checkbox" name="socialIntegration" checked={formData.goals?.socialIntegration} onChange={handleGoalChange} /> دمج مجتمعي</label>
                            <label><input type="checkbox" name="returnToFamily" checked={formData.goals?.returnToFamily} onChange={handleGoalChange} /> عودة للأسرة</label>
                            <label><input type="checkbox" name="vocationalPrep" checked={formData.goals?.vocationalPrep} onChange={handleGoalChange} /> تهيئة مهنية</label>
                            <label><input type="checkbox" name="skillDevelopment" checked={formData.goals?.skillDevelopment} onChange={handleGoalChange} /> تطوير مهارات</label>
                            <label><input type="checkbox" name="talentDevelopment" checked={formData.goals?.talentDevelopment} onChange={handleGoalChange} /> تنمية مواهب</label>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>مستوى الأداء الحالي</h3>
                        <div className="form-group">
                            <label>الاعتماد على النفس (قضاء الحاجة، تناول الطعام، العناية الشخصية)</label>
                            <select name="selfCare" value={formData.currentPerformance?.selfCare} onChange={handlePerformanceChange}>
                                <option value="">اختر التقييم</option>
                                <option value="good">جيد</option>
                                <option value="fair">جيد نوعاً ما</option>
                                <option value="poor">ضعيف</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>المهارات الاجتماعية (التواصل، الآداب، المشاركة)</label>
                            <select name="socialSkills" value={formData.currentPerformance?.socialSkills} onChange={handlePerformanceChange}>
                                <option value="">اختر التقييم</option>
                                <option value="good">جيد</option>
                                <option value="fair">جيد نوعاً ما</option>
                                <option value="poor">ضعيف</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>المهارات الإدراكية (التمييز، التصنيف، المعرفة)</label>
                            <select name="cognitiveSkills" value={formData.currentPerformance?.cognitiveSkills} onChange={handlePerformanceChange}>
                                <option value="">اختر التقييم</option>
                                <option value="good">جيد</option>
                                <option value="fair">جيد نوعاً ما</option>
                                <option value="poor">ضعيف</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>المهارات الحركية (مسك القلم، الكتابة)</label>
                            <select name="motorSkills" value={formData.currentPerformance?.motorSkills} onChange={handlePerformanceChange}>
                                <option value="">اختر التقييم</option>
                                <option value="good">جيد</option>
                                <option value="fair">جيد نوعاً ما</option>
                                <option value="poor">ضعيف</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>ملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ التحويل</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
