import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Heart, ChevronLeft, Save, Loader2, Edit2,
    User, Smile, Frown, Star, Coffee, Moon, Sun,
    Users, Music, Utensils, MessageCircle, Sparkles
} from 'lucide-react';
import { empowermentService, BeneficiaryPreferences } from '../../services/empowermentService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Predefined Options
const ACTIVITIES = ['القراءة', 'المشي', 'الرسم', 'الموسيقى', 'الحرف اليدوية', 'البستنة', 'مشاهدة التلفاز', 'زيارة الأصدقاء', 'الصلاة', 'التأمل'];
const CALMING_STRATEGIES = ['التنفس العميق', 'الاستماع للقرآن', 'المشي الهادئ', 'التحدث مع شخص مقرب', 'الموسيقى الهادئة', 'العزلة المؤقتة', 'التدليك'];
const MOTIVATORS = ['الثناء اللفظي', 'المكافآت الصغيرة', 'النقاط/الجوائز', 'التقدير أمام الآخرين', 'الخروج في نزهة', 'مكالمة العائلة'];

// Tag Input Component
const TagInput: React.FC<{
    value: string[];
    onChange: (value: string[]) => void;
    suggestions: string[];
    label: string;
    icon: React.ReactNode;
}> = ({ value, onChange, suggestions, label, icon }) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tag: string) => {
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
        }
        setInputValue('');
    };

    const removeTag = (tag: string) => {
        onChange(value.filter(t => t !== tag));
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                {icon}
                {label}
            </label>

            {/* Current Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map(tag => (
                    <span
                        key={tag}
                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm flex items-center gap-1"
                    >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="text-pink-500 hover:text-pink-700">×</button>
                    </span>
                ))}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2">
                {suggestions.filter(s => !value.includes(s)).slice(0, 6).map(suggestion => (
                    <button
                        key={suggestion}
                        onClick={() => addTag(suggestion)}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-pink-100 hover:text-pink-700 transition-colors"
                    >
                        + {suggestion}
                    </button>
                ))}
            </div>

            {/* Custom Input */}
            <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag(inputValue))}
                placeholder="أضف خيار آخر..."
                className="mt-2 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-sm"
            />
        </div>
    );
};

