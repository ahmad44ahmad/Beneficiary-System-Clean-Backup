import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ChevronLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DoorOpen,
  Wind,
  Droplets,
  Hand as HandIcon,
} from 'lucide-react';

// HRSD Brand Colors
const HRSD = {
  navy: '#0F3144',
  teal: '#269798',
};

interface IsolationType {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  hoverBgClass: string;
  badgeBgClass: string;
  icon: React.ReactNode;
  conditions: string[];
  ppe: string[];
  roomRequirements: string[];
  whenToInitiate: string;
  whenToDiscontinue: string;
  visitorInstructions: string[];
}

const isolationTypes: IsolationType[] = [
  {
    id: 'contact',
    title: 'العزل التلامسي',
    subtitle: 'Contact Isolation',
    color: '#22C55E',
    bgClass: 'bg-[#2BB574]/10',
    borderClass: 'border-[#2BB574]',
    textClass: 'text-[#2BB574]',
    hoverBgClass: 'hover:bg-[#2BB574]/15',
    badgeBgClass: 'bg-[#2BB574]/15 text-[#0F3144]',
    icon: <HandIcon className="w-8 h-8 text-[#2BB574]" />,
    conditions: [
      'MRSA',
      'VRE',
      'C. difficile',
      'الجرب',
      'القمل',
      'الجروح المصابة',
    ],
    ppe: ['قفازات', 'عباءة واقية'],
    roomRequirements: [
      'غرفة فردية مفضلة (ليست إلزامية)',
      'أجهزة مخصصة (سماعة، ميزان حرارة)',
      'لافتة خضراء على الباب',
      'ستارة فاصلة عند مشاركة الغرفة',
    ],
    whenToInitiate:
      'عند تأكيد أو اشتباه عدوى تنتقل بالتلامس المباشر أو غير المباشر',
    whenToDiscontinue:
      'بعد نتائج مزرعة سلبية (2 عينات متتالية بفاصل 24 ساعة)',
    visitorInstructions: [
      'لبس القفازات والعباءة قبل الدخول',
      'نظافة الأيدي عند الخروج',
    ],
  },
  {
    id: 'droplet',
    title: 'العزل الرذاذي',
    subtitle: 'Droplet Isolation',
    color: '#7A7A7A',
    bgClass: 'bg-[#DC2626]/10',
    borderClass: 'border-[#DC2626]',
    textClass: 'text-[#DC2626]',
    hoverBgClass: 'hover:bg-[#DC2626]/10',
    badgeBgClass: 'bg-[#DC2626]/10 text-[#7F1D1D]',
    icon: <Droplets className="w-8 h-8 text-[#DC2626]" />,
    conditions: [
      'الأنفلونزا',
      'السعال الديكي',
      'النكاف',
      'الحصبة الألمانية',
      'COVID-19 (خفيف)',
    ],
    ppe: ['كمامة جراحية', 'واقي العيون/درع وجهي', 'قفازات', 'عباءة'],
    roomRequirements: [
      'غرفة فردية إلزامية',
      'مسافة أمان 1-2 متر',
      'لافتة وردية على الباب',
      'باب مغلق دائما',
    ],
    whenToInitiate:
      'عند اشتباه أو تأكيد عدوى تنتقل عبر الرذاذ (قطرات > 5 ميكرون)',
    whenToDiscontinue:
      'بعد زوال الأعراض + فحص سلبي (حسب نوع المرض)',
    visitorInstructions: [
      'كمامة جراحية قبل الدخول',
      'الحفاظ على مسافة 1 متر',
    ],
  },
  {
    id: 'airborne',
    title: 'العزل الهوائي',
    subtitle: 'Airborne Isolation',
    color: '#269798',
    bgClass: 'bg-[#269798]/10',
    borderClass: 'border-[#269798]',
    textClass: 'text-[#269798]',
    hoverBgClass: 'hover:bg-[#269798]/15',
    badgeBgClass: 'bg-[#269798]/15 text-[#269798]',
    icon: <Wind className="w-8 h-8 text-[#269798]" />,
    conditions: [
      'السل الرئوي النشط',
      'الحصبة',
      'جدري الماء',
      'COVID-19 (شديد)',
      'الجمرة الخبيثة',
    ],
    ppe: [
      'كمامة N95 (يجب اختبار الملاءمة)',
      'واقي العيون',
      'قفازات',
      'عباءة',
      'غطاء الرأس',
    ],
    roomRequirements: [
      'غرفة ضغط سلبي (AIIR) إلزامية',
      '12 تبديل هواء/ساعة على الأقل',
      'باب مغلق دائما',
      'لافتة زرقاء على الباب',
      'فلتر HEPA',
    ],
    whenToInitiate:
      'عند اشتباه أو تأكيد عدوى تنتقل عبر الهواء (جزيئات < 5 ميكرون)',
    whenToDiscontinue:
      'السل: بعد 3 عينات بلغم سلبية. الحصبة/جدري الماء: بعد جفاف جميع الحويصلات',
    visitorInstructions: [
      'N95 إلزامي',
      'تدريب على لبس/خلع المعدات قبل الدخول',
    ],
  },
];

