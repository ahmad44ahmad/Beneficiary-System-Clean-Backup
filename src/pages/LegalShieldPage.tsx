import React, { useState } from 'react';
import { Shield, FileCheck2, Award, ShieldCheck, Download, FileText, Lock, Scale } from 'lucide-react';
import { Section, PageHeader } from '../design-system/primitives';
import { brand } from '../design-system/tokens';
import { SAFE_PAIRS } from '../design-system/a11y-tokens';

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

type PillarKey = 'green' | 'teal' | 'navy' | 'gold';

const COMPLIANCE_PILLARS: Array<{
    icon: React.ElementType;
    title: string;
    body: string;
    status: string;
    key: PillarKey;
}> = [
    {
        icon: Scale,
        title: 'اتفاقية حقوق الأشخاص ذوي الإعاقة (CRPD)',
        body: 'يلتزم النظام بتفعيل المادتين ٩ و١٩ من الاتفاقية: الوصولية وحق العيش المستقل في المجتمع.',
        status: 'مُفعَّل',
        key: 'green',
    },
    {
        icon: Lock,
        title: 'نظام حماية البيانات الشخصية (PDPL)',
        body: 'تشفير على مستوى قاعدة البيانات، مسار تدقيق على كل عملية حساسة، وتحكُّم بالوصول مبني على الأدوار.',
        status: 'مطبَّق',
        key: 'teal',
    },
    {
        icon: ShieldCheck,
        title: 'الضوابط الأساسية للأمن السيبراني (NCA ECC-2:2024)',
        body: 'إدارة الهويات، تسجيل الأحداث، الاستجابة للحوادث، استمرارية الأعمال — جميعها موثقة في حزمة الامتثال.',
        status: 'موثَّق',
        key: 'navy',
    },
    {
        icon: Award,
        title: 'معايير الوكالة لحوكمة الزيارات الإشرافية',
        body: 'نموذج التوثيق الذاتي ما قبل الزيارة، وتغطية البنود الثلاثة: الإداري والتقني، المالي، التشغيلي.',
        status: 'جاهز',
        key: 'gold',
    },
];

const CERTIFICATE_TEMPLATES = [
    { id: 'sroi', label: 'شهادة الأثر الاجتماعي', description: 'تصدر شهرياً وفق منهجية NEF/SSE' },
    { id: 'crpd', label: 'إقرار الالتزام بـ CRPD', description: 'وثيقة سنوية مرتبطة بتقييم الوصولية' },
    { id: 'pdpl', label: 'إقرار الالتزام بحماية البيانات الشخصية', description: 'إجراء سنوي يصدر مع نتائج التدقيق الداخلي' },
];

/**
 * Resolves a pillar's accent color from brand tokens. Includes the
 * a11y-correct foreground for the accent's badge: gold needs navy
 * foreground (gold + white fails WCAG AA), the rest pair with white.
 */
const pillarAccent = (key: PillarKey): { hex: string; badgeFg: string } => {
    switch (key) {
        case 'green':
            return { hex: brand.green.hex, badgeFg: '#FFFFFF' };
        case 'teal':
            return { hex: brand.teal.hex, badgeFg: '#FFFFFF' };
        case 'navy':
            return { hex: brand.navy.hex, badgeFg: '#FFFFFF' };
        case 'gold':
            return { hex: brand.gold.hex, badgeFg: brand.navy.hex };
    }
};

