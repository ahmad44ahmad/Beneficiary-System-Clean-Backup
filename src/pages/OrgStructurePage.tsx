import React from 'react';
import { OrgChart } from '../components/organization/OrgChart';
import { PageHeader } from '../design-system/primitives';
import { brand } from '../design-system/tokens';

export const OrgStructurePage: React.FC = () => {
    const stats: Array<{ label: string; value: string; accent: string }> = [
        { label: 'إجمالي الأقسام', value: '5', accent: brand.teal.hex },
        { label: 'إجمالي الوحدات', value: '13', accent: brand.green.hex },
        { label: 'الكادر الإداري', value: '—', accent: brand.gold.hex },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            <PageHeader
                title="الهيكل الإداري للمركز"
                subtitle="آخر تحديث: ديسمبر 2025"
                accent="teal"
            />

            <div className="bg-white rounded-3xl border border-gray-200 p-1 overflow-hidden">
                <OrgChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="p-4 rounded-xl border bg-white"
                        style={{ borderColor: `${stat.accent}33` }}
                    >
                        <h3 className="font-bold mb-2" style={{ color: brand.navy.hex }}>{stat.label}</h3>
                        <p className="text-2xl font-bold" style={{ color: stat.accent }}>{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
