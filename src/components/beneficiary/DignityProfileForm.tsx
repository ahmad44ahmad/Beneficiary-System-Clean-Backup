import React, { useState } from 'react';
import { DignityProfile } from '../../types';
import { X, Save, User, Sun, Heart } from 'lucide-react';

interface DignityProfileFormProps {
    initialData?: DignityProfile;
    onSave: (data: DignityProfile) => void;
    onCancel: () => void;
}

export const DignityProfileForm: React.FC<DignityProfileFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState<DignityProfile>(initialData || {
        personalityType: 'social',
        sensoryPreferences: { lighting: 'natural', noise: 'moderate', temperature: 'warm' },
        microPreferences: { dislikes: [], favoriteColor: '', favoriteCup: '' }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-200" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">تعديل ملف الكرامة (خوارزمية الإحسان)</h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-full"
                    title="إغلاق"
                    aria-label="إغلاق التعديل"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Identity */}
            <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0F3144]" /> الهوية الشخصية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="preferredName" className="block text-sm font-medium text-gray-700 mb-1">الاسم المفضل (اللقب)</label>
                        <input
                            id="preferredName"
                            type="text"
                            value={formData.preferredName || ''}
                            onChange={e => setFormData({ ...formData, preferredName: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0F3144]"
                            placeholder="مثال: أبو خالد"
                        />
                    </div>
                    <div>
                        <label htmlFor="personalityType" className="block text-sm font-medium text-gray-700 mb-1">نمط الشخصية</label>
                        <select
                            id="personalityType"
                            value={formData.personalityType}
                            onChange={e => setFormData({ ...formData, personalityType: e.target.value as DignityProfile['personalityType'] })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#0F3144]"
                            title="نمط الشخصية"
                        >
                            <option value="social">اجتماعي ومحبوب</option>
                            <option value="energetic">حيوي ونشيط</option>
                            <option value="calm">هادئ ومتأمل</option>
                            <option value="observer">مراقب جيد</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Sensory */}
            <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-[#D49A0A]" /> التفضيلات الحسية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="lightingPref" className="block text-sm font-medium text-gray-700 mb-1">الإضاءة</label>
                        <select
                            id="lightingPref"
                            value={formData.sensoryPreferences?.lighting}
                            onChange={e => setFormData({
                                ...formData,
                                sensoryPreferences: { ...formData.sensoryPreferences, lighting: e.target.value as NonNullable<DignityProfile['sensoryPreferences']>['lighting'] }
                            })}
                            className="w-full p-2 border rounded-lg"
                            title="تفضيلات الإضاءة"
                        >
                            <option value="dim">خافتة</option>
                            <option value="natural">طبيعية</option>
                            <option value="bright">ساطعة</option>
                            <option value="any">أي إضاءة</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="noisePref" className="block text-sm font-medium text-gray-700 mb-1">الصوت</label>
                        <select
                            id="noisePref"
                            value={formData.sensoryPreferences?.noise}
                            onChange={e => setFormData({
                                ...formData,
                                sensoryPreferences: { ...formData.sensoryPreferences, noise: e.target.value as NonNullable<DignityProfile['sensoryPreferences']>['noise'] }
                            })}
                            className="w-full p-2 border rounded-lg"
                            title="تفضيلات الصوت"
                        >
                            <option value="quiet">هادئ</option>
                            <option value="moderate">معتدل</option>
                            <option value="loud">مرتفع</option>
                            <option value="any">أي صوت</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tempPref" className="block text-sm font-medium text-gray-700 mb-1">الحرارة</label>
                        <select
                            id="tempPref"
                            value={formData.sensoryPreferences?.temperature}
                            onChange={e => setFormData({
                                ...formData,
                                sensoryPreferences: { ...formData.sensoryPreferences, temperature: e.target.value as NonNullable<DignityProfile['sensoryPreferences']>['temperature'] }
                            })}
                            className="w-full p-2 border rounded-lg"
                            title="تفضيلات الحرارة"
                        >
                            <option value="cool">باردة</option>
                            <option value="normal">عادية</option>
                            <option value="warm">دافئة</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Micro Preferences */}
            <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#DC2626]" /> المسرات الصغيرة
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="favColor" className="block text-sm font-medium text-gray-700 mb-1">اللون المفضل (كوب/ملابس)</label>
                        <input
                            id="favColor"
                            type="text"
                            value={formData.microPreferences?.favoriteColor || ''}
                            onChange={e => setFormData({
                                ...formData,
                                microPreferences: { ...formData.microPreferences, favoriteColor: e.target.value }
                            })}
                            className="w-full p-2 border rounded-lg"
                            placeholder="مثال: أزرق سماوي"
                        />
                    </div>
                    <div>
                        <label htmlFor="wakeupTime" className="block text-sm font-medium text-gray-700 mb-1">وقت الاستيقاظ المفضل</label>
                        <input
                            id="wakeupTime"
                            type="time"
                            value={formData.microPreferences?.wakeupTime || ''}
                            onChange={e => setFormData({
                                ...formData,
                                microPreferences: { ...formData.microPreferences, wakeupTime: e.target.value }
                            })}
                            className="w-full p-2 border rounded-lg"
                            title="وقت الاستيقاظ المفضل"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={onCancel} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    إلغاء
                </button>
                <button type="submit" className="px-5 py-2 bg-hrsd-teal text-white rounded-lg hover:bg-hrsd-teal-dark flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                </button>
            </div>
        </form>
    );
};