export const DignityFile: React.FC = () => {
    const navigate = useNavigate();
    const { beneficiaryId } = useParams<{ beneficiaryId: string }>();

    // Form State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Preferences
    const [preferredName, setPreferredName] = useState('');
    const [preferredTitle, setPreferredTitle] = useState('');
    const [communicationStyle, setCommunicationStyle] = useState('');
    const [preferredActivities, setPreferredActivities] = useState<string[]>([]);
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [calmingStrategies, setCalmingStrategies] = useState<string[]>([]);
    const [motivators, setMotivators] = useState<string[]>([]);
    const [whatMakesMeHappy, setWhatMakesMeHappy] = useState('');
    const [whatMakesMeUpset, setWhatMakesMeUpset] = useState('');
    const [myDreams, setMyDreams] = useState('');
    const [wakeUpTime, setWakeUpTime] = useState('06:30');
    const [sleepTime, setSleepTime] = useState('21:00');
    const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, [beneficiaryId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const prefs = beneficiaryId
                ? await empowermentService.getPreferences(beneficiaryId)
                : null;

            if (prefs) {
                setPreferredName(prefs.preferred_name || '');
                setPreferredTitle(prefs.preferred_title || '');
                setCommunicationStyle(prefs.communication_style || '');
                setPreferredActivities(prefs.preferred_activities || []);
                setHobbies(prefs.hobbies || []);
                setCalmingStrategies(prefs.calming_strategies || []);
                setMotivators(prefs.motivators || []);
                setWhatMakesMeHappy(prefs.what_makes_me_happy || '');
                setWhatMakesMeUpset(prefs.what_makes_me_upset || '');
                setMyDreams(prefs.my_dreams || '');
                setFavoriteFoods(prefs.favorite_foods || []);
            }
        } finally {
            setLoading(false);
            setEditMode(!beneficiaryId); // New file starts in edit mode
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await empowermentService.savePreferences({
                beneficiary_id: beneficiaryId || 'demo-beneficiary',
                preferred_name: preferredName,
                preferred_title: preferredTitle,
                communication_style: communicationStyle,
                preferred_activities: preferredActivities,
                hobbies: hobbies,
                calming_strategies: calmingStrategies,
                motivators: motivators,
                what_makes_me_happy: whatMakesMeHappy,
                what_makes_me_upset: whatMakesMeUpset,
                my_dreams: myDreams,
                favorite_foods: favoriteFoods,
                wake_up_time: wakeUpTime,
                sleep_time: sleepTime,
            });
            alert('✅ تم حفظ ملف الكرامة بنجاح');
            setEditMode(false);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل ملف الكرامة..." />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-pink-500 via-rose-500 to-red-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <Heart className="w-10 h-10" />
                        <div>
                            <h1 className="text-2xl font-bold">ملف الكرامة</h1>
                            <p className="text-white/80 text-sm">الاحتياجات الشخصية والتفضيلات</p>
                        </div>
                    </div>

                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            تعديل
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-white text-pink-600 rounded-lg hover:bg-pink-50 flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            حفظ
                        </button>
                    )}
                </div>
            </div>

            {/* Identity Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-pink-500" />
                    هويتي
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">الاسم المفضل</label>
                        <input
                            type="text"
                            value={preferredName}
                            onChange={e => setPreferredName(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50"
                            placeholder="كيف تحب أن تُنادى؟"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm mb-1">اللقب المفضل</label>
                        <input
                            type="text"
                            value={preferredTitle}
                            onChange={e => setPreferredTitle(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50"
                            placeholder="أبو... / أم... / أستاذ..."
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-600 text-sm mb-1">أسلوب التواصل المفضل</label>
                    <textarea
                        value={communicationStyle}
                        onChange={e => setCommunicationStyle(e.target.value)}
                        disabled={!editMode}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50 min-h-[60px] resize-none"
                        placeholder="كيف تفضل أن يتحدث معك الآخرون؟"
                    />
                </div>
            </div>

            {/* Daily Routine */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    روتيني اليومي
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Sun className="w-4 h-4 text-yellow-500" />
                            وقت الاستيقاظ
                        </label>
                        <input
                            type="time"
                            value={wakeUpTime}
                            onChange={e => setWakeUpTime(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Moon className="w-4 h-4 text-indigo-500" />
                            وقت النوم
                        </label>
                        <input
                            type="time"
                            value={sleepTime}
                            onChange={e => setSleepTime(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Activities & Preferences */}
            {editMode && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <TagInput
                        value={preferredActivities}
                        onChange={setPreferredActivities}
                        suggestions={ACTIVITIES}
                        label="الأنشطة المفضلة"
                        icon={<Sparkles className="w-5 h-5 text-purple-500" />}
                    />

                    <TagInput
                        value={calmingStrategies}
                        onChange={setCalmingStrategies}
                        suggestions={CALMING_STRATEGIES}
                        label="ما يساعدني على الهدوء"
                        icon={<Coffee className="w-5 h-5 text-teal-500" />}
                    />

                    <TagInput
                        value={motivators}
                        onChange={setMotivators}
                        suggestions={MOTIVATORS}
                        label="ما يحفزني"
                        icon={<Star className="w-5 h-5 text-yellow-500" />}
                    />
                </div>
            )}

            {/* Display Mode Tags */}
            {!editMode && (preferredActivities.length > 0 || calmingStrategies.length > 0 || motivators.length > 0) && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    {preferredActivities.length > 0 && (
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1"><Sparkles className="w-4 h-4" /> الأنشطة المفضلة</p>
                            <div className="flex flex-wrap gap-2">
                                {preferredActivities.map(a => (
                                    <span key={a} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{a}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {calmingStrategies.length > 0 && (
                        <div className="mb-4">
                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1"><Coffee className="w-4 h-4" /> ما يساعدني على الهدوء</p>
                            <div className="flex flex-wrap gap-2">
                                {calmingStrategies.map(s => (
                                    <span key={s} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {motivators.length > 0 && (
                        <div>
                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1"><Star className="w-4 h-4" /> ما يحفزني</p>
                            <div className="flex flex-wrap gap-2">
                                {motivators.map(m => (
                                    <span key={m} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">{m}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Emotional Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-500" />
                    ما يهم معرفته عني
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Smile className="w-4 h-4 text-green-500" />
                            ما يسعدني
                        </label>
                        <textarea
                            value={whatMakesMeHappy}
                            onChange={e => setWhatMakesMeHappy(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50 min-h-[80px] resize-none"
                            placeholder="الأشياء التي تجلب لي الفرح..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Frown className="w-4 h-4 text-red-500" />
                            ما يزعجني
                        </label>
                        <textarea
                            value={whatMakesMeUpset}
                            onChange={e => setWhatMakesMeUpset(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50 min-h-[80px] resize-none"
                            placeholder="الأشياء التي يجب تجنبها..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            أحلامي وتطلعاتي
                        </label>
                        <textarea
                            value={myDreams}
                            onChange={e => setMyDreams(e.target.value)}
                            disabled={!editMode}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50 min-h-[80px] resize-none"
                            placeholder="ما أتمنى تحقيقه..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DignityFile;
