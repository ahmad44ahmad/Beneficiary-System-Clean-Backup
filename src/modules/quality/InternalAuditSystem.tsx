import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  ClipboardCheck,
  Calendar,
  FileText,
  Search,
  Filter,
  X,
  AlertTriangle,
  AlertOctagon,
  Info,
  Lightbulb,
  Clock,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import {
  internalAuditService,
  AuditCycle,
  InternalAudit,
  AuditFinding,
} from '../../services/internalAuditService';
import {
  ISO_AUDIT_CLAUSES,
  AUDIT_RESULT_OPTIONS,
  DEPARTMENTS,
} from '../../data/isoAuditClauses';

// ─── HRSD Brand Colors ────────────────────────────────────────────────────────
const HRSD = {
  teal: '#269798',
  navy: '#0F3144',
  gold: '#FCB614',
};

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_CYCLES: AuditCycle[] = [
  {
    id: 'demo-cycle-1',
    cycle_name: 'دورة التدقيق الربع الرابع 2025',
    cycle_year: 2025,
    cycle_quarter: 4,
    planned_start_date: '2025-10-01',
    planned_end_date: '2025-12-31',
    lead_auditor: 'د. محمد العتيبي',
    status: 'completed',
    scope: 'تدقيق شامل لجميع البنود',
    created_at: '2025-09-15T00:00:00Z',
  },
  {
    id: 'demo-cycle-2',
    cycle_name: 'دورة التدقيق الربع الأول 2026',
    cycle_year: 2026,
    cycle_quarter: 1,
    planned_start_date: '2026-01-15',
    planned_end_date: '2026-03-31',
    lead_auditor: 'أ. فاطمة الزهراني',
    status: 'in_progress',
    scope: 'البنود 4-7 مع التركيز على إدارة المخاطر',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'demo-cycle-3',
    cycle_name: 'دورة التدقيق الربع الثاني 2026',
    cycle_year: 2026,
    cycle_quarter: 2,
    planned_start_date: '2026-04-01',
    planned_end_date: '2026-06-30',
    lead_auditor: 'د. خالد السبيعي',
    status: 'planned',
    scope: 'البنود 8-10 والعمليات التشغيلية',
    created_at: '2026-02-10T00:00:00Z',
  },
];

const DEMO_AUDITS: InternalAudit[] = [
  {
    id: 'demo-audit-1',
    cycle_id: 'demo-cycle-1',
    audit_code: 'IA-2025-Q4-001',
    iso_clause: '4',
    department: 'الإدارة العليا',
    auditor_name: 'أحمد سعيد',
    planned_date: '2025-10-15',
    actual_date: '2025-10-15',
    status: 'completed',
    overall_result: 'conforming',
    checklist_data: {},
    ncr_ids: [],
    created_at: '2025-10-01T00:00:00Z',
  },
  {
    id: 'demo-audit-2',
    cycle_id: 'demo-cycle-1',
    audit_code: 'IA-2025-Q4-002',
    iso_clause: '5',
    department: 'الخدمات الطبية',
    auditor_name: 'فاطمة محمد',
    planned_date: '2025-10-20',
    actual_date: '2025-10-20',
    status: 'completed',
    overall_result: 'minor_nc',
    checklist_data: {},
    ncr_ids: ['F-001'],
    created_at: '2025-10-05T00:00:00Z',
  },
  {
    id: 'demo-audit-3',
    cycle_id: 'demo-cycle-1',
    audit_code: 'IA-2025-Q4-003',
    iso_clause: '8',
    department: 'خدمات التأهيل',
    auditor_name: 'خالد عمر',
    planned_date: '2025-11-01',
    actual_date: '2025-11-01',
    status: 'completed',
    overall_result: 'major_nc',
    checklist_data: {},
    ncr_ids: ['F-002'],
    created_at: '2025-10-15T00:00:00Z',
  },
  {
    id: 'demo-audit-4',
    cycle_id: 'demo-cycle-2',
    audit_code: 'IA-2026-Q1-001',
    iso_clause: '4',
    department: 'الشؤون الإدارية',
    auditor_name: 'أحمد سعيد',
    planned_date: '2026-01-20',
    actual_date: '2026-01-20',
    status: 'completed',
    overall_result: 'observation',
    checklist_data: {},
    ncr_ids: ['F-003'],
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'demo-audit-5',
    cycle_id: 'demo-cycle-2',
    audit_code: 'IA-2026-Q1-002',
    iso_clause: '7',
    department: 'الموارد البشرية',
    auditor_name: 'فاطمة محمد',
    planned_date: '2026-02-15',
    status: 'in_progress',
    checklist_data: {},
    ncr_ids: [],
    created_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'demo-audit-6',
    cycle_id: 'demo-cycle-2',
    audit_code: 'IA-2026-Q1-003',
    iso_clause: '6',
    department: 'الخدمات الاجتماعية',
    auditor_name: 'خالد عمر',
    planned_date: '2026-03-01',
    status: 'planned',
    checklist_data: {},
    ncr_ids: [],
    created_at: '2026-01-25T00:00:00Z',
  },
];

