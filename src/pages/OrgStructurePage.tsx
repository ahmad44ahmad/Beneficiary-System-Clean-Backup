import React from 'react';
import { OrgChart } from '../components/organization/OrgChart';

export const OrgStructurePage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-l from-gray-50 to-white bg-clip-text text-transparent">
                    الهيكل الإداري للمركز
                </h1>
                <div className="text-sm text-gray-500">
                    آخر تحديث: ديسمبر 2025
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-1 overflow-hidden">
                <OrgChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-[#269798]/10 p-4 rounded-xl border border-[#269798]/10">
                    <h3 className="font-bold text-[#0F3144] mb-2">إجمالي الأقسام</h3>
                    <p className="text-2xl font-bold text-[#269798]">5</p>
                </div>
                <div className="bg-[#2BB574]/10 p-4 rounded-xl border border-[#2BB574]/10">
                    <h3 className="font-bold text-[#14532D] mb-2">إجمالي الوحدات</h3>
                    <p className="text-2xl font-bold text-[#1E9658]">13</p>
                </div>
                <div className="bg-[#FCB614]/10 p-4 rounded-xl border border-[#FCB614]/10">
                    <h3 className="font-bold text-[#92400E] mb-2">الكادر الإداري</h3>
                    <p className="text-2xl font-bold text-[#D49A0A]">--</p>
                </div>
            </div>
        </div>
    );
};
