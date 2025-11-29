import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, CaseStudy } from '../types';

interface CaseStudyFormProps {
    beneficiary: Beneficiary;
    onSave: (caseStudy: CaseStudy) => void;
    onCancel: () => void;
}

export const CaseStudyForm: React.FC<CaseStudyFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<CaseStudy, 'id' | 'beneficiaryId' | 'beneficiaryName' | 'beneficiaryAge' | 'medicalDiagnosis'>>({
        interviewDate: '',
        interviewLocation: '',
        interviewDuration: '',
        interviewParties: '',
        interviewResults: '',
        housingType: '',
        homeOwnership: '',
        professionalStatus: '',
        reasonForNotWorking: '',
        familyIncomeDetails: '',
        socialResearchSummary: '',
        recommendations: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCaseStudy: CaseStudy = {
            id: `cs_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            beneficiaryAge: beneficiary.age,
            medicalDiagnosis: beneficiary.medicalDiagnosis,
            ...formData,
        };
        onSave(newCaseStudy);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>نموذج دراسة حالة اجتماعية</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>رقم المستفيد:</strong> {beneficiary.id}</p>
                            <p><strong>العمر:</strong> {beneficiary.age}</p>
                            <p><strong>التشخيص الطبي:</strong> {beneficiary.medicalDiagnosis}</p>
                        </div>

                        <fieldset>
                            <legend>تفاصيل المقابلة</legend>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="interviewDate">تاريخ المقابلة</label>
                                    <input type="date" id="interviewDate" name="interviewDate" value={formData.interviewDate} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="interviewLocation">مكان المقابلة</label>
                                    <input type="text" id="interviewLocation" name="interviewLocation" value={formData.interviewLocation} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="interviewDuration">مدة المقابلة</label>
                                    <input type="text" id="interviewDuration" name="interviewDuration" value={formData.interviewDuration} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="interviewParties">أطراف المقابلة</label>
                                    <input type="text" id="interviewParties" name="interviewParties" value={formData.interviewParties} onChange={handleChange} />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>الحالة السكنية والمهنية</legend>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="housingType">نوع السكن</label>
                                    <input type="text" id="housingType" name="housingType" value={formData.housingType} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="homeOwnership">ملكية السكن</label>
                                    <input type="text" id="homeOwnership" name="homeOwnership" value={formData.homeOwnership} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="professionalStatus">الحالة المهنية</label>
                                    <input type="text" id="professionalStatus" name="professionalStatus" value={formData.professionalStatus} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reasonForNotWorking">سبب عدم القدرة على العمل</label>
                                    <input type="text" id="reasonForNotWorking" name="reasonForNotWorking" value={formData.reasonForNotWorking} onChange={handleChange} />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>ملخصات وتوصيات</legend>
                            <div className="form-group">
                                <label htmlFor="familyIncomeDetails">دخل الأسرة</label>
                                <textarea id="familyIncomeDetails" name="familyIncomeDetails" value={formData.familyIncomeDetails} onChange={handleChange} rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="socialResearchSummary">البحث الاجتماعي للحالة</label>
                                <textarea id="socialResearchSummary" name="socialResearchSummary" value={formData.socialResearchSummary} onChange={handleChange} rows={4}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="interviewResults">نتائج المقابلة</label>
                                <textarea id="interviewResults" name="interviewResults" value={formData.interviewResults} onChange={handleChange} rows={4}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="recommendations">التوصيات</label>
                                <textarea id="recommendations" name="recommendations" value={formData.recommendations} onChange={handleChange} rows={4}></textarea>
                            </div>
                        </fieldset>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
