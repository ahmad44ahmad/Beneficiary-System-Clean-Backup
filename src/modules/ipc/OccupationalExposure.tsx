import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Syringe,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  FileText,
  Calendar,
  User,
  MapPin,
  Droplets,
  Heart,
  Search,
  Filter,
  Plus,
  Eye,
} from 'lucide-react';
import { supabase } from '../../config/supabase';

// --- Types ---

interface ExposureIncident {
  id: string;
  date: string;
  employee: string;
  type: string;
  risk: 'high' | 'moderate' | 'low';
  pep: 'started' | 'not_needed';
  status: 'monitoring' | 'cleared' | 'labs_pending' | 'reported';
}

interface FormData {
  employee_name: string;
  department: string;
  incident_date: string;
  incident_time: string;
  exposure_type: string;
  body_part: string;
  fluid_type: string;
  source_known: boolean;
  source_status: string;
  first_aid_steps: boolean[];
}

// --- Demo Data ---

const demoIncidents: ExposureIncident[] = [
  { id: 'EXP-2026-001', date: '2026-01-15', employee: 'أحمد محمد', type: 'وخز إبرة مجوفة', risk: 'high', pep: 'started', status: 'monitoring' },
  { id: 'EXP-2026-002', date: '2026-01-22', employee: 'فاطمة علي', type: 'تعرض للأغشية المخاطية', risk: 'moderate', pep: 'not_needed', status: 'cleared' },
  { id: 'EXP-2026-003', date: '2026-02-03', employee: 'خالد سعيد', type: 'وخز إبرة صلبة', risk: 'low', pep: 'not_needed', status: 'monitoring' },
  { id: 'EXP-2026-004', date: '2026-02-10', employee: 'نورة أحمد', type: 'عض', risk: 'moderate', pep: 'started', status: 'labs_pending' },
  { id: 'EXP-2026-005', date: '2026-02-18', employee: 'سلمان حسن', type: 'وخز إبرة مجوفة', risk: 'high', pep: 'started', status: 'reported' },
];

const EXPOSURE_TYPES = [
  'وخز إبرة مجوفة',
  'وخز إبرة صلبة',
  'تعرض للأغشية المخاطية',
  'تعرض لجلد متهتك',
  'عض',
  'أخرى',
];

const FLUID_TYPES = [
  'دم',
  'سائل دماغي شوكي',
  'سائل جنبي',
  'لعاب مخلوط بدم',
  'أخرى',
];

const DEPARTMENTS = [
  'تمريض',
  'مختبر',
  'صيدلية',
  'نظافة',
  'أشعة',
  'طوارئ',
];

const FIRST_AID_STEPS = [
  'غسل الموقع بالماء والصابون فوراً (لمدة 5 دقائق)',
  'عدم الضغط أو العصر على الجرح',
  'تطهير بمحلول مطهر (كلورهيكسيدين أو بوفيدون أيودين)',
  'شطف العينين بالماء (في حالة تعرض الأغشية المخاطية)',
  'إبلاغ المشرف المباشر',
  'التوجه لقسم الطوارئ خلال ساعة',
];

const SOURCE_STATUSES = [
  { value: 'positive', label: 'معروف إيجابي' },
  { value: 'negative', label: 'معروف سلبي' },
  { value: 'unknown', label: 'غير معروف' },
];

// --- Helper Functions ---

const getRiskLevel = (exposureType: string, sourceStatus: string): 'high' | 'moderate' | 'low' => {
  const highRiskTypes = ['وخز إبرة مجوفة', 'عض'];
  const moderateRiskTypes = ['تعرض للأغشية المخاطية', 'وخز إبرة صلبة'];

  if (highRiskTypes.includes(exposureType) && sourceStatus !== 'negative') return 'high';
  if (highRiskTypes.includes(exposureType) && sourceStatus === 'negative') return 'moderate';
  if (moderateRiskTypes.includes(exposureType) && sourceStatus === 'positive') return 'high';
  if (moderateRiskTypes.includes(exposureType)) return 'moderate';
  return 'low';
};

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case 'high':
      return { label: 'مرتفع', className: 'bg-red-100 text-red-700 border border-red-300' };
    case 'moderate':
      return { label: 'متوسط', className: 'bg-yellow-100 text-yellow-700 border border-yellow-300' };
    case 'low':
      return { label: 'منخفض', className: 'bg-green-100 text-green-700 border border-green-300' };
    default:
      return { label: '-', className: 'bg-gray-100 text-gray-600' };
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'monitoring':
      return { label: 'تحت المتابعة', className: 'bg-blue-100 text-blue-700 border border-blue-300', icon: Clock };
    case 'cleared':
      return { label: 'تم التعافي', className: 'bg-green-100 text-green-700 border border-green-300', icon: CheckCircle2 };
    case 'labs_pending':
      return { label: 'بانتظار الفحوصات', className: 'bg-orange-100 text-orange-700 border border-orange-300', icon: Activity };
    case 'reported':
      return { label: 'تم الإبلاغ', className: 'bg-purple-100 text-purple-700 border border-purple-300', icon: FileText };
    default:
      return { label: '-', className: 'bg-gray-100 text-gray-600', icon: Clock };
  }
};

