import React, { useState } from 'react';
import { Shield, FileCheck2, Award, ShieldCheck, Download, FileText, Lock, Scale } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface AuditEntry {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    classification: 'sensitive' | 'standard' | 'confidential';
}

const SAMPLE_AUDIT_TRAIL: AuditEntry[] = [
    {
        id: 'a1',
        timestamp: '2026-04-27 14:32',
        actor: 'الممرضة عبير الشهري',
        action: 'تسجيل جرعة دوائية (إنسولين)',
        target: 'مستفيد #١٧٢ — أبو سعد',
        classification: 'sensitive',
    },
    {
        id: 'a2',
        timestamp: '2026-04-27 13:15',
        actor: 'مدير المركز',
        action: 'اعتماد رسالة مرئية للأسرة',
        target: 'مستفيد #١٠١',
        classification: 'standard',
    },
    {
        id: 'a3',
        timestamp: '2026-04-27 11:48',
        actor: 'الأخصائي الاجتماعي',
        action: 'تحديث ملف الكرامة',
        target: 'مستفيد #١٧٢',
        classification: 'sensitive',
    },
    {
        id: 'a4',
        timestamp: '2026-04-27 10:22',
        actor: 'النظام (تلقائي)',
        action: 'إعلان تفشٍّ مشتبه به (حالتان مرتبطتان)',
        target: 'القسم الشمالي',
        classification: 'confidential',
    },
    {
        id: 'a5',
        timestamp: '2026-04-27 09:05',
        actor: 'مدير الجودة',
        action: 'إغلاق ملاحظة عدم مطابقة',
        target: 'NCR-2026-014',
        classification: 'standard',
    },
];

const COMPLIANCE_PILLARS = [
    {
        icon: Scale,
        title: 'اتفاقية حقوق الأشخاص ذوي الإعاقة (CRPD)',
        body: 'يلتزم النظام بتفعيل المادتين ٩ و١٩ من الاتفاقية: الوصولية وحق العيش المستقل في المجتمع.',
        status: 'مُفعَّل',
        color: 'emerald',
    },
    {
        icon: Lock,
        title: 'نظام حماية البيانات الشخصية (PDPL)',
        body: 'تشفير على مستوى قاعدة البيانات، مسار تدقيق على كل عملية حساسة، وتحكُّم بالوصول مبني على الأدوار.',
        status: 'مطبَّق',
        color: 'blue',
    },
    {
        icon: ShieldCheck,
        title: 'الضوابط الأساسية للأمن السيبراني (NCA ECC-2:2024)',
        body: 'إدارة الهويات، تسجيل الأحداث، الاستجابة للحوادث، استمرارية الأعمال — جميعها موثقة في حزمة الامتثال.',
        status: 'موثَّق',
        color: 'indigo',
    },
    {
        icon: Award,
        title: 'معايير الوكالة لحوكمة الزيارات الإشرافية',
        body: 'نموذج التوثيق الذاتي ما قبل الزيارة، وتغطية البنود الثلاثة: الإداري والتقني، المالي، التشغيلي.',
        status: 'جاهز',
        color: 'amber',
    },
];

const CERTIFICATE_TEMPLATES = [
    { id: 'sroi', label: 'شهادة الأثر الاجتماعي', description: 'تصدر شهرياً وفق منهجية NEF/SSE' },
    { id: 'crpd', label: 'إقرار الالتزام بـ CRPD', description: 'وثيقة سنوية مرتبطة بتقييم الوصولية' },
    { id: 'pdpl', label: 'إقرار الالتزام بحماية البيانات الشخصية', description: 'إجراء سنوي يصدر مع نتائج التدقيق الداخلي' },
];

const colorClass = (color: string): { bg: string; text: string; border: string } => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
        emerald: { bg: 'bg-[#2BB574]/10', text: 'text-[#1E9658]', border: 'border-[#2BB574]/30' },
        blue: { bg: 'bg-[#269798]/10', text: 'text-[#1B7778]', border: 'border-[#269798]/30' },
        indigo: { bg: 'bg-[#0F3144]/5', text: 'text-[#0A2030]', border: 'border-[#0F3144]/30' },
        amber: { bg: 'bg-[#FCB614]/10', text: 'text-[#D49A0A]', border: 'border-[#FCB614]/30' },
    };
    return map[color] ?? map.blue;
};

