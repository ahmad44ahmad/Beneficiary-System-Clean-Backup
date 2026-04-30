import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ChevronLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  Shield,
  Trash2,
  Sparkles,
  RefreshCw,
  Calendar,
  Plus,
} from 'lucide-react';
// Supabase access via getSupabaseClient() from hooks/queries when needed

// HRSD brand colors
const NAVY = '#0F3144';
const TEAL = '#1E6B5C';
const GOLD = '#F59601';

// ─── BICSL Competencies ────────────────────────────────────────────────
interface Competency {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const BICSL_COMPETENCIES: Competency[] = [
  { id: 'hand_hygiene', label: 'نظافة الأيدي', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'ppe_usage', label: 'استخدام معدات الوقاية', icon: <Shield className="w-4 h-4" /> },
  { id: 'waste_management', label: 'إدارة النفايات الطبية', icon: <Trash2 className="w-4 h-4" /> },
  { id: 'isolation_precautions', label: 'احتياطات العزل', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'sharps_safety', label: 'سلامة الأدوات الحادة', icon: <Award className="w-4 h-4" /> },
  { id: 'environmental_cleaning', label: 'التنظيف والتطهير البيئي', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'outbreak_response', label: 'الاستجابة للتفشي', icon: <Plus className="w-4 h-4" /> },
];

// ─── Types ─────────────────────────────────────────────────────────────
type CompetencyStatus = 'passed' | 'failed' | 'pending';
type CertificationStatus = 'certified' | 'expired' | 'pending' | 'expiring_soon';

interface CompetencyRecord {
  competencyId: string;
  status: CompetencyStatus;
  date: string | null;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  certificationStatus: CertificationStatus;
  issueDate: string | null;
  expiryDate: string | null;
  competencies: CompetencyRecord[];
}

// ─── Demo Data ─────────────────────────────────────────────────────────
const DEMO_EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'أحمد محمد الغامدي',
    department: 'تمريض',
    certificationStatus: 'certified',
    issueDate: '2025-08-15',
    expiryDate: '2026-08-15',
    competencies: BICSL_COMPETENCIES.map(c => ({
      competencyId: c.id,
      status: 'passed' as CompetencyStatus,
      date: '2025-08-10',
    })),
  },
  {
    id: '2',
    name: 'فاطمة عبدالله الزهراني',
    department: 'صيدلية',
    certificationStatus: 'certified',
    issueDate: '2025-09-01',
    expiryDate: '2026-09-01',
    competencies: BICSL_COMPETENCIES.map(c => ({
      competencyId: c.id,
      status: 'passed' as CompetencyStatus,
      date: '2025-08-28',
    })),
  },
  {
    id: '3',
    name: 'خالد سعيد القحطاني',
    department: 'نظافة',
    certificationStatus: 'certified',
    issueDate: '2025-07-20',
    expiryDate: '2026-07-20',
    competencies: BICSL_COMPETENCIES.map(c => ({
      competencyId: c.id,
      status: 'passed' as CompetencyStatus,
      date: '2025-07-15',
    })),
  },
  {
    id: '4',
    name: 'نورة حسن الشهري',
    department: 'مختبر',
    certificationStatus: 'certified',
    issueDate: '2025-10-05',
    expiryDate: '2026-10-05',
    competencies: BICSL_COMPETENCIES.map(c => ({
      competencyId: c.id,
      status: 'passed' as CompetencyStatus,
      date: '2025-10-01',
    })),
  },
  {
    id: '5',
    name: 'سعد عمر الدوسري',
    department: 'أشعة',
    certificationStatus: 'expired',
    issueDate: '2024-06-10',
    expiryDate: '2025-06-10',
    competencies: BICSL_COMPETENCIES.map((c, i) => ({
      competencyId: c.id,
      status: (i < 5 ? 'passed' : 'failed') as CompetencyStatus,
      date: i < 5 ? '2024-06-05' : '2024-06-08',
    })),
  },
  {
    id: '6',
    name: 'ريم خالد العتيبي',
    department: 'طوارئ',
    certificationStatus: 'expired',
    issueDate: '2024-04-20',
    expiryDate: '2025-04-20',
    competencies: BICSL_COMPETENCIES.map((c, i) => ({
      competencyId: c.id,
      status: (i < 4 ? 'passed' : 'failed') as CompetencyStatus,
      date: i < 4 ? '2024-04-15' : '2024-04-18',
    })),
  },
  {
    id: '7',
    name: 'محمد علي الحربي',
    department: 'إدارة',
    certificationStatus: 'pending',
    issueDate: null,
    expiryDate: null,
    competencies: BICSL_COMPETENCIES.map((c, i) => ({
      competencyId: c.id,
      status: (i < 3 ? 'passed' : 'pending') as CompetencyStatus,
      date: i < 3 ? '2026-01-20' : null,
    })),
  },
  {
    id: '8',
    name: 'عائشة يوسف المالكي',
    department: 'تأهيل',
    certificationStatus: 'pending',
    issueDate: null,
    expiryDate: null,
    competencies: BICSL_COMPETENCIES.map((c, i) => ({
      competencyId: c.id,
      status: (i < 5 ? 'passed' : 'pending') as CompetencyStatus,
      date: i < 5 ? '2026-02-05' : null,
    })),
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────
function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: CertificationStatus) {
  const map: Record<CertificationStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    certified: {
      label: 'حاصل على الرخصة',
      bg: 'bg-[#2BB574]/15',
      text: 'text-[#1E9658]',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    expired: {
      label: 'منتهية الصلاحية',
      bg: 'bg-[#DC2626]/15',
      text: 'text-[#B91C1C]',
      icon: <XCircle className="w-4 h-4" />,
    },
    pending: {
      label: 'قيد الإصدار',
      bg: 'bg-[#FCB614]/15',
      text: 'text-[#D49A0A]',
      icon: <Clock className="w-4 h-4" />,
    },
    expiring_soon: {
      label: 'تنتهي قريباً',
      bg: 'bg-[#F7941D]/15',
      text: 'text-[#D67A0A]',
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  };
  return map[status];
}

function getCompetencyStatusStyle(status: CompetencyStatus) {
  const map: Record<CompetencyStatus, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
    passed: {
      bg: 'bg-[#2BB574]/15',
      text: 'text-[#1E9658]',
      label: 'ناجح',
      icon: <CheckCircle2 className="w-4 h-4 text-[#1E9658]" />,
    },
    failed: {
      bg: 'bg-[#DC2626]/15',
      text: 'text-[#B91C1C]',
      label: 'غير ناجح',
      icon: <XCircle className="w-4 h-4 text-[#DC2626]" />,
    },
    pending: {
      bg: 'bg-[#FCB614]/15',
      text: 'text-[#D49A0A]',
      label: 'معلّق',
      icon: <Clock className="w-4 h-4 text-[#D49A0A]" />,
    },
  };
  return map[status];
}

