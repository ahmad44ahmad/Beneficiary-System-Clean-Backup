import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, RehabilitationPlan } from '../../types';

interface RehabilitationPlanFormProps {
    beneficiary: Beneficiary;
    onSave: (plan: RehabilitationPlan) => void;
    onCancel: () => void;
}

export const RehabilitationPlanForm: React.FC<RehabilitationPlanFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<RehabilitationPlan, 'id' | 'beneficiaryId'>>({
        planDate: new Date().toISOString().split('T')[0],
        teamMembers: [{ name: '', specialization: '' }],
        servicesSchedule: '',
        medicalInfo: {
            weight: '', height: '', appetite: '', digestiveIssues: '',
            hasBloodPressure: false, hasDiabetes: false, hasAnemia: false, hasHeartDisease: false,
            otherChronicDetails: '', hasVisionProblems: false, visionProblemsDetails: '',
            hasHearingProblems: false, hearingProblemsDetails: '', hasSurgeryHistory: false,
            surgeryHistoryDetails: '', hasEpilepsy: false, epilepsyDetails: '',
            medicalDescription: '', generalHealthStatus: '', recommendations: '',
            medications: [{ name: '', dosage: '' }], doctorName: ''
        },
        occupationalTherapy: {
            caseDescription: '',
            plan: [{ need: '', method: '', duration: '', sessionsPerWeek: '' }],
            therapistName: ''
        }
    });

    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section: string, field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleDynamicListChange = (listName: string, index: number, field: string, value: string, section?: string) => {
        setFormData(prev => {
            const newFormState = { ...prev };
            let list;
            if (section) {
                list = [...newFormState[section][listName]];
            } else {
                list = [...newFormState[listName]];
            }
            list[index] = { ...list[index], [field]: value };

            if (section) {
                newFormState[section] = { ...newFormState[section], [listName]: list };
            } else {
                newFormState[listName] = list;
            }
            return newFormState;
        });
    };

    const addDynamicListItem = (listName: string, newItem: object, section?: string) => {
        setFormData(prev => {
            const newFormState = { ...prev };
            let list;
            if (section) {
                list = [...newFormState[section][listName], newItem];
                newFormState[section] = { ...newFormState[section], [listName]: list };
            } else {
                list = [...newFormState[listName], newItem];
                newFormState[listName] = list;
            }
            return newFormState;
        });
    };

    const removeDynamicListItem = (listName: string, index: number, section?: string) => {
        setFormData(prev => {
            const newFormState = { ...prev };
            let list;
            if (section) {
                list = [...newFormState[section][listName]];
                list.splice(index, 1);
                newFormState[section] = { ...newFormState[section], [listName]: list };
            } else {
                list = [...newFormState[listName]];
                list.splice(index, 1);
                newFormState[listName] = list;
            }
            return newFormState;
        });
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPlan: RehabilitationPlan = {
            id: `rp_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            ...formData,
        };
        onSave(newPlan);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>نموذج الخطة التأهيلية الفردية (نموذج ١٤)</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>رقم المستفيد:</strong> {beneficiary.id}</p>
                        </div>

                        <fieldset>
                            <legend>البيانات الأساسية للخطة</legend>
                            <div className="form-group">
                                <label htmlFor="planDate">تاريخ الخطة</label>
                                <input type="date" id="planDate" name="planDate" value={formData.planDate} onChange={handleMainChange} required />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>أعضاء فريق التأهيل</legend>
                            <div className="dynamic-list">
                                {formData.teamMembers.map((member, index) => (
                                    <div key={index} className="dynamic-list-item">
                                        <input type="text" placeholder="اسم العضو" value={member.name} onChange={e => handleDynamicListChange('teamMembers', index, 'name', e.target.value)} />
                                        <input type="text" placeholder="التخصص" value={member.specialization} onChange={e => handleDynamicListChange('teamMembers', index, 'specialization', e.target.value)} />
                                        <div className="list-item-controls">
                                            {formData.teamMembers.length > 1 && <button type="button" onClick={() => removeDynamicListItem('teamMembers', index)} className="remove-item-button">&ndash;</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => addDynamicListItem('teamMembers', { name: '', specialization: '' })} className="add-item-button">+ إضافة عضو</button>
                        </fieldset>

                        <fieldset>
                            <legend>المعلومات الطبية</legend>
                            <div className="form-group">
                                <label htmlFor="medicalDescription">الوصف الطبي</label>
                                <textarea id="medicalDescription" name="medicalDescription" value={formData.medicalInfo.medicalDescription} onChange={e => handleNestedChange('medicalInfo', 'medicalDescription', e.target.value)} rows={4}></textarea>
                            </div>
                            <div className="form-grid-col-3">
                                <div className="form-group"><label>ضغط الدم: <input type="checkbox" checked={formData.medicalInfo.hasBloodPressure} onChange={e => handleNestedChange('medicalInfo', 'hasBloodPressure', e.target.checked)} /></label></div>
                                <div className="form-group"><label>سكري: <input type="checkbox" checked={formData.medicalInfo.hasDiabetes} onChange={e => handleNestedChange('medicalInfo', 'hasDiabetes', e.target.checked)} /></label></div>
                                <div className="form-group"><label>فقر دم: <input type="checkbox" checked={formData.medicalInfo.hasAnemia} onChange={e => handleNestedChange('medicalInfo', 'hasAnemia', e.target.checked)} /></label></div>
                                <div className="form-group"><label>أمراض قلب: <input type="checkbox" checked={formData.medicalInfo.hasHeartDisease} onChange={e => handleNestedChange('medicalInfo', 'hasHeartDisease', e.target.checked)} /></label></div>
                                <div className="form-group"><label>صرع: <input type="checkbox" checked={formData.medicalInfo.hasEpilepsy} onChange={e => handleNestedChange('medicalInfo', 'hasEpilepsy', e.target.checked)} /></label></div>
                            </div>
                            {formData.medicalInfo.hasEpilepsy && <div className="form-group"><label>تفاصيل الصرع</label><input type="text" value={formData.medicalInfo.epilepsyDetails} onChange={e => handleNestedChange('medicalInfo', 'epilepsyDetails', e.target.value)} /></div>}
                            <div className="form-group">
                                <label>الأدوية المستخدمة</label>
                                {formData.medicalInfo.medications.map((med, index) => (
                                    <div key={index} className="dynamic-list-item">
                                        <input type="text" placeholder="اسم الدواء" value={med.name} onChange={e => handleDynamicListChange('medications', index, 'name', e.target.value, 'medicalInfo')} />
                                        <input type="text" placeholder="الجرعة" value={med.dosage} onChange={e => handleDynamicListChange('medications', index, 'dosage', e.target.value, 'medicalInfo')} />
                                        <div className="list-item-controls">
                                            {formData.medicalInfo.medications.length > 1 && <button type="button" onClick={() => removeDynamicListItem('medications', index, 'medicalInfo')} className="remove-item-button">&ndash;</button>}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addDynamicListItem('medications', { name: '', dosage: '' }, 'medicalInfo')} className="add-item-button">+ إضافة دواء</button>
                            </div>
                            <div className="form-group">
                                <label htmlFor="doctorName">اسم الطبيب</label>
                                <input type="text" id="doctorName" value={formData.medicalInfo.doctorName} onChange={e => handleNestedChange('medicalInfo', 'doctorName', e.target.value)} />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>خدمة العلاج الوظيفي</legend>
                            <div className="form-group">
                                <label>وصف الحالة</label>
                                <textarea value={formData.occupationalTherapy.caseDescription} onChange={e => handleNestedChange('occupationalTherapy', 'caseDescription', e.target.value)} rows={3} />
                            </div>
                            <div className="form-group">
                                <label>البرنامج العلاجي</label>
                                {formData.occupationalTherapy.plan.map((item, index) => (
                                    <div key={index} className="dynamic-list-item form-grid-col-2">
                                        <input type="text" placeholder="الاحتياج الطبي" value={item.need} onChange={e => handleDynamicListChange('plan', index, 'need', e.target.value, 'occupationalTherapy')} />
                                        <input type="text" placeholder="أسلوب العلاج" value={item.method} onChange={e => handleDynamicListChange('plan', index, 'method', e.target.value, 'occupationalTherapy')} />
                                        <input type="text" placeholder="مدة العلاج" value={item.duration} onChange={e => handleDynamicListChange('plan', index, 'duration', e.target.value, 'occupationalTherapy')} />
                                        <input type="text" placeholder="عدد الجلسات" value={item.sessionsPerWeek} onChange={e => handleDynamicListChange('plan', index, 'sessionsPerWeek', e.target.value, 'occupationalTherapy')} />
                                        <div className="list-item-controls">
                                            {formData.occupationalTherapy.plan.length > 1 && <button type="button" onClick={() => removeDynamicListItem('plan', index, 'occupationalTherapy')} className="remove-item-button">&ndash;</button>}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addDynamicListItem('plan', { need: '', method: '', duration: '', sessionsPerWeek: '' }, 'occupationalTherapy')} className="add-item-button">+ إضافة بند للخطة</button>
                            </div>
                            <div className="form-group">
                                <label>اسم أخصائي العلاج الوظيفي</label>
                                <input type="text" value={formData.occupationalTherapy.therapistName} onChange={e => handleNestedChange('occupationalTherapy', 'therapistName', e.target.value)} />
                            </div>
                        </fieldset>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ الخطة</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
