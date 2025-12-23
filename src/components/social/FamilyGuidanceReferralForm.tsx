import React, { useState } from 'react';
import { Beneficiary, FamilyGuidanceReferral } from '../../types';

interface FamilyGuidanceReferralFormProps {
    beneficiary: Beneficiary;
    onSave: (referral: FamilyGuidanceReferral) => void;
    onCancel: () => void;
}

export const FamilyGuidanceReferralForm: React.FC<FamilyGuidanceReferralFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<FamilyGuidanceReferral>>({
        beneficiaryId: beneficiary.id,
        referralDate: new Date().toISOString().split('T')[0],
        targetPrograms: '',
        targetDuration: '3 months',
        skills: {
            independence: '',
            cognitive: '',
            social: '',
            vocational: ''
        },
        status: {
            medical: '',
            rehab: '',
            psychological: '',
            nutrition: ''
        },
        familyInteraction: 'interactive',
        familyAcceptance: '',
        notes: ''
    });

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            skills: { ...prev.skills!, [name]: value }
        }));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            status: { ...prev.status!, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as FamilyGuidanceReferral
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>نموذج تحويل لقسم الإرشاد الأسري (نموذج 25)</h2>
                <div className="beneficiary-info">
                    <p><strong>المستفيد:</strong> {beneficiary.fullName}</p>
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

                    <div className="form-group">
                        <label>البرامج التأهيلية المستهدفة</label>
                        <input
                            type="text"
                            value={formData.targetPrograms}
                            onChange={e => setFormData({ ...formData, targetPrograms: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>مدة الخطة المستهدفة</label>
                        <select
                            value={formData.targetDuration}
                            onChange={e => setFormData({ ...formData, targetDuration: e.target.value })}
                        >
                            <option value="1 month">شهر</option>
                            <option value="3 months">3 شهور</option>
                            <option value="6 months">6 شهور</option>
                            <option value="1 year">سنة</option>
                        </select>
                    </div>

                    <div className="form-section">
                        <h3>تاريخ انتهاء الخطة الحالية (المهارات)</h3>
                        <div className="form-row">
                            <input placeholder="الاستقلالي" name="independence" value={formData.skills?.independence} onChange={handleSkillChange} />
                            <input placeholder="الإدراكي" name="cognitive" value={formData.skills?.cognitive} onChange={handleSkillChange} />
                            <input placeholder="الاجتماعي" name="social" value={formData.skills?.social} onChange={handleSkillChange} />
                            <input placeholder="المهني" name="vocational" value={formData.skills?.vocational} onChange={handleSkillChange} />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>تاريخ انتهاء الخطة الحالية (العلاج)</h3>
                        <div className="form-row">
                            <input placeholder="الطبي" name="medical" value={formData.status?.medical} onChange={handleStatusChange} />
                            <input placeholder="التأهيلي" name="rehab" value={formData.status?.rehab} onChange={handleStatusChange} />
                            <input placeholder="النفسي" name="psychological" value={formData.status?.psychological} onChange={handleStatusChange} />
                            <input placeholder="التغذية" name="nutrition" value={formData.status?.nutrition} onChange={handleStatusChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>تفاعل المستفيد ومشاركته</label>
                        <select
                            value={formData.familyInteraction}
                            onChange={e => setFormData({ ...formData, familyInteraction: e.target.value as any })}
                        >
                            <option value="interactive">متفاعل</option>
                            <option value="somewhat">نوعاً ما</option>
                            <option value="not_interactive">غير متفاعل</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>العلاقة الأسرية وتقبلهم للإعاقة</label>
                        <input
                            type="text"
                            value={formData.familyAcceptance}
                            onChange={e => setFormData({ ...formData, familyAcceptance: e.target.value })}
                        />
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
