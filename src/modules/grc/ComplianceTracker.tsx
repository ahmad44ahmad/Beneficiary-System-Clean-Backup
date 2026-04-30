import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSupabaseClient } from '../../hooks/queries';
import {
    ClipboardCheck,
    Plus,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Filter,
    FileText
} from 'lucide-react';
import { StatusBadge } from '../../design-system/primitives';
import { brand } from '../../design-system/tokens';

// HRSD Colors — inline JS literals; aligned to brand tokens.
const HRSD = {
    orange: brand.orange.hex,
    gold:   brand.gold.hex,
    green:  brand.green.hex,
    teal:   brand.teal.hex,
    navy:   brand.navy.hex,
};

interface ComplianceRequirement {
    id: string;
    requirement_code: string;
    title_ar: string;
    description: string;
    section: string;
    compliance_status: string;
    compliance_score: number;
    responsible_person: string;
    due_date: string;
    standard?: { name_ar: string; code: string };
}

export const ComplianceTracker: React.FC = () => {
    const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        compliant: 0,
        partial: 0,
        nonCompliant: 0,
        pending: 0
    });

    useEffect(() => {
        const DEMO_REQUIREMENTS: ComplianceRequirement[] = [
            {
                id: '1',
                requirement_code: 'ISO-001',
                title_ar: 'سياسة حماية البيانات',
                description: 'وجود سياسة معتمدة لحماية بيانات المستفيدين',
                section: 'أمن المعلومات',
                compliance_status: 'compliant',
                compliance_score: 100,
                responsible_person: 'مدير التقنية',
                due_date: '2025-12-31'
            },
            {
                id: '2',
                requirement_code: 'MOH-045',
                title_ar: 'ترخيص العيادة الطبية',
                description: 'تجديد ترخيص العيادة الداخلية',
                section: 'التراخيص',
                compliance_status: 'partial',
                compliance_score: 50,
                responsible_person: 'المدير الطبي',
                due_date: '2025-04-01'
            },
            {
                id: '3',
                requirement_code: 'ISO-002',
                title_ar: 'إجراءات الطوارئ',
                description: 'توثيق إجراءات الإخلاء وتدريب الموظفين عليها',
                section: 'السلامة والصحة المهنية',
                compliance_status: 'non_compliant',
                compliance_score: 20,
                responsible_person: 'مسؤول السلامة',
                due_date: '2025-02-15'
            }
        ];

        const fetchRequirements = async () => {
            setLoading(true);
            const supabase = getSupabaseClient();
            if (!supabase) {
                setRequirements(DEMO_REQUIREMENTS);
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('grc_compliance_requirements')
                    .select(`
                        *,
                        standard:grc_standards(name_ar, code)
                    `)
                    .order('created_at', { ascending: false });

                let finalData = data;

                // Fallback to demo data if empty or error
                if (error || !data || data.length === 0) {
                    finalData = DEMO_REQUIREMENTS;
                }

                // Only set if we have data (either real or demo)
                if (finalData) {
                    setRequirements(finalData as ComplianceRequirement[]);
                    setStats({
                        total: finalData.length,
                        compliant: finalData.filter(r => r.compliance_status === 'compliant').length,
                        partial: finalData.filter(r => r.compliance_status === 'partial').length,
                        nonCompliant: finalData.filter(r => r.compliance_status === 'non_compliant').length,
                        pending: finalData.filter(r => r.compliance_status === 'pending').length
                    });
                }
            } catch (e) {
                console.error('Compliance Logic Error', e);
                setRequirements(DEMO_REQUIREMENTS);
            } finally {
                setLoading(false);
            }
        };

        fetchRequirements();
    }, []);

    const getStatusBadge = (status: string) => {
        const config: Record<string, { tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string; icon: React.ElementType }> = {
            compliant:      { tone: 'success', label: 'ممتثل',         icon: CheckCircle2 },
            partial:        { tone: 'warning', label: 'جزئي',           icon: AlertCircle },
            non_compliant:  { tone: 'danger',  label: 'غير ممتثل',     icon: XCircle },
            pending:        { tone: 'info',    label: 'قيد المراجعة', icon: AlertCircle },
            not_applicable: { tone: 'neutral', label: 'لا ينطبق',       icon: AlertCircle },
        };
        const entry = config[status] ?? config.pending;
        return <StatusBadge tone={entry.tone} label={entry.label} icon={entry.icon} size="sm" />;
    };

    const compliancePercentage = stats.total > 0
        ? Math.round((stats.compliant / stats.total) * 100)
        : 0;

    const filteredRequirements = requirements.filter(req => {
        return filterStatus === 'all' || req.compliance_status === filterStatus;
    });

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/grc" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للحوكمة
                    </Link>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-[#0F3144]">
                        <ClipboardCheck className="w-7 h-7 text-[#269798]" />
                        متتبع الامتثال
                    </h1>
                    <p className="text-gray-500 mt-1">تتبع الامتثال للمعايير واللوائح</p>
                </div>
                <button
                    className="px-5 py-2.5 text-white rounded-xl flex items-center gap-2 shadow-lg bg-[#269798]"
                >
                    <Plus className="w-5 h-5" />
                    إضافة متطلب
                </button>
            </div>

            {/* Compliance Score Hero */}
            <div
                className="rounded-2xl p-8 text-white shadow-xl bg-gradient-to-br from-[#0F3144] to-[#269798]"
            >
                <div className="grid grid-cols-4 gap-8 items-center">
                    {/* Circular Progress */}
                    <div className="col-span-1 flex justify-center">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={compliancePercentage >= 80 ? HRSD.green : compliancePercentage >= 50 ? HRSD.gold : '#DC2626'}
                                    strokeWidth="8"
                                    strokeDasharray={`${compliancePercentage * 2.83} 283`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{compliancePercentage}%</span>
                                <span className="text-sm opacity-80">الامتثال</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="col-span-3 grid grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{stats.total}</p>
                            <p className="text-xs opacity-70">إجمالي المتطلبات</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: HRSD.green }} />
                            <p className="text-3xl font-bold">{stats.compliant}</p>
                            <p className="text-xs opacity-70">ممتثل</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: HRSD.gold }} />
                            <p className="text-3xl font-bold">{stats.partial}</p>
                            <p className="text-xs opacity-70">جزئي</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                            <XCircle className="w-8 h-8 mx-auto mb-2 text-[#DC2626]" />
                            <p className="text-3xl font-bold">{stats.nonCompliant}</p>
                            <p className="text-xs opacity-70">غير ممتثل</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">تصفية:</span>
                <div className="flex gap-2">
                    {[
                        { value: 'all', label: 'الكل' },
                        { value: 'compliant', label: 'ممتثل' },
                        { value: 'partial', label: 'جزئي' },
                        { value: 'non_compliant', label: 'غير ممتثل' },
                        { value: 'pending', label: 'قيد المراجعة' }
                    ].map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilterStatus(opt.value)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filterStatus === opt.value
                                ? 'text-white bg-[#269798]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requirements List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {loading ? (
                    <div className="py-12 text-center text-gray-400">جاري التحميل...</div>
                ) : filteredRequirements.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                        <ClipboardCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>لا توجد متطلبات مسجلة</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="text-gray-600 text-sm bg-[#269798]/10">
                            <tr>
                                <th className="p-4 text-right">المتطلب</th>
                                <th className="p-4 text-right">المعيار</th>
                                <th className="p-4 text-center">الحالة</th>
                                <th className="p-4 text-center">الدرجة</th>
                                <th className="p-4 text-right">المسؤول</th>
                                <th className="p-4 text-right">تاريخ الاستحقاق</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequirements.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{req.title_ar}</div>
                                        <div className="text-sm text-gray-500">{req.requirement_code}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-xs bg-[#0F3144]/20 text-[#0F3144]">
                                            {req.standard?.code || req.section || '-'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">{getStatusBadge(req.compliance_status)}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-16 mx-auto">
                                            <div className="text-sm font-bold">{req.compliance_score || 0}%</div>
                                            <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                                {(() => {
                                                    const score = req.compliance_score || 0;
                                                    return (
                                                        <div
                                                            className={`progress-bar ${score >= 80 ? 'progress-bar-success' : score >= 50 ? 'progress-bar-warning' : 'progress-bar-danger'}`}

                                                            style={{ '--progress-width': `${score}%` } as React.CSSProperties}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">{req.responsible_person || '-'}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {req.due_date ? new Date(req.due_date).toLocaleDateString('ar-SA') : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ComplianceTracker;
