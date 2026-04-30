import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle, ChevronLeft, Save, Loader2,
    User, MapPin, Calendar, FileText,
    Thermometer, Shield, AlertCircle,
    Search, ChevronUp, ChevronDown
} from 'lucide-react';
import { ipcService, Location, IPCIncident } from '../../services/ipcService';

// Incident Categories
const INCIDENT_CATEGORIES = [
    { value: 'infection_confirmed', label: 'عدوى مؤكدة', icon: '🦠', color: 'red' },
    { value: 'infection_suspected', label: 'اشتباه عدوى', icon: '🔍', color: 'yellow' },
    { value: 'needle_stick', label: 'وخز إبرة (NSI)', icon: '💉', color: 'orange' },
    { value: 'blood_exposure', label: 'تعرض للدم/سوائل', icon: '🩸', color: 'red' },
    { value: 'outbreak_alert', label: 'تنبيه تفشي', icon: '⚠️', color: 'red' },
    { value: 'colonization', label: 'استعمار ميكروبي', icon: '🧫', color: 'blue' },
];

const SEVERITY_LEVELS = [
    { value: 'mild', label: 'خفيف', color: 'bg-[#2BB574]/15 text-[#2BB574] border-[#2BB574]' },
    { value: 'moderate', label: 'متوسط', color: 'bg-[#FCB614]/10 text-[#FCB614] border-[#FCB614]' },
    { value: 'severe', label: 'شديد', color: 'bg-[#F7941D]/15 text-[#F7941D] border-[#F7941D]' },
    { value: 'critical', label: 'حرج', color: 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]' },
];

const AFFECTED_TYPES = [
    { value: 'beneficiary', label: 'مستفيد', icon: '👤' },
    { value: 'staff', label: 'موظف', icon: '👨‍⚕️' },
    { value: 'visitor', label: 'زائر', icon: '🚶' },
];

const INFECTION_SITES = [
    'تنفسي', 'بولي', 'جلدي', 'دم', 'جهاز هضمي', 'عين', 'أذن', 'جرح', 'أخرى'
];

const COMMON_SYMPTOMS = [
    'حمى', 'سعال', 'إسهال', 'قيء', 'صداع', 'طفح جلدي',
    'ألم بطن', 'ضيق تنفس', 'التهاب حلق', 'احمرار', 'تورم', 'إفرازات'
];

const IMMEDIATE_ACTIONS = [
    'عزل المصاب', 'إبلاغ الطبيب', 'أخذ عينات مخبرية',
    'تطهير المنطقة', 'إبلاغ مشرف القسم', 'توثيق الحادثة',
    'فحص المخالطين', 'تعزيز الاحتياطات'
];

const RCA_CATEGORIES = [
    { value: 'human', label: 'عامل بشري', icon: '👤', examples: ['نقص التدريب', 'عدم اتباع البروتوكول', 'إرهاق الموظف'] },
    { value: 'process', label: 'خلل في العملية', icon: '⚙️', examples: ['عدم وجود SOP', 'إجراء غير واضح', 'تأخر الاستجابة'] },
    { value: 'equipment', label: 'معدات/أدوات', icon: '🔧', examples: ['عطل في المعدات', 'نقص المستلزمات', 'أدوات غير مناسبة'] },
    { value: 'environment', label: 'بيئة العمل', icon: '🏥', examples: ['تلوث المنطقة', 'إضاءة ضعيفة', 'ازدحام'] },
    { value: 'communication', label: 'تواصل', icon: '💬', examples: ['سوء التواصل', 'عدم التسليم', 'توثيق ناقص'] },
    { value: 'system', label: 'نظام/سياسة', icon: '📋', examples: ['غياب الرقابة', 'سياسة قديمة', 'نقص الموارد'] },
];

