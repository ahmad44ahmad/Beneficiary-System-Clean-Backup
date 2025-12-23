import React, { useState } from 'react';
import { IncidentReport, Beneficiary, ShiftPeriod } from '../../types';

interface IncidentReportFormProps {
    beneficiaries: Beneficiary[];
    onSave: (report: IncidentReport) => void;
    onCancel: () => void;
}

export const IncidentReportForm: React.FC<IncidentReportFormProps> = ({ beneficiaries, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<IncidentReport>>({
        date: new Date().toISOString().split('T')[0],
        time: '',
        shift: 'first',
        beneficiaryId: '',
        location: '',
        type: 'injury',
        description: '',
        actionTaken: '',
        cameraRecordingKept: false,
        staffWitnesses: [],
        notes: ''
    });

    const [witnessName, setWitnessName] = useState('');
    const [witnessRole, setWitnessRole] = useState('');

    const addWitness = () => {
        if (witnessName && witnessRole) {
            setFormData({
                ...formData,
                staffWitnesses: [...(formData.staffWitnesses || []), { name: witnessName, role: witnessRole }]
            });
            setWitnessName('');
            setWitnessRole('');
        }
    };

    const removeWitness = (index: number) => {
        setFormData({
            ...formData,
            staffWitnesses: (formData.staffWitnesses || []).filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as IncidentReport
        });
    };

    const selectedBeneficiary = beneficiaries.find(b => b.id === formData.beneficiaryId);

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <h2>نموذج محضر واقعة</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>الوقت</label>
                            <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>الفترة</label>
                            <select value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value as ShiftPeriod })}>
                                <option value="first">الأولى</option>
                                <option value="second">الثانية</option>
                                <option value="third">الثالثة</option>
                                <option value="fourth">الرابعة</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>المستفيد</label>
                            <select value={formData.beneficiaryId} onChange={e => setFormData({ ...formData, beneficiaryId: e.target.value })} required>
                                <option value="">اختر المستفيد...</option>
                                {beneficiaries.map(b => (
                                    <option key={b.id} value={b.id}>{b.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>رقم الغرفة/السرير</label>
                            <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder={selectedBeneficiary ? `${selectedBeneficiary.roomNumber || ''} / ${selectedBeneficiary.bedNumber || ''}` : ''} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>نوع الواقعة</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })}>
                            <option value="injury">إصابة</option>
                            <option value="assault">اعتداء</option>
                            <option value="neglect">إهمال</option>
                            <option value="self_harm">إيذاء ذات</option>
                            <option value="suicide_attempt">محاولة انتحار</option>
                            <option value="death">وفاة</option>
                            <option value="agitation">هيجان</option>
                            <option value="vandalism">تخريب وشغب</option>
                            <option value="escape">هروب</option>
                            <option value="other">غير ذلك</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>وصف الواقعة (تفصيلي)</label>
                        <textarea
                            className="large-textarea"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={6}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الإجراء المتخذ</label>
                        <textarea
                            className="large-textarea"
                            value={formData.actionTaken}
                            onChange={e => setFormData({ ...formData, actionTaken: e.target.value })}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.cameraRecordingKept}
                                onChange={e => setFormData({ ...formData, cameraRecordingKept: e.target.checked })}
                            />
                            تم الاحتفاظ بنسخة من تسجيل الكاميرات للواقعة
                        </label>
                    </div>

                    <div className="form-section">
                        <h3>الشهود / المسؤولين الحاضرين</h3>
                        <div className="form-row" style={{ alignItems: 'flex-end' }}>
                            <div className="form-group">
                                <label>الاسم</label>
                                <input type="text" value={witnessName} onChange={e => setWitnessName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>الصفة/المسمى الوظيفي</label>
                                <input type="text" value={witnessRole} onChange={e => setWitnessRole(e.target.value)} />
                            </div>
                            <button type="button" onClick={addWitness} className="btn-secondary">إضافة</button>
                        </div>
                        <ul className="selected-items-list">
                            {formData.staffWitnesses?.map((w, i) => (
                                <li key={i}>
                                    <span>{w.name} - {w.role}</span>
                                    <button type="button" onClick={() => removeWitness(i)} className="btn-icon delete">×</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ المحضر</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
