
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import {
    Activity,
    Brain,
    Files,
    Heart,
    Stethoscope,
    User,
    AlertTriangle,
    Save,
    CheckCircle2
} from 'lucide-react';

interface ComprehensiveMedicalProfileProps {
    beneficiaryId: string;
}

export const ComprehensiveMedicalProfile: React.FC<ComprehensiveMedicalProfileProps> = ({ beneficiaryId }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('classification');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        disability_classification: '',
        mental_disability_level: '',
        motor_disability_type: [] as string[],

        mobility_status: '',
        gmfcs_level: '',
        is_bedridden: false,

        bmi_value: '',
        bmi_category: '',
        diet_type: '',

        chronic_conditions: {
            hypertension: { status: 'none', medication: false, notes: '' },
            diabetes: { status: 'none', hba1c: '', type: '', notes: '' },
            epilepsy: { status: 'none', seizures_last_month: 0, controlled: false, notes: '' },
            asthma: { status: 'none', medication: false, notes: '' }
        },

        psychological_profile: {
            diagnosis: [] as string[],
            status: 'stable',
            plan: '',
            notes: ''
        },

        injuries_profile: {
            bedsores: [] as any[], // { grade, location, notes }
            wounds: [] as any[],
            fractures: [] as any[],
            burns: [] as any[]
        },

        infection_status: {
            hepatitis_b: false,
            hepatitis_c: false,
            hiv: false,
            tb: false,
            other: ''
        },

        rehabilitation_plan: {
            pt_sessions_count: 0,
            speech_therapy_needed: false,
            swallowing_difficulty: false,
            notes: ''
        }
    });

    useEffect(() => {
        fetchProfile();
    }, [beneficiaryId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('medical_profiles')
                .select('*')
                .eq('beneficiary_id', beneficiaryId)
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore not found error
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setFormData({
                    ...formData,
                    ...data,
                    // Ensure JSON fields are merged correctly if null in DB
                    chronic_conditions: data.chronic_conditions || formData.chronic_conditions,
                    psychological_profile: data.psychological_profile || formData.psychological_profile,
                    injuries_profile: data.injuries_profile || formData.injuries_profile,
                    infection_status: data.infection_status || formData.infection_status,
                    rehabilitation_plan: data.rehabilitation_plan || formData.rehabilitation_plan,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const payload = {
                beneficiary_id: beneficiaryId,
                ...formData,
                updated_at: new Date().toISOString()
            };

            // Check if exists to determine insert vs update (though upsert handles this if unique constraint exists)
            // We have a unique constraint on beneficiary_id

            const { error } = await supabase
                .from('medical_profiles')
                .upsert(payload, { onConflict: 'beneficiary_id' });

            if (error) throw error;

            setSuccessMessage('تم حفظ الملف الطبي بنجاح');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const calculateBMI = (weight: number, heightCm: number) => {
        if (!weight || !heightCm) return;
        const heightM = heightCm / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(2);
        // Auto categorize
        let category = '';
        const bmiNum = parseFloat(bmi);
        if (bmiNum < 18.5) category = 'تحت الوزن الطبيعي';
        else if (bmiNum < 24.9) category = 'وزن طبيعي';
        else if (bmiNum < 29.9) category = 'زيادة وزن';
        else if (bmiNum < 34.9) category = 'سمنة درجة أولى';
        else if (bmiNum < 39.9) category = 'سمنة درجة ثانية';
        else category = 'سمنة مفرطة';

        setFormData(prev => ({ ...prev, bmi_value: bmi, bmi_category: category }));
    };

    if (loading) return <div className="p-8 text-center">جاري تحميل الملف الطبي...</div>;

    const tabs = [
        { id: 'classification', label: 'التصنيف والإعاقة', icon: User },
        { id: 'mobility', label: 'الحالة الحركية', icon: Activity },
        { id: 'vitals', label: 'العلامات الحيوية', icon: Heart },
        { id: 'chronic', label: 'الأمراض المزمنة', icon: Stethoscope },
        { id: 'psych', label: 'الحالة النفسية', icon: Brain },
        { id: 'injuries', label: 'الإصابات والعدوى', icon: AlertTriangle },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden" dir="rtl">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Files className="w-5 h-5 text-teal-600" />
                    الملف الطبي الشامل (Person-Centered Care)
                </h2>
                {successMessage && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {successMessage}
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 bg-slate-50 border-l border-slate-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-right px-4 py-4 flex items-center gap-3 transition-colors
                ${activeTab === tab.id
                                    ? 'bg-white text-teal-700 border-r-4 border-teal-600 font-medium shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[800px]">

                    {/* 1. Classification */}
                    {activeTab === 'classification' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">تصنيف الحالة والإعاقة</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">تصنيف الإعاقة الأساسي</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.disability_classification}
                                        onChange={(e) => setFormData({ ...formData, disability_classification: e.target.value })}
                                    >
                                        <option value="">ختر التصنيف</option>
                                        <option value="عقلية">إعاقة عقلية</option>
                                        <option value="حركية">إعاقة حركية</option>
                                        <option value="مزدوجة">مزدوجة (عقلية وحركية)</option>
                                        <option value="نفسية">اضطراب نفسي</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">مستوى الإعاقة العقلية</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.mental_disability_level}
                                        onChange={(e) => setFormData({ ...formData, mental_disability_level: e.target.value })}
                                    >
                                        <option value="">غير محدد</option>
                                        <option value="بسيطة">بسيطة</option>
                                        <option value="متوسطة">متوسطة</option>
                                        <option value="شديدة">شديدة</option>
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">نوع الإعاقة الحركية (يمكن اختيار أكثر من خيار)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['شلل رباعي', 'شلل نصفي', 'ضعف طرفين', 'شلل دماغي'].map(type => (
                                            <label key={type} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.motor_disability_type.includes(type)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setFormData({ ...formData, motor_disability_type: [...formData.motor_disability_type, type] });
                                                        else setFormData({ ...formData, motor_disability_type: formData.motor_disability_type.filter(t => t !== type) });
                                                    }}
                                                    className="rounded text-teal-600 focus:ring-teal-500"
                                                />
                                                <span className="text-sm text-slate-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Mobility */}
                    {activeTab === 'mobility' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">الحالة الحركية و GMFCS</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">مستوى GMFCS (نظام تصنيف الوظائف الحركية الكبرى)</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.gmfcs_level}
                                        onChange={(e) => setFormData({ ...formData, gmfcs_level: e.target.value })}
                                    >
                                        <option value="">اختر المستوى</option>
                                        <option value="1">المستوى 1: يمشي دون قيود</option>
                                        <option value="2">المستوى 2: يمشي مع قيود</option>
                                        <option value="3">المستوى 3: يمشي باستخدام أجهزة مساعدة محمولة باليد</option>
                                        <option value="4">المستوى 4: تنقل ذاتي محدود (كرسي آلي)</option>
                                        <option value="5">المستوى 5: يعتمد كليا على المساعدة (نقل يدوي)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">وضع التنقل العام</label>
                                    <select
                                        className="w-full p-2 border rounded-lg"
                                        value={formData.mobility_status}
                                        onChange={(e) => setFormData({ ...formData, mobility_status: e.target.value })}
                                    >
                                        <option value="">اختر الوضع</option>
                                        <option value="مستقل">يتحرك بنفسه دون مساعدة</option>
                                        <option value="مساعدة_بسيطة">يمشي بصعوبة / يحتاج مساعدة بسيطة</option>
                                        <option value="أجهزة_مساعدة">يمشي باستخدام أجهزة مساعدة</option>
                                        <option value="كرسي_متحرك">يعتمد على كرسي متحرك</option>
                                        <option value="طريح_فراش">طريح فراش</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id="bedridden"
                                        checked={formData.is_bedridden}
                                        onChange={(e) => setFormData({ ...formData, is_bedridden: e.target.checked })}
                                        className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                                    />
                                    <label htmlFor="bedridden" className="font-medium text-red-800">الحالة طريحة فراش (تنبيه لقرح الفراش)</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Vitals & Nutrition */}
                    {activeTab === 'vitals' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">العلامات الحيوية والتغذية</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-1 border p-4 rounded-lg bg-blue-50/50">
                                    <h4 className="font-medium text-blue-800 mb-4">حساب كتلة الجمس (BMI)</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="number"
                                            placeholder="الوزن (كجم)"
                                            className="w-full p-2 border rounded"
                                            onBlur={(e) => {
                                                // Simple logic to calculate if height is available somewhere, for now manual entry or separate state
                                                // Assuming user enters calculated BMI or separate fields. Let's provide manual BMI entry for now as it's often pre-calculated.
                                            }}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bmi_value: e.target.value }))}
                                            value={formData.bmi_value}
                                        />
                                        <input
                                            type="text"
                                            placeholder="تصنيف BMI (تلقائي/يدوي)"
                                            className="w-full p-2 border rounded"
                                            value={formData.bmi_category}
                                            readOnly // Make readOnly if we strictly calculate, but user might want to override. Let's leave editable for fix.
                                        // Actually better to make it select based on user input
                                        />
                                        <select
                                            className="w-full p-2 border rounded bg-white"
                                            value={formData.bmi_category}
                                            onChange={(e) => setFormData({ ...formData, bmi_category: e.target.value })}
                                        >
                                            <option value="">اختر التصنيف</option>
                                            <option value="تحت الوزن الطبيعي">تحت الوزن الطبيعي</option>
                                            <option value="وزن طبيعي">وزن طبيعي</option>
                                            <option value="زيادة وزن">زيادة وزن</option>
                                            <option value="سمنة درجة أولى">سمنة درجة أولى</option>
                                            <option value="سمنة درجة ثانية">سمنة درجة ثانية</option>
                                            <option value="سمنة مفرطة">سمنة مفرطة</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">نوع التغذية والحمية</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {['فموي طبيعي', 'مهروس', 'سائل كثيف', 'أنبوبي معدي (PEG)', 'أنبوبي أنفي (NG Tupe)'].map(diet => (
                                            <label key={diet} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="diet"
                                                    checked={formData.diet_type === diet}
                                                    onChange={() => setFormData({ ...formData, diet_type: diet })}
                                                    className="text-teal-600"
                                                />
                                                <span className="text-slate-700">{diet}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Chronic Diseases */}
                    {activeTab === 'chronic' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">الأمراض المزمنة</h3>

                            {/* Hypertension */}
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="font-semibold text-slate-700">ارتفاع ضغط الدم</label>
                                    <select
                                        className="p-1 border rounded text-sm"
                                        value={formData.chronic_conditions.hypertension.status}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            chronic_conditions: {
                                                ...formData.chronic_conditions,
                                                hypertension: { ...formData.chronic_conditions.hypertension, status: e.target.value }
                                            }
                                        })}
                                    >
                                        <option value="none">لا يوجد</option>
                                        <option value="controlled">مسيطر عليه</option>
                                        <option value="uncontrolled">صعوبة في السيطرة</option>
                                    </select>
                                </div>
                            </div>

                            {/* Diabetes */}
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="font-semibold text-slate-700">داء السكري</label>
                                    <select
                                        className="p-1 border rounded text-sm"
                                        value={formData.chronic_conditions.diabetes.status}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            chronic_conditions: {
                                                ...formData.chronic_conditions,
                                                diabetes: { ...formData.chronic_conditions.diabetes, status: e.target.value }
                                            }
                                        })}
                                    >
                                        <option value="none">لا يوجد</option>
                                        <option value="type1">النوع الأول</option>
                                        <option value="type2">النوع الثاني</option>
                                    </select>
                                </div>
                                {formData.chronic_conditions.diabetes.status !== 'none' && (
                                    <div className="mt-2 text-sm">
                                        <label>تحليل HbA1c الأخير: </label>
                                        <input
                                            type="text"
                                            className="border rounded p-1 w-20 mx-2"
                                            value={formData.chronic_conditions.diabetes.hba1c}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                chronic_conditions: {
                                                    ...formData.chronic_conditions,
                                                    diabetes: { ...formData.chronic_conditions.diabetes, hba1c: e.target.value }
                                                }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Epilepsy */}
                            <div className="bg-slate-50 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="font-semibold text-slate-700">الصرع / التشنجات</label>
                                    <select
                                        className="p-1 border rounded text-sm"
                                        value={formData.chronic_conditions.epilepsy.status}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            chronic_conditions: {
                                                ...formData.chronic_conditions,
                                                epilepsy: { ...formData.chronic_conditions.epilepsy, status: e.target.value }
                                            }
                                        })}
                                    >
                                        <option value="none">لا يوجد</option>
                                        <option value="active">نشط</option>
                                        <option value="controlled">تحت السيطرة</option>
                                    </select>
                                </div>
                                {formData.chronic_conditions.epilepsy.status !== 'none' && (
                                    <div className="mt-2 text-sm">
                                        <label>عدد النوبات هذا الشهر: </label>
                                        <input
                                            type="number"
                                            className="border rounded p-1 w-20 mx-2"
                                            value={formData.chronic_conditions.epilepsy.seizures_last_month}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                chronic_conditions: {
                                                    ...formData.chronic_conditions,
                                                    epilepsy: { ...formData.chronic_conditions.epilepsy, seizures_last_month: parseInt(e.target.value) || 0 }
                                                }
                                            })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 5. Injuries & Infections - Simplified for now */}
                    {activeTab === 'injuries' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">الإصابات والعدوى</h3>

                            <div className="grid grid-cols-1 gap-4">
                                <label className="block text-sm font-medium text-slate-700">الأمراض المعدية</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="flex items-center gap-2 p-2 border rounded bg-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.infection_status.hepatitis_b}
                                            onChange={(e) => setFormData({ ...formData, infection_status: { ...formData.infection_status, hepatitis_b: e.target.checked } })}
                                        />
                                        <span>التهاب كبد B</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded bg-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.infection_status.hepatitis_c}
                                            onChange={(e) => setFormData({ ...formData, infection_status: { ...formData.infection_status, hepatitis_c: e.target.checked } })}
                                        />
                                        <span>التهاب كبد C</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded bg-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.infection_status.hiv}
                                            onChange={(e) => setFormData({ ...formData, infection_status: { ...formData.infection_status, hiv: e.target.checked } })}
                                        />
                                        <span>HIV</span>
                                    </label>
                                    <label className="flex items-center gap-2 p-2 border rounded bg-white">
                                        <input
                                            type="checkbox"
                                            checked={formData.infection_status.tb}
                                            onChange={(e) => setFormData({ ...formData, infection_status: { ...formData.infection_status, tb: e.target.checked } })}
                                        />
                                        <span>درن</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. Psychological - Simplified */}
                    {activeTab === 'psych' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <h3 className="text-lg font-medium text-slate-800 border-b pb-2">الحالة النفسية</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">التشخيص النفسي (فيكتور)</label>
                                <select
                                    className="w-full p-2 border rounded-lg mb-2"
                                    onChange={(e) => {
                                        if (e.target.value && !formData.psychological_profile.diagnosis.includes(e.target.value)) {
                                            setFormData({
                                                ...formData,
                                                psychological_profile: {
                                                    ...formData.psychological_profile,
                                                    diagnosis: [...formData.psychological_profile.diagnosis, e.target.value]
                                                }
                                            });
                                        }
                                    }}
                                >
                                    <option value="">إضافة تشخيص...</option>
                                    <option value="الذهان">الذهان</option>
                                    <option value="ثنائي القطب">ثنائي القطب</option>
                                    <option value="الوسواس القهري">الوسواس القهري</option>
                                    <option value="اضطراب سلوكي">اضطراب سلوكي</option>
                                    <option value="خرف الشيخوخة">خرف الشيخوخة</option>
                                    <option value="اكتئاب">اكتئاب</option>
                                </select>
                                <div className="flex flex-wrap gap-2">
                                    {formData.psychological_profile.diagnosis.map(diag => (
                                        <span key={diag} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {diag}
                                            <button
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    psychological_profile: {
                                                        ...formData.psychological_profile,
                                                        diagnosis: formData.psychological_profile.diagnosis.filter(d => d !== diag)
                                                    }
                                                })}
                                                className="hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <div className="border-t p-4 bg-slate-50 flex justify-end gap-3">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2 disabled:bg-slate-400"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </div>
    );
};
