import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';
import { SROI_ASSUMPTIONS, computeSroiCardSummary } from '../../data/sroiAssumptions';

export const SROICard: React.FC = () => {
    const { ratio, socialValue, investment } = computeSroiCardSummary();

    return (
        <div className="bg-gradient-to-br from-[#0A2030] to-[#92400E] rounded-xl p-6 text-white overflow-hidden relative shadow-lg" dir="rtl">
            <div className="absolute top-0 end-0 w-64 h-64 bg-white opacity-5 rounded-full -me-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 start-0 w-48 h-48 bg-[#FCB614] opacity-10 rounded-full -ms-24 -mb-24 pointer-events-none"></div>

            <h3 className="text-[#0F3144]/20 font-medium mb-1 flex items-center gap-2 relative z-10">
                <Heart className="w-5 h-5 text-[#DC2626]" />
                العائد الاجتماعي على الاستثمار (SROI)
            </h3>

            <div className="mt-6 grid grid-cols-2 gap-8 relative z-10">
                <div>
                    <div className="text-4xl font-bold mb-1 flex items-baseline gap-1">
                        {ratio.toFixed(1)}
                        <span className="text-lg text-[#0F3144] font-normal">x</span>
                    </div>
                    <p className="text-[#0F3144]/20 text-sm">
                        كل ١ ريال يُستثمَر يحقق أثراً اجتماعياً تقديره {ratio.toFixed(1)} ريال
                    </p>
                </div>

                <div className="border-e border-[#0A2030] pe-8">
                    <p className="text-[#0F3144] text-xs uppercase tracking-wider mb-2">القيمة الاجتماعية المولَّدة</p>
                    <div className="text-2xl font-bold flex items-center gap-1 text-[#2BB574]">
                        <TrendingUp className="w-5 h-5" />
                        {socialValue.toLocaleString('ar-SA')} <span className="text-sm">ريال</span>
                    </div>
                    <p className="text-xs text-[#0F3144] mt-1">شهرياً (تقديري)</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#0A2030]/50 text-xs text-[#0F3144]/80 relative z-10 leading-relaxed">
                المصدر: منهجية NEF/SSE لاحتساب العائد الاجتماعي على الاستثمار،
                مع تطبيق مُعاملي خصم احترازيين للأثر الذاتي ({SROI_ASSUMPTIONS.deadweight * 100}٪)
                والإسناد الجزئي لأطراف أخرى ({SROI_ASSUMPTIONS.attribution * 100}٪).
                ميزانية شهرية مرجعية: {investment.toLocaleString('ar-SA')} ريال.
            </div>
        </div>
    );
};