export const IsolationGuide: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" style={{ color: HRSD.teal }} />
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: HRSD.navy }}
            >
              دليل احتياطات العزل
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Isolation Precautions Guide
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/ipc')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: HRSD.navy }}
        >
          <span>العودة</span>
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Isolation Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isolationTypes.map((type) => {
          const isExpanded = expandedCard === type.id;

          return (
            <div
              key={type.id}
              className={`rounded-xl shadow-sm border-r-4 transition-all duration-300 cursor-pointer ${
                type.bgClass
              } ${type.borderClass} ${
                isExpanded ? 'shadow-lg md:col-span-3' : 'hover:shadow-md'
              }`}
              onClick={() => toggleCard(type.id)}
            >
              {/* Card Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    {type.icon}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${type.textClass}`}>
                      {type.title}
                    </h2>
                    <p className="text-sm text-gray-500">{type.subtitle}</p>
                  </div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <ChevronLeft
                    className="w-5 h-5"
                    style={{ color: type.color }}
                  />
                </div>
              </div>

              {/* Conditions Preview (always visible) */}
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {type.conditions.map((condition, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-3 py-1 rounded-full font-medium ${type.badgeBgClass}`}
                  >
                    {condition}
                  </span>
                ))}
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className="border-t px-5 py-6 space-y-6"
                  style={{ borderColor: `${type.color}40` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PPE Required */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield
                          className="w-5 h-5"
                          style={{ color: type.color }}
                        />
                        <h3
                          className="font-bold text-base"
                          style={{ color: HRSD.navy }}
                        >
                          معدات الحماية الشخصية المطلوبة
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {type.ppe.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: type.color }}
                            />
                            <span className="text-sm text-gray-700">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Room Requirements */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <DoorOpen
                          className="w-5 h-5"
                          style={{ color: type.color }}
                        />
                        <h3
                          className="font-bold text-base"
                          style={{ color: HRSD.navy }}
                        >
                          متطلبات الغرفة
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {type.roomRequirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2
                              className="w-4 h-4 flex-shrink-0"
                              style={{ color: type.color }}
                            />
                            <span className="text-sm text-gray-700">
                              {req}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* When to Initiate */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle
                          className="w-5 h-5"
                          style={{ color: type.color }}
                        />
                        <h3
                          className="font-bold text-base"
                          style={{ color: HRSD.navy }}
                        >
                          متى يبدأ العزل؟
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {type.whenToInitiate}
                      </p>
                    </div>

                    {/* When to Discontinue */}
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <XCircle
                          className="w-5 h-5"
                          style={{ color: type.color }}
                        />
                        <h3
                          className="font-bold text-base"
                          style={{ color: HRSD.navy }}
                        >
                          متى ينتهي العزل؟
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {type.whenToDiscontinue}
                      </p>
                    </div>
                  </div>

                  {/* Visitor Instructions */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <HandIcon
                        className="w-5 h-5"
                        style={{ color: type.color }}
                      />
                      <h3
                        className="font-bold text-base"
                        style={{ color: HRSD.navy }}
                      >
                        تعليمات الزوار
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {type.visitorInstructions.map((instruction, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${type.bgClass}`}
                        >
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0"
                            style={{ color: type.color }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {instruction}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Reference Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div
          className="px-6 py-4 border-b border-gray-200"
          style={{ backgroundColor: HRSD.navy }}
        >
          <h2 className="text-lg font-bold text-white">
            جدول المقارنة السريع
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            مقارنة بين أنواع العزل الثلاثة
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-right font-bold text-gray-700">
                  المعيار
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[#2BB574] font-bold">
                    <HandIcon className="w-4 h-4" />
                    تلامسي
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[#DC2626] font-bold">
                    <Droplets className="w-4 h-4" />
                    رذاذي
                  </span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[#269798] font-bold">
                    <Wind className="w-4 h-4" />
                    هوائي
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">
                  الكمامة
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-gray-400">غير مطلوبة</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[#DC2626] font-medium">جراحية</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[#269798] font-bold">N95</span>
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">
                  الغرفة
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[#2BB574]">مفضلة فردية</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[#DC2626] font-medium">
                    فردية إلزامية
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-[#269798] font-bold">
                    ضغط سلبي إلزامي
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">
                  القفازات
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB574] mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#DC2626] mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#269798] mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">
                  العباءة
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#2BB574] mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#DC2626] mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#269798] mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-700">
                  واقي العيون
                </td>
                <td className="px-4 py-3 text-center">
                  <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#DC2626] mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <CheckCircle2 className="w-5 h-5 text-[#269798] mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">
                  مستوى الخطورة
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2BB574]/15 text-[#2BB574]">
                    متوسط
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DC2626]/10 text-[#DC2626]">
                    عالي
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#269798]/15 text-[#269798]">
                    عالي جدا
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-700">
                  طريقة الانتقال
                </td>
                <td className="px-4 py-3 text-center text-[#2BB574] text-xs">
                  لمس مباشر/غير مباشر
                </td>
                <td className="px-4 py-3 text-center text-[#DC2626] text-xs">
                  قطرات {'>'} 5 ميكرون
                </td>
                <td className="px-4 py-3 text-center text-[#269798] text-xs">
                  جزيئات {'<'} 5 ميكرون
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Note */}
      <div
        className="rounded-xl p-5 flex items-start gap-4 border border-[#FCB614]"
        style={{ backgroundColor: '#FFF7ED' }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#FCB614]/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-[#FCB614]" />
        </div>
        <div>
          <h3 className="font-bold text-[#0F3144] text-base mb-1">
            ملاحظة مهمة - حالة عدم التأكد
          </h3>
          <p className="text-sm text-[#0F3144] leading-relaxed">
            في حالة عدم معرفة نوع العدوى، طبّق الاحتياطات الهوائية (الأعلى
            حماية) حتى تحديد النوع
          </p>
        </div>
      </div>
    </div>
  );
};
