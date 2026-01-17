// ═══════════════════════════════════════════════════════════════════════════════
// 🍒 لوحة الحوكمة والمخاطر والامتثال الاحترافية
// GRC Dashboard Pro - Governance, Risk & Compliance
// بيانات حقيقية من سجل المخاطر الشامل لمركز التأهيل بالباحة
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, FileText, Target, Eye,
  Calendar, ChevronRight, ChevronDown, Filter, Download,
  RefreshCw, Plus, AlertOctagon, Award, Lock, Users,
  Activity, BarChart3, PieChart, Zap, Heart, Building2,
  Flame, Droplets, Pill, Stethoscope, UserX, Camera,
  Scale, Gavel, FileCheck, ClipboardList, Siren, Gauge,
  ArrowUpRight, ArrowDownRight, Minus, Timer, MapPin
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 الأنواع والواجهات
// ═══════════════════════════════════════════════════════════════════════════════

type RiskLevel = 1 | 2 | 3 | 4 | 5;
type RiskCategory = 'clinical' | 'safety' | 'social' | 'infrastructure' | 'compliance' | 'contractual';
type RiskStatus = 'open' | 'mitigating' | 'monitoring' | 'closed';
type ComplianceStatus = 'compliant' | 'non_compliant' | 'partial' | 'in_progress';
type NCRSeverity = 'critical' | 'major' | 'minor';

interface Risk {
  id: string;
  code: string;
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
  status: RiskStatus;
  owner: string;
  mitigationPlan: string;
  controls: string[];
  isoRef: string;
  dueDate?: string;
}

interface ComplianceRequirement {
  id: string;
  code: string;
  title: string;
  clause: string;
  standard: string;
  status: ComplianceStatus;
  gap?: string;
  actionPlan?: string;
  dueDate?: string;
  evidence?: string[];
}

interface NCR {
  id: string;
  code: string;
  title: string;
  severity: NCRSeverity;
  status: 'open' | 'in_progress' | 'closed';
  isoClause: string;
  rootCause: string;
  correctiveAction: string;
  dueDate: string;
  owner: string;
  progress: number;
}

interface BCPScenario {
  id: string;
  title: string;
  type: 'evacuation' | 'pandemic' | 'infrastructure' | 'supply';
  rto: string;
  criticalProcess: string;
  strategy: string;
  resources: string[];
  lastTested?: string;
  status: 'ready' | 'needs_update' | 'not_tested';
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 إعدادات التصميم
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORY_CONFIG: Record<RiskCategory, {
  label: string;
  labelEn: string;
  color: string;
  bg: string;
  gradient: string;
  icon: React.ElementType
}> = {
  clinical: {
    label: 'سريري',
    labelEn: 'Clinical',
    color: 'text-rose-400',
    bg: 'bg-rose-500/20',
    gradient: 'from-rose-500 to-pink-600',
    icon: Stethoscope
  },
  safety: {
    label: 'سلامة',
    labelEn: 'Safety',
    color: 'text-red-400',
    bg: 'bg-red-500/20',
    gradient: 'from-red-500 to-orange-600',
    icon: Flame
  },
  social: {
    label: 'اجتماعي',
    labelEn: 'Social',
    color: 'text-violet-400',
    bg: 'bg-violet-500/20',
    gradient: 'from-violet-500 to-purple-600',
    icon: Users
  },
  infrastructure: {
    label: 'بنية تحتية',
    labelEn: 'Infrastructure',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20',
    gradient: 'from-amber-500 to-yellow-600',
    icon: Building2
  },
  compliance: {
    label: 'امتثال',
    labelEn: 'Compliance',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
    gradient: 'from-blue-500 to-cyan-600',
    icon: Scale
  },
  contractual: {
    label: 'تعاقدي',
    labelEn: 'Contractual',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-600',
    icon: FileCheck
  },
};

const STATUS_CONFIG: Record<RiskStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  open: { label: 'مفتوح', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertOctagon },
  mitigating: { label: 'قيد المعالجة', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Zap },
  monitoring: { label: 'تحت المراقبة', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Eye },
  closed: { label: 'مغلق', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle },
};

