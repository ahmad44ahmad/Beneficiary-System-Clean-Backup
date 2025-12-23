import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, SocialResearch } from '../../types';
import { supaService } from '../../services/supaService';

interface SocialResearchFormProps {
    beneficiary: Beneficiary;
    onSave: (researchData: SocialResearch) => void;
    onCancel: () => void;
}

export const SocialResearchForm: React.FC<SocialResearchFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<Omit<SocialResearch, 'id' | 'beneficiaryId' | 'beneficiaryName'>>({
        researchDate: '',
        researcherName: '',
        guardianName: beneficiary.guardianRelation || '',
        guardianGender: '',
        guardianAge: '',
        guardianRelation: beneficiary.guardianRelation || '',
        guardianEducation: '',
        guardianProfession: '',
        isFatherAlive: 'unknown',
        isMotherAlive: 'unknown',
        guardianMobile: beneficiary.guardianPhone || '',
        familyComposition: '',
        disabilityCause: '',
        hasChronicIllness: 'no',
        chronicIllnessDetails: '',
        familyAdaptation: '',
        socialResearchSummary: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const newResearchData: SocialResearch = {
            id: `sr_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            ...formData,
        };

        try {
            await supaService.saveSocialResearch(newResearchData);
            onSave(newResearchData); // Keep updating local state for instant feedback too if needed
        } catch (error) {
            console.error("Failed to save social research:", error);
            alert("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>نموذج البحث الاجتماعي (نموذج ١٢)</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>رقم المستفيد:</strong> {beneficiary.id}</p>
                            <p><strong>العمر:</strong> {beneficiary.age}</p>
                        </div>

                        <fieldset>
                            <legend>البيانات الأولية</legend>
                            <div className="form-grid-col-2">
                                <div className="form-group">
                                    <label htmlFor="researcherName">اسم الباحث الاجتماعي</label>
                                    <input type="text" id="researcherName" name="researcherName" value={formData.researcherName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="researchDate">تاريخ إجراء البحث</label>
                                    <input type="date" id="researchDate" name="researchDate" value={formData.researchDate} onChange={handleChange} required />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>بيانات ولي الأمر</legend>
                            <div className="form-grid-col-3">
                                <div className="form-group">
                                    <label htmlFor="guardianName">اسم ولي الأمر</label>
                                    <input type="text" id="guardianName" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="guardianMobile">رقم الجوال</label>
                                    <input type="text" id="guardianMobile" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="guardianRelation">صلة القرابة</label>
                                    <input type="text" id="guardianRelation" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="guardianEducation">الحالة التعليمية</label>
                                    <input type="text" id="guardianEducation" name="guardianEducation" value={formData.guardianEducation} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="guardianProfession">المهنة</label>
                                    <input type="text" id="guardianProfession" name="guardianProfession" value={formData.guardianProfession} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="isFatherAlive">هل الأب على قيد الحياة؟</label>
                                    <select id="isFatherAlive" name="isFatherAlive" value={formData.isFatherAlive} onChange={handleChange}>
                                        <option value="unknown">اختر...</option>
                                        <option value="yes">نعم</option>
                                        <option value="no">لا</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="isMotherAlive">هل الأم على قيد الحياة؟</label>
                                    <select id="isMotherAlive" name="isMotherAlive" value={formData.isMotherAlive} onChange={handleChange}>
                                        <option value="unknown">اختر...</option>
                                        <option value="yes">نعم</option>
                                        <option value="no">لا</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>معلومات تفصيلية عن الحالة والأسرة</legend>
                            <div className="form-group">
                                <label htmlFor="familyComposition">التكوين الأسري للحالة (اذكر: الاسم، صلة القرابة، العمر، الحالة التعليمية والاجتماعية)</label>
                                <textarea id="familyComposition" name="familyComposition" value={formData.familyComposition} onChange={handleChange} rows={5}></textarea>
                            </div>
                            <div className="form-grid-col-2">
                                <div className="form-group">
                                    <label htmlFor="disabilityCause">سبب الإعاقة</label>
                                    <input type="text" id="disabilityCause" name="disabilityCause" value={formData.disabilityCause} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="familyAdaptation">مدى تكيف الحالة داخل الأسرة</label>
                                    <input type="text" id="familyAdaptation" name="familyAdaptation" value={formData.familyAdaptation} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>هل تعاني الحالة من أمراض مزمنة؟</label>
                                    <div className="radio-group">
                                        <label><input type="radio" name="hasChronicIllness" value="yes" checked={formData.hasChronicIllness === 'yes'} onChange={handleChange} /> نعم</label>
                                        <label><input type="radio" name="hasChronicIllness" value="no" checked={formData.hasChronicIllness === 'no'} onChange={handleChange} /> لا</label>
                                    </div>
                                </div>
                                {formData.hasChronicIllness === 'yes' && (
                                    <div className="form-group">
                                        <label htmlFor="chronicIllnessDetails">يرجى ذكرها</label>
                                        <input type="text" id="chronicIllnessDetails" name="chronicIllnessDetails" value={formData.chronicIllnessDetails} onChange={handleChange} />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="socialResearchSummary">خلاصة البحث الاجتماعي</label>
                                <textarea id="socialResearchSummary" name="socialResearchSummary" value={formData.socialResearchSummary} onChange={handleChange} rows={5}></textarea>
                            </div>
                        </fieldset>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ البحث الاجتماعي</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
