import React from 'react';
import { PageHeader } from '../design-system/primitives';
import {
    AggregateKPI,
    SroiHeadline,
    StaffingOverview,
    ContractorsList,
    BuildingInfo,
    RiskRegisterPreview,
} from '../design-system/aggregate';
import type {
    ContractorRow,
    RoleCount,
    BuildingInfoData,
    RiskPreviewRow,
    AggregateBreakdownRow,
} from '../design-system/aggregate';
import { computeSroiCardSummary } from '../data/sroiAssumptions';

/**
 * AggregateDashboard — the single page rendered to aggregate-scope
 * personas (Wakeel, Branch GM). Per Ahmad's directive (2026-04-30):
 * leadership sees aggregates only — counts, classifications, KPIs,
 * sanitized risks. No drill-in to a beneficiary record, no staff names,
 * no operational detail.
 *
 * The page is read-only by design: every component below is read-only,
 * and there are no interactive routes leaving from here back into
 * operational surfaces. If a leader needs operational detail, the
 * mechanism is org-formal (request through the Branch GM workflow),
 * not an in-app drill-down.
 *
 * Data shown here is realistic seed (5-6 cases per Ahmad's directive)
 * representing مركز التأهيل الشامل بالباحة. The ministry team will
 * replace seeds with API data when the integration phase begins.
 */

const beneficiaryBreakdown: AggregateBreakdownRow[] = [
    { label: 'استضافة كاملة (طريح فراش)', value: 12 },
    { label: 'كرسي متحرك', value: 28 },
    { label: 'متحرك مع دعم', value: 22 },
];

const staffingRows: RoleCount[] = [
    { role: 'أخصائي علاج طبيعي', count: 4, note: 'صباحي' },
    { role: 'أخصائي اجتماعي', count: 5 },
    { role: 'طبيب', count: 2 },
    { role: 'ممرض', count: 8, note: '٣ صباحي · ٣ مسائي · ٢ ليلي' },
    { role: 'مساعد رعاية', count: 12 },
    { role: 'إداري', count: 4 },
];

const contractors: ContractorRow[] = [
    {
        company: 'شركة الرعاية المتكاملة',
        serviceArea: 'تشغيل وصيانة المرافق',
        status: 'active',
        expiresAt: '2027-03-15',
    },
    {
        company: 'مؤسسة الوجبات الصحية',
        serviceArea: 'خدمة التغذية',
        status: 'expiring',
        expiresAt: '2026-07-30',
    },
    {
        company: 'النقل المتخصص',
        serviceArea: 'نقل المستفيدين',
        status: 'active',
        expiresAt: '2026-12-01',
    },
    {
        company: '—',
        serviceArea: 'الخدمات الأمنية',
        status: 'tendering',
    },
];

const buildingData: BuildingInfoData = {
    constructedYear: '1429هـ (2008م)',
    evaluation: 'ممتاز',
    licenseStatus: 'ساري',
    licenseExpiresAt: '2027-08-12',
    capacity: 80,
    ownership: 'مملوك للوزارة',
};

const risks: RiskPreviewRow[] = [
    {
        title: 'تأخّر تجديد عقد التغذية قبل الانتهاء بأقل من ٩٠ يوماً',
        severity: 'high',
        reporterRole: 'مدير المركز',
        loggedAt: '٢٠٢٦-٠٤-١٠',
    },
    {
        title: 'نقص في الكادر التمريضي للوردية الليلية',
        severity: 'high',
        reporterRole: 'رئيس قسم التمريض',
        loggedAt: '٢٠٢٦-٠٤-٠٢',
    },
    {
        title: 'تأخّر صيانة المصاعد الدورية',
        severity: 'medium',
        reporterRole: 'مشرف الصيانة',
        loggedAt: '٢٠٢٦-٠٣-٢٧',
    },
    {
        title: 'محدودية برامج التأهيل المهني داخل المركز',
        severity: 'medium',
        reporterRole: 'مشرف خدمات العلاج الطبيعي',
        loggedAt: '٢٠٢٦-٠٣-٢١',
    },
    {
        title: 'نقص في وسائل النقل المتخصصة لذوي الإعاقات الحركية الشديدة',
        severity: 'low',
        reporterRole: 'الأخصائي الاجتماعي',
        loggedAt: '٢٠٢٦-٠٣-١٥',
    },
];

export const AggregateDashboard: React.FC = () => {
    const sroi = computeSroiCardSummary();

    return (
        <div dir="rtl" className="space-y-6">
            <PageHeader
                title="عرض القيادات"
                subtitle="مركز التأهيل الشامل بالباحة · ملخّص تنفيذي للقيادات الإشرافية"
            />

            <SroiHeadline
                ratio={sroi.ratio}
                period="السنة المالية ١٤٤٦هـ"
                interpretation="كلّ ريال مُستثمَر يعود بأثر اجتماعي صافٍ يفوق قيمته"
            />

            <AggregateKPI
                title="المستفيدون"
                headline={(62).toLocaleString('ar-SA')}
                unit="مستفيد نشط"
                breakdown={beneficiaryBreakdown}
                caption="التصنيف بناءً على درجة الاستقلال الحركي · لا يتضمّن حالات قيد القبول"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StaffingOverview total={35} rows={staffingRows} />
                <BuildingInfo data={buildingData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ContractorsList rows={contractors} />
                <RiskRegisterPreview rows={risks} />
            </div>
        </div>
    );
};

export default AggregateDashboard;
