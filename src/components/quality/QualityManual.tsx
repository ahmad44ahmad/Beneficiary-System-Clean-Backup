// ═══════════════════════════════════════════════════════════════════════════════
// 🍒 دليل الجودة الشامل - Quality Manual Pro
// الدليل التفاعلي لنظام إدارة الجودة ISO 9001:2015
// مركز التأهيل الشامل بالباحة
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book, FileText, Target, Users, Settings, TrendingUp,
  ChevronRight, ChevronDown, Search, Download, Printer,
  CheckCircle, AlertCircle, Info, Building2, Shield,
  Award, Compass, Heart, Zap, Eye, Clock, Calendar,
  BarChart3, PieChart, Layers, GitBranch, ArrowRight,
  Globe, Lock, Sparkles, BookOpen, GraduationCap
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 بيانات الدليل
// ═══════════════════════════════════════════════════════════════════════════════

interface ManualSection {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  status: 'complete' | 'partial' | 'pending';
  lastUpdated?: string;
  subsections?: {
    id: string;
    number: string;
    title: string;
    content: string[];
    documents?: string[];
  }[];
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'intro',
    number: '0',
    title: 'مقدمة الدليل',
    titleEn: 'Introduction',
    icon: BookOpen,
    color: 'text-teal-400',
    gradient: 'from-teal-500 to-emerald-600',
    status: 'complete',
    lastUpdated: '01 ديسمبر 2025',
    subsections: [
      {
        id: 'intro-1',
        number: '0.1',
        title: 'نطاق الدليل والغرض منه',
        content: [
          'هذا الدليل هو المرجع الرئيسي لنظام إدارة الجودة في مركز التأهيل الشامل بمنطقة الباحة',
          'يحدد السياسات والإجراءات والمسؤوليات لضمان جودة الخدمات المقدمة للمستفيدين',
          'يتوافق مع متطلبات ISO 9001:2015 والمعايير الوطنية لوزارة الموارد البشرية والتنمية الاجتماعية',
        ],
        documents: ['POL-QMS-001', 'DOC-SCOPE-001'],
      },
      {
        id: 'intro-2',
        number: '0.2',
        title: 'التعريفات والمصطلحات',
        content: [
          'المستفيد: الشخص ذو الإعاقة المستفيد من خدمات المركز',
          'نظام إدارة الجودة (QMS): الهيكل التنظيمي والعمليات والموارد اللازمة لتحقيق الجودة',
          'الخيط الذهبي: الترابط بين الأهداف الاستراتيجية والعمليات والمخرجات',
        ],
      },
    ],
  },
  {
    id: 'context',
    number: '4',
    title: 'سياق المنظمة',
    titleEn: 'Context of the Organization',
    icon: Building2,
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-cyan-600',
    status: 'complete',
    lastUpdated: '15 ديسمبر 2025',
    subsections: [
      {
        id: 'context-1',
        number: '4.1',
        title: 'فهم المنظمة وسياقها',
        content: [
          'السياق الجغرافي: يقع المركز في منطقة الباحة ذات الطبيعة الجبلية الوعرة',
          'السياق البشري: خدمة 62 مستفيداً من ذوي الإعاقات الشديدة والمتعددة',
          'السياق التشغيلي: إدارة 127 عملية متداخلة بين قطاعات طبية واجتماعية وتأهيلية',
          'التحديات: المخاطر البيئية (سيول، ضباب)، نقص الكوادر، بُعد الموقع عن المدن الرئيسية',
        ],
        documents: ['DOC-CONTEXT-001', 'SWOT Analysis'],
      },
      {
        id: 'context-2',
        number: '4.2',
        title: 'احتياجات وتوقعات الأطراف المعنية',
        content: [
          'المستفيدون وأسرهم: رعاية كريمة، أمان، برامج تأهيلية فعالة',
          'وزارة الموارد البشرية: الامتثال للوائح، تحقيق مستهدفات رؤية 2030',
          'الموظفون: بيئة عمل آمنة، تطوير مهني، رواتب منتظمة',
          'المجتمع: دمج المستفيدين، شراكات فعالة، مسؤولية اجتماعية',
        ],
        documents: ['Stakeholder Matrix', 'DOC-PARTIES-001'],
      },
      {
        id: 'context-3',
        number: '4.3',
        title: 'نطاق نظام إدارة الجودة',
        content: [
          'يشمل النطاق جميع خدمات الرعاية والتأهيل المقدمة للمستفيدين من ذوي الإعاقة',
          'يغطي الأقسام: الإيواء، التمريض، التأهيل، الخدمات الاجتماعية، الدعم النفسي',
          'المستثنى: خدمات الإسعاف الخارجي (تُقدم عبر شركاء)',
        ],
        documents: ['DOC-SCOPE-002'],
      },
      {
        id: 'context-4',
        number: '4.4',
        title: 'نظام إدارة الجودة وعملياته',
        content: [
          'تم تحديد 127 عملية تشغيلية مصنفة إلى: عمليات أساسية، عمليات داعمة، عمليات إدارية',
          'لكل عملية: مدخلات، مخرجات، مؤشرات أداء، مالك العملية',
          'يتم مراجعة العمليات ربع سنوياً لضمان الفاعلية والكفاءة',
        ],
        documents: ['Process Map', 'DOC-PROC-001'],
      },
    ],
  },
  {
    id: 'leadership',
    number: '5',
    title: 'القيادة',
    titleEn: 'Leadership',
    icon: Award,
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
    status: 'partial',
    lastUpdated: '20 ديسمبر 2025',
    subsections: [
      {
        id: 'leadership-1',
        number: '5.1',
        title: 'القيادة والالتزام',
        content: [
          'الإدارة العليا ملتزمة بتطوير وتنفيذ نظام إدارة الجودة والتحسين المستمر',
          'يتم تخصيص الموارد اللازمة لتحقيق أهداف الجودة',
          'مراجعة الإدارة تُعقد ربع سنوياً لتقييم فاعلية النظام',
          '⚠️ فجوة: انقطاع التواصل الاستراتيجي مع الوزارة (NCR-003)',
        ],
        documents: ['Management Review Minutes', 'DOC-LEAD-001'],
      },
      {
        id: 'leadership-2',
        number: '5.2',
        title: 'السياسة',
        content: [
          'سياسة الجودة: "نلتزم بتقديم خدمات رعاية وتأهيل متميزة للمستفيدين من ذوي الإعاقة، مع الحفاظ على كرامتهم وتمكينهم من المشاركة الفاعلة في المجتمع"',
          'السياسة معلنة ومتاحة لجميع الأطراف المعنية',
          'تتم مراجعة السياسة سنوياً لضمان ملاءمتها',
        ],
        documents: ['POL-QMS-001', 'Quality Policy Statement'],
      },
      {
        id: 'leadership-3',
        number: '5.3',
        title: 'الأدوار والمسؤوليات والصلاحيات',
        content: [
          'ممثل الإدارة للجودة: أحمد الشهري (مدير الجودة)',
          'الصلاحيات: الإشراف على نظام الجودة، التدقيق الداخلي، رفع التقارير',
          'جميع الأقسام لديها مسؤوليات محددة ضمن نظام الجودة',
        ],
        documents: ['Organizational Chart', 'RACI Matrix'],
      },
    ],
  },
  {
    id: 'planning',
    number: '6',
    title: 'التخطيط',
    titleEn: 'Planning',
    icon: Target,
    color: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-600',
    status: 'complete',
    lastUpdated: '25 ديسمبر 2025',
    subsections: [
      {
        id: 'planning-1',
        number: '6.1',
        title: 'الإجراءات لمعالجة المخاطر والفرص',
        content: [
          'تم إنشاء سجل مخاطر شامل يضم 12 خطراً رئيسياً مصنفاً حسب الشدة',
          'منهجية التقييم: مصفوفة 5×5 (الاحتمالية × التأثير)',
          'المخاطر الحرجة (≥15): 4 مخاطر تتطلب تدخلاً فورياً',
          'يتم مراجعة سجل المخاطر ربع سنوياً وتحديثه عند الحاجة',
        ],
        documents: ['Risk Register', 'DOC-RISK-001'],
      },
      {
        id: 'planning-2',
        number: '6.2',
        title: 'أهداف الجودة والتخطيط لتحقيقها',
        content: [
          'معدل العدوى المكتسبة: < 2% (المستهدف الشهري)',
          'معدل الأخطاء الدوائية: < 0.5% (المستهدف الشهري)',
          'زمن الإخلاء الطارئ: < 5 دقائق (المستهدف الربع سنوي)',
          'نسبة جاهزية أنظمة الحريق: 100% (المستهدف الأسبوعي)',
          'حوادث التنمر/العزل: صفر (المستهدف الشهري)',
        ],
        documents: ['KPI Dashboard', 'DOC-OBJ-001'],
      },
      {
        id: 'planning-3',
        number: '6.3',
        title: 'تخطيط التغييرات',
        content: [
          'أي تغيير في نظام الجودة يخضع لإجراء إدارة التغيير',
          'يتم تقييم أثر التغيير قبل التنفيذ',
          'التغييرات الجوهرية تتطلب موافقة مراجعة الإدارة',
        ],
        documents: ['Change Management Procedure', 'DOC-CHG-001'],
      },
    ],
  },
  {
    id: 'support',
    number: '7',
    title: 'الدعم',
    titleEn: 'Support',
    icon: Settings,
    color: 'text-red-400',
    gradient: 'from-red-500 to-rose-600',
    status: 'partial',
    lastUpdated: '28 ديسمبر 2025',
    subsections: [
      {
        id: 'support-1',
        number: '7.1',
        title: 'الموارد',
        content: [
          '7.1.1 الموارد البشرية: كادر من 45 موظفاً موزعين على الأقسام',
          '7.1.2 البنية التحتية: مبنى رئيسي + مرافق مساندة',
          '⚠️ فجوة: غياب نظام الإطفاء الآلي (NCR-001)',
          '7.1.3 بيئة تشغيل العمليات: تكييف مركزي، أنظمة أمان، مولدات احتياطية',
        ],
        documents: ['Infrastructure Assessment', 'DOC-RES-001'],
      },
      {
        id: 'support-2',
        number: '7.2',
        title: 'الكفاءة',
        content: [
          'تحديد متطلبات الكفاءة لكل وظيفة في الهيكل التنظيمي',
          'خطة تدريب سنوية تشمل: السلامة، مكافحة العدوى، التعامل مع الأزمات',
          'تقييم فاعلية التدريب من خلال الاختبارات والملاحظة الميدانية',
        ],
        documents: ['Training Plan', 'Competency Matrix'],
      },
      {
        id: 'support-3',
        number: '7.3',
        title: 'الوعي',
        content: [
          'جميع الموظفين على دراية بسياسة الجودة وأهدافها',
          'الإعلان عن سياسة الجودة في جميع المرافق',
          'اجتماعات توعوية شهرية حول نظام الجودة',
        ],
      },
      {
        id: 'support-4',
        number: '7.4',
        title: 'الاتصال',
        content: [
          'قنوات الاتصال الداخلي: اجتماعات، لوحات إعلان، مجموعات واتساب',
          'قنوات الاتصال الخارجي: الموقع الإلكتروني، التقارير الدورية للوزارة',
          'آلية استقبال الشكاوى والمقترحات من المستفيدين وأسرهم',
        ],
        documents: ['Communication Matrix', 'DOC-COM-001'],
      },
      {
        id: 'support-5',
        number: '7.5',
        title: 'المعلومات الموثقة',
        content: [
          'نظام ترميز الوثائق: النوع-القسم-الرقم (مثال: POL-QMS-001)',
          'التحكم في الوثائق: الإصدار، التاريخ، المراجعة، الاعتماد',
          'الاحتفاظ بالسجلات: حسب الجدول الزمني المحدد لكل نوع',
          'النسخ الاحتياطي: يومي للبيانات الإلكترونية',
        ],
        documents: ['Document Control Procedure', 'DOC-DCC-001'],
      },
    ],
  },
  {
    id: 'operation',
    number: '8',
    title: 'العمليات',
    titleEn: 'Operation',
    icon: Zap,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-green-600',
    status: 'partial',
    lastUpdated: '01 يناير 2026',
    subsections: [
      {
        id: 'operation-1',
        number: '8.1',
        title: 'التخطيط التشغيلي والسيطرة',
        content: [
          '127 عملية تشغيلية موثقة ومصنفة',
          'لكل عملية: SOP، معايير قبول، مؤشرات أداء',
          '⚠️ فجوة: 3 عمليات ابتكارية غير موثقة (NCR-002)',
        ],
        documents: ['Operations Manual', 'Process Procedures'],
      },
      {
        id: 'operation-2',
        number: '8.2',
        title: 'متطلبات المنتجات والخدمات',
        content: [
          'معايير قبول المستفيدين الجدد',
          'تقييم الاحتياجات الفردية (ISP)',
          'خطط الرعاية الشخصية',
          'معايير جودة الخدمات المقدمة',
        ],
        documents: ['Service Standards', 'Admission Criteria'],
      },
      {
        id: 'operation-3',
        number: '8.4',
        title: 'التحكم في العمليات والمنتجات والخدمات المقدمة من الخارج',
        content: [
          'تقييم واختيار الموردين والمقاولين',
          'عقد الصيانة والنظافة مع معايير أداء محددة',
          'عقد التغذية (الإعاشة) مع لجنة استلام يومية',
          'تفعيل نظام الغرامات للمخالفات التعاقدية',
        ],
        documents: ['Supplier Evaluation', 'Contract Management'],
      },
      {
        id: 'operation-4',
        number: '8.5',
        title: 'تقديم الخدمات',
        content: [
          '8.5.1 السيطرة على تقديم الخدمة: إجراءات موحدة لكل خدمة',
          '8.5.2 التعريف والتتبع: نظام ترقيم للمستفيدين والسجلات',
          '8.5.4 الحفاظ: حفظ السجلات الطبية والشخصية بسرية تامة',
          '8.5.6 السيطرة على التغييرات: أي تعديل في الخدمات يتطلب موافقة',
        ],
        documents: ['Service Delivery SOPs', 'DOC-SVC-001'],
      },
    ],
  },
  {
    id: 'evaluation',
    number: '9',
    title: 'تقييم الأداء',
    titleEn: 'Performance Evaluation',
    icon: BarChart3,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    status: 'complete',
    lastUpdated: '05 يناير 2026',
    subsections: [
      {
        id: 'evaluation-1',
        number: '9.1',
        title: 'الرصد والقياس والتحليل والتقييم',
        content: [
          'مؤشرات الأداء الرئيسية (KPIs): 5 مؤشرات للمخاطر الحرجة',
          'قياس رضا المستفيدين وأسرهم: استبيان ربع سنوي',
          'تحليل البيانات: تقارير شهرية وربع سنوية',
          'لوحة مؤشرات الأداء: متاحة لجميع القيادات',
        ],
        documents: ['KPI Dashboard', 'Performance Reports'],
      },
      {
        id: 'evaluation-2',
        number: '9.2',
        title: 'التدقيق الداخلي',
        content: [
          'برنامج تدقيق سنوي يغطي جميع بنود ISO 9001',
          'فريق تدقيق داخلي مؤهل ومدرب',
          'التدقيق الداخلي الشامل المقبل: مايو 2026',
          'متابعة الإجراءات التصحيحية للملاحظات',
        ],
        documents: ['Audit Schedule', 'Internal Audit Procedure'],
      },
      {
        id: 'evaluation-3',
        number: '9.3',
        title: 'مراجعة الإدارة',
        content: [
          'مراجعة الإدارة تُعقد ربع سنوياً',
          'المدخلات: نتائج التدقيق، KPIs، شكاوى، تغييرات، توصيات',
          'المخرجات: قرارات التحسين، تخصيص الموارد، تعديل الأهداف',
          'المراجعة القادمة: يونيو 2026',
        ],
        documents: ['Management Review Minutes', 'DOC-MR-001'],
      },
    ],
  },
  {
    id: 'improvement',
    number: '10',
    title: 'التحسين',
    titleEn: 'Improvement',
    icon: TrendingUp,
    color: 'text-pink-400',
    gradient: 'from-pink-500 to-rose-600',
    status: 'partial',
    lastUpdated: '10 يناير 2026',
    subsections: [
      {
        id: 'improvement-1',
        number: '10.1',
        title: 'عام',
        content: [
          'الالتزام بالتحسين المستمر لنظام إدارة الجودة',
          'تحديد فرص التحسين من خلال: التدقيق، الشكاوى، المقترحات، تحليل البيانات',
          'تنفيذ التحسينات ضمن خطط عمل محددة',
        ],
      },
      {
        id: 'improvement-2',
        number: '10.2',
        title: 'عدم المطابقة والإجراء التصحيحي',
        content: [
          'حالات عدم المطابقة الحالية: 3 NCRs مفتوحة',
          'NCR-001: فشل البنية التحتية للسلامة (حرج) - الموعد: 30 مارس 2026',
          'NCR-002: استثناء العمليات الابتكارية (رئيسي) - الموعد: 30 يونيو 2026',
          'NCR-003: انقطاع التواصل الاستراتيجي (رئيسي) - الموعد: 31 مارس 2026',
        ],
        documents: ['NCR Register', 'Corrective Action Procedure'],
      },
      {
        id: 'improvement-3',
        number: '10.3',
        title: 'التحسين المستمر',
        content: [
          'دورة PDCA (خطط - نفذ - تحقق - صحح) مطبقة على جميع العمليات',
          'مشاريع التحسين الجارية: 3 مشاريع ذات أولوية حرجة',
          'هدف الجاهزية للتدقيق الخارجي: 82-85% بحلول يونيو 2026',
        ],
        documents: ['Improvement Projects', 'PDCA Records'],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🧩 المكونات الفرعية
// ═══════════════════════════════════════════════════════════════════════════════

const SectionCard = ({
  section,
  isActive,
  onClick
}: {
  section: ManualSection;
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = section.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl cursor-pointer transition-all ${isActive
        ? `bg-gradient-to-r ${section.gradient} shadow-lg`
        : 'bg-white/5 hover:bg-white/10'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : section.color.replace('text-', 'bg-').replace('400', '500/20')}`}>
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : section.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
              {section.number}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${section.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
              section.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
              {section.status === 'complete' ? 'مكتمل' : section.status === 'partial' ? 'جزئي' : 'معلق'}
            </span>
          </div>
          <h3 className={`font-bold truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>
            {section.title}
          </h3>
          <p className={`text-xs ${isActive ? 'text-white/60' : 'text-gray-500'}`}>
            {section.titleEn}
          </p>
        </div>
        <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
      </div>
    </motion.div>
  );
};

const SubsectionContent = ({ subsection, index }: { subsection: ManualSection['subsections'][0]; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-teal-400 font-mono font-bold">{subsection.number}</span>
          <h4 className="text-white font-medium text-right">{subsection.title}</h4>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* المحتوى */}
              <ul className="space-y-2">
                {subsection.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {item.startsWith('⚠️') ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-amber-300">{item.replace('⚠️ ', '')}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {/* الوثائق المرتبطة */}
              {subsection.documents && subsection.documents.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <span className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    الوثائق المرتبطة:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {subsection.documents.map((doc, i) => (
                      <span key={i} className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded text-xs">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// شريط التقدم الدائري
const CircularProgress = ({ value, size = 120, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${circumference - offset} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl font-black text-white">{value}%</span>
          <p className="text-gray-500 text-xs">مكتمل</p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════════

export default function QualityManualPro() {
  const [activeSection, setActiveSection] = useState<string>('context');
  const [searchQuery, setSearchQuery] = useState('');

  const currentSection = MANUAL_SECTIONS.find(s => s.id === activeSection);

  // حساب نسبة الاكتمال
  const completionRate = Math.round(
    (MANUAL_SECTIONS.filter(s => s.status === 'complete').length / MANUAL_SECTIONS.length) * 100
  );

  const filteredSections = MANUAL_SECTIONS.filter(section =>
    section.title.includes(searchQuery) ||
    section.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.number.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* الهيدر */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-700 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Book className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">دليل الجودة الشامل</h1>
                <p className="text-teal-100">Quality Manual - ISO 9001:2015</p>
                <p className="text-teal-200/80 text-sm mt-1">مركز التأهيل الشامل بمنطقة الباحة</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-left">
                <div className="text-teal-100 text-sm">الإصدار</div>
                <div className="text-white font-bold">v2.0</div>
              </div>
              <div className="text-left">
                <div className="text-teal-100 text-sm">آخر تحديث</div>
                <div className="text-white font-bold">يناير 2026</div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <Download className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                  <Printer className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* الشريط الجانبي */}
          <div className="lg:col-span-1 space-y-6">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="بحث في الدليل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pr-10 pl-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* نسبة الاكتمال */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-white/10 text-center"
            >
              <h3 className="text-white font-bold mb-4">حالة الدليل</h3>
              <CircularProgress value={completionRate} />
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="bg-emerald-500/20 rounded-lg p-2">
                  <div className="text-emerald-400 font-bold">{MANUAL_SECTIONS.filter(s => s.status === 'complete').length}</div>
                  <div className="text-gray-500">مكتمل</div>
                </div>
                <div className="bg-amber-500/20 rounded-lg p-2">
                  <div className="text-amber-400 font-bold">{MANUAL_SECTIONS.filter(s => s.status === 'partial').length}</div>
                  <div className="text-gray-500">جزئي</div>
                </div>
                <div className="bg-red-500/20 rounded-lg p-2">
                  <div className="text-red-400 font-bold">{MANUAL_SECTIONS.filter(s => s.status === 'pending').length}</div>
                  <div className="text-gray-500">معلق</div>
                </div>
              </div>
            </motion.div>

            {/* قائمة الأقسام */}
            <div className="space-y-2">
              {filteredSections.map((section) => (
                <div key={section.id}>
                  <SectionCard
                    section={section}
                    isActive={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentSection && (
                <motion.div
                  key={currentSection.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* عنوان القسم */}
                  <div className={`bg-gradient-to-r ${currentSection.gradient} rounded-2xl p-6`}>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/20 rounded-xl">
                        <currentSection.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-white/80 font-mono text-lg">البند {currentSection.number}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${currentSection.status === 'complete' ? 'bg-white/20 text-white' :
                            currentSection.status === 'partial' ? 'bg-amber-400/20 text-amber-100' :
                              'bg-red-400/20 text-red-100'
                            }`}>
                            {currentSection.status === 'complete' ? '✓ مكتمل' :
                              currentSection.status === 'partial' ? '⚠ جزئي' : '✗ معلق'}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black text-white">{currentSection.title}</h2>
                        <p className="text-white/80">{currentSection.titleEn}</p>
                      </div>
                    </div>
                    {currentSection.lastUpdated && (
                      <div className="mt-4 text-white/60 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        آخر تحديث: {currentSection.lastUpdated}
                      </div>
                    )}
                  </div>

                  {/* الأقسام الفرعية */}
                  {currentSection.subsections && currentSection.subsections.length > 0 && (
                    <div className="space-y-4">
                      {currentSection.subsections.map((subsection, index) => (
                        <div key={subsection.id}>
                          <SubsectionContent subsection={subsection} index={index} />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Named export for backward compatibility
export { QualityManualPro as QualityManual };
