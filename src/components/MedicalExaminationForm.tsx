import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, MedicalExamination } from '../types';

interface MedicalExaminationFormProps {
    beneficiary: Beneficiary;
    onSave: (examData: MedicalExamination) => void;
    onCancel: () => void;
}

export const MedicalExaminationForm: React.FC<MedicalExaminationFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<MedicalExamination, 'id' | 'beneficiaryId' | 'beneficiaryName'>>({
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
        diagnosis: beneficiary.medicalDiagnosis || '',
        vitalSigns: {
            bloodPressure: '',
            pulse: '',
            temperature: '',
            respiration: '',
        },
        physicalExamNotes: '',
        recommendations: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in formData.vitalSigns) {
            setFormData(prev => ({
                ...prev,
                vitalSigns: {
                    ...prev.vitalSigns,
                    [name]: value,
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newExam: MedicalExamination = {
            id: `med_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            ...formData,
        };
        onSave(newExam);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>نموذج الكشف الطبي</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>رقم الملف:</strong> {beneficiary.id}</p>
                        </div>

                        <fieldset>
                            <legend>بيانات الكشف</legend>
                            <div className="form-grid-col-2">
                                <div className="form-group">
                                    <label htmlFor="doctorName">اسم الطبيب</label>
                                    <input type="text" id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">تاريخ الكشف</label>
                                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>العلامات الحيوية</legend>
                            <div className="form-grid-col-2">
                                <div className="form-group">
                                    <label htmlFor="bloodPressure">ضغط الدم (BP)</label>
                                    <input type="text" id="bloodPressure" name="bloodPressure" value={formData.vitalSigns.bloodPressure} onChange={handleChange} placeholder="e.g. 120/80" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="pulse">النبض (Pulse)</label>
                                    <input type="text" id="pulse" name="pulse" value={formData.vitalSigns.pulse} onChange={handleChange} placeholder="bpm" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="temperature">درجة الحرارة (Temp)</label>
                                    <input type="text" id="temperature" name="temperature" value={formData.vitalSigns.temperature} onChange={handleChange} placeholder="°C" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="respiration">معدل التنفس (Resp)</label>
                                    <input type="text" id="respiration" name="respiration" value={formData.vitalSigns.respiration} onChange={handleChange} placeholder="breaths/min" />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>التفاصيل الطبية</legend>
                            <div className="form-group">
                                <label htmlFor="diagnosis">التشخيص الطبي</label>
                                <input type="text" id="diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="physicalExamNotes">ملاحظات الفحص السريري</label>
                                <textarea id="physicalExamNotes" name="physicalExamNotes" value={formData.physicalExamNotes} onChange={handleChange} rows={4}></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="recommendations">التوصيات والعلاج</label>
                                <textarea id="recommendations" name="recommendations" value={formData.recommendations} onChange={handleChange} rows={4}></textarea>
                            </div>
                        </fieldset>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ الكشف</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
