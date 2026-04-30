import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon, ChevronLeft, Search, Shield, Users, MapPin,
  Calendar, Activity, CheckCircle2, XCircle, Clock, Phone,
  FileText, Plus, Filter, TrendingUp, AlertTriangle, Eye
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// HRSD brand colors
const NAVY = '#0F3144';
const TEAL = '#269798';

type TabType = 'dashboard' | 'tracing' | 'protocols';
type Severity = 'low' | 'moderate' | 'high' | 'critical';
type ContainmentStatus = 'active' | 'contained' | 'resolved';
type ContactType = 'beneficiary' | 'staff' | 'visitor';
type ExposureLevel = 'close' | 'casual' | 'indirect';
type ContactStatus = 'active' | 'symptomatic' | 'cleared' | 'infected';

interface Outbreak {
  code: string;
  pathogen: string;
  severity: Severity;
  location: string;
  staff_affected: number;
  beneficiaries_affected: number;
  containment_status: ContainmentStatus;
  moh_notified: boolean;
  detection_date: string;
}

interface Contact {
  name: string;
  type: ContactType;
  outbreak: string;
  exposure: ExposureLevel;
  status: ContactStatus;
  end_date: string;
}

// Demo data
const outbreaks: Outbreak[] = [
  {
    code: 'OB-2026-001',
    pathogen: 'Norovirus',
    severity: 'high',
    location: 'جناح الذكور أ',
    staff_affected: 2,
    beneficiaries_affected: 5,
    containment_status: 'active',
    moh_notified: true,
    detection_date: '2026-02-10',
  },
  {
    code: 'OB-2025-003',
    pathogen: 'Influenza A',
    severity: 'moderate',
    location: 'جناح الإناث ب',
    staff_affected: 1,
    beneficiaries_affected: 3,
    containment_status: 'contained',
    moh_notified: true,
    detection_date: '2025-12-15',
  },
  {
    code: 'OB-2025-002',
    pathogen: 'Scabies',
    severity: 'low',
    location: 'جناح الذكور ب',
    staff_affected: 0,
    beneficiaries_affected: 2,
    containment_status: 'resolved',
    moh_notified: false,
    detection_date: '2025-11-20',
  },
];

const contacts: Contact[] = [
  { name: 'محمد أحمد', type: 'beneficiary', outbreak: 'OB-2026-001', exposure: 'close', status: 'active', end_date: '2026-02-24' },
  { name: 'سارة خالد', type: 'staff', outbreak: 'OB-2026-001', exposure: 'close', status: 'symptomatic', end_date: '2026-02-24' },
  { name: 'عبدالله سعد', type: 'beneficiary', outbreak: 'OB-2026-001', exposure: 'casual', status: 'active', end_date: '2026-02-24' },
  { name: 'هدى محمد', type: 'visitor', outbreak: 'OB-2026-001', exposure: 'indirect', status: 'cleared', end_date: '2026-02-20' },
  { name: 'ريم علي', type: 'staff', outbreak: 'OB-2025-003', exposure: 'close', status: 'cleared', end_date: '2026-01-05' },
  { name: 'يوسف إبراهيم', type: 'beneficiary', outbreak: 'OB-2025-003', exposure: 'casual', status: 'cleared', end_date: '2026-01-05' },
];

const monthlyData = [
  { month: 'سبتمبر', count: 0 },
  { month: 'أكتوبر', count: 1 },
  { month: 'نوفمبر', count: 1 },
  { month: 'ديسمبر', count: 1 },
  { month: 'يناير', count: 0 },
  { month: 'فبراير', count: 1 },
];

