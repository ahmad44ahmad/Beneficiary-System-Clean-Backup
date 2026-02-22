import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Globe, Palette, Save, CheckCircle } from 'lucide-react';

interface SettingsState {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    language: 'ar' | 'en';
    dashboardLayout: 'compact' | 'comfortable';
}

export const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SettingsState>({
        theme: 'light',
        notifications: true,
        language: 'ar',
        dashboardLayout: 'comfortable'
    });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // In production, save to localStorage or database
        localStorage.setItem('basira_settings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#14415A] flex items-center gap-3">
                        <Settings className="w-7 h-7 text-[#148287]" />
                        الإعدادات
                    </h1>
                    <p className="text-gray-500 mt-1">تخصيص تجربة استخدام النظام</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-[#148287] text-white rounded-xl flex items-center gap-2 shadow-lg hover:bg-[#0f6b6f] transition-colors"
                >
                    {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saved ? 'تم الحفظ!' : 'حفظ التغييرات'}
                </button>
            </div>

            {/* Theme Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-[#14415A] mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#F5961E]" />
                    المظهر
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { value: 'light', label: 'فاتح', icon: Sun },
                        { value: 'dark', label: 'داكن', icon: Moon },
                        { value: 'auto', label: 'تلقائي', icon: Settings }
                    ].map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => setSettings({ ...settings, theme: value as SettingsState['theme'] })}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.theme === value
                                ? 'border-[#148287] bg-[#148287]/10'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Icon className={`w-8 h-8 ${settings.theme === value ? 'text-[#148287]' : 'text-gray-400'}`} />
                            <span className={settings.theme === value ? 'text-[#148287] font-bold' : 'text-gray-600'}>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-[#14415A] mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#F5961E]" />
                    الإشعارات
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-800">تفعيل الإشعارات</p>
                        <p className="text-sm text-gray-500">استلام تنبيهات حول التحديثات والتذكيرات</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                        title={settings.notifications ? 'تعطيل الإشعارات' : 'تفعيل الإشعارات'}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.notifications ? 'bg-[#2DB473]' : 'bg-gray-300'
                            }`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${settings.notifications ? '' : 'translate-x-6'
                            }`} />
                    </button>
                </div>
            </div>

            {/* Language */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-[#14415A] mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#F5961E]" />
                    اللغة
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { value: 'ar', label: 'العربية', flag: '🇸🇦' },
                        { value: 'en', label: 'English', flag: '🇬🇧' }
                    ].map(({ value, label, flag }) => (
                        <button
                            key={value}
                            onClick={() => setSettings({ ...settings, language: value as SettingsState['language'] })}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${settings.language === value
                                ? 'border-[#148287] bg-[#148287]/10'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="text-2xl">{flag}</span>
                            <span className={settings.language === value ? 'text-[#148287] font-bold' : 'text-gray-600'}>{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
