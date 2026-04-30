import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, ChevronLeft, ChevronRight, CheckCircle2,
  AlertTriangle, Play, RotateCcw, Hand, Eye
} from 'lucide-react';

// HRSD brand colors
const NAVY = '#0F3144';
const TEAL = '#269798';

interface PPEStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const donningSteps: PPEStep[] = [
  {
    title: 'نظافة الأيدي',
    description: 'اغسل الأيدي بالماء والصابون (40-60 ثانية) أو المعقم الكحولي (20-30 ثانية)',
    icon: <Hand className="w-6 h-6" />,
  },
  {
    title: 'العباءة الواقية',
    description: 'ارتدِ العباءة وتأكد من تغطية الملابس من الأمام والأكمام. اربط الأشرطة من الخلف',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'الكمامة/N95',
    description: 'ضع الكمامة الجراحية أو N95 حسب نوع العزل. تأكد من إحكام الأنف',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'واقي العينين',
    description: 'ضع النظارات الواقية أو الدرع الوجهي فوق الكمامة',
    icon: <Eye className="w-6 h-6" />,
  },
  {
    title: 'القفازات',
    description: 'ارتدِ القفازات فوق أكمام العباءة لتغطية المعصم',
    icon: <Hand className="w-6 h-6" />,
  },
  {
    title: 'الفحص الذاتي',
    description: 'تحقق من إحكام جميع المعدات وعدم وجود فجوات',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  {
    title: 'الدخول',
    description: 'ادخل غرفة المستفيد بحذر',
    icon: <Play className="w-6 h-6" />,
  },
];

const doffingSteps: PPEStep[] = [
  {
    title: 'القفازات',
    description: 'اخلع القفازات بتقنية التقشير (من الخارج للداخل). تجنب لمس الجلد',
    icon: <Hand className="w-6 h-6" />,
  },
  {
    title: 'نظافة الأيدي',
    description: 'اغسل أو عقم الأيدي فوراً',
    icon: <Hand className="w-6 h-6" />,
  },
  {
    title: 'العباءة',
    description: 'فك الأشرطة واسحب العباءة من الأكتاف. اطوها من الداخل للخارج',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'نظافة الأيدي',
    description: 'اغسل أو عقم الأيدي مرة أخرى',
    icon: <Hand className="w-6 h-6" />,
  },
  {
    title: 'واقي العينين',
    description: 'أزل الواقي بسحبه من الخلف (لا تلمس الجزء الأمامي)',
    icon: <Eye className="w-6 h-6" />,
  },
  {
    title: 'الكمامة',
    description: 'أزل الكمامة بسحب الأشرطة من الخلف. لا تلمس الجزء الأمامي',
    icon: <Shield className="w-6 h-6" />,
  },
  {
    title: 'نظافة الأيدي النهائية',
    description: 'اغسل الأيدي جيداً بالماء والصابون',
    icon: <Hand className="w-6 h-6" />,
  },
];

export const PPEProtocols: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'donning' | 'doffing'>('donning');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = activeTab === 'donning' ? donningSteps : doffingSteps;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleTabChange = (tab: 'donning' | 'doffing') => {
    setActiveTab(tab);
    setCurrentStep(0);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${NAVY}, ${TEAL})` }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/ipc')}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-white">
            <Shield className="w-6 h-6" />
            <h1 className="text-lg font-bold">
              بروتوكولات معدات الوقاية الشخصية (PPE)
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow p-1 flex gap-1">
          <button
            onClick={() => handleTabChange('donning')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'donning'
                ? 'text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            style={
              activeTab === 'donning'
                ? { backgroundColor: TEAL }
                : undefined
            }
          >
            ارتداء المعدات (Donning)
          </button>
          <button
            onClick={() => handleTabChange('doffing')}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'doffing'
                ? 'text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            style={
              activeTab === 'doffing'
                ? { backgroundColor: NAVY }
                : undefined
            }
          >
            خلع المعدات (Doffing)
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-700">
              الخطوة {currentStep + 1} من {steps.length}
            </h2>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة
            </button>
          </div>

          {/* Stepper Bar */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((_, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <React.Fragment key={index}>
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#2BB574] text-white scale-90'
                        : isCurrent
                        ? 'text-white scale-110 shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                    style={
                      isCurrent
                        ? {
                            backgroundColor:
                              activeTab === 'donning' ? TEAL : NAVY,
                          }
                        : undefined
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-shrink-0 h-0.5 w-6 rounded transition-colors duration-300 ${
                        index < currentStep ? 'bg-[#2BB574]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Step Card */}
          <div
            key={`${activeTab}-${currentStep}`}
            className="rounded-xl border-2 p-6 transition-all duration-300"
            style={{
              borderColor: activeTab === 'donning' ? TEAL : NAVY,
              opacity: 1,
              transform: 'scale(1)',
              animation: 'stepFadeIn 0.35s ease-out',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{
                  backgroundColor:
                    activeTab === 'donning' ? TEAL : NAVY,
                }}
              >
                {steps[currentStep].icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              السابق
            </button>

            <span className="text-xs text-gray-400">
              {currentStep + 1} / {steps.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm text-white transition-all ${
                currentStep === steps.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:opacity-90 shadow-md'
              }`}
              style={{
                backgroundColor:
                  activeTab === 'donning' ? TEAL : NAVY,
              }}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="space-y-3">
          <div className="bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#DC2626]/15 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#7F1D1D] mb-1">
                خلع المعدات هو الأكثر خطورة!
              </h4>
              <p className="text-xs text-[#DC2626] leading-relaxed">
                معظم حالات التلوث تحدث أثناء خلع المعدات بشكل خاطئ
              </p>
            </div>
          </div>

          <div className="bg-[#FCB614]/10 border border-[#FCB614]/30 rounded-xl p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-[#FCB614]/15 rounded-lg flex items-center justify-center">
              <Hand className="w-5 h-5 text-[#FCB614]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F3144] mb-1">
                نظافة الأيدي بين كل خطوة
              </h4>
              <p className="text-xs text-[#FCB614] leading-relaxed">
                يجب تعقيم الأيدي بين كل خطوة من خطوات الخلع
              </p>
            </div>
          </div>
        </div>

        {/* PPE by Isolation Type */}
        <div>
          <h2 className="text-base font-bold text-gray-700 mb-4">
            متطلبات PPE حسب نوع العزل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Contact */}
            <div className="bg-white rounded-xl shadow border-2 border-[#2BB574] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#2BB574]" />
                <h3 className="font-bold text-gray-800 text-sm">
                  تلامسي (Contact)
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                قفازات + عباءة
              </p>
            </div>

            {/* Droplet */}
            <div className="bg-white rounded-xl shadow border-2 border-[#DC2626] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
                <h3 className="font-bold text-gray-800 text-sm">
                  رذاذي (Droplet)
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                كمامة جراحية + واقي عيون + قفازات + عباءة
              </p>
            </div>

            {/* Airborne */}
            <div className="bg-white rounded-xl shadow border-2 border-[#269798] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#269798]" />
                <h3 className="font-bold text-gray-800 text-sm">
                  هوائي (Airborne)
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                N95 + واقي عيون + قفازات + عباءة + غرفة ضغط سلبي
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default PPEProtocols;
