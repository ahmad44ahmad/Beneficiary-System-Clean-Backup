import React, { useState } from 'react';
import { SocialActivityPlan } from '../../types';

interface SocialActivityPlanFormProps {
    onSave: (plan: SocialActivityPlan) => void;
    onCancel: () => void;
}

export const SocialActivityPlanForm: React.FC<SocialActivityPlanFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityPlan>>({
        year: new Date().getFullYear(),
        activityType: '',
        supervisor: '',
        executionTimeStart: '',
        executionTimeEnd: '',
        targetGroup: 'employees',
        cost: 0,
        location: '',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as SocialActivityPlan
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">الخطة السنوية للأنشطة الثقافية والاجتماعية (نموذج 1)</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">العام</label>
                            <input
                                type="number"
                                name="year"
                                className="w-full border rounded p-2"
                                value={formData.year}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">اسم النشاط</label>
                            <input
                                type="text"
                                name="activityType"
                                className="w-full border rounded p-2"
                                value={formData.activityType}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">المشرف على النشاط</label>
                        <input
                            type="text"
                            name="supervisor"
                            className="w-full border rounded p-2"
                            value={formData.supervisor}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">وقت التنفيذ (من)</label>
                            <input
                                type="date"
                                name="executionTimeStart"
                                className="w-full border rounded p-2"
                                value={formData.executionTimeStart}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">وقت التنفيذ (إلى)</label>
                            <input
                                type="date"
                                name="executionTimeEnd"
                                className="w-full border rounded p-2"
                                value={formData.executionTimeEnd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الفئة المستهدفة</label>
                            <select
                                name="targetGroup"
                                className="w-full border rounded p-2"
                                value={formData.targetGroup}
                                onChange={handleChange}
                            >
                                <option value="employees">موظفي المركز</option>
                                <option value="beneficiaries">المستفيدين</option>
                                <option value="community">المجتمع الخارجي</option>
                                <option value="both">مشترك</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">التكلفة المالية (ريال)</label>
                            <input
                                type="number"
                                name="cost"
                                className="w-full border rounded p-2"
                                value={formData.cost}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">مكان التنفيذ</label>
                        <input
                            type="text"
                            name="location"
                            className="w-full border rounded p-2"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ملاحظات</label>
                        <textarea
                            name="notes"
                            className="w-full border rounded p-2"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">حفظ الخطة</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
