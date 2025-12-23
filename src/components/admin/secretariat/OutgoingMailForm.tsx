import React, { useState } from 'react';
import { OutgoingMail } from '../../../types';
import { Send, Save, X } from 'lucide-react';

interface OutgoingMailFormProps {
    onSave: (mail: OutgoingMail) => void;
    onCancel: () => void;
}

export const OutgoingMailForm: React.FC<OutgoingMailFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<OutgoingMail>>({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        destination: '',
        senderDept: '',
        letterNumber: '',
        priority: 'normal',
        status: 'draft',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as OutgoingMail
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Send className="w-6 h-6 text-green-600 transform -rotate-45" />
                        تسجيل صادر جديد
                    </h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">تاريخ الصادر</label>
                            <input
                                type="date"
                                name="date"
                                className="w-full border rounded-md p-2"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">رقم الخطاب / القيد</label>
                            <input
                                type="text"
                                name="letterNumber"
                                className="w-full border rounded-md p-2"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">الموضوع</label>
                        <input
                            type="text"
                            name="subject"
                            className="w-full border rounded-md p-2"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الإدارة المصدرة (داخلي)</label>
                            <select
                                name="senderDept"
                                className="w-full border rounded-md p-2"
                                value={formData.senderDept}
                                onChange={handleChange}
                                required
                            >
                                <option value="">اختر الإدارة...</option>
                                <option value="إدارة المركز">إدارة المركز</option>
                                <option value="الخدمات الطبية">الخدمات الطبية</option>
                                <option value="الخدمات الاجتماعية">الخدمات الاجتماعية</option>
                                <option value="الموارد البشرية">الموارد البشرية</option>
                                <option value="المالية والتشغيل">المالية والتشغيل</option>
                                <option value="أخرى">أخرى</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الجهة المرسل إليها</label>
                            <input
                                type="text"
                                name="destination"
                                className="w-full border rounded-md p-2"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                                placeholder="مثال: إمارة المنطقة"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الأهمية</label>
                            <select
                                name="priority"
                                className="w-full border rounded-md p-2"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="normal">عادي</option>
                                <option value="urgent">عاجل</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الحالة</label>
                            <select
                                name="status"
                                className="w-full border rounded-md p-2"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="draft">مسودة</option>
                                <option value="sent">تم الإرسال</option>
                                <option value="archived">مؤرشف</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ملاحظات</label>
                        <textarea
                            name="notes"
                            rows={3}
                            className="w-full border rounded-md p-2"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
