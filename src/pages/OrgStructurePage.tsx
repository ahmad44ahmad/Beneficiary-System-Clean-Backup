import React from 'react';
import { OrgChart } from '../components/organization/OrgChart';

export const OrgStructurePage: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold bg-gradient-to-l from-slate-700 to-slate-900 bg-clip-text text-transparent">
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
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2">إجمالي الأقسام</h3>
                    <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h3 className="font-bold text-emerald-900 mb-2">إجمالي الوحدات</h3>
                    <p className="text-2xl font-bold text-emerald-600">13</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-purple-900 mb-2">الكادر الإداري</h3>
                    <p className="text-2xl font-bold text-purple-600">--</p>
                </div>
            </div>
        </div>
    );
};