export const LegalShieldPage: React.FC = () => {
    const [issuedNote, setIssuedNote] = useState<string | null>(null);

    const handleIssue = (template: typeof CERTIFICATE_TEMPLATES[number]) => {
        setIssuedNote(`تم إعداد «${template.label}» وحفظها في سجل الوثائق المؤسسية.`);
        setTimeout(() => setIssuedNote(null), 4000);
    };

    return (
        <div className="min-h-screen bg-white p-6 md:p-10" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">

                <PageHeader
                    title={
                        <span className="flex items-center gap-3">
                            <Shield className="w-7 h-7" style={{ color: brand.navy.hex }} />
                            <span>الدرع القانوني</span>
                        </span>
                    }
                    subtitle="توثيق تلقائي لكل خطوة، وامتثال مُسبق لاتفاقية حقوق الأشخاص ذوي الإعاقة، ونظام حماية البيانات الشخصية، والأمن السيبراني الوطني."
                    accent="teal"
                    actions={
                        <div
                            className="rounded-xl px-4 py-3 flex items-center gap-3 border"
                            style={{
                                backgroundColor: `${brand.green.hex}1A`,
                                borderColor: `${brand.green.hex}55`,
                            }}
                        >
                            <FileCheck2 className="w-5 h-5" style={{ color: brand.green.hex }} />
                            <div>
                                <p className="font-bold text-sm" style={{ color: brand.green.hex }}>سجل التدقيق ١٠٠٪</p>
                                <p className="text-xs" style={{ color: brand.green.hex }}>كل عملية حساسة موثقة</p>
                            </div>
                        </div>
                    }
                />

                {/* Compliance Pillars */}
                <Section title="ركائز الامتثال">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {COMPLIANCE_PILLARS.map((p) => {
                            const accent = pillarAccent(p.key);
                            const Icon = p.icon;
                            return (
                                <div
                                    key={p.title}
                                    className="p-5 rounded-xl border bg-white"
                                    style={{ borderColor: `${accent.hex}55` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: `${accent.hex}1A` }}
                                        >
                                            <Icon className="w-6 h-6" style={{ color: accent.hex }} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-3 mb-1">
                                                <h3 className="font-bold" style={{ color: brand.navy.hex }}>{p.title}</h3>
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0"
                                                    style={{
                                                        backgroundColor: accent.hex,
                                                        color: accent.badgeFg,
                                                    }}
                                                >
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="text-sm leading-relaxed" style={{ color: brand.coolGray.hex }}>
                                                {p.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                {/* Certificates */}
                <Section title="إصدار الوثائق المؤسسية">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CERTIFICATE_TEMPLATES.map((t) => (
                            <div
                                key={t.id}
                                className="p-5 rounded-xl border border-gray-200 bg-white flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <FileText className="w-5 h-5" style={{ color: brand.coolGray.hex }} />
                                    <h3 className="font-bold" style={{ color: brand.navy.hex }}>{t.label}</h3>
                                </div>
                                <p className="text-sm flex-1" style={{ color: brand.coolGray.hex }}>{t.description}</p>
                                <button
                                    onClick={() => handleIssue(t)}
                                    className="mt-4 w-full rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:brightness-95"
                                    style={{
                                        backgroundColor: brand.teal.hex,
                                        color: '#FFFFFF',
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                    إصدار الوثيقة
                                </button>
                            </div>
                        ))}
                    </div>
                    {issuedNote && (
                        <div
                            className="mt-4 rounded-xl px-4 py-3 text-sm border"
                            style={{
                                backgroundColor: `${brand.green.hex}1A`,
                                borderColor: `${brand.green.hex}55`,
                                color: brand.green.hex,
                            }}
                            role="status"
                        >
                            {issuedNote}
                        </div>
                    )}
                </Section>

                {/* Audit Trail */}
                <Section
                    title="آخر إجراءات سجل التدقيق"
                    actions={
                        <a
                            href="/admin/audit-logs"
                            className="text-sm hover:underline underline-offset-4"
                            style={{ color: brand.coolGray.hex }}
                        >
                            عرض السجل الكامل
                        </a>
                    }
                >
                    <ul className="divide-y divide-gray-100">
                        {SAMPLE_AUDIT_TRAIL.map((e) => {
                            const tag =
                                e.classification === 'confidential' ? { fg: '#FFFFFF', bg: '#DC2626', label: 'سرّي' } :
                                e.classification === 'sensitive' ? { fg: SAFE_PAIRS.badgeOnGold.fg, bg: SAFE_PAIRS.badgeOnGold.bg, label: 'حساس' } :
                                { fg: brand.coolGray.hex, bg: '#F3F4F6', label: 'قياسي' };
                            return (
                                <li key={e.id} className="py-3 flex items-start gap-4">
                                    <div
                                        className="text-xs w-32 shrink-0 tabular-nums"
                                        style={{ color: brand.coolGray.hex }}
                                    >
                                        {e.timestamp}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: brand.navy.hex }}>{e.action}</p>
                                        <p className="text-xs mt-0.5" style={{ color: brand.coolGray.hex }}>
                                            {e.actor} ← {e.target}
                                        </p>
                                    </div>
                                    <span
                                        className="text-[10px] px-2 py-1 rounded-full font-medium shrink-0"
                                        style={{ color: tag.fg, backgroundColor: tag.bg }}
                                    >
                                        {tag.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </Section>

            </div>
        </div>
    );
};

export default LegalShieldPage;
