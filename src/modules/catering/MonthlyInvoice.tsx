import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { FileText, Calculator, Download, Calendar, AlertTriangle, CheckCircle2, Sparkles, BrainCircuit, Loader2, X } from 'lucide-react';

export const MonthlyInvoice: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [invoiceData, setInvoiceData] = useState<any>(null);

    useEffect(() => {
        calculateInvoice();
    }, [month]);

    const calculateInvoice = async () => {
        setLoading(true);
        const startDate = `${month}-01`;
        const endDate = `${month}-31`; // Simplified

        // 1. Fetch Meal Counts (Using daily_meals)
        const { data: meals } = await supabase
            .from('daily_meals')
            .select('meal_type, status')
            .gte('meal_date', startDate)
            .lte('meal_date', endDate)
            .eq('status', 'consumed');

        // 2. Fetch Penalties (Using contractor_evaluations)
        const { data: penalties } = await supabase
            .from('contractor_evaluations')
            .select('total_penalty_amount')
            .gte('evaluation_date', startDate)
            .lte('evaluation_date', endDate);

        // 3. Process Data
        const mealCounts = {
            breakfast: meals?.filter(m => m.meal_type === 'فطور').length || 0,
            lunch: meals?.filter(m => m.meal_type === 'غداء').length || 0,
            dinner: meals?.filter(m => m.meal_type === 'عشاء').length || 0,
            snack: meals?.filter(m => m.meal_type.includes('خفيفة')).length || 0,
        };

        const PRICES = { breakfast: 10, lunch: 15, dinner: 12, snack: 5 };

        const grossTotal =
            (mealCounts.breakfast * PRICES.breakfast) +
            (mealCounts.lunch * PRICES.lunch) +
            (mealCounts.dinner * PRICES.dinner) +
            (mealCounts.snack * PRICES.snack);

        const totalPenalties = penalties?.reduce((sum, p) => sum + (p.total_penalty_amount || 0), 0) || 0;

        setInvoiceData({
            mealCounts,
            grossTotal,
            totalPenalties,
            netTotal: grossTotal - totalPenalties
        });
        setLoading(false);
    };

    const handleAnalyze = async () => {
        if (!invoiceData) return;
        setAnalyzing(true);
        try {
            // Dynamic import to avoid build errors if service doesn't exist yet
            const { analyzeReport } = await import('../../services/aiService');
            const result = await analyzeReport(invoiceData);
            setAiAnalysis(result);
        } catch (error) {
            console.error(error);
            alert('تعذر إجراء التحليل الذكي. تأكد من إعداد مفتاح API.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen" dir="rtl">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-none p-12 print:shadow-none print:w-full">
                {/* Header with AI Button */}
                <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#14415A] mb-2">المستخلص الشهري للإعاشة</h1>
                        <p className="text-gray-500">الفترة: {month}</p>
                    </div>
                    <div className="text-left flex flex-col items-end gap-3">
                        <div className="text-left">
                            <p className="font-bold text-gray-800">شركة الخليج للتموين</p>
                            <p className="text-sm text-gray-500">سجل تجاري: 1010101010</p>
                        </div>
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing || !invoiceData}
                            className="print:hidden px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {analyzing ? (
                                <span className="flex items-center gap-2">جاري التحليل <Loader2 className="w-4 h-4 animate-spin" /></span>
                            ) : (
                                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> تحليل الذكاء الاصطناعي</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* AI Insight Card */}
                {aiAnalysis && (
                    <div className="mb-8 p-6 bg-purple-50 border border-purple-100 rounded-xl relative animate-in fade-in slide-in-from-top-4">
                        <button
                            onClick={() => setAiAnalysis(null)}
                            className="absolute top-4 left-4 text-purple-400 hover:text-purple-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="flex items-center gap-2 font-bold text-purple-800 mb-4">
                            <BrainCircuit className="w-6 h-6" />
                            تحليل المساعد الذكي (Gemini)
                        </h3>
                        <div className="prose prose-sm max-w-none text-purple-900 leading-relaxed whitespace-pre-line">
                            {aiAnalysis}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="py-12 text-center text-gray-400">جاري الحساب...</div>
                ) : invoiceData && (
                    <div className="space-y-8">
                        {/* 1. Meal Summary Table */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                ملخص الوجبات المقدمة
                            </h3>
                            <table className="w-full border border-gray-200">
                                <thead className="bg-gray-50 text-gray-600 text-sm">
                                    <tr>
                                        <th className="p-3 text-right">البيان</th>
                                        <th className="p-3 text-center">العدد</th>
                                        <th className="p-3 text-center">السعر الإفرادي</th>
                                        <th className="p-3 text-right">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-3">وجبات إفطار</td>
                                        <td className="p-3 text-center">{invoiceData.mealCounts.breakfast}</td>
                                        <td className="p-3 text-center">10 ر.س</td>
                                        <td className="p-3 font-bold text-right">{(invoiceData.mealCounts.breakfast * 10).toLocaleString()} ر.س</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">وجبات غداء</td>
                                        <td className="p-3 text-center">{invoiceData.mealCounts.lunch}</td>
                                        <td className="p-3 text-center">15 ر.س</td>
                                        <td className="p-3 font-bold text-right">{(invoiceData.mealCounts.lunch * 15).toLocaleString()} ر.س</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3">وجبات عشاء</td>
                                        <td className="p-3 text-center">{invoiceData.mealCounts.dinner}</td>
                                        <td className="p-3 text-center">12 ر.س</td>
                                        <td className="p-3 font-bold text-right">{(invoiceData.mealCounts.dinner * 12).toLocaleString()} ر.س</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. Penalties Section (Data Linking) */}
                        <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                            <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                الحسومات والغرامات (Quality Control)
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-red-600">
                                    تم احتساب الغرامات بناءً على تقارير الجودة اليومية وسجلات "لجنة الاستلام"
                                </p>
                                <span className="text-xl font-bold text-red-700">
                                    - {invoiceData.totalPenalties.toLocaleString()} ر.س
                                </span>
                            </div>
                        </div>

                        {/* 3. Final Total */}
                        <div className="border-t-2 border-gray-800 pt-6 flex justify-end">
                            <div className="text-left">
                                <p className="text-gray-500 mb-1">صافي المبلغ المستحق</p>
                                <p className="text-4xl font-bold text-[#14415A]">
                                    {invoiceData.netTotal.toLocaleString()} <span className="text-lg">ر.س</span>
                                </p>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                            <div>
                                <p className="mb-8">أخضائي التغذية</p>
                                <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                            </div>
                            <div>
                                <p className="mb-8">المحاسب</p>
                                <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                            </div>
                            <div>
                                <p className="mb-8">مدير المركز</p>
                                <div className="border-b border-gray-300 w-3/4 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
