import React from 'react';
import { Section, DescriptionList } from '../primitives';
import type { DescriptionItem } from '../primitives';

/**
 * BuildingInfo — facility-level static info.
 *
 * Per Ahmad's directive (5-6 data points leadership cares about):
 * building age, evaluation rating, license status, capacity, ownership.
 * No floor plans, no maintenance backlog details.
 */

export interface BuildingInfoData {
    /** Year of construction or full date string. */
    constructedYear: string;
    /** Latest official evaluation grade (e.g., "ممتاز", "جيد جداً"). */
    evaluation?: string;
    /** License status, ideally a status word. */
    licenseStatus?: string;
    /** License expiry, ISO or display date. */
    licenseExpiresAt?: string;
    /** Total capacity (beneficiary slots). */
    capacity?: number;
    /** Ownership: مملوك / مستأجر / منحة. */
    ownership?: string;
}

interface BuildingInfoProps {
    data: BuildingInfoData;
}

export const BuildingInfo: React.FC<BuildingInfoProps> = ({ data }) => {
    const items: DescriptionItem[] = [
        { label: 'سنة الإنشاء', value: data.constructedYear },
    ];
    if (data.evaluation) items.push({ label: 'التقييم الرسمي', value: data.evaluation });
    if (data.licenseStatus) items.push({ label: 'حالة الترخيص', value: data.licenseStatus });
    if (data.licenseExpiresAt) items.push({ label: 'انتهاء الترخيص', value: data.licenseExpiresAt });
    if (typeof data.capacity === 'number') {
        items.push({
            label: 'الطاقة الاستيعابية',
            value: `${data.capacity.toLocaleString('ar-SA')} مستفيد`,
        });
    }
    if (data.ownership) items.push({ label: 'الملكية', value: data.ownership });

    return (
        <Section title="المبنى والمنشأة">
            <DescriptionList items={items} layout="two-col" />
        </Section>
    );
};

export default BuildingInfo;
