import React, { useState, useMemo } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock, FileText, Filter,
  Plus, Search, ChevronDown, ChevronUp,
  AlertCircle, XCircle, Shield, TrendingUp, Calendar,
  User, ClipboardCheck, Eye
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type NcrSeverity = 'critical' | 'major' | 'minor' | 'observation';
type NcrStatus = 'open' | 'investigating' | 'action_planned' | 'in_progress' | 'verification' | 'closed';
type CapaType = 'corrective' | 'preventive';

interface NCR {
  id: string;
  title: string;
  description: string;
  isoClause: string;
  department: string;
  severity: NcrSeverity;
  status: NcrStatus;
  reportedBy: string;
  reportedDate: string;
  dueDate: string;
  rootCause?: string;
  capas: CAPA[];
}

interface CAPA {
  id: string;
  type: CapaType;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  completionDate?: string;
  evidence?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const NCR_DATA: NCR[] = [
  {
    id: 'NCR-001',
    title: 'قصور في نظام السلامة من الحرائق',
    description: 'عدم وجود نظام إطفاء آلي (Sprinkler) في جميع أجنحة الإيواء. كاشفات الدخان في الجناح B تحتاج استبدال.',
    isoClause: '7.1.3 / 8.5.1',
    department: 'الصيانة والخدمات العامة',
    severity: 'critical',
    status: 'in_progress',
    reportedBy: 'فريق التدقيق الداخلي',
    reportedDate: '2026-01-15',
    dueDate: '2026-03-30',
    rootCause: 'عدم تحديث منظومة الحرائق منذ 2019. الميزانية المخصصة غير كافية لتغطية جميع الأجنحة.',
    capas: [
      {
        id: 'CAPA-001-1',
        type: 'corrective',
        description: 'استبدال كاشفات الدخان في الجناح B فوراً',
        assignedTo: 'مدير الصيانة',
        dueDate: '2026-02-15',
        status: 'completed',
        completionDate: '2026-02-10',
        evidence: 'تقرير فني + صور التركيب'
      },
      {
        id: 'CAPA-001-2',
        type: 'corrective',
        description: 'تركيب نظام Sprinkler في أجنحة الإيواء',
        assignedTo: 'مدير الصيانة',
        dueDate: '2026-03-30',
        status: 'in_progress',
      },
      {
        id: 'CAPA-001-3',
        type: 'preventive',
        description: 'إنشاء جدول صيانة ربع سنوي لأنظمة الحرائق',
        assignedTo: 'مسؤول السلامة',
        dueDate: '2026-03-15',
        status: 'pending',
      }
    ]
  },
  {
    id: 'NCR-002',
    title: 'فجوات في توثيق العمليات الابتكارية',
    description: 'البرامج الابتكارية (Smart Sense, Family Connect, Opti-Staff) غير موثقة وفق معايير ISO 8.3. لا توجد سجلات مراجعة تصميم رسمية.',
    isoClause: '8.3 / 7.5',
    department: 'الجودة وتطوير الأداء',
    severity: 'major',
    status: 'action_planned',
    reportedBy: 'مدير الجودة',
    reportedDate: '2026-01-20',
    dueDate: '2026-06-30',
    rootCause: 'البرامج الابتكارية تم تطويرها بسرعة استجابة للاحتياجات دون اتباع إجراءات التصميم والتطوير الرسمية.',
    capas: [
      {
        id: 'CAPA-002-1',
        type: 'corrective',
        description: 'إعداد وثائق التصميم والتطوير (Design & Development) للبرامج الثلاثة',
        assignedTo: 'مدير تقنية المعلومات',
        dueDate: '2026-04-30',
        status: 'pending',
      },
      {
        id: 'CAPA-002-2',
        type: 'preventive',
        description: 'تحديث إجراء التصميم والتطوير ليشمل البرامج الرقمية',
        assignedTo: 'مدير الجودة',
        dueDate: '2026-05-31',
        status: 'pending',
      }
    ]
  },
  {
    id: 'NCR-003',
    title: 'انقطاع التواصل الاستراتيجي مع الوزارة',
    description: 'لم تُرسل تقارير الأداء الربع سنوية للوزارة خلال Q3 و Q4 2025. غياب آلية واضحة لتصعيد الاتصالات.',
    isoClause: '5.1 / 7.4',
    department: 'الإدارة العليا',
    severity: 'major',
    status: 'in_progress',
    reportedBy: 'مدير الجودة',
    reportedDate: '2026-01-10',
    dueDate: '2026-03-31',
    rootCause: 'تغيير نقطة الاتصال في الوزارة + عدم وجود بديل معتمد. البريد الرسمي توقف دون إشعار.',
    capas: [
      {
        id: 'CAPA-003-1',
        type: 'corrective',
        description: 'إرسال تقارير Q3 و Q4 المتأخرة مع خطاب اعتذار رسمي',
        assignedTo: 'مدير المركز',
        dueDate: '2026-02-28',
        status: 'in_progress',
      },
      {
        id: 'CAPA-003-2',
        type: 'preventive',
        description: 'تعيين نقطتي اتصال (أساسي + بديل) مع الوزارة وتوثيقها',
        assignedTo: 'مدير المركز',
        dueDate: '2026-03-15',
        status: 'pending',
      },
      {
        id: 'CAPA-003-3',
        type: 'preventive',
        description: 'إنشاء تنبيهات آلية للتقارير الوزارية المستحقة',
        assignedTo: 'تقنية المعلومات',
        dueDate: '2026-03-31',
        status: 'pending',
      }
    ]
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { label: 'حرج', color: 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/30', dot: 'bg-[#DC2626]' },
  major: { label: 'رئيسي', color: 'bg-[#F7941D]/15 text-[#F7941D] border-[#F7941D]/30', dot: 'bg-[#F7941D]' },
  minor: { label: 'ثانوي', color: 'bg-[#FCB614]/10 text-[#FCB614] border-[#FCB614]/20', dot: 'bg-[#FCB614]' },
  observation: { label: 'ملاحظة', color: 'bg-[#269798]/15 text-[#269798] border-[#269798]/30', dot: 'bg-[#269798]' },
};

const statusConfig = {
  open: { label: 'مفتوح', color: 'bg-[#DC2626]/10 text-[#DC2626]', icon: AlertCircle },
  investigating: { label: 'تحقيق', color: 'bg-[#FCB614]/10 text-[#FCB614]', icon: Search },
  action_planned: { label: 'خطة إجراءات', color: 'bg-[#269798]/10 text-[#269798]', icon: ClipboardCheck },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-[#FCB614]/10 text-[#FCB614]', icon: Clock },
  verification: { label: 'تحقق', color: 'bg-[#269798]/10 text-[#269798]', icon: Eye },
  closed: { label: 'مغلق', color: 'bg-[#2BB574]/10 text-[#2BB574]', icon: CheckCircle2 },
};

const capaStatusConfig = {
  pending: { label: 'معلق', color: 'text-gray-500 bg-gray-100' },
  in_progress: { label: 'جاري', color: 'text-[#269798] bg-[#269798]/10' },
  completed: { label: 'مكتمل', color: 'text-[#2BB574] bg-[#2BB574]/10' },
  verified: { label: 'تم التحقق', color: 'text-[#2BB574] bg-[#2BB574]/10' },
};

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function DueDateBadge({ date }: { date: string }) {
  const days = daysUntil(date);
  let color = 'text-[#2BB574] bg-[#2BB574]/10';
  let text = `${days} يوم متبقي`;
  if (days < 0) { color = 'text-[#DC2626] bg-[#DC2626]/10'; text = `متأخر ${Math.abs(days)} يوم`; }
  else if (days <= 14) { color = 'text-[#FCB614] bg-[#FCB614]/10'; text = `${days} يوم متبقي`; }
  else if (days <= 30) { color = 'text-[#FCB614] bg-[#FCB614]/10'; }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      <Calendar className="w-3 h-3" />
      {text}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export const NcrCapaTracker: React.FC = () => {
  const [expandedNcr, setExpandedNcr] = useState<string | null>('NCR-001');
  const [filterSeverity, setFilterSeverity] = useState<NcrSeverity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<NcrStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNcrs = useMemo(() => {
    return NCR_DATA.filter(ncr => {
      if (filterSeverity !== 'all' && ncr.severity !== filterSeverity) return false;
      if (filterStatus !== 'all' && ncr.status !== filterStatus) return false;
      if (searchTerm && !ncr.title.includes(searchTerm) && !ncr.id.includes(searchTerm)) return false;
      return true;
    });
  }, [filterSeverity, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const total = NCR_DATA.length;
    const open = NCR_DATA.filter(n => n.status !== 'closed').length;
    const overdue = NCR_DATA.filter(n => n.status !== 'closed' && daysUntil(n.dueDate) < 0).length;
    const totalCapas = NCR_DATA.reduce((acc, n) => acc + n.capas.length, 0);
    const completedCapas = NCR_DATA.reduce((acc, n) => acc + n.capas.filter(c => c.status === 'completed' || c.status === 'verified').length, 0);
    return { total, open, overdue, totalCapas, completedCapas };
  }, []);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F3144]">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            سجل عدم المطابقة والإجراءات التصحيحية
          </h1>
          <p className="text-gray-500 mt-1">NCR & CAPA Register — ISO 9001:2015 Clause 10.2</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F3144] text-white rounded-lg hover:bg-[#1a5270] transition-colors">
          <Plus className="w-4 h-4" />
          تسجيل NCR جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'إجمالي NCRs', value: stats.total, icon: FileText, color: 'text-[#269798] bg-[#269798]/10' },
          { label: 'مفتوحة', value: stats.open, icon: AlertCircle, color: 'text-[#DC2626] bg-[#DC2626]/10' },
          { label: 'متأخرة', value: stats.overdue, icon: XCircle, color: stats.overdue > 0 ? 'text-[#DC2626] bg-[#DC2626]/15' : 'text-[#2BB574] bg-[#2BB574]/10' },
          { label: 'إجراءات CAPA', value: `${stats.completedCapas}/${stats.totalCapas}`, icon: ClipboardCheck, color: 'text-[#FCB614] bg-[#FCB614]/10' },
          { label: 'نسبة الإنجاز', value: `${stats.totalCapas > 0 ? Math.round((stats.completedCapas / stats.totalCapas) * 100) : 0}%`, icon: TrendingUp, color: 'text-[#2BB574] bg-[#2BB574]/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-[#0F3144]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-gray-50 rounded-xl p-4 border border-gray-100">
        <Filter className="w-4 h-4 text-gray-400" />
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full ps-4 pe-9 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3144]"
          />
        </div>
        <select
          title="تصفية حسب الخطورة"
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value as NcrSeverity | 'all')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">كل المستويات</option>
          <option value="critical">حرج</option>
          <option value="major">رئيسي</option>
          <option value="minor">ثانوي</option>
          <option value="observation">ملاحظة</option>
        </select>
        <select
          title="تصفية حسب الحالة"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as NcrStatus | 'all')}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
        >
          <option value="all">كل الحالات</option>
          <option value="open">مفتوح</option>
          <option value="investigating">تحقيق</option>
          <option value="action_planned">خطة إجراءات</option>
          <option value="in_progress">قيد التنفيذ</option>
          <option value="verification">تحقق</option>
          <option value="closed">مغلق</option>
        </select>
      </div>

      {/* NCR List */}
      <div className="space-y-4">
        {filteredNcrs.map(ncr => {
          const isExpanded = expandedNcr === ncr.id;
          const sevCfg = severityConfig[ncr.severity];
          const stsCfg = statusConfig[ncr.status];
          const StatusIcon = stsCfg.icon;
          const completedCapas = ncr.capas.filter(c => c.status === 'completed' || c.status === 'verified').length;
          const capaProgress = ncr.capas.length > 0 ? Math.round((completedCapas / ncr.capas.length) * 100) : 0;

          return (
            <div key={ncr.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* NCR Header */}
              <button
                onClick={() => setExpandedNcr(isExpanded ? null : ncr.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors text-right"
              >
                {/* Severity dot */}
                <div className={`w-3 h-3 rounded-full ${sevCfg.dot} flex-shrink-0`} />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold text-[#0F3144]">{ncr.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${sevCfg.color}`}>
                      {sevCfg.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${stsCfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {stsCfg.label}
                    </span>
                    <DueDateBadge date={ncr.dueDate} />
                  </div>
                  <h3 className="font-bold text-gray-800">{ncr.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>البند: {ncr.isoClause}</span>
                    <span>القسم: {ncr.department}</span>
                    <span>CAPA: {completedCapas}/{ncr.capas.length}</span>
                  </div>
                </div>

                {/* CAPA progress bar */}
                <div className="w-24 hidden md:block">
                  <div className="text-xs text-gray-500 text-center mb-1">{capaProgress}%</div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${capaProgress === 100 ? 'bg-[#2BB574]' : capaProgress > 0 ? 'bg-[#269798]' : 'bg-gray-200'}`}
                      style={{ width: `${capaProgress}%` }}
                    />
                  </div>
                </div>

                {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50/30">
                  {/* Description & Root Cause */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        وصف عدم المطابقة
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{ncr.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ncr.reportedBy}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ncr.reportedDate}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        تحليل السبب الجذري (RCA)
                      </h4>
                      {ncr.rootCause ? (
                        <p className="text-sm text-gray-600 leading-relaxed">{ncr.rootCause}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">لم يتم تحديد السبب الجذري بعد</p>
                      )}
                    </div>
                  </div>

                  {/* CAPA Actions */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0F3144] mb-3 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4" />
                      الإجراءات التصحيحية والوقائية (CAPA)
                    </h4>
                    <div className="space-y-2">
                      {ncr.capas.map((capa, idx) => {
                        const capaCfg = capaStatusConfig[capa.status];
                        return (
                          <div key={capa.id} className="bg-white rounded-lg border border-gray-100 p-4 flex items-start gap-3">
                            {/* Step number */}
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              capa.status === 'completed' || capa.status === 'verified'
                                ? 'bg-[#2BB574]/15 text-[#2BB574]'
                                : capa.status === 'in_progress'
                                  ? 'bg-[#269798]/15 text-[#269798]'
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              {capa.status === 'completed' || capa.status === 'verified' ? '✓' : idx + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${capaCfg.color}`}>
                                  {capaCfg.label}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  capa.type === 'corrective' ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-[#269798]/10 text-[#269798]'
                                }`}>
                                  {capa.type === 'corrective' ? 'تصحيحي' : 'وقائي'}
                                </span>
                                <span className="text-xs text-gray-400 font-mono">{capa.id}</span>
                              </div>
                              <p className="text-sm text-gray-700">{capa.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {capa.assignedTo}</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {capa.dueDate}</span>
                                {capa.completionDate && (
                                  <span className="flex items-center gap-1 text-[#2BB574]">
                                    <CheckCircle2 className="w-3 h-3" /> أُنجز: {capa.completionDate}
                                  </span>
                                )}
                                {capa.evidence && (
                                  <span className="flex items-center gap-1 text-[#269798]">
                                    <FileText className="w-3 h-3" /> {capa.evidence}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Due date */}
                            {capa.status !== 'completed' && capa.status !== 'verified' && (
                              <DueDateBadge date={capa.dueDate} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredNcrs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد نتائج مطابقة للتصفية</p>
        </div>
      )}
    </div>
  );
};

export default NcrCapaTracker;