const protocols = [
  {
    id: 1,
    title: 'إعلان التفشي',
    icon: <AlertOctagon className="w-5 h-5" />,
    criteria: '2+ حالات مرتبطة وبائياً في نفس الموقع خلال فترة حضانة المرض',
    steps: [
      'التحقق من وجود حالتين مؤكدتين أو أكثر مرتبطتين وبائياً',
      'تأكيد الارتباط الزمني والمكاني بين الحالات',
      'إشعار مسؤول مكافحة العدوى فوراً',
      'تفعيل فريق إدارة التفشي',
      'توثيق تاريخ ووقت إعلان التفشي',
    ],
  },
  {
    id: 2,
    title: 'الإبلاغ الخارجي',
    icon: <Phone className="w-5 h-5" />,
    criteria: 'وزارة الصحة خلال 24 ساعة، الطب الوقائي بالمنطقة',
    steps: [
      'إبلاغ وزارة الصحة خلال 24 ساعة من إعلان التفشي',
      'إرسال تقرير مبدئي لإدارة الطب الوقائي بالمنطقة',
      'تحديث البيانات في نظام الإنذار المبكر',
      'إبلاغ الجهات الرقابية المعنية حسب نوع الممرض',
      'توثيق جميع الاتصالات والمراسلات الخارجية',
    ],
  },
  {
    id: 3,
    title: 'تدابير الاحتواء',
    icon: <Shield className="w-5 h-5" />,
    criteria: 'عزل المصابين، تعزيز نظافة الأيدي، تكثيف التنظيف، تقييد التنقل',
    steps: [
      'عزل المصابين في غرف مخصصة مع احتياطات العزل المناسبة',
      'تعزيز بروتوكولات نظافة الأيدي لجميع الكوادر',
      'تكثيف التنظيف والتعقيم في المناطق المتأثرة',
      'تقييد حركة التنقل بين الأجنحة والأقسام',
      'تخصيص معدات وأدوات لكل قسم متأثر',
      'مراجعة وتعزيز إجراءات معدات الوقاية الشخصية',
    ],
  },
  {
    id: 4,
    title: 'فحص المخالطين',
    icon: <Users className="w-5 h-5" />,
    criteria: 'تحديد جميع المعرضين، مراقبة يومية للأعراض، فحوصات مخبرية',
    steps: [
      'تحديد وحصر جميع المخالطين (مقيمين، موظفين، زوار)',
      'تصنيف المخالطين حسب مستوى التعرض (مباشر، عرضي، غير مباشر)',
      'بدء المراقبة اليومية للأعراض لجميع المخالطين',
      'إجراء الفحوصات المخبرية اللازمة حسب نوع الممرض',
      'تحديث قاعدة بيانات تتبع المخالطين يومياً',
      'إبلاغ المخالطين بالإجراءات الوقائية المطلوبة',
    ],
  },
  {
    id: 5,
    title: 'التواصل',
    icon: <FileText className="w-5 h-5" />,
    criteria: 'إبلاغ الإدارة، الأقسام المتأثرة، الأسر',
    steps: [
      'إبلاغ الإدارة العليا بتفاصيل التفشي والإجراءات المتخذة',
      'إشعار رؤساء الأقسام المتأثرة والأقسام المجاورة',
      'إبلاغ أسر المقيمين المتأثرين مع الحفاظ على السرية',
      'إصدار تحديثات دورية لجميع الأطراف المعنية',
      'توثيق جميع الاتصالات في سجل التفشي',
    ],
  },
  {
    id: 6,
    title: 'إنهاء التفشي',
    icon: <CheckCircle2 className="w-5 h-5" />,
    criteria: 'مرور فترتي حضانة بدون حالات جديدة، تقرير ختامي، الدروس المستفادة',
    steps: [
      'التأكد من مرور فترتي حضانة كاملتين بدون تسجيل حالات جديدة',
      'إعداد التقرير الختامي الشامل للتفشي',
      'عقد اجتماع الدروس المستفادة مع فريق إدارة التفشي',
      'تحديث السياسات والإجراءات بناءً على الدروس المستفادة',
      'إبلاغ الجهات الخارجية بإنهاء التفشي رسمياً',
      'أرشفة جميع الوثائق والتقارير المتعلقة بالتفشي',
    ],
  },
];

const severityConfig: Record<Severity, { label: string; bg: string; text: string; border: string }> = {
  low: { label: 'منخفض', bg: 'bg-[#269798]/10', text: 'text-[#269798]', border: 'border-[#269798]/30' },
  moderate: { label: 'متوسط', bg: 'bg-[#FCB614]/10', text: 'text-[#FCB614]', border: 'border-[#FCB614]/30' },
  high: { label: 'مرتفع', bg: 'bg-[#F7941D]/10', text: 'text-[#F7941D]', border: 'border-[#F7941D]/30' },
  critical: { label: 'حرج', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', border: 'border-[#DC2626]/30' },
};

const containmentLabels: Record<ContainmentStatus, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'text-[#DC2626]' },
  contained: { label: 'محتوى', color: 'text-[#FCB614]' },
  resolved: { label: 'منتهي', color: 'text-[#2BB574]' },
};

const contactTypeLabels: Record<ContactType, { label: string; bg: string; text: string }> = {
  beneficiary: { label: 'مستفيد', bg: 'bg-[#269798]/10', text: 'text-[#269798]' },
  staff: { label: 'موظف', bg: 'bg-[#269798]/10', text: 'text-[#269798]' },
  visitor: { label: 'زائر', bg: 'bg-[#FCB614]/10', text: 'text-[#FCB614]' },
};

