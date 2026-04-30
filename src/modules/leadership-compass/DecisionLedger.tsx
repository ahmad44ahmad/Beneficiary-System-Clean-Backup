import React, { useState, useMemo } from 'react';
import { BookOpen, Search, Filter, CheckCircle2, XCircle, PauseCircle, RotateCw } from 'lucide-react';
import {
    SEED_LEDGER, VARIANCE_LABELS, VARIANCE_TONES, type LedgerEntry, type OutcomeActual,
} from './data/seed-ledger';

/**
 * تبويب «سجلّ القرارات» — الذاكرة المؤسّسيّة.
 * كلّ قرارٍ يَبقى، حتى المرفوض، حتى الذي لم يَنجح.
 * الدرس المُستخلَص مُسجَّلٌ صراحةً — هذا أثمن ما فيه.
 */
export const DecisionLedger: React.FC = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filtered = useMemo(() => {
        return SEED_LEDGER.filter((e) => {
            if (statusFilter !== 'all' && e.status !== statusFilter) return false;
            if (search) {
                const q = search.toLowerCase();
                return e.title.toLowerCase().includes(q)
                    || e.tags.some((t) => t.toLowerCase().includes(q))
                    || e.lessonLearned.toLowerCase().includes(q);
            }
            return true;
        }).sort((a, b) => b.decidedDate.localeCompare(a.decidedDate));
    }, [search, statusFilter]);

    const stats = useMemo(() => {
        const total = SEED_LEDGER.length;
        const approved = SEED_LEDGER.filter((e) => e.status === 'approved').length;
        const rejected = SEED_LEDGER.filter((e) => e.status === 'rejected').length;
        const withLessons = SEED_LEDGER.filter((e) => e.lessonLearned.length > 0).length;
        return { total, approved, rejected, withLessons };
    }, []);

    return (
        <section className="space-y-5" dir="rtl">
            {/* الإحصائيّات العامّة */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="إجمالي القرارات" value={stats.total} icon={BookOpen} tone="navy" />
                <StatCard label="مُعتمَدة" value={stats.approved} icon={CheckCircle2} tone="green" />
                <StatCard label="مرفوضة (قراراتٌ واعية)" value={stats.rejected} icon={XCircle} tone="slate" />
                <StatCard label="دروسٌ مُوثَّقة" value={stats.withLessons} icon={RotateCw} tone="gold" />
            </div>

            {/* الفلترة والبحث */}
            <div className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 p-4 flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-hrsd-cool-gray" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="ابحث بالعنوان أو الدرس أو الوسم..."
                        className="w-full ps-3 pe-10 py-2 border border-gray-200 dark:border-gray-300
                            rounded-lg bg-white dark:bg-white text-[14px] focus:border-hrsd-teal focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-hrsd-cool-gray" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 dark:border-gray-300
                            rounded-lg bg-white dark:bg-white text-[14px] font-medium"
                    >
                        <option value="all">كلّ الحالات</option>
                        <option value="approved">مُعتمَدة</option>
                        <option value="rejected">مرفوضة</option>
                        <option value="delayed">مُؤجَّلة</option>
                    </select>
                </div>

                <div className="text-[13px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">
                    تَعرض {filtered.length} من {SEED_LEDGER.length}
                </div>
            </div>

            {/* القرارات */}
            <div className="space-y-4">
                {filtered.map((e) => (
                    <LedgerCard key={e.id} entry={e} />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-hrsd-cool-gray">لا قراراتٌ تُطابق البحث.</div>
                )}
            </div>
        </section>
    );
};

// ─── بطاقة إحصائيّة ──────────────────────────────────────────────────────────
const StatCard: React.FC<{
    label: string; value: number; icon: React.ElementType;
    tone: 'navy' | 'green' | 'gold' | 'slate';
}> = ({ label, value, icon: Icon, tone }) => {
    const tones = {
        navy:  { bg: 'bg-hrsd-navy/5',        text: 'text-hrsd-navy',      iconBg: 'bg-hrsd-navy text-white' },
        green: { bg: 'bg-hrsd-green/10',      text: 'text-hrsd-green-dark', iconBg: 'bg-hrsd-green text-white' },
        gold:  { bg: 'bg-hrsd-gold/10',       text: 'text-hrsd-gold-dark',  iconBg: 'bg-hrsd-gold text-white' },
        slate: { bg: 'bg-slate-100',          text: 'text-hrsd-navy',       iconBg: 'bg-slate-500 text-white' },
    };
    const t = tones[tone];
    return (
        <div className={`${t.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-lg ${t.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className={`text-[22px] font-black leading-none ${t.text}`}>{value}</div>
                <div className="text-[12px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mt-0.5">{label}</div>
            </div>
        </div>
    );
};

// ─── بطاقة قرار تاريخيّ ─────────────────────────────────────────────────────
const STATUS_ICONS = {
    approved:   { icon: CheckCircle2,  color: 'text-hrsd-green-dark', badge: 'bg-hrsd-green/15', label: 'مُعتمَد' },
    rejected:   { icon: XCircle,       color: 'text-[#DC2626]',        badge: 'bg-[#DC2626]/10',      label: 'مرفوض' },
    delayed:    { icon: PauseCircle,   color: 'text-[#FCB614]',       badge: 'bg-[#FCB614]/15',     label: 'مُؤجَّل' },
    superseded: { icon: RotateCw,      color: 'text-hrsd-cool-gray',       badge: 'bg-slate-100',     label: 'استُبدِل' },
};

const LedgerCard: React.FC<{ entry: LedgerEntry }> = ({ entry }) => {
    const [expanded, setExpanded] = useState(false);
    const StatusIcon = STATUS_ICONS[entry.status].icon;

    return (
        <article className="bg-white dark:bg-white rounded-2xl border border-gray-200 dark:border-gray-200 shadow-sm overflow-hidden">
            {/* الشريط العلويّ */}
            <header className="p-5 border-b border-slate-100 dark:border-gray-200 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                    <div className={`mt-1 ${STATUS_ICONS[entry.status].color}`}>
                        <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-[12px] mb-0.5">
                            <span className="font-mono text-hrsd-cool-gray">{entry.decidedDate}</span>
                            <span className="text-hrsd-cool-gray">·</span>
                            <span className="font-semibold text-hrsd-cool-gray dark:text-hrsd-navy">{entry.category}</span>
                            <span className="text-hrsd-cool-gray">·</span>
                            <span className="text-hrsd-cool-gray dark:text-hrsd-navy">مستوى {entry.level}</span>
                        </div>
                        <h3 className="text-[17px] font-bold text-hrsd-navy dark:text-white leading-tight">
                            {entry.title}
                        </h3>
                    </div>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${STATUS_ICONS[entry.status].badge} ${STATUS_ICONS[entry.status].color}`}>
                    {STATUS_ICONS[entry.status].label}
                </span>
            </header>

            <div className="p-5 space-y-4">
                {/* نتائج فعليّة (ملخَّص دائماً ظاهر) */}
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray dark:text-hrsd-cool-gray mb-2">
                        النتائج الفعليّة
                    </div>
                    <div className="grid md:grid-cols-3 gap-2.5">
                        <OutcomePanel label="بعد 3 أشهر" outcome={entry.outcomes.at3mo} />
                        <OutcomePanel label="بعد 6 أشهر" outcome={entry.outcomes.at6mo} />
                        <OutcomePanel label="بعد 12 شهراً" outcome={entry.outcomes.at12mo} />
                    </div>
                </div>

                {/* الدرس المُستخلَص */}
                <div className="bg-hrsd-gold/5 border-r-4 border-hrsd-gold rounded-lg p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-gold-dark mb-1.5">
                        🎓 الدرس المُستخلَص
                    </div>
                    <p className="text-[13.5px] text-hrsd-navy dark:text-slate-200 leading-relaxed">
                        {entry.lessonLearned}
                    </p>
                </div>

                {/* زر التفاصيل */}
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-300 text-[13px] font-semibold
                        text-hrsd-cool-gray dark:text-hrsd-navy hover:bg-slate-50 dark:hover:bg-gray-50 transition-colors"
                >
                    {expanded ? 'إخفاء التفاصيل' : 'عرض تفاصيل القرار الأصليّ'}
                </button>

                {expanded && (
                    <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-gray-200">
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1">التوصية الأصليّة</div>
                            <p className="text-[13.5px] text-hrsd-navy dark:text-slate-200 leading-relaxed">{entry.originalRecommendation}</p>
                        </div>
                        {entry.decisionNotes && (
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1">ملاحظات القرار</div>
                                <p className="text-[13px] text-hrsd-cool-gray dark:text-hrsd-navy leading-relaxed">{entry.decisionNotes}</p>
                            </div>
                        )}
                        {entry.cost && (
                            <div className="flex gap-4 text-[13px] text-hrsd-cool-gray dark:text-hrsd-navy">
                                <div>
                                    <span className="font-bold">التكلفة المُخطَّطة:</span>{' '}
                                    {entry.cost.plannedSar.toLocaleString('ar-SA')} ريال
                                </div>
                                {entry.cost.actualSar !== undefined && (
                                    <div>
                                        <span className="font-bold">الفعليّة:</span>{' '}
                                        {entry.cost.actualSar.toLocaleString('ar-SA')} ريال
                                    </div>
                                )}
                            </div>
                        )}
                        <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-1">الصانع</div>
                            <p className="text-[13px] text-hrsd-cool-gray dark:text-hrsd-navy">{entry.decidedBy}</p>
                        </div>
                    </div>
                )}

                {/* الوسوم */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-gray-200">
                    {entry.tags.map((tag) => (
                        <span key={tag} className="text-[11px] bg-slate-100 dark:bg-gray-50 text-hrsd-cool-gray dark:text-hrsd-navy px-2 py-0.5 rounded-md">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
};

// ─── لوحة نتيجة ──────────────────────────────────────────────────────────────
const OutcomePanel: React.FC<{ label: string; outcome?: OutcomeActual }> = ({ label, outcome }) => {
    if (!outcome) {
        return (
            <div className="bg-slate-50 dark:bg-white rounded-lg p-3 border border-dashed border-gray-200 dark:border-gray-200">
                <div className="text-[11px] font-bold uppercase tracking-wider text-hrsd-cool-gray mb-0.5">{label}</div>
                <p className="text-[12px] text-hrsd-cool-gray italic">لم يُقَس بعد</p>
            </div>
        );
    }
    const tone = VARIANCE_TONES[outcome.variance];
    return (
        <div className={`${tone.bg} rounded-lg p-3 border ${tone.bg.replace('bg-', 'border-').replace('-100', '-200').replace('/15', '/30')}`}>
            <div className={`text-[11px] font-bold uppercase tracking-wider ${tone.text} mb-1 flex items-center gap-1`}>
                <span>{label}</span>
                <span className="ms-auto">{tone.icon} {VARIANCE_LABELS[outcome.variance]}</span>
            </div>
            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray mb-0.5">المُخطَّط:</div>
            <div className="text-[12.5px] text-hrsd-navy dark:text-slate-200 mb-1.5 leading-snug">{outcome.plannedValue}</div>
            <div className="text-[11px] text-hrsd-cool-gray dark:text-hrsd-cool-gray">الفعليّ:</div>
            <div className={`text-[13px] font-bold leading-snug ${tone.text}`}>{outcome.actualValue}</div>
            {outcome.notes && (
                <div className="mt-1.5 pt-1.5 border-t border-current opacity-70 text-[11px] italic leading-relaxed">
                    {outcome.notes}
                </div>
            )}
        </div>
    );
};
