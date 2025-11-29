import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, InjuryReport } from '../types';

interface InjuryReportFormProps {
    beneficiary: Beneficiary;
    onSave: (report: InjuryReport) => void;
    onCancel: () => void;
}

export const InjuryReportForm: React.FC<InjuryReportFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<InjuryReport, 'id' | 'beneficiaryId'>>({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        location: '',
        injuryType: '',
        description: '',
        firstAidGiven: '',
        takenToHospital: false,
        witnesses: '',
        supervisorName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReport: InjuryReport = {
            id: `inj_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            ...formData
        };
        onSave(newReport);
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h3>نموذج الإبلاغ عن إصابة (نموذج ١٧)</h3>
                        <button type="button" className="close-button" onClick={onCancel}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="form-readonly-section">
                            <p><strong>اسم المستفيد:</strong> {beneficiary.fullName}</p>
                            <p><strong>رقم الملف:</strong> {beneficiary.id}</p>
                        </div>

                        <div className="form-grid-col-2">
                            <div className="form-group">
                                <label htmlFor="date">تاريخ الإصابة</label>
                                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">وقت الإصابة</label>
                                <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">مكان وقوع الإصابة</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="injuryType">نوع الإصابة (جرح، كدمة، كسر، حرق...)</label>
                            <input type="text" id="injuryType" name="injuryType" value={formData.injuryType} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">وصف الحادث وكيفية وقوعه</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstAidGiven">الإسعافات الأولية التي قدمت</label>
                            <textarea id="firstAidGiven" name="firstAidGiven" value={formData.firstAidGiven} onChange={handleChange} rows={3}></textarea>
                        </div>

                        <div className="form-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="takenToHospital"
                                    checked={formData.takenToHospital}
                                    onChange={handleCheckboxChange}
                                />
                                هل تم نقل الحالة للمستشفى؟
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="witnesses">أسماء الشهود (إن وجد)</label>
                            <input type="text" id="witnesses" name="witnesses" value={formData.witnesses} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="supervisorName">اسم المشرف المبلغ</label>
                            <input type="text" id="supervisorName" name="supervisorName" value={formData.supervisorName} onChange={handleChange} required />
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="button-primary">حفظ البلاغ</button>
                        <button type="button" className="button-secondary" onClick={onCancel}>إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