const exposureLabels: Record<ExposureLevel, { label: string; bg: string; text: string }> = {
  close: { label: 'مباشر', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' },
  casual: { label: 'عرضي', bg: 'bg-[#FCB614]/10', text: 'text-[#FCB614]' },
  indirect: { label: 'غير مباشر', bg: 'bg-gray-50', text: 'text-gray-700' },
};

const contactStatusConfig: Record<ContactStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'تحت المراقبة', bg: 'bg-[#FCB614]/10', text: 'text-[#FCB614]' },
  symptomatic: { label: 'أعراض ظاهرة', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]' },
  cleared: { label: 'تم الإخلاء', bg: 'bg-[#2BB574]/10', text: 'text-[#2BB574]' },
  infected: { label: 'مصاب', bg: 'bg-[#DC2626]/15', text: 'text-[#7F1D1D]' },
};

const PIE_COLORS = [NAVY, TEAL, '#D4AF37', '#DC2626'];

export const OutbreakManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedOutbreak, setSelectedOutbreak] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProtocol, setExpandedProtocol] = useState<number | null>(1);

  const activeOutbreaks = useMemo(
    () => outbreaks.filter((o) => o.containment_status === 'active'),
    []
  );

  const totalContacts = useMemo(() => contacts.length, []);

  const mohNotified = useMemo(
    () => outbreaks.filter((o) => o.moh_notified).length,
    []
  );

  const containedCount = useMemo(
    () => outbreaks.filter((o) => o.containment_status === 'contained' || o.containment_status === 'resolved').length,
    []
  );

  const filteredContacts = useMemo(() => {
    let result = contacts;
    if (selectedOutbreak !== 'all') {
      result = result.filter((c) => c.outbreak === selectedOutbreak);
    }
    if (searchTerm) {
      result = result.filter((c) =>
        c.name.includes(searchTerm) || c.outbreak.includes(searchTerm)
      );
    }
    return result;
  }, [selectedOutbreak, searchTerm]);

  const severityDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    outbreaks.forEach((o) => {
      const label = severityConfig[o.severity].label;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  const containmentProgress = (status: ContainmentStatus): number => {
    if (status === 'resolved') return 100;
    if (status === 'contained') return 70;
    return 35;
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'لوحة التفشي', icon: <Activity className="w-4 h-4" /> },
    { key: 'tracing', label: 'تتبع المخالطين', icon: <Users className="w-4 h-4" /> },
    { key: 'protocols', label: 'البروتوكولات', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/ipc')}
            className="p-2 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
              إدارة التفشي
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              كشف التفشي وتتبع المخالطين وبروتوكولات الاحتواء
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: TEAL }}>
            <Plus className="w-4 h-4" />
            <span>تسجيل تفشي جديد</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            style={activeTab === tab.key ? { backgroundColor: NAVY } : undefined}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Outbreaks */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
              {activeOutbreaks.length > 0 && (
                <div className="absolute top-3 left-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DC2626]" />
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">تفشيات نشطة</p>
                  <p className="text-3xl font-bold text-gray-800">{activeOutbreaks.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#DC2626]/10">
                  <AlertOctagon className="w-6 h-6 text-[#DC2626]" />
                </div>
              </div>
            </div>

            {/* Total Contacts */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">إجمالي المخالطين</p>
                  <p className="text-3xl font-bold text-gray-800">{totalContacts}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#269798]/10">
                  <Users className="w-6 h-6 text-[#269798]" />
                </div>
              </div>
            </div>

            {/* MOH Notified */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">مبلّغ لوزارة الصحة</p>
                  <p className="text-3xl font-bold text-gray-800">{mohNotified}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FCB614]/10">
                  <Phone className="w-6 h-6 text-[#FCB614]" />
                </div>
              </div>
            </div>

            {/* Contained */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">محتوى بنجاح</p>
                  <p className="text-3xl font-bold text-gray-800">{containedCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#2BB574]/10">
                  <CheckCircle2 className="w-6 h-6 text-[#2BB574]" />
                </div>
              </div>
            </div>
          </div>

          {/* Active Outbreaks + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Outbreaks List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#F7941D]" />
                التفشيات المسجلة
              </h2>
              {outbreaks.map((outbreak) => {
                const sev = severityConfig[outbreak.severity];
                const cont = containmentLabels[outbreak.containment_status];
                const progress = containmentProgress(outbreak.containment_status);
                return (
                  <div
                    key={outbreak.code}
                    className={`bg-white rounded-2xl p-5 shadow-sm border ${
                      outbreak.containment_status === 'active' ? 'border-[#DC2626]/30' : 'border-gray-100'
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2.5 rounded-xl"
                          style={{ backgroundColor: outbreak.containment_status === 'active' ? '#FEF2F2' : '#F0FDF4' }}
                        >
                          <Activity
                            className="w-5 h-5"
                            style={{ color: outbreak.containment_status === 'active' ? '#DC2626' : '#16A34A' }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-base">{outbreak.code}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${sev.bg} ${sev.text} border ${sev.border}`}>
                              {sev.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{outbreak.pathogen}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${cont.color}`}>{cont.label}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {outbreak.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        {outbreak.beneficiaries_affected} مستفيد + {outbreak.staff_affected} موظف
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {outbreak.detection_date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {outbreak.moh_notified ? (
                          <span className="flex items-center gap-1 text-[#2BB574]">
                            <CheckCircle2 className="w-4 h-4" />
                            مبلّغ للوزارة
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400">
                            <XCircle className="w-4 h-4" />
                            غير مبلّغ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Containment Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">تقدم الاحتواء</span>
                        <span className="text-xs font-medium text-gray-700">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: progress === 100 ? '#16A34A' : progress >= 70 ? '#D97706' : '#DC2626',
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: NAVY }}>
                        <Eye className="w-3.5 h-3.5" />
                        عرض التفاصيل
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: TEAL }}>
                        <Plus className="w-3.5 h-3.5" />
                        إضافة مخالط
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="space-y-4">
              {/* Monthly Bar Chart */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" style={{ color: TEAL }} />
                  التفشيات حسب الشهر
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
                      formatter={(value: number) => [value, 'تفشيات']}
                    />
                    <Bar dataKey="count" fill={NAVY} radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Severity Distribution Pie */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" style={{ color: NAVY }} />
                  توزيع الشدة
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={severityDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {severityDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', direction: 'rtl' }}
                      formatter={(value: number) => [value, 'تفشي']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {severityDistribution.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tracing Tab */}
      {activeTab === 'tracing' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث بالاسم أو رمز التفشي..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-gray-50"
                  style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedOutbreak}
                  onChange={(e) => setSelectedOutbreak(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                >
                  <option value="all">جميع التفشيات</option>
                  {outbreaks.map((o) => (
                    <option key={o.code} value={o.code}>
                      {o.code} — {o.pathogen}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: `${NAVY}08` }}>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">الاسم</th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">النوع</th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">رمز التفشي</th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">مستوى التعرض</th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">حالة المراقبة</th>
                    <th className="text-right py-3.5 px-4 text-xs font-semibold text-gray-600">تاريخ انتهاء المراقبة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                        لا توجد نتائج مطابقة
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact, idx) => {
                      const cType = contactTypeLabels[contact.type];
                      const exp = exposureLabels[contact.exposure];
                      const cStatus = contactStatusConfig[contact.status];
                      return (
                        <tr
                          key={`${contact.name}-${idx}`}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="text-sm font-medium text-gray-800">{contact.name}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cType.bg} ${cType.text}`}>
                              {cType.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 font-mono">{contact.outbreak}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${exp.bg} ${exp.text}`}>
                              {exp.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cStatus.bg} ${cStatus.text}`}>
                              {cStatus.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {contact.end_date}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                عرض {filteredContacts.length} من {contacts.length} مخالط
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: TEAL }}>
                <Plus className="w-3.5 h-3.5" />
                إضافة مخالط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Protocols Tab */}
      {activeTab === 'protocols' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: NAVY }} />
              بروتوكولات الاحتواء
            </h2>
            <span className="text-xs text-gray-400">{protocols.length} بروتوكولات</span>
          </div>

          {protocols.map((protocol) => {
            const isExpanded = expandedProtocol === protocol.id;
            return (
              <div
                key={protocol.id}
                className={`bg-white rounded-2xl shadow-sm border transition-all ${
                  isExpanded ? 'border-gray-200 shadow-md' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => setExpandedProtocol(isExpanded ? null : protocol.id)}
                  className="w-full flex items-center justify-between p-5 text-right"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl text-white"
                      style={{ backgroundColor: isExpanded ? NAVY : '#E5E7EB' }}
                    >
                      <span style={{ color: isExpanded ? 'white' : '#6B7280' }}>
                        {protocol.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">
                        {protocol.id}. {protocol.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{protocol.criteria}</p>
                    </div>
                  </div>
                  <ChevronLeft
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">الخطوات الإجرائية:</h4>
                      <div className="space-y-2.5">
                        {protocol.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold"
                              style={{ backgroundColor: TEAL }}
                            >
                              {idx + 1}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
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
      )}
    </div>
  );
};

export default OutbreakManagement;
