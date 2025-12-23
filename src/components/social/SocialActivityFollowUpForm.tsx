import React, { useState } from 'react';
import { SocialActivityFollowUp } from '../../types';

interface SocialActivityFollowUpFormProps {
    onSave: (followUp: SocialActivityFollowUp) => void;
    onCancel: () => void;
}

export const SocialActivityFollowUpForm: React.FC<SocialActivityFollowUpFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityFollowUp>>({
        month: '',
        activityName: '',
        date: '',
        responsiblePerson: '',
        status: 'achieved',
        observations: '',
        recommendations: ''
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mb-4">
                <h2 className="text-xl font-bold mb-4">متابعة قسم الأنشطة (نموذج 3)</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الشهر</label>
                            <input
                                type="text"
                                name="month"
                                className="w-full border rounded p-2"
                                value={formData.month}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">التاريخ</label>
                            <input
                                type="date"
                                name="date"
                                className="w-full border rounded p-2"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">اسم النشاط</label>
                        <input
                            type="text"
                            name="activityName"
                            className="w-full border rounded p-2"
                            value={formData.activityName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">المسؤول</label>
                        <input
                            type="text"
                            name="responsiblePerson"
                            className="w-full border rounded p-2"
                            value={formData.responsiblePerson}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">الانجاز</label>
                        <select
                            name="status"
                            className="w-full border rounded p-2"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="achieved">تم الانجاز</option>
                            <option value="not_achieved">لم يتم الانجاز</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">الملاحظات</label>
                        <textarea
                            name="observations"
                            className="w-full border rounded p-2"
                            value={formData.observations}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">محلات الصرف/توصيات</label>
                        <textarea
                            name="recommendations"
                            className="w-full border rounded p-2"
                            value={formData.recommendations}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">حفظ المتابعة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