const getPepLabel = (pep: string) => {
  switch (pep) {
    case 'started':
      return { label: 'تم البدء', className: 'text-teal-700 font-medium' };
    case 'not_needed':
      return { label: 'غير مطلوب', className: 'text-gray-500' };
    default:
      return { label: '-', className: 'text-gray-400' };
  }
};

// --- Component ---

export const OccupationalExposure: React.FC = () => {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'registry' | 'new_report'>('registry');

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    employee_name: '',
    department: '',
    incident_date: '',
    incident_time: '',
    exposure_type: '',
    body_part: '',
    fluid_type: '',
    source_known: false,
    source_status: '',
    first_aid_steps: new Array(6).fill(false),
  });

  // Search/filter state for registry
  const [searchQuery, setSearchQuery] = useState('');

  const totalSteps = 4;

  const filteredIncidents = demoIncidents.filter(
    (inc) =>
      inc.employee.includes(searchQuery) ||
      inc.id.includes(searchQuery) ||
      inc.type.includes(searchQuery)
  );

  const updateFormField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFirstAidStep = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.first_aid_steps];
      updated[index] = !updated[index];
      return { ...prev, first_aid_steps: updated };
    });
  };

  const calculatedRisk = getRiskLevel(
    formData.exposure_type,
    formData.source_known ? formData.source_status : 'unknown'
  );

  const pepRecommended =
    calculatedRisk === 'high' || (calculatedRisk === 'moderate' && formData.source_status === 'positive');

  const handleSubmit = async () => {
    // In production this would save to Supabase
    console.log('Submitting exposure report:', formData);
    alert('تم إرسال البلاغ بنجاح');
    setActiveTab('registry');
    setCurrentStep(1);
    setFormData({
      employee_name: '',
      department: '',
      incident_date: '',
      incident_time: '',
      exposure_type: '',
      body_part: '',
      fluid_type: '',
      source_known: false,
      source_status: '',
      first_aid_steps: new Array(6).fill(false),
    });
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  // --- Stats ---
  const stats = [
    {
      label: 'إجمالي الحوادث',
      value: demoIncidents.length,
      icon: Syringe,
      color: 'bg-[#14415A]',
      iconColor: 'text-white',
    },
    {
      label: 'حالات نشطة',
      value: demoIncidents.filter((i) => i.status === 'monitoring' || i.status === 'reported').length,
      icon: Activity,
      color: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      label: 'بانتظار الفحوصات',
      value: demoIncidents.filter((i) => i.status === 'labs_pending').length,
      icon: Clock,
      color: 'bg-orange-500',
      iconColor: 'text-white',
    },
    {
      label: 'تم التعافي',
      value: demoIncidents.filter((i) => i.status === 'cleared').length,
      icon: CheckCircle2,
      color: 'bg-[#1E6B5C]',
      iconColor: 'text-white',
    },
  ];

  // --- Step Indicator ---
  const stepLabels = [
    'معلومات الحادثة',
    'تفاصيل التعرض',
    'الإسعافات الأولية',
    'المتابعة',
  ];

  // --- Render Helpers ---

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepLabels.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        return (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#14415A] text-white shadow-lg'
                    : isComplete
                    ? 'bg-[#1E6B5C] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isComplete ? <CheckCircle2 size={18} /> : stepNum}
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isActive ? 'text-[#14415A] font-bold' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < stepLabels.length - 1 && (
              <div
                className={`flex-1 h-1 rounded-full mt-[-20px] min-w-[40px] ${
                  stepNum < currentStep ? 'bg-[#1E6B5C]' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#14415A] flex items-center gap-2">
        <User size={20} />
        معلومات الحادثة
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموظف</label>
          <input
            type="text"
            value={formData.employee_name}
            onChange={(e) => updateFormField('employee_name', e.target.value)}
            placeholder="أدخل اسم الموظف المتعرض"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
          <select
            value={formData.department}
            onChange={(e) => updateFormField('department', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition bg-white"
          >
            <option value="">اختر القسم</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الحادثة</label>
          <input
            type="date"
            value={formData.incident_date}
            onChange={(e) => updateFormField('incident_date', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وقت الحادثة</label>
          <input
            type="time"
            value={formData.incident_time}
            onChange={(e) => updateFormField('incident_time', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#14415A] flex items-center gap-2">
        <Droplets size={20} />
        تفاصيل التعرض
      </h3>

      {/* Exposure Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">نوع التعرض</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EXPOSURE_TYPES.map((et) => (
            <label
              key={et}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                formData.exposure_type === et
                  ? 'border-[#14415A] bg-[#14415A]/5 text-[#14415A] font-medium shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <input
                type="radio"
                name="exposure_type"
                value={et}
                checked={formData.exposure_type === et}
                onChange={(e) => updateFormField('exposure_type', e.target.value)}
                className="accent-[#14415A]"
              />
              {et}
            </label>
          ))}
        </div>
      </div>

      {/* Body Part */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">موقع التعرض (عضو الجسم)</label>
        <input
          type="text"
          value={formData.body_part}
          onChange={(e) => updateFormField('body_part', e.target.value)}
          placeholder="مثال: إصبع السبابة - اليد اليمنى"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition"
        />
      </div>

      {/* Fluid Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">نوع السائل</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FLUID_TYPES.map((ft) => (
            <label
              key={ft}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                formData.fluid_type === ft
                  ? 'border-[#1E6B5C] bg-[#1E6B5C]/5 text-[#1E6B5C] font-medium shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <input
                type="radio"
                name="fluid_type"
                value={ft}
                checked={formData.fluid_type === ft}
                onChange={(e) => updateFormField('fluid_type', e.target.value)}
                className="accent-[#1E6B5C]"
              />
              {ft}
            </label>
          ))}
        </div>
      </div>

      {/* Source Known Toggle */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">هل المصدر معروف؟</label>
          <button
            type="button"
            onClick={() => {
              updateFormField('source_known', !formData.source_known);
              if (formData.source_known) updateFormField('source_status', '');
            }}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              formData.source_known ? 'bg-[#1E6B5C]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                formData.source_known ? '-translate-x-6' : '-translate-x-1'
              }`}
            />
          </button>
        </div>

        {formData.source_known && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">حالة المصدر</label>
            <div className="flex flex-wrap gap-3">
              {SOURCE_STATUSES.map((ss) => (
                <label
                  key={ss.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                    formData.source_status === ss.value
                      ? 'border-[#14415A] bg-[#14415A]/5 text-[#14415A] font-medium'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="source_status"
                    value={ss.value}
                    checked={formData.source_status === ss.value}
                    onChange={(e) => updateFormField('source_status', e.target.value)}
                    className="accent-[#14415A]"
                  />
                  {ss.label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#14415A] flex items-center gap-2">
        <Heart size={20} />
        الإسعافات الأولية
      </h3>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-amber-800">
          يرجى التأكد من تنفيذ جميع خطوات الإسعافات الأولية التالية فور وقوع الحادثة.
          وضع علامة على الخطوات التي تم تنفيذها.
        </p>
      </div>

      <div className="space-y-3">
        {FIRST_AID_STEPS.map((step, idx) => (
          <label
            key={idx}
            className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
              formData.first_aid_steps[idx]
                ? 'border-[#1E6B5C] bg-[#1E6B5C]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.first_aid_steps[idx]}
              onChange={() => toggleFirstAidStep(idx)}
              className="mt-1 w-5 h-5 accent-[#1E6B5C] rounded shrink-0"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-[#14415A] ml-1">{idx + 1}.</span>
              <span className={`text-sm ${formData.first_aid_steps[idx] ? 'text-[#1E6B5C]' : 'text-gray-700'}`}>
                {step}
              </span>
            </div>
            {formData.first_aid_steps[idx] && (
              <CheckCircle2 size={18} className="text-[#1E6B5C] shrink-0 mt-0.5" />
            )}
          </label>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-center pt-2">
        تم تنفيذ {formData.first_aid_steps.filter(Boolean).length} من {FIRST_AID_STEPS.length} خطوات
      </div>
    </div>
  );

  const renderStep4 = () => {
    const risk = calculatedRisk;
    const riskBadge = getRiskBadge(risk);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#14415A] flex items-center gap-2">
          <Shield size={20} />
          المتابعة والتقييم
        </h3>

        {/* Risk Assessment */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h4 className="font-semibold text-[#14415A] text-sm">تقييم مستوى الخطورة</h4>
          <div className="flex items-center gap-4">
            <div
              className={`px-5 py-3 rounded-lg text-base font-bold ${riskBadge.className}`}
            >
              {riskBadge.label}
            </div>
            <p className="text-sm text-gray-600">
              {risk === 'high' && 'يتطلب بدء العلاج الوقائي فوراً والمتابعة الدورية المكثفة'}
              {risk === 'moderate' && 'يتطلب تقييم إضافي من الطبيب المختص وفحوصات مخبرية'}
              {risk === 'low' && 'متابعة روتينية مع فحوصات أساسية'}
            </p>
          </div>
        </div>

        {/* PEP Recommendation */}
        <div
          className={`rounded-xl p-5 border ${
            pepRecommended
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Shield
              size={24}
              className={pepRecommended ? 'text-red-600' : 'text-green-600'}
            />
            <div>
              <h4 className="font-semibold text-sm">
                العلاج الوقائي بعد التعرض (PEP)
              </h4>
              <p
                className={`text-base font-bold mt-1 ${
                  pepRecommended ? 'text-red-700' : 'text-green-700'
                }`}
              >
                {pepRecommended ? 'مُوصى به' : 'غير مطلوب'}
              </p>
            </div>
          </div>
        </div>

        {/* Follow-up Schedule */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h4 className="font-semibold text-[#14415A] text-sm flex items-center gap-2">
            <Calendar size={16} />
            جدول المتابعة
          </h4>
          <div className="space-y-3">
            {[
              {
                time: 'فوري',
                desc: 'فحوصات أساسية (HBV, HCV, HIV)',
                icon: AlertTriangle,
                color: 'text-red-600 bg-red-50 border-red-200',
              },
              {
                time: '6 أسابيع',
                desc: 'فحوصات متابعة',
                icon: Clock,
                color: 'text-orange-600 bg-orange-50 border-orange-200',
              },
              {
                time: '3 أشهر',
                desc: 'فحوصات متابعة',
                icon: Clock,
                color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
              },
              {
                time: '6 أشهر',
                desc: 'فحوصات نهائية',
                icon: CheckCircle2,
                color: 'text-green-600 bg-green-50 border-green-200',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-lg border ${item.color}`}
              >
                <item.icon size={18} className="shrink-0" />
                <div className="flex-1">
                  <span className="font-bold text-sm">{item.time}</span>
                  <span className="text-sm mr-2">— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-[#1E6B5C] hover:bg-[#185a4d] text-white font-bold rounded-xl text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <FileText size={18} />
          إرسال البلاغ
        </button>
      </div>
    );
  };

  // --- Main Render ---

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#14415A] to-[#1E6B5C] text-white px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/ipc')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Syringe size={22} />
                  إدارة التعرض المهني
                </h1>
                <p className="text-white/70 text-sm mt-0.5">
                  الإبلاغ والمتابعة لحوادث وخز الإبر والتعرض للدم
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('registry');
              setCurrentStep(1);
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'registry'
                ? 'bg-[#14415A] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FileText size={16} />
            السجل
          </button>
          <button
            onClick={() => setActiveTab('new_report')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'new_report'
                ? 'bg-[#14415A] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Plus size={16} />
            إبلاغ جديد
          </button>
        </div>

        {/* Registry Tab */}
        {activeTab === 'registry' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm"
                >
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#14415A]">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو رقم الحادثة أو نوع التعرض..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-[#14415A] focus:border-transparent outline-none transition"
                  />
                </div>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-500">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {/* Incidents Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">رقم الحادثة</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">التاريخ</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">الموظف</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">نوع التعرض</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">تقييم الخطورة</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">حالة PEP</th>
                      <th className="text-right px-4 py-3 font-semibold text-[#14415A]">الحالة</th>
                      <th className="text-center px-4 py-3 font-semibold text-[#14415A]">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((incident) => {
                      const riskBadge = getRiskBadge(incident.risk);
                      const statusBadge = getStatusBadge(incident.status);
                      const pepInfo = getPepLabel(incident.pep);
                      const StatusIcon = statusBadge.icon;

                      return (
                        <tr
                          key={incident.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-[#14415A] font-medium">
                            {incident.id}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{incident.date}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{incident.employee}</td>
                          <td className="px-4 py-3 text-gray-600">{incident.type}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${riskBadge.className}`}
                            >
                              {riskBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${pepInfo.className}`}>{pepInfo.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                            >
                              <StatusIcon size={12} />
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="p-1.5 text-[#14415A] hover:bg-[#14415A]/10 rounded-lg transition">
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredIncidents.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-gray-400">
                          لا توجد نتائج مطابقة للبحث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* New Report Tab */}
        {activeTab === 'new_report' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              {/* Step Indicator */}
              {renderStepIndicator()}

              {/* Step Content */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              {currentStep < totalSteps && (
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
                  <button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      currentStep === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#14415A] hover:bg-[#14415A]/5 border border-[#14415A]/20'
                    }`}
                  >
                    السابق
                  </button>

                  <span className="text-xs text-gray-400">
                    الخطوة {currentStep} من {totalSteps}
                  </span>

                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-[#14415A] hover:bg-[#0f3347] text-white rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2"
                  >
                    التالي
                  </button>
                </div>
              )}

              {currentStep === totalSteps && currentStep > 1 && (
                <div className="flex items-center justify-start mt-6 pt-5 border-t border-gray-100">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 text-[#14415A] hover:bg-[#14415A]/5 border border-[#14415A]/20"
                  >
                    السابق
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