const NCR_SEVERITY_CONFIG: Record<NCRSeverity, { label: string; color: string; bg: string }> = {
  critical: { label: 'حرج', color: 'text-red-400', bg: 'bg-red-500/20' },
  major: { label: 'رئيسي', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  minor: { label: 'ثانوي', color: 'text-blue-400', bg: 'bg-blue-500/20' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📦 البيانات الحقيقية من سجل المخاطر
// ═══════════════════════════════════════════════════════════════════════════════

const REAL_RISKS: Risk[] = [
  // المخاطر السريرية
  {
    id: 'clin-01',
    code: 'CLIN-01',
    title: 'الأخطاء الدوائية',
    description: 'صرف دواء خاطئ أو جرعة خاطئة نتيجة التشابه في الأسماء أو العبوات، أو الاعتماد على الذاكرة',
    category: 'clinical',
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    status: 'mitigating',
    owner: 'د. محمد بلال',
    mitigationPlan: 'تطبيق نظام الحقوق الخمسة (5 Rights) بصرامة + التحقق المزدوج للأدوية عالية الخطورة + التحول الرقمي الكامل',
    controls: ['نظام التحقق المزدوج', 'الحقوق الخمسة', 'نظام الوصفات الإلكتروني', 'تدقيق عربة الطوارئ'],
    isoRef: 'ISO 9001 (8.5.1)',
  },
  {
    id: 'clin-02',
    code: 'CLIN-02',
    title: 'قرح الفراش',
    description: 'فشل الالتزام بجدول التقليب الدوري للمستفيدين طريحي الفراش مما يؤدي لتلف الأنسجة والتهابات خطيرة',
    category: 'clinical',
    likelihood: 4,
    impact: 4,
    riskScore: 16,
    status: 'mitigating',
    owner: 'نايف الغامدي',
    mitigationPlan: 'استخدام ساعة التقليب المرئية + توفير مراتب هوائية ديناميكية + تقييم الجلد يومياً بمقياس Braden',
    controls: ['ساعة التقليب', 'مراتب هوائية', 'مقياس Braden', 'نموذج متابعة التقليب'],
    isoRef: 'بروتوكول العناية التمريضية',
  },
  {
    id: 'clin-03',
    code: 'CLIN-03',
    title: 'تفشي العدوى المكتسبة',
    description: 'انتقال عدوى تنفسية أو تلامسية نتيجة ضعف تعقيم الأيدي أو عدم عزل الحالات المشتبهة',
    category: 'clinical',
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    status: 'monitoring',
    owner: 'نايف الغامدي',
    mitigationPlan: 'فرض سياسة اللحظات الخمس لنظافة الأيدي + مسحات بيئية دورية + سياسات العزل الفوري',
    controls: ['اللحظات الخمس', 'المسحات البيئية', 'سياسات العزل', 'إدارة النفايات الطبية'],
    isoRef: 'دليل مكافحة العدوى الوزاري',
  },
  {
    id: 'clin-04',
    code: 'CLIN-04',
    title: 'الاختناق أثناء التغذية',
    description: 'تقديم قوام طعام غير مناسب لمستفيدين يعانون من صعوبات البلع (Dysphagia)',
    category: 'clinical',
    likelihood: 2,
    impact: 5,
    riskScore: 10,
    status: 'monitoring',
    owner: 'أخصائي التغذية',
    mitigationPlan: 'تقييم قدرة البلع من أخصائي النطق + علامات واضحة على سرير المريض + تدريب على مناورة هايملاخ',
    controls: ['تقييم البلع', 'Color Coding', 'تدريب هايملاخ', 'معايير سلامة الغذاء'],
    isoRef: 'معايير سلامة الغذاء',
  },
  // المخاطر الاجتماعية
  {
    id: 'soc-01',
    code: 'SOC-01',
    title: 'انتهاك الخصوصية',
    description: 'تصوير المستفيدين في أوضاع غير لائقة عبر كاميرات المراقبة أو الهواتف الشخصية للموظفين',
    category: 'social',
    likelihood: 2,
    impact: 5,
    riskScore: 10,
    status: 'mitigating',
    owner: 'مدير المركز',
    mitigationPlan: 'الحظر التام للكاميرات في غرف النوم ودورات المياه + منع الهواتف في المناطق الخاصة + تعهدات قانونية',
    controls: ['حظر الكاميرات', 'منع الهواتف', 'التعهدات القانونية', 'الإشراف البشري'],
    isoRef: 'نظام الحماية من الإيذاء / ISO 27001',
  },
  {
    id: 'soc-02',
    code: 'SOC-02',
    title: 'العنف والإيذاء',
    description: 'تعرض المستفيد لعنف جسدي أو لفظي من قبل الموظفين نتيجة الاحتراق الوظيفي أو ضعف التدريب',
    category: 'social',
    likelihood: 2,
    impact: 5,
    riskScore: 10,
    status: 'monitoring',
    owner: 'رئيس الاجتماعية',
    mitigationPlan: 'تطبيق سياسة عدم التسامح + التدوير الوظيفي + قنوات إبلاغ سرية + تدريب إدارة السلوك العدواني',
    controls: ['سياسة Zero Tolerance', 'التدوير الوظيفي', 'قنوات الإبلاغ السرية', 'تدريب إدارة السلوك'],
    isoRef: 'اللوائح التنفيذية للوزارة',
  },
  {
    id: 'soc-03',
    code: 'SOC-03',
    title: 'فشل الدمج والعزل',
    description: 'بقاء المستفيدين داخل المركز دون برامج دمج حقيقية مما يحول المركز إلى مؤسسة إيوائية',
    category: 'social',
    likelihood: 4,
    impact: 3,
    riskScore: 12,
    status: 'mitigating',
    owner: 'رئيس الاجتماعية',
    mitigationPlan: 'ربط KPIs بنسبة المدمجين + تفعيل الشراكات المجتمعية + مراجعة ISP ربع سنوياً',
    controls: ['مؤشرات الدمج', 'الشراكات المجتمعية', 'مراجعة ISP', 'برامج التوظيف'],
    isoRef: 'الاستراتيجية الوطنية للإعاقة',
  },
  // مخاطر السلامة والبنية التحتية
  {
    id: 'saf-01',
    code: 'SAF-01',
    title: 'الحريق في المباني القديمة',
    description: 'غياب مرشات المياه التلقائية (Sprinklers) وسرعة انتشار الدخان في المباني القديمة',
    category: 'safety',
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    status: 'open',
    owner: 'سعد بخيت الزهراني',
    mitigationPlan: 'تطبيق نظام Fire Watch البشري 24 ساعة + زيادة الطفايات + كواشف VESDA + أبواب الحريق',
    controls: ['Fire Watch', 'طفايات يدوية', 'كواشف VESDA', 'أبواب الحريق'],
    isoRef: 'كود البناء السعودي (SBC 801)',
    dueDate: '30 مارس 2026',
  },
  {
    id: 'saf-02',
    code: 'SAF-02',
    title: 'صعوبة الإخلاء الطارئ',
    description: 'صعوبة إخلاء المستفيدين غير القادرين على الحركة في الوقت القياسي (5 دقائق)',
    category: 'safety',
    likelihood: 3,
    impact: 5,
    riskScore: 15,
    status: 'mitigating',
    owner: 'سعد بخيت الزهراني',
    mitigationPlan: 'إعداد خطط إخلاء شخصية (PEEPs) لكل مستفيد + كراسي الإخلاء + تجارب إخلاء دورية',
    controls: ['PEEPs', 'كراسي الإخلاء', 'ملاءات انزلاقية', 'تجارب الإخلاء'],
    isoRef: 'ISO 45001 / مبادرة أمان مستدام',
  },
  {
    id: 'saf-03',
    code: 'SAF-03',
    title: 'حوادث السقوط والانزلاق',
    description: 'أرضيات غير آمنة أو عدم وجود مقابض دعم كافية في دورات المياه',
    category: 'infrastructure',
    likelihood: 4,
    impact: 3,
    riskScore: 12,
    status: 'monitoring',
    owner: 'فواز عطية العمري',
    mitigationPlan: 'تطبيق كود الوصول الشامل + صيانة فورية للتسربات + أحذية مانعة للانزلاق',
    controls: ['كود الوصول الشامل', 'أرضيات مانعة للانزلاق', 'مقابض الدعم', 'صيانة فورية'],
    isoRef: 'معايير الوصول الشامل',
  },
  // المخاطر التعاقدية
  {
    id: 'con-01',
    code: 'CON-01',
    title: 'تقصير مقاول الصيانة والنظافة',
    description: 'نقص العمالة أو تدني مستوى النظافة أو تأخر إصلاح الأعطال الحرجة',
    category: 'contractual',
    likelihood: 3,
    impact: 3,
    riskScore: 9,
    status: 'monitoring',
    owner: 'مدير المشتريات',
    mitigationPlan: 'تفعيل جولات التفتيش اليومية + ربط المستخلصات بتقارير الأداء + نظام البلاغات الإلكتروني',
    controls: ['جولات التفتيش', 'تقارير الأداء', 'نظام البلاغات', 'غرامات التقصير'],
    isoRef: 'كراسة الشروط والمواصفات',
  },
  {
    id: 'con-02',
    code: 'CON-02',
    title: 'مخاطر عقد التغذية',
    description: 'نقص كميات الطعام أو عدم الالتزام بالمواصفات أو التسمم الغذائي',
    category: 'contractual',
    likelihood: 2,
    impact: 4,
    riskScore: 8,
    status: 'monitoring',
    owner: 'لجنة الإعاشة',
    mitigationPlan: 'تشكيل لجنة استلام يومية + فحص ظاهري ومخبري + مراقبة درجات الحرارة',
    controls: ['لجنة الاستلام', 'الفحص المخبري', 'مراقبة الحرارة', 'نظام الغرامات'],
    isoRef: 'عقد شركة الهناء',
  },
];

const REAL_NCRS: NCR[] = [
  {
    id: 'ncr-001',
    code: 'NCR-001',
    title: 'فشل البنية التحتية للسلامة',
    severity: 'critical',
    status: 'in_progress',
    isoClause: 'ISO 9001 (7.1.3)',
    rootCause: 'عدم تركيب نظام إطفاء آلي + غياب شهادة سلامة سارية من الدفاع المدني',
    correctiveAction: 'تركيب نظام Sprinkler + الحصول على شهادة السلامة',
    dueDate: '30 مارس 2026',
    owner: 'سعد الزهراني / فواز العمري',
    progress: 35,
  },
  {
    id: 'ncr-002',
    code: 'NCR-002',
    title: 'استثناء العمليات الابتكارية من نظام الجودة',
    severity: 'major',
    status: 'in_progress',
    isoClause: 'ISO 9001 (8.5.1)',
    rootCause: 'عدم توثيق العمليات الابتكارية (غرفة التحفيز الحسي، العلاج بالموسيقى، التدريب المهني)',
    correctiveAction: 'إعداد SOPs للعمليات الثلاث + رسم خرائط العمليات + تحديد KPIs',
    dueDate: '30 يونيو 2026',
    owner: 'رؤساء الأقسام / أحمد الشهري',
    progress: 20,
  },
  {
    id: 'ncr-003',
    code: 'NCR-003',
    title: 'انقطاع التواصل الاستراتيجي (الخيط الذهبي)',
    severity: 'major',
    status: 'in_progress',
    isoClause: 'ISO 9001 (5.1)',
    rootCause: 'غياب قنوات تواصل رسمية موثقة مع وزارة الموارد البشرية والتنمية الاجتماعية',
    correctiveAction: 'إنشاء بروتوكول تواصل + اجتماعات دورية + تقارير أداء ربع سنوية',
    dueDate: '31 مارس 2026',
    owner: 'مدير المركز',
    progress: 45,
  },
];

const REAL_COMPLIANCE: ComplianceRequirement[] = [
  {
    id: 'iso-4',
    code: '4.0',
    title: 'سياق المنظمة',
    clause: 'ISO 9001:2015 - البند 4',
    standard: 'ISO 9001:2015',
    status: 'compliant',
    evidence: ['مصفوفة أصحاب المصلحة', 'تحليل SWOT', 'سياق داخلي وخارجي'],
  },
  {
    id: 'iso-5',
    code: '5.0',
    title: 'القيادة والالتزام',
    clause: 'ISO 9001:2015 - البند 5',
    standard: 'ISO 9001:2015',
    status: 'partial',
    gap: 'انقطاع التواصل مع الوزارة (NCR-003)',
    actionPlan: 'استعادة الخيط الذهبي مع HRSD',
    dueDate: '31 مارس 2026',
  },
  {
    id: 'iso-6',
    code: '6.0',
    title: 'التخطيط والمخاطر',
    clause: 'ISO 9001:2015 - البند 6',
    standard: 'ISO 9001:2015',
    status: 'compliant',
    evidence: ['سجل المخاطر الشامل', 'خطط المعالجة', 'مراجعة دورية'],
  },
  {
    id: 'iso-7',
    code: '7.0',
    title: 'الدعم والموارد',
    clause: 'ISO 9001:2015 - البند 7',
    standard: 'ISO 9001:2015',
    status: 'non_compliant',
    gap: 'فشل البنية التحتية للسلامة (NCR-001)',
    actionPlan: 'تركيب نظام الإطفاء الآلي',
    dueDate: '30 مارس 2026',
  },
  {
    id: 'iso-8',
    code: '8.0',
    title: 'العمليات',
    clause: 'ISO 9001:2015 - البند 8',
    standard: 'ISO 9001:2015',
    status: 'partial',
    gap: 'عمليات ابتكارية غير موثقة (NCR-002)',
    actionPlan: 'توثيق SOPs للعمليات الثلاث',
    dueDate: '30 يونيو 2026',
  },
  {
    id: 'iso-9',
    code: '9.0',
    title: 'تقييم الأداء',
    clause: 'ISO 9001:2015 - البند 9',
    standard: 'ISO 9001:2015',
    status: 'compliant',
    evidence: ['لوحة مؤشرات المخاطر', 'تدقيق داخلي مجدول', 'مراجعة الإدارة'],
  },
  {
    id: 'iso-10',
    code: '10.0',
    title: 'التحسين المستمر',
    clause: 'ISO 9001:2015 - البند 10',
    standard: 'ISO 9001:2015',
    status: 'in_progress',
    actionPlan: 'تنفيذ الإجراءات التصحيحية للـ NCRs الثلاث',
  },
  {
    id: 'pdpl-1',
    code: 'PDPL-1',
    title: 'حماية البيانات الشخصية',
    clause: 'نظام حماية البيانات الشخصية',
    standard: 'PDPL',
    status: 'partial',
    gap: 'عدم فصل الهوية عن السجل الطبي',
    actionPlan: 'تطبيق Pseudonymization في نظام بصيرة',
  },
  {
    id: 'nca-1',
    code: 'NCA-ECC',
    title: 'ضوابط الأمن السيبراني',
    clause: 'ضوابط الهيئة الوطنية للأمن السيبراني',
    standard: 'NCA',
    status: 'partial',
    gap: 'بعض الضوابط التقنية غير مكتملة',
    actionPlan: 'تفعيل MFA + audit logs + تشفير البيانات',
  },
];

const BCP_SCENARIOS: BCPScenario[] = [
  {
    id: 'bcp-01',
    title: 'الإخلاء الليلي الطارئ',
    type: 'evacuation',
    rto: '< 5 دقائق',
    criticalProcess: 'إخلاء 100% من المستفيدين بسلامة',
    strategy: 'تفعيل كود أحمر + PEEPs + كراسي الإخلاء + مخزون الطوارئ',
    resources: ['كراسي الإخلاء', 'ملاءات انزلاقية', 'صندوق الطوارئ الدوائي', 'بطانيات حرارية'],
    lastTested: 'لم يُختبر بعد',
    status: 'needs_update',
  },
  {
    id: 'bcp-02',
    title: 'انقطاع التيار الكهربائي',
    type: 'infrastructure',
    rto: '< 10 دقائق',
    criticalProcess: 'استمرارية التكييف والأجهزة الطبية',
    strategy: 'تشغيل المولدات الاحتياطية + أنظمة UPS + عقود صيانة طارئة',
    resources: ['المولدات الاحتياطية', 'أنظمة UPS', 'فريق الصيانة'],
    lastTested: '15 نوفمبر 2025',
    status: 'ready',
  },
  {
    id: 'bcp-03',
    title: 'انقطاع إمداد الأكسجين',
    type: 'supply',
    rto: '0 ساعة (فوري)',
    criticalProcess: 'ضمان أجهزة دعم الحياة',
    strategy: 'مخزون استراتيجي 72 ساعة + أسطوانات احتياطية + مولدات أكسجين متنقلة',
    resources: ['مخزون الأكسجين', 'أسطوانات احتياطية', 'مولدات متنقلة'],
    status: 'ready',
  },
  {
    id: 'bcp-04',
    title: 'تفشي وبائي',
    type: 'pandemic',
    rto: '4 ساعات',
    criticalProcess: 'عزل الحالات + منع الانتشار',
    strategy: 'تفعيل سياسات العزل + مسحات فورية + تعليق الزيارات',
    resources: ['غرف العزل', 'معدات الوقاية', 'مختبر الفحص'],
    lastTested: 'خبرة كوفيد-19',
    status: 'ready',
  },
  {
    id: 'bcp-05',
    title: 'انقطاع التغذية والمياه',
    type: 'supply',
    rto: '4 ساعات',
    criticalProcess: 'ضمان الإعاشة للمستفيدين',
    strategy: 'خزان مياه مستقل + مخزون أغذية جافة + موردين بدلاء',
    resources: ['خزان المياه', 'أغذية الطوارئ', 'قائمة الموردين البدلاء'],
    status: 'ready',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 🧩 المكونات الفرعية
// ═══════════════════════════════════════════════════════════════════════════════

// مصفوفة المخاطر 5×5 التفاعلية
const RiskMatrixPro = ({ risks, onCellClick }: { risks: Risk[]; onCellClick?: (l: number, i: number) => void }) => {
  const getColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 15) return 'bg-gradient-to-br from-red-500 to-rose-600';
    if (score >= 10) return 'bg-gradient-to-br from-orange-500 to-amber-600';
    if (score >= 5) return 'bg-gradient-to-br from-yellow-500 to-amber-500';
    return 'bg-gradient-to-br from-emerald-500 to-green-600';
  };

  const getRisksInCell = (likelihood: number, impact: number) => {
    return risks.filter(r => r.likelihood === likelihood && r.impact === impact);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
    >
      <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
        <Target className="w-5 h-5 text-teal-400" />
        مصفوفة المخاطر 5×5
      </h3>

      <div className="flex">
        {/* محور التأثير */}
        <div className="flex flex-col justify-around pl-2 py-2">
          {[5, 4, 3, 2, 1].map(i => (
            <span key={i} className="text-gray-400 text-xs h-12 flex items-center">{i}</span>
          ))}
        </div>

        {/* المصفوفة */}
        <div className="flex-1">
          <div className="grid grid-cols-5 gap-1.5">
            {[5, 4, 3, 2, 1].map(impact =>
              [1, 2, 3, 4, 5].map(likelihood => {
                const cellRisks = getRisksInCell(likelihood, impact);
                return (
                  <motion.div
                    key={`${likelihood}-${impact}`}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCellClick?.(likelihood, impact)}
                    className={`h-12 rounded-lg ${getColor(likelihood, impact)} flex items-center justify-center cursor-pointer shadow-lg transition-all ${cellRisks.length > 0 ? 'ring-2 ring-white/60' : 'opacity-60 hover:opacity-100'
                      }`}
                    title={`الاحتمالية: ${likelihood}, التأثير: ${impact}`}
                  >
                    {cellRisks.length > 0 && (
                      <span className="text-white font-bold text-lg drop-shadow-lg">{cellRisks.length}</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* محور الاحتمالية */}
          <div className="flex justify-around mt-2 text-gray-400 text-xs">
            {[1, 2, 3, 4, 5].map(l => <span key={l}>{l}</span>)}
          </div>
          <p className="text-center text-gray-500 text-xs mt-1">الاحتمالية →</p>
        </div>
      </div>

      {/* المفتاح */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-white/10">
        {[
          { color: 'bg-red-500', label: 'حرج (15-25)' },
          { color: 'bg-orange-500', label: 'عالي (10-14)' },
          { color: 'bg-yellow-500', label: 'متوسط (5-9)' },
          { color: 'bg-emerald-500', label: 'منخفض (1-4)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded ${color}`} />
            <span className="text-gray-400 text-xs">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// بطاقة الخطر المحسنة
const RiskCardPro = ({ risk, index }: { risk: Risk; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryConfig = CATEGORY_CONFIG[risk.category];
  const statusConfig = STATUS_CONFIG[risk.status];
  const CategoryIcon = categoryConfig.icon;
  const StatusIcon = statusConfig.icon;

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'border-r-red-500 bg-red-500/5';
    if (score >= 10) return 'border-r-orange-500 bg-orange-500/5';
    if (score >= 5) return 'border-r-amber-500 bg-amber-500/5';
    return 'border-r-emerald-500 bg-emerald-500/5';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 15) return 'from-red-500 to-rose-600';
    if (score >= 10) return 'from-orange-500 to-amber-600';
    if (score >= 5) return 'from-amber-500 to-yellow-600';
    return 'from-emerald-500 to-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`rounded-2xl border-r-4 overflow-hidden backdrop-blur-sm ${getRiskColor(risk.riskScore)}`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* الأيقونة والدرجة */}
          <div className="text-center flex-shrink-0">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${categoryConfig.gradient} mb-2 shadow-lg`}>
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div className={`text-2xl font-black bg-gradient-to-br ${getScoreGradient(risk.riskScore)} bg-clip-text text-transparent`}>
              {risk.riskScore}
            </div>
            <div className="text-gray-500 text-xs">درجة</div>
          </div>

          {/* المحتوى */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-teal-400 font-mono text-sm">{risk.code}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.label}
              </span>
            </div>
            <h4 className="text-white font-bold mb-1 truncate">{risk.title}</h4>
            <p className="text-gray-400 text-sm line-clamp-2">{risk.description}</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {risk.owner}
              </span>
              {risk.dueDate && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {risk.dueDate}
                </span>
              )}
            </div>
          </div>

          {/* مؤشر التوسع */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-gray-500"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      {/* المحتوى الموسع */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-white/10 space-y-4">
              {/* خطة المعالجة */}
              <div>
                <h5 className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  خطة المعالجة
                </h5>
                <p className="text-white text-sm">{risk.mitigationPlan}</p>
              </div>

              {/* الضوابط */}
              <div>
                <h5 className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  الضوابط الحالية
                </h5>
                <div className="flex flex-wrap gap-2">
                  {risk.controls.map((control, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-xs text-gray-300">
                      {control}
                    </span>
                  ))}
                </div>
              </div>

              {/* المرجعية */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  <FileText className="w-3.5 h-3.5 inline mr-1" />
                  {risk.isoRef}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">الاحتمالية: {risk.likelihood}</span>
                  <span className="text-gray-500">التأثير: {risk.impact}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// بطاقة NCR
const NCRCard = ({ ncr, index }: { ncr: NCR; index: number }) => {
  const severityConfig = NCR_SEVERITY_CONFIG[ncr.severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-4 border border-white/10"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-rose-400 font-mono font-bold">{ncr.code}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${severityConfig.bg} ${severityConfig.color}`}>
              {severityConfig.label}
            </span>
          </div>
          <h4 className="text-white font-bold">{ncr.title}</h4>
        </div>
        <div className="text-left">
          <div className="text-2xl font-black text-teal-400">{ncr.progress}%</div>
          <div className="text-gray-500 text-xs">الإنجاز</div>
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${ncr.progress}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
        />
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-gray-500">البند: </span>
          <span className="text-gray-300">{ncr.isoClause}</span>
        </div>
        <div>
          <span className="text-gray-500">الإجراء التصحيحي: </span>
          <span className="text-gray-300">{ncr.correctiveAction}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-gray-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {ncr.owner}
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {ncr.dueDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// بطاقة الامتثال
const ComplianceCard = ({ req, index }: { req: ComplianceRequirement; index: number }) => {
  const getStatusConfig = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant': return { label: 'متوافق', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: CheckCircle };
      case 'non_compliant': return { label: 'غير متوافق', color: 'text-red-400', bg: 'bg-red-500/20', icon: XCircle };
      case 'partial': return { label: 'جزئي', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: AlertTriangle };
      case 'in_progress': return { label: 'قيد التنفيذ', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Clock };
    }
  };

  const statusConfig = getStatusConfig(req.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-mono text-sm font-bold">{req.code}</span>
            <span className="text-gray-500 text-xs">{req.standard}</span>
          </div>
          <h4 className="text-white font-medium">{req.title}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color} flex items-center gap-1`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig.label}
        </span>
      </div>

      {req.gap && (
        <div className="mt-2 p-2 bg-red-500/10 rounded-lg text-sm">
          <span className="text-red-400 font-medium">الفجوة: </span>
          <span className="text-gray-300">{req.gap}</span>
        </div>
      )}

      {req.actionPlan && (
        <div className="mt-2 text-sm">
          <span className="text-gray-500">خطة العمل: </span>
          <span className="text-gray-300">{req.actionPlan}</span>
        </div>
      )}

      {req.evidence && req.evidence.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {req.evidence.map((e, i) => (
            <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
              ✓ {e}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// بطاقة سيناريو BCP
const BCPScenarioCard = ({ scenario, index }: { scenario: BCPScenario; index: number }) => {
  const getTypeConfig = (type: BCPScenario['type']) => {
    switch (type) {
      case 'evacuation': return { icon: Siren, color: 'text-red-400', bg: 'bg-red-500/20', gradient: 'from-red-500 to-rose-600' };
      case 'pandemic': return { icon: Heart, color: 'text-violet-400', bg: 'bg-violet-500/20', gradient: 'from-violet-500 to-purple-600' };
      case 'infrastructure': return { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/20', gradient: 'from-amber-500 to-yellow-600' };
      case 'supply': return { icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/20', gradient: 'from-blue-500 to-cyan-600' };
    }
  };

  const getStatusConfig = (status: BCPScenario['status']) => {
    switch (status) {
      case 'ready': return { label: 'جاهز', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
      case 'needs_update': return { label: 'يحتاج تحديث', color: 'text-amber-400', bg: 'bg-amber-500/20' };
      case 'not_tested': return { label: 'لم يُختبر', color: 'text-red-400', bg: 'bg-red-500/20' };
    }
  };

  const typeConfig = getTypeConfig(scenario.type);
  const statusConfig = getStatusConfig(scenario.status);
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl overflow-hidden border border-white/10 group"
    >
      {/* الهيدر */}
      <div className={`bg-gradient-to-r ${typeConfig.gradient} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon className="w-8 h-8 text-white/90" />
            <div>
              <h4 className="text-white font-bold">{scenario.title}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-white/60 text-xs">RTO</div>
            <div className="text-white font-bold text-lg">{scenario.rto}</div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-4 space-y-3">
        <div>
          <span className="text-gray-500 text-sm">العملية الحرجة: </span>
          <span className="text-white text-sm">{scenario.criticalProcess}</span>
        </div>

        <div>
          <span className="text-gray-500 text-sm">الاستراتيجية: </span>
          <span className="text-gray-300 text-sm">{scenario.strategy}</span>
        </div>

        <div>
          <span className="text-gray-500 text-sm block mb-1">الموارد المطلوبة:</span>
          <div className="flex flex-wrap gap-1">
            {scenario.resources.map((r, i) => (
              <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                {r}
              </span>
            ))}
          </div>
        </div>

        {scenario.lastTested && (
          <div className="text-xs text-gray-500 pt-2 border-t border-white/10">
            آخر اختبار: {scenario.lastTested}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════════

export default function GRCDashboardPro() {
  const [activeTab, setActiveTab] = useState<'risks' | 'compliance' | 'ncr' | 'bcp'>('risks');
  const [filterCategory, setFilterCategory] = useState<RiskCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RiskStatus | 'all'>('all');

  // الإحصائيات المحسوبة
  const stats = useMemo(() => {
    const criticalRisks = REAL_RISKS.filter(r => r.riskScore >= 15).length;
    const highRisks = REAL_RISKS.filter(r => r.riskScore >= 10 && r.riskScore < 15).length;
    const mediumRisks = REAL_RISKS.filter(r => r.riskScore >= 5 && r.riskScore < 10).length;
    const lowRisks = REAL_RISKS.filter(r => r.riskScore < 5).length;

    const compliantCount = REAL_COMPLIANCE.filter(c => c.status === 'compliant').length;
    const complianceRate = Math.round((compliantCount / REAL_COMPLIANCE.length) * 100);

    const openNCRs = REAL_NCRS.filter(n => n.status !== 'closed').length;
    const avgNCRProgress = Math.round(REAL_NCRS.reduce((acc, n) => acc + n.progress, 0) / REAL_NCRS.length);

    return {
      totalRisks: REAL_RISKS.length,
      criticalRisks,
      highRisks,
      mediumRisks,
      lowRisks,
      complianceRate,
      openNCRs,
      avgNCRProgress,
      bcpReady: BCP_SCENARIOS.filter(s => s.status === 'ready').length,
    };
  }, []);

  // تصفية المخاطر
  const filteredRisks = useMemo(() => {
    return REAL_RISKS.filter(r => {
      if (filterCategory !== 'all' && r.category !== filterCategory) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [filterCategory, filterStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6" dir="rtl">
      {/* الهيدر */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl shadow-lg shadow-teal-500/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              الحوكمة والمخاطر والامتثال
            </h1>
            <p className="text-gray-400 mt-2">مركز التأهيل الشامل بالباحة | ISO 9001:2015 & ISO 31000</p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'المخاطر الحرجة',
              value: stats.criticalRisks,
              total: stats.totalRisks,
              color: 'from-red-500 to-rose-600',
              icon: AlertOctagon,
              trend: 'down',
              trendValue: '-2'
            },
            {
              label: 'معدل الامتثال',
              value: `${stats.complianceRate}%`,
              color: 'from-emerald-500 to-teal-600',
              icon: CheckCircle,
              trend: 'up',
              trendValue: '+5%'
            },
            {
              label: 'NCRs مفتوحة',
              value: stats.openNCRs,
              subValue: `${stats.avgNCRProgress}% متوسط الإنجاز`,
              color: 'from-amber-500 to-orange-600',
              icon: FileText,
            },
            {
              label: 'خطط BCP جاهزة',
              value: `${stats.bcpReady}/${BCP_SCENARIOS.length}`,
              color: 'from-blue-500 to-cyan-600',
              icon: Siren,
            },
          ].map(({ label, value, total, subValue, color, icon: Icon, trend, trendValue }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
              <div className="relative">
                <Icon className="w-6 h-6 mb-2 opacity-80" />
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-black">{value}</p>
                  {total && <span className="text-white/60 text-lg mb-0.5">/{total}</span>}
                  {trend && (
                    <span className={`flex items-center text-xs ${trend === 'up' ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {trendValue}
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm">{label}</p>
                {subValue && <p className="text-white/60 text-xs mt-1">{subValue}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.header>

      {/* التبويبات */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'risks', label: 'سجل المخاطر', icon: AlertTriangle, count: REAL_RISKS.length },
          { key: 'compliance', label: 'الامتثال', icon: Scale, count: REAL_COMPLIANCE.length },
          { key: 'ncr', label: 'عدم المطابقة', icon: FileText, count: REAL_NCRS.length },
          { key: 'bcp', label: 'استمرارية الأعمال', icon: Siren, count: BCP_SCENARIOS.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <motion.button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${activeTab === key
              ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
          >
            <Icon className="w-5 h-5" />
            {label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === key ? 'bg-white/20' : 'bg-white/10'
              }`}>
              {count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* المحتوى */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'risks' && (
              <motion.div
                key="risks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {/* الفلاتر */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === 'all' ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                  >
                    جميع الفئات
                  </button>
                  {Object.entries(CATEGORY_CONFIG).map(([key, { label, bg, color }]) => (
                    <button
                      key={key}
                      onClick={() => setFilterCategory(key as RiskCategory)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterCategory === key ? `${bg} ${color}` : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* قائمة المخاطر */}
                <div className="space-y-3">
                  {filteredRisks.map((risk, index) => (
                    <div key={risk.id}>
                      <RiskCardPro risk={risk} index={index} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'compliance' && (
              <motion.div
                key="compliance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { status: 'compliant', label: 'متوافق', count: REAL_COMPLIANCE.filter(c => c.status === 'compliant').length },
                    { status: 'partial', label: 'جزئي', count: REAL_COMPLIANCE.filter(c => c.status === 'partial').length },
                    { status: 'non_compliant', label: 'غير متوافق', count: REAL_COMPLIANCE.filter(c => c.status === 'non_compliant').length },
                  ].map(({ status, label, count }) => (
                    <div key={status} className={`p-3 rounded-xl text-center ${status === 'compliant' ? 'bg-emerald-500/20' :
                      status === 'partial' ? 'bg-amber-500/20' : 'bg-red-500/20'
                      }`}>
                      <div className={`text-2xl font-bold ${status === 'compliant' ? 'text-emerald-400' :
                        status === 'partial' ? 'text-amber-400' : 'text-red-400'
                        }`}>{count}</div>
                      <div className="text-gray-400 text-sm">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {REAL_COMPLIANCE.map((req, index) => (
                    <div key={req.id}>
                      <ComplianceCard req={req} index={index} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ncr' && (
              <motion.div
                key="ncr"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-rose-500/20 to-red-500/20 rounded-2xl p-4 border border-rose-500/30">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-400" />
                    حالات عدم المطابقة الرئيسية (NCRs)
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {REAL_NCRS.length} حالات مفتوحة | متوسط الإنجاز: {stats.avgNCRProgress}%
                  </p>
                </div>

                <div className="space-y-4">
                  {REAL_NCRS.map((ncr, index) => (
                    <div key={ncr.id}>
                      <NCRCard ncr={ncr} index={index} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'bcp' && (
              <motion.div
                key="bcp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Siren className="w-5 h-5 text-blue-400" />
                    خطط استمرارية الأعمال (BCP) - ISO 22301
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {stats.bcpReady} من {BCP_SCENARIOS.length} سيناريوهات جاهزة للتفعيل
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BCP_SCENARIOS.map((scenario, index) => (
                    <div key={scenario.id}>
                      <BCPScenarioCard scenario={scenario} index={index} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* مصفوفة المخاطر */}
          <RiskMatrixPro risks={REAL_RISKS} />

          {/* ملخص الامتثال */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              ملخص الامتثال ISO 9001
            </h3>

            <div className="relative pt-4">
              {/* الدائرة */}
              <div className="w-32 h-32 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <motion.circle
                    cx="64" cy="64" r="56"
                    fill="none"
                    stroke="url(#complianceGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 352' }}
                    animate={{ strokeDasharray: `${(stats.complianceRate / 100) * 352} 352` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="complianceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white">{stats.complianceRate}%</span>
                    <p className="text-gray-500 text-xs">متوافق</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {[
                { label: 'متوافق', count: REAL_COMPLIANCE.filter(r => r.status === 'compliant').length, color: 'bg-emerald-500' },
                { label: 'جزئي', count: REAL_COMPLIANCE.filter(r => r.status === 'partial').length, color: 'bg-amber-500' },
                { label: 'غير متوافق', count: REAL_COMPLIANCE.filter(r => r.status === 'non_compliant').length, color: 'bg-red-500' },
                { label: 'قيد التنفيذ', count: REAL_COMPLIANCE.filter(r => r.status === 'in_progress').length, color: 'bg-blue-500' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-gray-300 text-sm">{label}</span>
                  </div>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* خارطة الطريق */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10"
          >
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              خارطة الطريق للاعتماد
            </h3>

            <div className="space-y-4">
              {[
                { month: 'يناير 2026', task: 'تقييم الدفاع المدني + SOPs', status: 'current' },
                { month: 'فبراير', task: 'ترسية عقد الإطفاء + اعتماد SOPs', status: 'pending' },
                { month: 'مارس', task: 'إغلاق NCR-001 + NCR-003', status: 'pending' },
                { month: 'أبريل', task: 'تجربة إخلاء + تدقيق جزئي', status: 'pending' },
                { month: 'مايو', task: 'تدقيق داخلي شامل', status: 'pending' },
                { month: 'يونيو', task: 'مراجعة الإدارة + الجاهزية النهائية', status: 'pending' },
              ].map(({ month, task, status }, i) => (
                <div key={month} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${status === 'current' ? 'bg-teal-500 animate-pulse' : 'bg-white/20'
                    }`} />
                  <div className="flex-1">
                    <div className={`font-medium ${status === 'current' ? 'text-teal-400' : 'text-gray-400'}`}>
                      {month}
                    </div>
                    <div className="text-gray-500 text-sm">{task}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Named export for backward compatibility
export { GRCDashboardPro as GRCDashboard };
