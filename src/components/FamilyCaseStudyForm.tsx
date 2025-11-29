import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, FamilyCaseStudy } from '../types';

interface FamilyCaseStudyFormProps {
    beneficiary: Beneficiary;
    onSave: (study: FamilyCaseStudy) => void;
    onCancel: () => void;
}

export const FamilyCaseStudyForm: React.FC<FamilyCaseStudyFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<FamilyCaseStudy, 'id' | 'beneficiaryId'>>({
        studyDate: new Date().toISOString().split('T')[0],
        socialWorkerName: '',
        familyStructure: '',
        economicStatus: '',
        housingCondition: '',
        familyRelationships: '',
        attitudeTowardsBeneficiary: '',
        challenges: '',
        recommendations: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newStudy: FamilyCaseStudy = {
            id: `fcs_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            ...formData
        };
        onSave(newStudy);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>دراسة الحالة الأسرية (نموذج ٢٩)</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>ولي الأمر:</strong> {beneficiary.guardianName}</p>
                            <p><strong>رقم التواصل:</strong> {beneficiary.guardianPhone}</p>
                        </div>

                        <div className="form-grid-col-2">
                            <div className="form-group">
                                <label htmlFor="socialWorkerName">اسم الباحث الاجتماعي</label>
                                <input type="text" id="socialWorkerName" name="socialWorkerName" value={formData.socialWorkerName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="studyDate">تاريخ الدراسة</label>
                                <input type="date" id="studyDate" name="studyDate" value={formData.studyDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <fieldset>
                            <legend>الوضع الأسري والاجتماعي</legend>
                            <div className="form-group">
                                <label htmlFor="familyStructure">التكوين الأسري (الوالدين، الإخوة، أعمارهم، وظائفهم)</label>
                                <textarea id="familyStructure" name="familyStructure" value={formData.familyStructure} onChange={handleChange} rows={4}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="familyRelationships">العلاقات الأسرية (طبيعة العلاقة بين أفراد الأسرة)</label>
                                <textarea id="familyRelationships" name="familyRelationships" value={formData.familyRelationships} onChange={handleChange} rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="attitudeTowardsBeneficiary">اتجاهات الأسرة نحو المستفيد (القبول، الرفض، الإهمال، الرعاية الزائدة)</label>
                                <textarea id="attitudeTowardsBeneficiary" name="attitudeTowardsBeneficiary" value={formData.attitudeTowardsBeneficiary} onChange={handleChange} rows={3}></textarea>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>الوضع الاقتصادي والسكني</legend>
                            <div className="form-group">
                                <label htmlFor="economicStatus">الوضع الاقتصادي (مصادر الدخل، الالتزامات المالية)</label>
                                <textarea id="economicStatus" name="economicStatus" value={formData.economicStatus} onChange={handleChange} rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="housingCondition">الوضع السكني (نوع السكن، حالته، ملاءمته للمستفيد)</label>
                                <textarea id="housingCondition" name="housingCondition" value={formData.housingCondition} onChange={handleChange} rows={3}></textarea>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>التحديات والتوصيات</legend>
                            <div className="form-group">
                                <label htmlFor="challenges">أبرز المشكلات والتحديات التي تواجه الأسرة</label>
                                <textarea id="challenges" name="challenges" value={formData.challenges} onChange={handleChange} rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="recommendations">المرئيات والتوصيات المهنية</label>
                                <textarea id="recommendations" name="recommendations" value={formData.recommendations} onChange={handleChange} rows={4}></textarea>
                            </div>
                        </fieldset>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ الدراسة الأسرية</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
