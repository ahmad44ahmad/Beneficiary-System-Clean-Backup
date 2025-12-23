
import React from 'react';
import { TrendingUp, DollarSign, Users, Heart } from 'lucide-react';

export const SROICard: React.FC = () => {
    // Assumptions for SROI Calculation (Demo Logic)
    // 1 SAR invested = 4.2 SAR social value (Standard SROI ratio for social care)
    const investment = 150000; // Monthly budget example
    const socialValue = investment * 4.2;
    const ratio = 4.2;

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white overflow-hidden relative shadow-lg">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-10 rounded-full -ml-24 -mb-24 pointer-events-none"></div>

            <h3 className="text-indigo-200 font-medium mb-1 flex items-center gap-2 relative z-10">
                <Heart className="w-5 h-5 text-pink-400" />
                العائد الاجتماعي على الاستثمار (SROI)
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-8 relative z-10">
                <div>
                    <div className="text-4xl font-bold mb-1 flex items-baseline gap-1">
                        {ratio}
                        <span className="text-lg text-indigo-300 font-normal">x</span>
                    </div>
                    <p className="text-indigo-200 text-sm">كل 1 ريال يُستثمر يحقق أثراً بقيمة 4.2 ريال</p>
                </div>

                <div className="border-r border-indigo-700 pr-8">
                    <p className="text-indigo-300 text-xs uppercase tracking-wider mb-2">القيمة الاجتماعية المولدة</p>
                    <div className="text-2xl font-bold flex items-center gap-1 text-emerald-300">
                        <TrendingUp className="w-5 h-5" />
                        {socialValue.toLocaleString()} <span className="text-sm">ريال</span>
                    </div>
                    <p className="text-xs text-indigo-400 mt-1">شهرياً (تقديري)</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-indigo-800/50 grid grid-cols-3 gap-4 text-center relative z-10">
                <div>
                    <span className="block text-xl font-bold">120+</span>
                    <span className="text-xs text-indigo-300">ساعة رعاية</span>
                </div>
                <div>
                    <span className="block text-xl font-bold">95%</span>
                    <span className="text-xs text-indigo-300">رضا المستفيدين</span>
                </div>
                <div>
                    <span className="block text-xl font-bold">0%</span>
                    <span className="text-xs text-indigo-300">هدر غذائي</span>
                </div>
            </div>
        </div>
    );
};
