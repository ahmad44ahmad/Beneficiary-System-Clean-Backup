import React, { useState } from 'react';
import { MeetingMinute } from '../../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface MeetingMinutesFormProps {
    onSubmit: (data: Omit<MeetingMinute, 'id'>) => void;
    onClose: () => void;
}

export const MeetingMinutesForm: React.FC<MeetingMinutesFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        location: '',
        agenda: '',
        decisions: '',
    });

    const [attendees, setAttendees] = useState<string[]>(['']);
    const [actionItems, setActionItems] = useState<Omit<MeetingMinute['actionItems'][0], 'status'>[]>([
        { task: '', assignee: '', dueDate: '' }
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Filter out empty entries
        const validAttendees = attendees.filter(a => a.trim() !== '');
        const validActionItems = actionItems.filter(item => item.task.trim() !== '')
            .map(item => ({ ...item, status: 'pending' as const }));

        onSubmit({
            ...formData,
            attendees: validAttendees,
            actionItems: validActionItems
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Attendees Handlers
    const handleAttendeeChange = (index: number, value: string) => {
        const newAttendees = [...attendees];
        newAttendees[index] = value;
        setAttendees(newAttendees);
    };

    const addAttendee = () => setAttendees([...attendees, '']);
    const removeAttendee = (index: number) => {
        const newAttendees = attendees.filter((_, i) => i !== index);
        setAttendees(newAttendees.length ? newAttendees : ['']);
    };

    // Action Items Handlers
    const handleActionItemChange = (index: number, field: keyof typeof actionItems[0], value: string) => {
        const newItems = [...actionItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setActionItems(newItems);
    };

    const addActionItem = () => setActionItems([...actionItems, { task: '', assignee: '', dueDate: '' }]);
    const removeActionItem = (index: number) => {
        const newItems = actionItems.filter((_, i) => i !== index);
        setActionItems(newItems.length ? newItems : [{ task: '', assignee: '', dueDate: '' }]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">تسجيل محضر اجتماع</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">المكان</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                placeholder="قاعة الاجتماعات، مكتب المدير..."
                            />
                        </div>
                    </div>

                    {/* Agenda & Decisions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">أجندة الاجتماع (المواضيع)</label>
                        <textarea
                            name="agenda"
                            value={formData.agenda}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="- مناقشة الخطة السنوية
- مراجعة تقارير الأداء..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">التوصيات والقرارات</label>
                        <textarea
                            name="decisions"
                            value={formData.decisions}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="تم الاتفاق على..."
                        />
                    </div>

                    {/* Attendees */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                            الحضور
                            <button
                                type="button"
                                onClick={addAttendee}
                                className="mr-auto text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 flex items-center"
                            >
                                <Plus size={14} className="ml-1" />
                                إضافة
                            </button>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {attendees.map((attendee, index) => (
                                <div key={index} className="flex">
                                    <input
                                        type="text"
                                        value={attendee}
                                        onChange={(e) => handleAttendeeChange(index, e.target.value)}
                                        className="flex-1 p-2 border rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`اسم الحاضر ${index + 1}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeAttendee(index)}
                                        className="bg-red-50 text-red-500 px-3 border border-l-0 rounded-l-md hover:bg-red-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                            المهام والتكليفات
                            <button
                                type="button"
                                onClick={addActionItem}
                                className="mr-auto text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 flex items-center"
                            >
                                <Plus size={14} className="ml-1" />
                                إضافة مهمة
                            </button>
                        </h3>
                        <div className="space-y-3">
                            {actionItems.map((item, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-start border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex-1 w-full">
                                        <input
                                            type="text"
                                            value={item.task}
                                            onChange={(e) => handleActionItemChange(index, 'task', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="المهمة المطلوبة"
                                            required
                                        />
                                    </div>
                                    <div className="w-full md:w-1/4">
                                        <input
                                            type="text"
                                            value={item.assignee}
                                            onChange={(e) => handleActionItemChange(index, 'assignee', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="المسؤول"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/5">
                                        <input
                                            type="date"
                                            value={item.dueDate}
                                            onChange={(e) => handleActionItemChange(index, 'dueDate', e.target.value)}
                                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeActionItem(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
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
