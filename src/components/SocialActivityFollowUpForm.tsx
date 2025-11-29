import React, { useState } from 'react';
import { SocialActivityFollowUp } from '../types';

interface SocialActivityFollowUpFormProps {
    onSave: (followUp: SocialActivityFollowUp) => void;
    onCancel: () => void;
}

export const SocialActivityFollowUpForm: React.FC<SocialActivityFollowUpFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityFollowUp>>({
        month: '',
        activityName: '',
        type: '',
        date: '',
        responsiblePerson: '',
        status: 'achieved',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as SocialActivityFollowUp
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>متابعة قسم الأنشطة (نموذج 3)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>الشهر</label>
                        <input
                            type="text"
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>اسم النشاط</label>
                            <input
                                type="text"
                                name="activityName"
                                value={formData.activityName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>نوعه</label>
                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>التاريخ</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>المسؤول</label>
                            <input
                                type="text"
                                name="responsiblePerson"
                                value={formData.responsiblePerson}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>الانجاز</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="achieved">تم الانجاز</option>
                            <option value="not_achieved">لم يتم الانجاز</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>الملاحظات</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
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
