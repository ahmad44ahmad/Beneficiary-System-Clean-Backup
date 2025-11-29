import React, { useState } from 'react';
import { Beneficiary, PostCareFollowUp } from '../types';

interface PostCareFollowUpFormProps {
    beneficiary: Beneficiary;
    onSave: (followUp: PostCareFollowUp) => void;
    onCancel: () => void;
}

export const PostCareFollowUpForm: React.FC<PostCareFollowUpFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<PostCareFollowUp>>({
        beneficiaryId: beneficiary.id,
        visitDate: new Date().toISOString().split('T')[0],
        visitPurpose: '',
        familyMembers: '',
        visitTeam: '',
        monthlyFollowUp: {
            month1: '',
            month2: '',
            month3: ''
        },
        notes: ''
    });

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            monthlyFollowUp: { ...prev.monthlyFollowUp!, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as PostCareFollowUp
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>استمارة متابعة المستفيد (الرعاية اللاحقة) (نموذج 27)</h2>
                <div className="beneficiary-info">
                    <p><strong>المستفيد:</strong> {beneficiary.fullName}</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>تاريخ الزيارة</label>
                        <input
                            type="date"
                            value={formData.visitDate}
                            onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>الغرض من الزيارة</label>
                        <input
                            type="text"
                            value={formData.visitPurpose}
                            onChange={e => setFormData({ ...formData, visitPurpose: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>أسماء أعضاء أسرة المستفيد</label>
                        <textarea
                            value={formData.familyMembers}
                            onChange={e => setFormData({ ...formData, familyMembers: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>أسماء أعضاء فريق الزيارة</label>
                        <textarea
                            value={formData.visitTeam}
                            onChange={e => setFormData({ ...formData, visitTeam: e.target.value })}
                        />
                    </div>

                    <div className="form-section">
                        <h3>المتابعة الشهرية</h3>
                        <div className="form-group">
                            <label>الشهر الأول</label>
                            <input
                                type="text"
                                name="month1"
                                value={formData.monthlyFollowUp?.month1}
                                onChange={handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>الشهر الثاني</label>
                            <input
                                type="text"
                                name="month2"
                                value={formData.monthlyFollowUp?.month2}
                                onChange={handleMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>الشهر الثالث</label>
                            <input
                                type="text"
                                name="month3"
                                value={formData.monthlyFollowUp?.month3}
                                onChange={handleMonthChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>الملاحظات</label>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn-secondary">إلغاء</button>
                        <button type="submit" className="btn-primary">حفظ المتابعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