export const LegalShieldPage: React.FC = () => {
    const [issuedNote, setIssuedNote] = useState<string | null>(null);

    const handleIssue = (template: typeof CERTIFICATE_TEMPLATES[number]) => {
        setIssuedNote(`تم إعداد «${template.label}» وحفظها في سجل الوثائق المؤسسية.`);
        setTimeout(() => setIssuedNote(null), 4000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6 md:p-10" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-white text-white flex items-center justify-center shadow-md">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-hrsd-navy">الدرع القانوني</h1>
                            <p className="text-hrsd-cool-gray mt-1 max-w-2xl">
                                توثيق تلقائي لكل خطوة، وامتثال مُسبق لاتفاقية حقوق الأشخاص ذوي الإعاقة، ونظام حماية البيانات الشخصية، والأمن السيبراني الوطني.
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#2BB574]/10 border border-[#2BB574]/30 rounded-xl px-4 py-3 flex items-center gap-3">
                        <FileCheck2 className="w-5 h-5 text-[#1E9658]" />
                        <div>
                            <p className="text-[#1E9658] font-bold text-sm">سجل التدقيق ١٠٠٪</p>
                            <p className="text-[#1E9658] text-xs">كل عملية حساسة موثقة</p>
                        </div>
                    </div>
                </div>

                {/* Compliance Pillars */}
                <section>
                    <h2 className="text-lg font-bold text-hrsd-navy mb-4">ركائز الامتثال</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COMPLIANCE_PILLARS.map((p) => {
                            const c = colorClass(p.color);
                            const Icon = p.icon;
                            return (
                                <Card key={p.title} className={`p-5 border ${c.border}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                                            <Icon className={`w-6 h-6 ${c.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                <h3 className="font-bold text-hrsd-navy">{p.title}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-hrsd-cool-gray leading-relaxed">{p.body}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Certificates */}
                <section>
                    <h2 className="text-lg font-bold text-hrsd-navy mb-4">إصدار الوثائق المؤسسية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CERTIFICATE_TEMPLATES.map((t) => (
                            <Card key={t.id} className="p-5 border border-gray-200 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <FileText className="w-5 h-5 text-hrsd-cool-gray" />
                                    <h3 className="font-bold text-hrsd-navy">{t.label}</h3>
                                </div>
                                <p className="text-sm text-hrsd-cool-gray flex-1">{t.description}</p>
                                <button
                                    onClick={() => handleIssue(t)}
                                    className="mt-4 w-full bg-white hover:bg-white text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    إصدار الوثيقة
                                </button>
                            </Card>
                        ))}
                    </div>
                    {issuedNote && (
                        <div className="mt-4 bg-[#2BB574]/10 border border-[#2BB574]/30 text-[#14532D] rounded-xl px-4 py-3 text-sm">
                            {issuedNote}
                        </div>
                    )}
                </section>

                {/* Audit Trail */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-hrsd-navy">آخر إجراءات سجل التدقيق</h2>
                        <a href="/admin/audit-logs" className="text-sm text-hrsd-cool-gray hover:text-hrsd-navy underline-offset-4 hover:underline">
                            عرض السجل الكامل
                        </a>
                    </div>
                    <Card className="border border-gray-200 overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {SAMPLE_AUDIT_TRAIL.map((e) => {
                                const tagColor =
                                    e.classification === 'confidential' ? 'bg-[#DC2626]/10 text-[#B91C1C] border-[#DC2626]/30' :
                                    e.classification === 'sensitive' ? 'bg-[#FCB614]/10 text-[#D49A0A] border-[#FCB614]/30' :
                                    'bg-gray-50 text-hrsd-navy border-gray-200';
                                const label =
                                    e.classification === 'confidential' ? 'سرّي' :
                                    e.classification === 'sensitive' ? 'حساس' : 'قياسي';
                                return (
                                    <div key={e.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="text-xs text-hrsd-cool-gray w-32 shrink-0 tabular-nums">{e.timestamp}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-hrsd-navy truncate">{e.action}</p>
                                            <p className="text-xs text-hrsd-cool-gray mt-0.5">{e.actor} ← {e.target}</p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-1 rounded-full border ${tagColor} shrink-0`}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </section>

            </div>
        </div>
    );
};

export default LegalShieldPage;
