import React, { useState } from 'react';
import { SocialActivityDocumentation } from '../../types';
import { Image, X } from 'lucide-react';

interface SocialActivityDocumentationFormProps {
    onSave: (doc: SocialActivityDocumentation) => void;
    onCancel: () => void;
}

export const SocialActivityDocumentationForm: React.FC<SocialActivityDocumentationFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SocialActivityDocumentation>>({
        activityName: '',
        date: '',
        type: '',
        supervisor: '',
        objectives: '',
        implementationProcedure: '',
        budget: 0,
        outcomes: '',
        internalParticipants: [],
        externalParticipants: [],
        images: [],
        notes: ''
    });

    const [newInternal, setNewInternal] = useState('');
    const [newExternal, setNewExternal] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map((file: any) => URL.createObjectURL(file));
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), ...newImages]
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const addInternal = () => {
        if (newInternal) {
            setFormData(prev => ({ ...prev, internalParticipants: [...(prev.internalParticipants || []), newInternal] }));
            setNewInternal('');
        }
    };

    const addExternal = () => {
        if (newExternal) {
            setFormData(prev => ({ ...prev, externalParticipants: [...(prev.externalParticipants || []), newExternal] }));
            setNewExternal('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: Date.now().toString(),
            ...formData as SocialActivityDocumentation
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">توثيق النشاط (نموذج 2)</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium mb-1">نوعه</label>
                            <input
                                type="text"
                                name="type"
                                className="w-full border rounded p-2"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <div>
                            <label className="block text-sm font-medium mb-1">مشرف الوحدة</label>
                            <input
                                type="text"
                                name="supervisor"
                                className="w-full border rounded p-2"
                                value={formData.supervisor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">أهداف النشاط</label>
                        <textarea
                            name="objectives"
                            className="w-full border rounded p-2"
                            value={formData.objectives}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">اجراءات التنفيذ</label>
                        <textarea
                            name="implementationProcedure"
                            className="w-full border rounded p-2"
                            value={formData.implementationProcedure}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">الميزانية</label>
                            <input
                                type="number"
                                name="budget"
                                className="w-full border rounded p-2"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">المخرجات</label>
                            <textarea
                                name="outcomes"
                                className="w-full border rounded p-2"
                                value={formData.outcomes}
                                onChange={handleChange}
                                rows={1}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-3 rounded">
                            <label className="block text-sm font-bold mb-2">المشاركون من الداخل</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    className="border p-1 w-full text-sm"
                                    placeholder="الاسم"
                                    value={newInternal}
                                    onChange={e => setNewInternal(e.target.value)}
                                />
                                <button type="button" onClick={addInternal} className="bg-blue-100 text-blue-600 px-2 rounded">+</button>
                            </div>
                            <ul className="text-xs list-disc pr-4 h-24 overflow-y-auto">
                                {formData.internalParticipants?.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                        <div className="border p-3 rounded">
                            <label className="block text-sm font-bold mb-2">المشاركون من الخارج</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    className="border p-1 w-full text-sm"
                                    placeholder="الاسم/الجهة"
                                    value={newExternal}
                                    onChange={e => setNewExternal(e.target.value)}
                                />
                                <button type="button" onClick={addExternal} className="bg-blue-100 text-blue-600 px-2 rounded">+</button>
                            </div>
                            <ul className="text-xs list-disc pr-4 h-24 overflow-y-auto">
                                {formData.externalParticipants?.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="border p-3 rounded bg-gray-50 border-dashed border-gray-300">
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            صور من النشاط
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mb-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <div className="flex gap-2 flex-wrap">
                            {formData.images?.map((img, i) => (
                                <div key={i} className="relative w-16 h-16 border rounded overflow-hidden">
                                    <img src={img} alt={`upload-${i}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">حفظ التوثيق</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
