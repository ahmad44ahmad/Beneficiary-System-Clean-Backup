import React, { useState } from 'react';
import { IncomingMail } from '../../types';
import { X, Save, Upload } from 'lucide-react';

interface IncomingMailFormProps {
    onSubmit: (data: Omit<IncomingMail, 'id' | 'status'>) => void;
    onClose: () => void;
}

export const IncomingMailForm: React.FC<IncomingMailFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        sender: '',
        receiverDept: '',
        letterNumber: '',
        priority: 'normal' as IncomingMail['priority'],
        notes: '',
        attachmentUrl: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">تسجيل بريد وارد جديد</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الوارد</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        {/* Letter Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الخطاب</label>
                            <input
                                type="text"
                                name="letterNumber"
                                value={formData.letterNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="رقم الخطاب الخارجي"
                            />
                        </div>

                        {/* Sender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الجهة المرسلة</label>
                            <input
                                type="text"
                                name="sender"
                                value={formData.sender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="مثال: وزارة الموارد البشرية"
                            />
                        </div>

                        {/* Receiver Dept */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الجهة المحال إليها</label>
                            <select
                                name="receiverDept"
                                value={formData.receiverDept}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">ختر القسم</option>
                                <option value="director">مدير المركز</option>
                                <option value="medical">القسم الطبي</option>
                                <option value="social">الخدمة الاجتماعية</option>
                                <option value="rehab">التأهيل والعلاج الطبيعي</option>
                                <option value="hr">الموارد البشرية</option>
                                <option value="finance">المالية</option>
                                <option value="quality">الجودة</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الأهمية</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="normal">عادي</option>
                                <option value="urgent">عاجل</option>
                                <option value="top_urgent">عاجل جداً</option>
                            </select>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="عنوان أو ملخص الخطاب"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* File Upload (Visual only for now) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المرفقات</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">اضغط للتحميل</span> أو اسحب الملف هنا</p>
                                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5MB)</p>
                                </div>
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            <Save size={18} className="ml-2" />
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