const DEMO_FINDINGS: AuditFinding[] = [
  {
    id: 'demo-finding-1',
    audit_id: 'demo-audit-2',
    finding_code: 'NCR-2025-001',
    finding_type: 'minor_nc',
    iso_clause: '5.3',
    description: 'عدم تحديث مصفوفة الصلاحيات بعد التغيير التنظيمي الأخير',
    evidence: 'مصفوفة RACI لم تُحدّث منذ 6 أشهر',
    root_cause: 'عدم وجود آلية مراجعة دورية للمصفوفة',
    corrective_action: 'تحديث مصفوفة الصلاحيات وجدولة مراجعة ربع سنوية',
    responsible_person: 'مدير الموارد البشرية',
    due_date: '2026-01-30',
    completion_date: '2026-01-25',
    verification_date: '2026-02-01',
    status: 'closed',
    created_at: '2025-10-20T00:00:00Z',
  },
  {
    id: 'demo-finding-2',
    audit_id: 'demo-audit-3',
    finding_code: 'NCR-2025-002',
    finding_type: 'major_nc',
    iso_clause: '8.5.1',
    description: 'عدم توثيق 3 برامج تأهيلية وفق متطلبات البند 8.3',
    evidence: 'برامج بدون وثائق تصميم وتطوير معتمدة',
    root_cause: 'عدم وجود إجراء موثق لتوثيق البرامج الجديدة',
    corrective_action: 'إعداد وثائق تصميم وتطوير لكل برنامج تأهيلي',
    responsible_person: 'مدير خدمات التأهيل',
    due_date: '2026-03-30',
    status: 'in_progress',
    created_at: '2025-11-01T00:00:00Z',
  },
  {
    id: 'demo-finding-3',
    audit_id: 'demo-audit-4',
    finding_code: 'OBS-2026-001',
    finding_type: 'observation',
    iso_clause: '4.1',
    description: 'يمكن تحسين آلية رصد التغييرات في البيئة الخارجية',
    evidence: 'لا يوجد جدول زمني محدد لمراجعة السياق الخارجي',
    corrective_action: 'إعداد جدول مراجعة ربع سنوي للسياق الخارجي',
    responsible_person: 'مدير الجودة',
    due_date: '2026-04-15',
    status: 'action_planned',
    created_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'demo-finding-4',
    audit_id: 'demo-audit-4',
    finding_code: 'OFI-2026-001',
    finding_type: 'opportunity',
    iso_clause: '4.4',
    description: 'فرصة لتطبيق أتمتة العمليات الإدارية باستخدام النظام الإلكتروني',
    responsible_person: 'مدير تقنية المعلومات',
    due_date: '2026-06-30',
    status: 'open',
    created_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'demo-finding-5',
    audit_id: 'demo-audit-2',
    finding_code: 'NCR-2025-003',
    finding_type: 'minor_nc',
    iso_clause: '5.2',
    description: 'سياسة الجودة غير معلّقة في بعض الأقسام',
    evidence: 'قسم الصيانة وقسم الإعاشة بدون لوحة سياسة الجودة',
    corrective_action: 'طباعة وتعليق سياسة الجودة في جميع الأقسام',
    responsible_person: 'منسق الجودة',
    due_date: '2025-12-15',
    completion_date: '2025-12-10',
    status: 'completed',
    created_at: '2025-10-20T00:00:00Z',
  },
];

