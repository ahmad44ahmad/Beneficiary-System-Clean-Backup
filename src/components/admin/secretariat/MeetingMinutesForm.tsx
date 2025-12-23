import React, { useState } from 'react';
import { MeetingMinute } from '../../../types';
import { Network, Save, X, Plus, Trash2 } from 'lucide-react';

interface MeetingMinutesFormProps {
    onSave: (minutes: MeetingMinute) => void;
    onCancel: () => void;
}

export const MeetingMinutesForm: React.FC<MeetingMinutesFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<MeetingMinute>>({
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        location: '',
        attendees: [],
        agenda: '',
        decisions: '',
        actionItems: []
    });

    const [newAttendee, setNewAttendee] = useState('');
    const [newActionItem, setNewActionItem] = useState({ task: '', assignee: '', dueDate: '', status: 'pending' as const });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addAttendee = () => {
        if (newAttendee.trim()) {
            setFormData(prev => ({ ...prev, attendees: [...(prev.attendees || []), newAttendee.trim()] }));
            setNewAttendee('');
        }
    };

    const removeAttendee = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attendees: prev.attendees?.filter((_, i) => i !== index)
        }));
    };

    const addActionItem = () => {
        if (newActionItem.task && newActionItem.assignee) {
            setFormData(prev => ({
                ...prev,
                actionItems: [...(prev.actionItems || []), { ...newActionItem }]
            }));
            setNewActionItem({ task: '', assignee: '', dueDate: '', status: 'pending' });
        }
    };

    const removeActionItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            actionItems: prev.actionItems?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as MeetingMinute
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Network className="w-6 h-6 text-purple-600" />
                        محضر اجتماع جديد
                    </h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">التاريخ</label>
                            <input type="date" name="date" className="w-full border rounded-md p-2" value={formData.date} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">الوقت</label>
                            <input type="time" name="time" className="w-full border rounded-md p-2" value={formData.time} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">المكان</label>
                            <input type="text" name="location" className="w-full border rounded-md p-2" value={formData.location} onChange={handleChange} placeholder="مثال: قاعة الاجتماعات" required />
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <label className="block text-sm font-medium mb-1">الحضور</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="border rounded-md p-2 w-64"
                                placeholder="اسم الحاضر"
                                value={newAttendee}
                                onChange={(e) => setNewAttendee(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                            />
                            <button type="button" onClick={addAttendee} className="bg-purple-100 text-purple-700 px-3 rounded-md hover:bg-purple-200">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md min-h-[50px]">
                            {formData.attendees?.map((attendee, index) => (
                                <span key={index} className="bg-white border px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {attendee}
                                    <button type="button" onClick={() => removeAttendee(index)} className="text-red-400 hover:text-red-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Agenda & Decisions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">جدول الأعمال (Agenda)</label>
                            <textarea
                                name="agenda"
                                rows={4}
                                className="w-full border rounded-md p-2"
                                value={formData.agenda}
                                onChange={handleChange}
                                placeholder="نقاط النقاش..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">القرارات المتخذة</label>
                            <textarea
                                name="decisions"
                                rows={4}
                                className="w-full border rounded-md p-2"
                                value={formData.decisions}
                                onChange={handleChange}
                                placeholder="ما تم الاتفاق عليه..."
                            />
                        </div>
                    </div>

                    {/* Action Items */}
                    <div>
                        <label className="block text-sm font-medium mb-2 border-b pb-1">المهام والتكليفات (Action Items)</label>
                        <div className="grid grid-cols-12 gap-2 mb-2 items-end">
                            <div className="col-span-5">
                                <input
                                    className="w-full border p-2 text-sm rounded bg-gray-50"
                                    placeholder="المهمة"
                                    value={newActionItem.task}
                                    onChange={e => setNewActionItem({ ...newActionItem, task: e.target.value })}
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    className="w-full border p-2 text-sm rounded bg-gray-50"
                                    placeholder="المسؤول"
                                    value={newActionItem.assignee}
                                    onChange={e => setNewActionItem({ ...newActionItem, assignee: e.target.value })}
                                />
                            </div>
                            <div className="col-span-3">
                                <input
                                    type="date"
                                    className="w-full border p-2 text-sm rounded bg-gray-50"
                                    value={newActionItem.dueDate}
                                    onChange={e => setNewActionItem({ ...newActionItem, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="col-span-1">
                                <button type="button" onClick={addActionItem} className="w-full bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 flex justify-center">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 text-right">المهمة</th>
                                        <th className="p-2 text-right">المسؤول</th>
                                        <th className="p-2 text-right">أقضى موعد</th>
                                        <th className="p-2 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.actionItems?.map((item, i) => (
                                        <tr key={i} className="border-t hover:bg-gray-50">
                                            <td className="p-2">{item.task}</td>
                                            <td className="p-2">{item.assignee}</td>
                                            <td className="p-2">{item.dueDate}</td>
                                            <td className="p-2 text-center">
                                                <button type="button" onClick={() => removeActionItem(i)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!formData.actionItems || formData.actionItems.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-400">لا توجد مهام مسجلة</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            حفظ المحضر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