export const IncidentReportForm: React.FC = () => {
    const navigate = useNavigate();

    // Form State
    const [category, setCategory] = useState<string>('');
    const [affectedType, setAffectedType] = useState<string>('');
    const [affectedName, setAffectedName] = useState('');
    const [reporterName, setReporterName] = useState('');
    const [locationId, setLocationId] = useState('');
    const [infectionSite, setInfectionSite] = useState('');
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [severityLevel, setSeverityLevel] = useState<string>('mild');
    const [onsetDate, setOnsetDate] = useState('');
    const [immediateActions, setImmediateActions] = useState<string[]>([]);
    const [isolationRequired, setIsolationRequired] = useState(false);
    const [notes, setNotes] = useState('');
    const [showRCA, setShowRCA] = useState(false);
    const [rcaCategory, setRcaCategory] = useState<string>('');
    const [rcaWhyChain, setRcaWhyChain] = useState<string[]>(['', '', '', '', '']);
    const [rcaRootCause, setRcaRootCause] = useState('');
    const [rcaCorrectiveAction, setRcaCorrectiveAction] = useState('');
    const [rcaPreventiveAction, setRcaPreventiveAction] = useState('');

    // UI State
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchLocations = async () => {
            const locs = await ipcService.getLocations();
            setLocations(locs);
            setLoading(false);
        };
        fetchLocations();
    }, []);

    const toggleSymptom = (symptom: string) => {
        setSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const toggleAction = (action: string) => {
        setImmediateActions(prev =>
            prev.includes(action)
                ? prev.filter(a => a !== action)
                : [...prev, action]
        );
    };

    const handleSubmit = async () => {
        // Validation
        if (!category) { alert('الرجاء اختيار نوع الحادثة'); return; }
        if (!affectedType) { alert('الرجاء تحديد الشخص المتأثر'); return; }
        if (!reporterName.trim()) { alert('الرجاء إدخال اسم المُبلِّغ'); return; }

        setSubmitting(true);
        try {
            const result = await ipcService.saveIncident({
                incident_category: category,
                affected_type: affectedType as 'beneficiary' | 'staff' | 'visitor',
                reported_by: reporterName,
                location_id: locationId || undefined,
                infection_site: infectionSite || undefined,
                symptoms: symptoms,
                severity_level: severityLevel as 'mild' | 'moderate' | 'severe' | 'critical',
                onset_date: onsetDate || undefined,
                immediate_actions: immediateActions,
                isolation_required: isolationRequired,
                investigation_notes: notes || undefined,
                status: 'open',
                detection_date: new Date().toISOString().split('T')[0],
                rca_category: rcaCategory || undefined,
                rca_why_chain: rcaWhyChain.filter(w => w.trim()) || undefined,
                rca_root_cause: rcaRootCause || undefined,
                rca_corrective_action: rcaCorrectiveAction || undefined,
                rca_preventive_action: rcaPreventiveAction || undefined,
            } as Partial<IPCIncident>);

            if (result.success) {
                alert('✅ تم تسجيل الحادثة بنجاح - رقم المرجع: ' + result.id);
                navigate('/ipc');
            } else {
                alert('❌ حدث خطأ أثناء التسجيل');
            }
        } catch (err) {
            console.error(err);
            alert('❌ حدث خطأ أثناء التسجيل');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#DC2626]" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-[#DC2626] via-[#DC2626] to-[#7F1D1D] rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/ipc')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <AlertTriangle className="w-10 h-10" />
                    <div>
                        <h1 className="text-2xl font-bold">الإبلاغ عن حادثة عدوى</h1>
                        <p className="text-white/80 text-sm mt-1">نموذج تسجيل وتوثيق حوادث مكافحة العدوى</p>
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#DC2626]" />
                    نوع الحادثة <span className="text-[#DC2626]">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INCIDENT_CATEGORIES.map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`p-4 rounded-xl border-2 transition-all text-right ${category === cat.value
                                    ? 'border-[#DC2626] bg-[#DC2626]/10 ring-2 ring-[#DC2626]/20'
                                    : 'border-gray-200 hover:border-[#DC2626] hover:bg-[#DC2626]/10'
                                }`}
                        >
                            <span className="text-2xl block mb-1">{cat.icon}</span>
                            <span className="font-medium text-gray-700">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Affected Person */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#269798]" />
                    الشخص المتأثر <span className="text-[#DC2626]">*</span>
                </label>
                <div className="flex gap-3 mb-4">
                    {AFFECTED_TYPES.map(type => (
                        <button
                            key={type.value}
                            onClick={() => setAffectedType(type.value)}
                            className={`flex-1 p-3 rounded-xl border-2 transition-all ${affectedType === type.value
                                    ? 'border-[#269798] bg-[#269798]/10'
                                    : 'border-gray-200 hover:border-[#269798]'
                                }`}
                        >
                            <span className="text-xl ml-2">{type.icon}</span>
                            <span className="font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
                {affectedType && (
                    <input
                        type="text"
                        value={affectedName}
                        onChange={e => setAffectedName(e.target.value)}
                        placeholder={`اسم ${AFFECTED_TYPES.find(t => t.value === affectedType)?.label}`}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#269798] outline-none"
                    />
                )}
            </div>

            {/* Location & Reporter */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#2BB574]" />
                            الموقع
                        </label>
                        <select
                            value={locationId}
                            onChange={e => setLocationId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2BB574] outline-none bg-white"
                        >
                            <option value="">-- اختر الموقع --</option>
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id}>
                                    {loc.is_high_risk && '⚠️ '}{loc.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#FCB614]" />
                            اسم المُبلِّغ <span className="text-[#DC2626]">*</span>
                        </label>
                        <input
                            type="text"
                            value={reporterName}
                            onChange={e => setReporterName(e.target.value)}
                            placeholder="اسمك"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FCB614] outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Clinical Details */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-[#F7941D]" />
                    البيانات السريرية
                </label>

                {/* Infection Site */}
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-2">موقع العدوى</label>
                    <div className="flex flex-wrap gap-2">
                        {INFECTION_SITES.map(site => (
                            <button
                                key={site}
                                onClick={() => setInfectionSite(site)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${infectionSite === site
                                        ? 'bg-[#F7941D] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-[#F7941D]/15'
                                    }`}
                            >
                                {site}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Symptoms */}
                <div className="mb-4">
                    <label className="block text-gray-600 text-sm mb-2">الأعراض (اختر ما ينطبق)</label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_SYMPTOMS.map(symptom => (
                            <button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${symptoms.includes(symptom)
                                        ? 'bg-[#DC2626] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-[#DC2626]/15'
                                    }`}
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Onset Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-2 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            تاريخ بداية الأعراض
                        </label>
                        <input
                            type="date"
                            value={onsetDate}
                            onChange={e => setOnsetDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F7941D] outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">مستوى الشدة</label>
                        <div className="flex gap-2">
                            {SEVERITY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => setSeverityLevel(level.value)}
                                    className={`flex-1 py-2 px-2 rounded-xl text-sm font-medium border transition-all ${severityLevel === level.value
                                            ? level.color + ' ring-2 ring-offset-1'
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                        }`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Immediate Actions */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2BB574]" />
                    الإجراءات الفورية المتخذة
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                    {IMMEDIATE_ACTIONS.map(action => (
                        <button
                            key={action}
                            onClick={() => toggleAction(action)}
                            className={`px-3 py-2 rounded-xl text-sm transition-all border ${immediateActions.includes(action)
                                    ? 'bg-[#2BB574] text-white border-[#2BB574]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#2BB574]'
                                }`}
                        >
                            {action}
                        </button>
                    ))}
                </div>

                {/* Isolation Required */}
                <label className="flex items-center gap-3 p-3 bg-[#FCB614]/10 rounded-xl cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isolationRequired}
                        onChange={e => setIsolationRequired(e.target.checked)}
                        className="w-5 h-5 rounded text-[#FCB614] focus:ring-[#FCB614]"
                    />
                    <span className="font-medium text-[#FCB614]">يتطلب عزل فوري</span>
                </label>
            </div>

            {/* Root Cause Analysis (RCA) Section */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <button
                    type="button"
                    onClick={() => setShowRCA(!showRCA)}
                    className="w-full flex items-center justify-between"
                >
                    <label className="block text-gray-700 font-bold flex items-center gap-2 cursor-pointer">
                        <Search className="w-5 h-5 text-[#FCB614]" />
                        تحليل السبب الجذري (RCA)
                        <span className="text-xs font-normal text-gray-400 mr-2">- اختياري</span>
                    </label>
                    {showRCA ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {showRCA && (
                    <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                        {/* RCA Category */}
                        <div>
                            <label className="block text-gray-600 text-sm mb-2">تصنيف السبب الجذري</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {RCA_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setRcaCategory(cat.value)}
                                        className={`p-3 rounded-xl border-2 transition-all text-right ${
                                            rcaCategory === cat.value
                                                ? 'border-[#FCB614] bg-[#FCB614]/10 ring-2 ring-[#FCB614]/20'
                                                : 'border-gray-200 hover:border-[#FCB614] hover:bg-[#FCB614]/10'
                                        }`}
                                    >
                                        <span className="text-xl block mb-1">{cat.icon}</span>
                                        <span className="font-medium text-gray-700 text-sm block">{cat.label}</span>
                                        <div className="text-[10px] text-gray-400 mt-1">
                                            {cat.examples.join(' · ')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5 Whys Analysis */}
                        <div>
                            <label className="block text-gray-600 text-sm mb-2 flex items-center gap-1">
                                🔍 تحليل الأسباب (5 لماذا)
                            </label>
                            <div className="bg-[#FCB614]/10/50 rounded-xl p-4 border border-[#FCB614]/10 space-y-3">
                                {rcaWhyChain.map((why, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#FCB614] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={why}
                                            onChange={e => {
                                                const updated = [...rcaWhyChain];
                                                updated[idx] = e.target.value;
                                                setRcaWhyChain(updated);
                                            }}
                                            placeholder={idx === 0 ? 'لماذا حدثت المشكلة؟' : `لماذا؟ (المستوى ${idx + 1})`}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FCB614] outline-none text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Root Cause Summary */}
                        <div>
                            <label className="block text-gray-600 text-sm mb-2">ملخص السبب الجذري</label>
                            <textarea
                                value={rcaRootCause}
                                onChange={e => setRcaRootCause(e.target.value)}
                                placeholder="ما هو السبب الجذري النهائي المحدد؟"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FCB614] outline-none min-h-[70px] resize-none text-sm"
                            />
                        </div>

                        {/* Corrective & Preventive Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-sm mb-2 flex items-center gap-1">
                                    ✅ الإجراء التصحيحي
                                </label>
                                <textarea
                                    value={rcaCorrectiveAction}
                                    onChange={e => setRcaCorrectiveAction(e.target.value)}
                                    placeholder="ما الإجراء لمعالجة السبب الحالي؟"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2BB574] outline-none min-h-[70px] resize-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-sm mb-2 flex items-center gap-1">
                                    🛡️ الإجراء الوقائي
                                </label>
                                <textarea
                                    value={rcaPreventiveAction}
                                    onChange={e => setRcaPreventiveAction(e.target.value)}
                                    placeholder="ما الإجراء لمنع التكرار مستقبلاً؟"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#269798] outline-none min-h-[70px] resize-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <label className="block text-gray-700 font-bold mb-2">ملاحظات إضافية</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="أي تفاصيل إضافية عن الحادثة..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none min-h-[100px] resize-none"
                />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-[#DC2626] hover:bg-[#DC2626] disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 sticky bottom-4"
            >
                {submitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري التسجيل...</span>
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        <span>تسجيل الحادثة</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default IncidentReportForm;