// ─── Status Helpers ───────────────────────────────────────────────────────────
const CYCLE_STATUS_MAP: Record<AuditCycle['status'], { label: string; color: string }> = {
  planned: { label: 'مخطط', color: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-[#269798]/15 text-[#269798]' },
  completed: { label: 'مكتمل', color: 'bg-[#2BB574]/15 text-[#2BB574]' },
  cancelled: { label: 'ملغي', color: 'bg-[#DC2626]/15 text-[#DC2626]' },
};

const FINDING_STATUS_MAP: Record<AuditFinding['status'], { label: string; color: string }> = {
  open: { label: 'مفتوح', color: 'bg-[#DC2626]/15 text-[#DC2626]' },
  action_planned: { label: 'إجراء مخطط', color: 'bg-[#F7941D]/15 text-[#F7941D]' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-[#FCB614]/10 text-[#FCB614]' },
  completed: { label: 'مكتمل', color: 'bg-[#269798]/15 text-[#269798]' },
  verified: { label: 'تم التحقق', color: 'bg-[#2BB574]/15 text-[#2BB574]' },
  closed: { label: 'مغلق', color: 'bg-gray-100 text-gray-600' },
};

const FINDING_TYPE_MAP: Record<AuditFinding['finding_type'], { label: string; icon: React.ReactNode; color: string }> = {
  major_nc: { label: 'عدم مطابقة رئيسي', icon: <AlertOctagon className="w-4 h-4" />, color: 'bg-[#DC2626]/15 text-[#7F1D1D]' },
  minor_nc: { label: 'عدم مطابقة بسيط', icon: <AlertTriangle className="w-4 h-4" />, color: 'bg-[#FCB614]/15 text-[#0F3144]' },
  observation: { label: 'ملاحظة', icon: <Info className="w-4 h-4" />, color: 'bg-[#269798]/15 text-[#269798]' },
  opportunity: { label: 'فرصة تحسين', icon: <Lightbulb className="w-4 h-4" />, color: 'bg-[#FCB614]/15 text-[#0F3144]' },
  strength: { label: 'نقطة قوة', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-[#2BB574]/15 text-[#0F3144]' },
};

// ─── Tab Type ─────────────────────────────────────────────────────────────────
type TabKey = 'cycles' | 'audits' | 'findings';

// ─── Main Component ───────────────────────────────────────────────────────────
export const InternalAuditSystem: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('cycles');
  const [loading, setLoading] = useState(true);

  // Data
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [audits, setAudits] = useState<InternalAudit[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);

  // Filters
  const [cycleFilter, setCycleFilter] = useState<string>('all');
  const [clauseFilter, setClauseFilter] = useState<string>('all');
  const [findingSearch, setFindingSearch] = useState('');

  // Modals
  const [showCycleModal, setShowCycleModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Expanded rows
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  // Cycle form
  const [cycleForm, setCycleForm] = useState({
    cycle_name: '',
    cycle_year: 2026,
    cycle_quarter: 1,
    planned_start_date: '',
    planned_end_date: '',
    lead_auditor: '',
    scope: '',
  });

  // Audit form
  const [auditForm, setAuditForm] = useState({
    cycle_id: '',
    iso_clause: '',
    department: '',
    auditor_name: '',
    planned_date: '',
  });

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedCycles, fetchedAudits, fetchedFindings] = await Promise.all([
          internalAuditService.getCycles(),
          internalAuditService.getAudits(),
          internalAuditService.getFindings(),
        ]);

        setCycles(fetchedCycles.length > 0 ? fetchedCycles : DEMO_CYCLES);
        setAudits(fetchedAudits.length > 0 ? fetchedAudits : DEMO_AUDITS);
        setFindings(fetchedFindings.length > 0 ? fetchedFindings : DEMO_FINDINGS);
      } catch {
        setCycles(DEMO_CYCLES);
        setAudits(DEMO_AUDITS);
        setFindings(DEMO_FINDINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Computed ───────────────────────────────────────────────────────────────
  const findingSummary = {
    major_nc: findings.filter((f) => f.finding_type === 'major_nc').length,
    minor_nc: findings.filter((f) => f.finding_type === 'minor_nc').length,
    observation: findings.filter((f) => f.finding_type === 'observation').length,
    opportunity: findings.filter((f) => f.finding_type === 'opportunity').length,
  };

  const filteredAudits = audits.filter((a) => {
    if (cycleFilter !== 'all' && a.cycle_id !== cycleFilter) return false;
    if (clauseFilter !== 'all' && a.iso_clause !== clauseFilter) return false;
    return true;
  });

  const filteredFindings = findings.filter((f) => {
    if (!findingSearch.trim()) return true;
    const q = findingSearch.toLowerCase();
    return (
      f.finding_code.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.iso_clause.toLowerCase().includes(q) ||
      (f.responsible_person || '').toLowerCase().includes(q)
    );
  });

  const getClauseLabel = (clauseNum: string): string => {
    const clause = ISO_AUDIT_CLAUSES.find((c) => c.number === clauseNum);
    return clause ? clause.titleAr : clauseNum;
  };

  const getResultLabel = (result?: string): string => {
    const opt = AUDIT_RESULT_OPTIONS.find((o) => o.value === result);
    return opt ? opt.label : '-';
  };

  const getResultColor = (result?: string): string => {
    const map: Record<string, string> = {
      conforming: 'bg-[#2BB574]/15 text-[#0F3144]',
      minor_nc: 'bg-[#FCB614]/15 text-[#0F3144]',
      major_nc: 'bg-[#DC2626]/15 text-[#7F1D1D]',
      observation: 'bg-[#269798]/15 text-[#269798]',
      opportunity: 'bg-[#FCB614]/15 text-[#0F3144]',
    };
    return result ? map[result] || 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600';
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleCreateCycle = async () => {
    if (!cycleForm.cycle_name || !cycleForm.lead_auditor || !cycleForm.planned_start_date || !cycleForm.planned_end_date) return;

    const result = await internalAuditService.saveCycle({
      ...cycleForm,
      status: 'planned',
    });

    const newCycle: AuditCycle = {
      id: result.id || `demo-${Date.now()}`,
      ...cycleForm,
      status: 'planned',
      created_at: new Date().toISOString(),
    };
    setCycles((prev) => [newCycle, ...prev]);
    setShowCycleModal(false);
    setCycleForm({ cycle_name: '', cycle_year: 2026, cycle_quarter: 1, planned_start_date: '', planned_end_date: '', lead_auditor: '', scope: '' });
  };

  const handleCreateAudit = async () => {
    if (!auditForm.cycle_id || !auditForm.iso_clause || !auditForm.department || !auditForm.auditor_name || !auditForm.planned_date) return;

    const auditCode = `IA-${new Date().getFullYear()}-${String(audits.length + 1).padStart(3, '0')}`;
    const result = await internalAuditService.saveAudit({
      ...auditForm,
      audit_code: auditCode,
      status: 'planned',
      checklist_data: {},
      ncr_ids: [],
    });

    const newAudit: InternalAudit = {
      id: result.id || `demo-${Date.now()}`,
      ...auditForm,
      audit_code: auditCode,
      status: 'planned',
      checklist_data: {},
      ncr_ids: [],
      created_at: new Date().toISOString(),
    };
    setAudits((prev) => [newAudit, ...prev]);
    setShowAuditModal(false);
    setAuditForm({ cycle_id: '', iso_clause: '', department: '', auditor_name: '', planned_date: '' });
  };

  // ─── Tabs Config ────────────────────────────────────────────────────────────
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'cycles', label: 'دورات التدقيق', icon: <Calendar className="w-4 h-4" />, count: cycles.length },
    { key: 'audits', label: 'التدقيقات', icon: <ClipboardCheck className="w-4 h-4" />, count: audits.length },
    { key: 'findings', label: 'النتائج والمتابعة', icon: <FileText className="w-4 h-4" />, count: findings.length },
  ];

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: HRSD.teal }} />
          <span className="text-sm text-gray-500">جارٍ تحميل بيانات التدقيق...</span>
        </div>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="رجوع"
        >
          <ChevronLeft className="w-6 h-6" style={{ color: HRSD.navy }} />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${HRSD.navy}15` }}
          >
            <ClipboardCheck className="w-6 h-6" style={{ color: HRSD.navy }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: HRSD.navy }}>
              نظام التدقيق الداخلي
            </h1>
            <p className="text-sm text-gray-500">ISO 9001:2015 - إدارة دورات التدقيق والنتائج</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              style={isActive ? { backgroundColor: HRSD.navy } : undefined}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════ Tab 1: Audit Cycles ═══════════════ */}
      {activeTab === 'cycles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCycleModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: HRSD.teal }}
            >
              <Plus className="w-4 h-4" />
              إضافة دورة جديدة
            </button>
          </div>

          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${HRSD.teal}15` }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: HRSD.teal }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: HRSD.navy }}>
                      {cycle.cycle_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {cycle.lead_auditor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cycle.planned_start_date} - {cycle.planned_end_date}
                      </span>
                      <span>الربع {cycle.cycle_quarter} / {cycle.cycle_year}</span>
                      <span className="flex items-center gap-1">
                        <ClipboardCheck className="w-3 h-3" />
                        {audits.filter((a) => a.cycle_id === cycle.id).length} تدقيق
                      </span>
                    </div>
                    {cycle.scope && (
                      <p className="text-xs text-gray-400 mt-1">النطاق: {cycle.scope}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${CYCLE_STATUS_MAP[cycle.status].color}`}
                >
                  {CYCLE_STATUS_MAP[cycle.status].label}
                </span>
              </div>
            </div>
          ))}

          {cycles.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">لا توجد دورات تدقيق</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════ Tab 2: Audits ═══════════════ */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          {/* Filters + Add Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={cycleFilter}
                  onChange={(e) => setCycleFilter(e.target.value)}
                  className="py-2 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                >
                  <option value="all">جميع الدورات</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>{c.cycle_name}</option>
                  ))}
                </select>
              </div>
              <select
                value={clauseFilter}
                onChange={(e) => setClauseFilter(e.target.value)}
                className="py-2 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
              >
                <option value="all">جميع البنود</option>
                {ISO_AUDIT_CLAUSES.map((c) => (
                  <option key={c.id} value={c.number}>بند {c.number} - {c.titleAr}</option>
                ))}
              </select>
              <div className="flex-1" />
              <button
                onClick={() => setShowAuditModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium shadow-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: HRSD.teal }}
              >
                <Plus className="w-4 h-4" />
                إضافة تدقيق
              </button>
            </div>
          </div>

          {/* Audits Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredAudits.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد تدقيقات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">رمز التدقيق</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">بند ISO</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">القسم</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">المدقق</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">التاريخ المخطط</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">الحالة</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-500">النتيجة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudits.map((audit) => (
                      <tr key={audit.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs font-medium" style={{ color: HRSD.navy }}>
                          {audit.audit_code}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-700">{audit.iso_clause}</span>
                          <span className="text-xs text-gray-400 mr-1.5">({getClauseLabel(audit.iso_clause)})</span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{audit.department}</td>
                        <td className="py-3 px-4 text-gray-700">{audit.auditor_name}</td>
                        <td className="py-3 px-4 text-gray-500">{audit.planned_date || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CYCLE_STATUS_MAP[audit.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                            {CYCLE_STATUS_MAP[audit.status]?.label || audit.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {audit.overall_result ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getResultColor(audit.overall_result)}`}>
                              {getResultLabel(audit.overall_result)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ Tab 3: Findings & Follow-up ═══════════════ */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { type: 'major_nc' as const, count: findingSummary.major_nc, label: 'عدم مطابقة رئيسي', color: '#DC2626', bg: 'bg-[#DC2626]/10', icon: <AlertOctagon className="w-5 h-5" /> },
              { type: 'minor_nc' as const, count: findingSummary.minor_nc, label: 'عدم مطابقة بسيط', color: '#FCB614', bg: 'bg-[#FCB614]/10', icon: <AlertTriangle className="w-5 h-5" /> },
              { type: 'observation' as const, count: findingSummary.observation, label: 'ملاحظة', color: '#269798', bg: 'bg-[#269798]/10', icon: <Info className="w-5 h-5" /> },
              { type: 'opportunity' as const, count: findingSummary.opportunity, label: 'فرصة تحسين', color: '#FCB614', bg: 'bg-[#FCB614]/10', icon: <Lightbulb className="w-5 h-5" /> },
            ]).map((card) => (
              <div key={card.type} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">{card.label}</span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.bg}`}>
                    <span style={{ color: card.color }}>{card.icon}</span>
                  </div>
                </div>
                <span className="text-3xl font-bold" style={{ color: HRSD.navy }}>{card.count}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={findingSearch}
                onChange={(e) => setFindingSearch(e.target.value)}
                placeholder="بحث بالرمز، الوصف، البند، المسؤول..."
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">لا توجد نتائج تطابق معايير البحث</p>
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isExpanded = expandedFinding === finding.id;
                const typeInfo = FINDING_TYPE_MAP[finding.finding_type];
                const statusInfo = FINDING_STATUS_MAP[finding.status];

                return (
                  <div key={finding.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-right"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-medium" style={{ color: HRSD.navy }}>
                              {finding.finding_code}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeInfo.color}`}>
                              {typeInfo.label}
                            </span>
                            <span className="text-[10px] text-gray-400">بند {finding.iso_clause}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 truncate">{finding.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 mr-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {finding.evidence && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block mb-1">الدليل / الشاهد</span>
                              <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">{finding.evidence}</p>
                            </div>
                          )}
                          {finding.root_cause && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block mb-1">السبب الجذري</span>
                              <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">{finding.root_cause}</p>
                            </div>
                          )}
                          {finding.corrective_action && (
                            <div>
                              <span className="text-xs font-medium text-gray-500 block mb-1">الإجراء التصحيحي</span>
                              <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">{finding.corrective_action}</p>
                            </div>
                          )}
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              {finding.responsible_person && (
                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {finding.responsible_person}</span>
                              )}
                              {finding.due_date && (
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> الموعد: {finding.due_date}</span>
                              )}
                            </div>
                            {/* Status Pipeline */}
                            <div>
                              <span className="text-xs font-medium text-gray-500 block mb-2">مسار الحالة</span>
                              <div className="flex items-center gap-1 text-[10px] flex-wrap">
                                {(['open', 'action_planned', 'in_progress', 'completed', 'verified', 'closed'] as AuditFinding['status'][]).map((step, idx) => {
                                  const stepOrder: Record<AuditFinding['status'], number> = {
                                    open: 0, action_planned: 1, in_progress: 2, completed: 3, verified: 4, closed: 5,
                                  };
                                  const currentOrder = stepOrder[finding.status];
                                  const thisOrder = stepOrder[step];
                                  const isDone = thisOrder < currentOrder;
                                  const isCurrent = step === finding.status;

                                  return (
                                    <React.Fragment key={step}>
                                      <span
                                        className={`px-2 py-0.5 rounded-full font-medium ${
                                          isCurrent
                                            ? 'text-white'
                                            : isDone
                                            ? 'bg-[#2BB574]/15 text-[#2BB574]'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                        style={isCurrent ? { backgroundColor: HRSD.teal } : undefined}
                                      >
                                        {FINDING_STATUS_MAP[step].label}
                                      </span>
                                      {idx < 5 && <span className="text-gray-300">&larr;</span>}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ═══════════════ Create Cycle Modal ═══════════════ */}
      {showCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: HRSD.navy }}>إضافة دورة تدقيق جديدة</h2>
              <button onClick={() => setShowCycleModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدورة <span className="text-[#DC2626]">*</span></label>
                <input
                  type="text"
                  value={cycleForm.cycle_name}
                  onChange={(e) => setCycleForm((f) => ({ ...f, cycle_name: e.target.value }))}
                  placeholder="مثال: دورة التدقيق الربع الثاني 2026"
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السنة <span className="text-[#DC2626]">*</span></label>
                  <input
                    type="number"
                    value={cycleForm.cycle_year}
                    onChange={(e) => setCycleForm((f) => ({ ...f, cycle_year: parseInt(e.target.value) || 2026 }))}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الربع <span className="text-[#DC2626]">*</span></label>
                  <select
                    value={cycleForm.cycle_quarter}
                    onChange={(e) => setCycleForm((f) => ({ ...f, cycle_quarter: parseInt(e.target.value) }))}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                  >
                    <option value={1}>الربع الأول</option>
                    <option value={2}>الربع الثاني</option>
                    <option value={3}>الربع الثالث</option>
                    <option value={4}>الربع الرابع</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية المخطط <span className="text-[#DC2626]">*</span></label>
                  <input
                    type="date"
                    value={cycleForm.planned_start_date}
                    onChange={(e) => setCycleForm((f) => ({ ...f, planned_start_date: e.target.value }))}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية المخطط <span className="text-[#DC2626]">*</span></label>
                  <input
                    type="date"
                    value={cycleForm.planned_end_date}
                    onChange={(e) => setCycleForm((f) => ({ ...f, planned_end_date: e.target.value }))}
                    className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدقق الرئيسي <span className="text-[#DC2626]">*</span></label>
                <input
                  type="text"
                  value={cycleForm.lead_auditor}
                  onChange={(e) => setCycleForm((f) => ({ ...f, lead_auditor: e.target.value }))}
                  placeholder="اسم المدقق الرئيسي"
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النطاق</label>
                <textarea
                  value={cycleForm.scope}
                  onChange={(e) => setCycleForm((f) => ({ ...f, scope: e.target.value }))}
                  placeholder="وصف نطاق دورة التدقيق..."
                  rows={3}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setShowCycleModal(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateCycle}
                disabled={!cycleForm.cycle_name || !cycleForm.lead_auditor || !cycleForm.planned_start_date || !cycleForm.planned_end_date}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: HRSD.teal }}
              >
                إنشاء الدورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ Create Audit Modal ═══════════════ */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold" style={{ color: HRSD.navy }}>إضافة تدقيق جديد</h2>
              <button onClick={() => setShowAuditModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">دورة التدقيق <span className="text-[#DC2626]">*</span></label>
                <select
                  value={auditForm.cycle_id}
                  onChange={(e) => setAuditForm((f) => ({ ...f, cycle_id: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                >
                  <option value="">اختر دورة التدقيق</option>
                  {cycles.map((c) => (
                    <option key={c.id} value={c.id}>{c.cycle_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">بند ISO <span className="text-[#DC2626]">*</span></label>
                <select
                  value={auditForm.iso_clause}
                  onChange={(e) => setAuditForm((f) => ({ ...f, iso_clause: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                >
                  <option value="">اختر بند ISO</option>
                  {ISO_AUDIT_CLAUSES.map((c) => (
                    <option key={c.id} value={c.number}>بند {c.number} - {c.titleAr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم <span className="text-[#DC2626]">*</span></label>
                <select
                  value={auditForm.department}
                  onChange={(e) => setAuditForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                >
                  <option value="">اختر القسم</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المدقق <span className="text-[#DC2626]">*</span></label>
                <input
                  type="text"
                  value={auditForm.auditor_name}
                  onChange={(e) => setAuditForm((f) => ({ ...f, auditor_name: e.target.value }))}
                  placeholder="اسم المدقق"
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ المخطط <span className="text-[#DC2626]">*</span></label>
                <input
                  type="date"
                  value={auditForm.planned_date}
                  onChange={(e) => setAuditForm((f) => ({ ...f, planned_date: e.target.value }))}
                  className="w-full py-2.5 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': HRSD.teal } as React.CSSProperties}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateAudit}
                disabled={!auditForm.cycle_id || !auditForm.iso_clause || !auditForm.department || !auditForm.auditor_name || !auditForm.planned_date}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: HRSD.teal }}
              >
                إنشاء التدقيق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternalAuditSystem;