// ─── Component ─────────────────────────────────────────────────────────
export const BICLSCertification: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CertificationStatus>('all');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);

  // ── KPI calculations ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = DEMO_EMPLOYEES.length;
    const certified = DEMO_EMPLOYEES.filter(e => e.certificationStatus === 'certified').length;
    const expired = DEMO_EMPLOYEES.filter(e => e.certificationStatus === 'expired').length;
    const pending = DEMO_EMPLOYEES.filter(e => e.certificationStatus === 'pending').length;
    const expiringThreshold = new Date();
    expiringThreshold.setDate(expiringThreshold.getDate() + 90);
    const expiringSoon = DEMO_EMPLOYEES.filter(e => {
      if (e.certificationStatus !== 'certified' || !e.expiryDate) return false;
      return new Date(e.expiryDate) <= expiringThreshold;
    }).length;
    return { total, certified, expired, pending, expiringSoon };
  }, []);

  // ── Filtered employees ────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    return DEMO_EMPLOYEES.filter(emp => {
      const matchesSearch =
        searchQuery === '' ||
        emp.name.includes(searchQuery) ||
        emp.department.includes(searchQuery);
      const matchesStatus =
        statusFilter === 'all' || emp.certificationStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const coveragePercent = stats.total > 0
    ? Math.round((stats.certified / stats.total) * 100)
    : 0;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/ipc')}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: NAVY }} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            نظام رخصة BICSL
          </h1>
          <p className="text-sm text-gray-500">
            رخصة التحكم السلوكي في العدوى ومستوى السلامة
          </p>
        </div>
        <div className="mr-auto">
          <Award className="w-10 h-10" style={{ color: GOLD }} />
        </div>
      </div>

      {/* ── KPI Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" style={{ color: NAVY }} />
            <span className="text-sm text-gray-500">إجمالي الموظفين</span>
          </div>
          <p className="text-3xl font-bold" style={{ color: NAVY }}>{stats.total}</p>
        </div>
        {/* Certified */}
        <div className="bg-white rounded-xl shadow-sm border border-[#2BB574]/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-[#1E9658]" />
            <span className="text-sm text-gray-500">حاصلون على الرخصة</span>
          </div>
          <p className="text-3xl font-bold text-[#1E9658]">{stats.certified}</p>
        </div>
        {/* Expired */}
        <div className="bg-white rounded-xl shadow-sm border border-[#DC2626]/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-[#DC2626]" />
            <span className="text-sm text-gray-500">منتهية الصلاحية</span>
          </div>
          <p className="text-3xl font-bold text-[#DC2626]">{stats.expired}</p>
        </div>
        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-sm border border-[#FCB614]/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#D49A0A]" />
            <span className="text-sm text-gray-500">تنتهي خلال 90 يوم</span>
          </div>
          <p className="text-3xl font-bold text-[#D49A0A]">{stats.expiringSoon}</p>
        </div>
      </div>

      {/* ── Coverage Progress ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: NAVY }}>
            نسبة التغطية بالرخصة
          </span>
          <span className="text-sm font-bold" style={{ color: TEAL }}>
            {coveragePercent}% ({stats.certified}/{stats.total})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full transition-all duration-700"
            style={{
              width: `${coveragePercent}%`,
              background: `linear-gradient(90deg, ${TEAL}, ${NAVY})`,
            }}
          />
        </div>
      </div>

      {/* ── Search & Filter ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو القسم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | CertificationStatus)}
            className="pr-9 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none
                       bg-white focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': TEAL } as React.CSSProperties}
          >
            <option value="all">جميع الحالات</option>
            <option value="certified">حاصل على الرخصة</option>
            <option value="expired">منتهية الصلاحية</option>
            <option value="pending">قيد الإصدار</option>
          </select>
        </div>
      </div>

      {/* ── Employee Table ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-2 px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100"
             style={{ backgroundColor: '#f8fafc' }}>
          <span>الموظف</span>
          <span>الكفاءات</span>
          <span>حالة الرخصة</span>
          <span>تاريخ الإصدار</span>
          <span>تاريخ الانتهاء</span>
          <span>إجراء</span>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>لا توجد نتائج مطابقة</p>
          </div>
        )}

        {filteredEmployees.map(emp => {
          const badge = getStatusBadge(emp.certificationStatus);
          const passedCount = emp.competencies.filter(c => c.status === 'passed').length;
          const totalComp = BICSL_COMPETENCIES.length;
          const compPercent = Math.round((passedCount / totalComp) * 100);
          const isExpanded = expandedEmployeeId === emp.id;

          return (
            <div key={emp.id} className="border-b border-gray-50 last:border-b-0">
              {/* ── Row ───────────────────────────────────────────── */}
              <div
                className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.8fr] gap-2 px-4 py-3.5
                           items-center hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setExpandedEmployeeId(isExpanded ? null : emp.id)}
              >
                {/* Employee */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: NAVY }}
                  >
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.department}</p>
                  </div>
                </div>

                {/* Competencies */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {passedCount}/{totalComp}
                  </span>
                  <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${compPercent}%`,
                        backgroundColor:
                          compPercent === 100 ? '#059669' : compPercent >= 50 ? GOLD : '#DC2626',
                      }}
                    />
                  </div>
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                </div>

                {/* Issue date */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(emp.issueDate)}
                </div>

                {/* Expiry date */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formatDate(emp.expiryDate)}
                </div>

                {/* Action */}
                <div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setExpandedEmployeeId(isExpanded ? null : emp.id);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                    style={{ backgroundColor: TEAL }}
                  >
                    {isExpanded ? 'إخفاء' : 'التفاصيل'}
                  </button>
                </div>
              </div>

              {/* ── Expanded Detail ───────────────────────────────── */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: TEAL }} />
                    <h3 className="text-sm font-bold" style={{ color: NAVY }}>
                      تفاصيل الكفاءات — {emp.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {emp.competencies.map(cr => {
                      const compDef = BICSL_COMPETENCIES.find(c => c.id === cr.competencyId);
                      const style = getCompetencyStatusStyle(cr.status);
                      if (!compDef) return null;

                      return (
                        <div
                          key={cr.competencyId}
                          className={`rounded-lg border p-3 ${style.bg} border-opacity-40`}
                          style={{ borderColor: cr.status === 'passed' ? '#a7f3d0' : cr.status === 'failed' ? '#fecaca' : '#fde68a' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {compDef.icon}
                            <span className={`text-sm font-semibold ${style.text}`}>
                              {compDef.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${style.text}`}>
                              {style.icon}
                              {style.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {cr.date ? formatDate(cr.date) : '—'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overall certification status in detail */}
                  <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
                    <Award className="w-6 h-6" style={{ color: GOLD }} />
                    <div>
                      <p className="text-xs text-gray-500">الحالة الإجمالية للرخصة</p>
                      <span className={`inline-flex items-center gap-1 text-sm font-bold ${badge.text}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    <div className="mr-auto text-left">
                      <p className="text-xs text-gray-500">الكفاءات المجتازة</p>
                      <p className="text-sm font-bold" style={{ color: NAVY }}>
                        {passedCount} / {totalComp}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
