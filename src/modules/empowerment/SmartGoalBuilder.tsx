import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, ChevronLeft, Save, Loader2,
    Calendar, User, Building, Sparkles,
    CheckCircle, ArrowRight, BookOpen
} from 'lucide-react';
import { empowermentService, GoalTemplate, REHAB_DOMAINS, QOL_DIMENSIONS } from '../../services/empowermentService';

// Measurement Types
const MEASUREMENT_TYPES = [
    { value: 'numeric', label: 'قياس رقمي', example: 'مسافة، عدد' },
    { value: 'frequency', label: 'تكرار', example: 'مرات/يوم' },
    { value: 'duration', label: 'مدة', example: 'دقائق، ساعات' },
    { value: 'percentage', label: 'نسبة مئوية', example: '0-100%' },
    { value: 'milestone', label: 'إنجاز محدد', example: 'نعم/لا' },
    { value: 'scale', label: 'مقياس', example: '1-10' },
];

export const SmartGoalBuilder: React.FC<{ beneficiaryId?: string }> = ({ beneficiaryId }) => {
    const navigate = useNavigate();

    // Form State
    const [step, setStep] = useState(1);
    const [domain, setDomain] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [measurementType, setMeasurementType] = useState('');
    const [measurementUnit, setMeasurementUnit] = useState('');
    const [baselineValue, setBaselineValue] = useState<string>('');
    const [targetValue, setTargetValue] = useState<string>('');
    const [qolDimension, setQolDimension] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [targetDate, setTargetDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [familyInvolvement, setFamilyInvolvement] = useState('');

    // UI State
    const [templates, setTemplates] = useState<GoalTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch templates when domain changes
    useEffect(() => {
        if (domain) {
            fetchTemplates();
        }
    }, [domain]);

    const fetchTemplates = async () => {
        setLoading(true);
        const temps = await empowermentService.getGoalTemplates(domain);
        setTemplates(temps);
        setLoading(false);
    };

    const applyTemplate = (template: GoalTemplate) => {
        setSelectedTemplate(template);
        setGoalTitle(template.goal_title);
        setGoalDescription(template.goal_description);
        setMeasurementType(template.measurement_type || '');
        setMeasurementUnit(template.measurement_unit || '');

        // Calculate target date based on typical duration
        if (template.typical_duration_weeks) {
            const target = new Date();
            target.setDate(target.getDate() + template.typical_duration_weeks * 7);
            setTargetDate(target.toISOString().split('T')[0]);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!goalTitle.trim()) { alert('الرجاء إدخال عنوان الهدف'); return; }
        if (!targetDate) { alert('الرجاء تحديد تاريخ الإنجاز المستهدف'); return; }

        setSubmitting(true);
        try {
            const result = await empowermentService.saveGoal({
                beneficiary_id: beneficiaryId || 'demo-beneficiary',
                domain,
                goal_title: goalTitle,
                goal_description: goalDescription,
                measurement_type: measurementType || undefined,
                measurement_unit: measurementUnit || undefined,
                baseline_value: baselineValue ? parseFloat(baselineValue) : undefined,
                target_value: targetValue ? parseFloat(targetValue) : undefined,
                quality_of_life_dimension: qolDimension || undefined,
                start_date: startDate,
                target_date: targetDate,
                assigned_to: assignedTo || undefined,
                family_involvement: familyInvolvement || undefined,
                status: 'planned',
                progress_percentage: 0,
            });

            if (result.success) {
                alert('✅ تم إنشاء الهدف بنجاح');
                navigate('/empowerment');
            } else {
                alert('❌ حدث خطأ أثناء الحفظ');
            }
        } catch (err) {
            console.error(err);
            alert('❌ حدث خطأ أثناء الحفظ');
        } finally {
            setSubmitting(false);
        }
    };

    // Progress indicator
    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                        {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <ArrowRight className={`w-5 h-5 ${step > s ? 'text-emerald-600' : 'text-gray-300'}`} />}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Target className="w-10 h-10" />
                    <div>
                        <h1 className="text-2xl font-bold">بناء هدف SMART</h1>
                        <p className="text-white/80 text-sm mt-1">أهداف ذكية: محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، مؤطرة زمنياً</p>
                    </div>
                </div>
            </div>

            <StepIndicator />

            {/* Step 1: Domain Selection */}
            {step === 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                        اختر المجال التأهيلي
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {REHAB_DOMAINS.map(d => (
                            <button
                                key={d.value}
                                onClick={() => { setDomain(d.value); setStep(2); }}
                                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${domain === d.value
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300'
                                    }`}
                            >
                                <span className="text-3xl block mb-2">{d.icon}</span>
                                <span className="font-medium text-gray-700">{d.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Template or Custom */}
            {step === 2 && (
                <div className="space-y-6">
                    {/* Templates */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            اختر من مكتبة الأهداف أو أنشئ هدفاً جديداً
                        </h2>

                        {loading ? (
                            <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 mb-4">
                                {templates.map(temp => (
                                    <button
                                        key={temp.id}
                                        onClick={() => { applyTemplate(temp); setStep(3); }}
                                        className={`p-4 rounded-xl border-2 text-right transition-all ${selectedTemplate?.id === temp.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <p className="font-bold text-gray-800">{temp.goal_title}</p>
                                        <p className="text-sm text-gray-500 mt-1">{temp.goal_description}</p>
                                        {temp.typical_duration_weeks && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                                ~{temp.typical_duration_weeks} أسبوع
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setStep(3)}
                            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-all"
                        >
                            <span className="text-xl">+</span> إنشاء هدف مخصص
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Goal Details */}
            {step === 3 && (
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">تفاصيل الهدف</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">عنوان الهدف *</label>
                                <input
                                    type="text"
                                    value={goalTitle}
                                    onChange={e => setGoalTitle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="مثال: المشي باستقلالية لمسافة 50 متر"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-600 text-sm mb-1">وصف الهدف</label>
                                <textarea
                                    value={goalDescription}
                                    onChange={e => setGoalDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[80px] resize-none"
                                    placeholder="وصف تفصيلي للهدف وكيفية تحقيقه..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Measurement */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">القياس (M - Measurable)</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                            {MEASUREMENT_TYPES.map(m => (
                                <button
                                    key={m.value}
                                    onClick={() => setMeasurementType(m.value)}
                                    className={`p-3 rounded-xl border text-sm transition-all ${measurementType === m.value
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-gray-200 hover:border-emerald-300'
                                        }`}
                                >
                                    <p className="font-medium">{m.label}</p>
                                    <p className="text-xs text-gray-400">{m.example}</p>
                                </button>
                            ))}
                        </div>

                        {measurementType && measurementType !== 'milestone' && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">وحدة القياس</label>
                                    <input
                                        type="text"
                                        value={measurementUnit}
                                        onChange={e => setMeasurementUnit(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="متر، كلمة..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">القيمة الحالية</label>
                                    <input
                                        type="number"
                                        value={baselineValue}
                                        onChange={e => setBaselineValue(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">القيمة المستهدفة</label>
                                    <input
                                        type="number"
                                        value={targetValue}
                                        onChange={e => setTargetValue(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            الإطار الزمني (T - Time-bound)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">تاريخ البداية</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">تاريخ الإنجاز المستهدف *</label>
                                <input
                                    type="date"
                                    value={targetDate}
                                    onChange={e => setTargetDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assignment */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">المسؤولية</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                                    <User className="w-4 h-4" /> المسؤول
                                </label>
                                <input
                                    type="text"
                                    value={assignedTo}
                                    onChange={e => setAssignedTo(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none"
                                    placeholder="اسم الأخصائي/المعالج"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-1">بُعد جودة الحياة</label>
                                <select
                                    value={qolDimension}
                                    onChange={e => setQolDimension(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none bg-white"
                                >
                                    <option value="">-- اختر --</option>
                                    {QOL_DIMENSIONS.map(d => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-600 text-sm mb-1">مشاركة الأسرة</label>
                            <textarea
                                value={familyInvolvement}
                                onChange={e => setFamilyInvolvement(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none min-h-[60px] resize-none"
                                placeholder="كيف ستشارك الأسرة في تحقيق هذا الهدف؟"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3"
                    >
                        {submitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> جاري الحفظ...</>
                        ) : (
                            <><Save size={20} /> حفظ الهدف</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmartGoalBuilder;
