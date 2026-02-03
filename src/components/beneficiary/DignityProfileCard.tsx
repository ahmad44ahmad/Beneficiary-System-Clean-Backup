import React, { useState } from 'react';
import { DignityProfile } from '../../types';
import { Card } from '../ui/Card';
import { DignityProfileForm } from './DignityProfileForm';
import {
    Smile,
    Zap,
    Moon,
    Volume2,
    Sun,
    Thermometer,
    Heart,
    ThumbsUp,
    ThumbsDown,
    MessageCircle,
    Star,
    Award,
    HandHeart,
    Edit2,
    Users
} from 'lucide-react';

interface DignityProfileCardProps {
    profile?: DignityProfile | null;
    onUpdate?: (updatedProfile: DignityProfile) => void;
}

export const DignityProfileCard: React.FC<DignityProfileCardProps> = ({ profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Handle missing profile
    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-medium mb-4">لا توجد بيانات ملف الكرامة لهذا المستفيد</p>
                {onUpdate && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2"
                    >
                        + إنشاء ملف الكرامة
                    </button>
                )}
                {isEditing && (
                    <div className="w-full mt-4">
                        <DignityProfileForm
                            onSave={(data) => {
                                onUpdate?.(data);
                                setIsEditing(false);
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                )}
            </div>
        );
    }

    if (isEditing) {
        return (
            <DignityProfileForm
                initialData={profile}
                onSave={(data) => {
                    onUpdate?.(data);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    // Provide safe defaults for nested properties
    const favorites = profile.favorites || { food: [], activities: [], places: [], people: [], colors: [] };
    const dislikes = profile.dislikes || { food: [], triggers: [], fears: [] };
    const deeds = profile.deeds || [];
    const sensoryPreferences = profile.sensoryPreferences || { lighting: 'any', noise: 'any', temperature: 'normal' };

    const getPersonalityIcon = (type: DignityProfile['personalityType']) => {
        switch (type) {
            case 'social': return <Users className="w-5 h-5 text-blue-500" />;
            case 'energetic': return <Zap className="w-5 h-5 text-yellow-500" />;
            case 'calm': return <Moon className="w-5 h-5 text-indigo-500" />;
            case 'observer': return <Smile className="w-5 h-5 text-green-500" />;
            default: return <Smile className="w-5 h-5 text-gray-500" />;
        }
    };

    const getImpactColor = (level: 'high' | 'medium' | 'low') => {
        switch (level) {
            case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header / Identity Section */}
            <div className="bg-gradient-to-l from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 flex flex-col md:flex-row gap-6 items-start relative group">
                {onUpdate && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="تعديل الملف"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                )}

                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                    {getPersonalityIcon(profile.personalityType)}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-800">{profile.nickname || 'الاسم المفضل'}</h2>
                        <span className="px-3 py-1 bg-white border rounded-full text-sm font-medium text-indigo-600 shadow-sm flex items-center gap-2">
                            {getPersonalityIcon(profile.personalityType)}
                            {profile.personalityType === 'social' ? 'اجتماعي ومحبوب' :
                                profile.personalityType === 'energetic' ? 'حيوي ونشيط' :
                                    profile.personalityType === 'calm' ? 'هادئ ومتأمل' : 'مراقب جيد'}
                        </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                        "{profile.personalityDescription || 'لا يوجد وصف للشخصية مسجل'}"
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                            <MessageCircle className="w-4 h-4 text-gray-400" />
                            طريقة التواصل: {
                                profile.communicationStyle === 'verbal' ? 'لفظي' :
                                    profile.communicationStyle === 'sign_language' ? 'لغة الإشارة' :
                                        profile.communicationStyle === 'gestures' ? 'الإيماءات' : 'متنوع'
                            }
                        </span>
                        <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border">
                            <Heart className="w-4 h-4 text-rose-400" />
                            كيف تسعده: {profile.bestWayToEngage || 'غير محدد'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sensory Preferences (My Comfort) */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        تفضيلات "راحتي"
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                                {sensoryPreferences.lighting === 'bright' ? <Sun className="text-orange-500" /> : <Moon className="text-indigo-500" />}
                            </div>
                            <span className="text-sm font-medium text-gray-700">الإضاءة</span>
                            <p className="text-xs text-gray-500">
                                {sensoryPreferences.lighting === 'bright' ? 'ساطعة' : 'خافتة/طبيعية'}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                                {sensoryPreferences.noise === 'quiet' ? <Volume2 className="text-gray-400" /> : <Volume2 className="text-green-500" />}
                            </div>
                            <span className="text-sm font-medium text-gray-700">الصوت</span>
                            <p className="text-xs text-gray-500">
                                {sensoryPreferences.noise === 'quiet' ? 'هادئ' : 'حيوي'}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <div className="flex justify-center mb-2">
                                <Thermometer className={sensoryPreferences.temperature === 'cool' ? 'text-blue-500' : 'text-red-500'} />
                            </div>
                            <span className="text-sm font-medium text-gray-700">الحرارة</span>
                            <p className="text-xs text-gray-500">
                                {sensoryPreferences.temperature === 'cool' ? 'باردة' : 'دافئة'}
                            </p>
                        </div>
                        {sensoryPreferences.smells && sensoryPreferences.smells.length > 0 && (
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <div className="flex justify-center mb-2">
                                    <Award className="text-purple-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">الروائح</span>
                                <p className="text-xs text-gray-500 truncate">
                                    {sensoryPreferences.smells.join('، ')}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Likes & Dislikes */}
                <Card className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <ThumbsUp className="w-5 h-5 text-green-600" />
                            ما يحبه
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {favorites.food.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                    {item}
                                </span>
                            ))}
                            {favorites.activities.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                    {item}
                                </span>
                            ))}
                            {favorites.colors.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                    {item}
                                </span>
                            ))}
                            {!favorites.food.length && !favorites.activities.length && !favorites.colors.length && (
                                <span className="text-xs text-gray-400 italic">لا توجد تفضيلات مسجلة</span>
                            )}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <ThumbsDown className="w-5 h-5 text-red-500" />
                            ما يزعجه
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {dislikes.triggers.map((item, i) => (
                                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">
                                    {item}
                                </span>
                            ))}
                            {!dislikes.triggers.length && (
                                <span className="text-xs text-gray-400 italic">لا توجد انزعاجات مسجلة</span>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Deeds Log */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <HandHeart className="w-5 h-5 text-teal-600" />
                        سجل الحسنات والإنجازات اليومية
                    </h3>
                    <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                        + إضافة إنجاز
                    </button>
                </div>

                <div className="relative border-r-2 border-gray-200 mr-3 pr-6 space-y-6">
                    {deeds.length > 0 ? deeds.map((deed) => (
                        <div key={deed.id} className="relative">
                            <div className="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-sm">{deed.title}</h4>
                                        <p className="text-xs text-gray-500">{deed.date}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full border ${getImpactColor(deed.impactLevel)}`}>
                                        {deed.impactLevel === 'high' ? 'أثر عالي' : 'متوسط'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{deed.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Award className="w-3 h-3" />
                                    <span>تم التوثيق بواسطة: {deed.verifiedBy}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm text-center py-4">لا توجد إنجازات مسجلة بعد</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
