import * as React from 'react';
import { useState } from 'react';
import { Beneficiary, InjuryReport } from '../../types';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/Button';

interface InjuryReportFormProps {
    beneficiary: Beneficiary;
    onSave: (report: InjuryReport) => void;
    onCancel: () => void;
}

export const InjuryReportForm: React.FC<InjuryReportFormProps> = ({ beneficiary, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<InjuryReport, 'id' | 'beneficiaryId'>>({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        location: '',
        injuryType: '',
        description: '',
        firstAidGiven: '',
        takenToHospital: false,
        witnesses: '',
        supervisorName: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReport: InjuryReport = {
            id: `inj_${Date.now()}`,
            beneficiaryId: beneficiary.id,
            ...formData
        };
        onSave(newReport);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">نموذج الإبلاغ عن إصابة (نموذج ١٧)</h3>
                            <p className="text-sm text-gray-500 mt-1">تويثق الحوادث والإصابات لضمان سلامة المستفيدين</p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex justify-between items-center text-sm">
                            <div>
                                <span className="text-gray-500 ml-2">اسم المستفيد:</span>
                                <span className="font-bold text-gray-900">{beneficiary.fullName}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 ml-2">رقم الملف:</span>
                                <span className="font-mono font-bold text-gray-900">{beneficiary.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">تاريخ الإصابة</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700">وقت الإصابة</label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">مكان وقوع الإصابة</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="مثلاً: الصالة الرياضية، غرفة النوم..."
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="injuryType" className="block text-sm font-medium text-gray-700">نوع الإصابة</label>
                            <input
                                type="text"
                                id="injuryType"
                                name="injuryType"
                                value={formData.injuryType}
                                onChange={handleChange}
                                required
                                placeholder="جرح، كدمة، كسر، حرق..."
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">وصف الحادث وكيفية وقوعه</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                required
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="firstAidGiven" className="block text-sm font-medium text-gray-700">الإسعافات الأولية التي قدمت</label>
                            <textarea
                                id="firstAidGiven"
                                name="firstAidGiven"
                                value={formData.firstAidGiven}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="takenToHospital"
                                    checked={formData.takenToHospital}
                                    onChange={handleCheckboxChange}
                                    className="w-5 h-5 text-red-600 rounded focus:ring-red-500 border-gray-300"
                                />
                                <span className="font-medium text-red-900">هل تم نقل الحالة للمستشفى؟</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="witnesses" className="block text-sm font-medium text-gray-700">أسماء الشهود (إن وجد)</label>
                                <input
                                    type="text"
                                    id="witnesses"
                                    name="witnesses"
                                    value={formData.witnesses}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700">اسم المشرف المبلغ</label>
                                <input
                                    type="text"
                                    id="supervisorName"
                                    name="supervisorName"
                                    value={formData.supervisorName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            إلغاء
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                            <Save className="w-4 h-4" />
                            حفظ البلاغ
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
