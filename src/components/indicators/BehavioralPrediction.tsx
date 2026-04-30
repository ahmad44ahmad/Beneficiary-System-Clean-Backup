import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Brain, Thermometer, AlertTriangle,
    Wind, Sun, CloudRain, ChevronLeft, Info, BarChart3
} from 'lucide-react';
import { Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Types
interface IncidentRecord {
    date: string;
    incidents: number;
    temperature: number;
    weather: string;
}

interface Prediction {
    risk_level: 'high' | 'medium' | 'low';
    confidence: number;
    trigger: string;
    recommendation: string;
}

export const BehavioralPrediction: React.FC = () => {
    const navigate = useNavigate();

    // Demo correlation data
    const correlationData: IncidentRecord[] = [
        { date: '2026-01-01', incidents: 2, temperature: 22, weather: 'معتدل' },
        { date: '2026-01-08', incidents: 3, temperature: 24, weather: 'دافئ' },
        { date: '2026-01-15', incidents: 8, temperature: 28, weather: 'حار' }, // High correlation
        { date: '2026-01-22', incidents: 2, temperature: 21, weather: 'معتدل' },
        { date: '2026-01-29', incidents: 1, temperature: 20, weather: 'بارد' },
        { date: '2026-02-05', incidents: 9, temperature: 29, weather: 'حار جداً' }, // Climate issue
        { date: '2026-02-12', incidents: 7, temperature: 27, weather: 'حار' },
        { date: '2026-02-19', incidents: 2, temperature: 23, weather: 'معتدل' },
    ];

    const [currentTemp] = useState(28);

    // AI Prediction
    const prediction: Prediction = {
        risk_level: 'high',
        confidence: 87,
        trigger: 'درجة الحرارة الحالية 28°م + عطل المكيف = احتمالية 87% لحدوث شغب أو سلوك عنيف خلال 4 ساعات',
        recommendation: 'إصلاح المكيف فوراً + زيادة عدد الممرضين + توزيع سوائل باردة'
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-[#DC2626]/10 border-[#DC2626] text-[#7F1D1D]';
            case 'medium': return 'bg-[#F7941D]/10 border-[#F7941D] text-[#0F3144]';
            case 'low': return 'bg-[#2BB574]/10 border-[#2BB574] text-[#0F3144]';
            default: return 'bg-gray-50 border-gray-500 text-gray-900';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">التنبؤ السلوكي بالذكاء الاصطناعي</h1>
                        <p className="text-gray-500">منع الانفجار السلوكي قبل حدوثه</p>
                    </div>
                </div>

                <div className="bg-hrsd-teal-light/20 border border-hrsd-teal rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-hrsd-teal flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-hrsd-navy">
                        <p className="font-bold mb-1">🧠 كيف يعمل:</p>
                        <p>يحلل النظام <span className="font-bold">سجل الحوادث السلوكية</span> (شغب، عنف، انفعال) ويربطه بـ <span className="font-bold">درجة حرارة الغرف</span> والطقس. النمط الخفي: العنف يزيد 40% عندما تتجاوز الحرارة 26°م بسبب تعطل التكييف.</p>
                    </div>
                </div>
            </div>

            {/* Current Status Alert */}
            <div className={`mb-6 rounded-2xl p-6 border-e-4 ${getRiskColor(prediction.risk_level)}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8" />
                        <div>
                            <h3 className="text-2xl font-bold">تنبيه خطر عالي</h3>
                            <p className="text-sm opacity-75">مستوى الثقة: {prediction.confidence}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg">
                        <Thermometer className="w-5 h-5" />
                        <span className="text-xl font-bold">{currentTemp}°م</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-white/50 rounded-lg p-3">
                        <p className="font-bold mb-1">🎯 التنبؤ:</p>
                        <p>{prediction.trigger}</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3">
                        <p className="font-bold mb-1">✅ التوصية الفورية:</p>
                        <p>{prediction.recommendation}</p>
                    </div>
                </div>
            </div>

            {/* Correlation Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-hrsd-teal" />
                    العلاقة: درجة الحرارة vs الحوادث السلوكية
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="left" />
                        <Tooltip />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="incidents"
                            fill="#DC2626"
                            name="عدد الحوادث"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="temperature"
                            stroke="rgb(38, 151, 152)" /* HRSD Teal */
                            strokeWidth={2}
                            name="درجة الحرارة (°م)"
                        />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 bg-[#FCB614]/10 border border-[#FCB614]/20 rounded-lg p-3">
                    <p className="text-sm text-[#0F3144]">
                        🔥 <span className="font-bold">نمط مكتشف:</span> عندما ترتفع الحرارة فوق 26°م، تزيد الحوادث السلوكية بنسبة 300%
                    </p>
                </div>
            </div>

            {/* Environmental Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Wind className="w-5 h-5 text-[#269798]" />
                        حالة أنظمة التبريد
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-[#DC2626]/10 rounded-lg border-e-2 border-[#DC2626]">
                            <div>
                                <p className="font-bold text-[#7F1D1D]">مكيف الجناح الشرقي</p>
                                <p className="text-sm text-[#DC2626]">معطل منذ 3 أيام</p>
                            </div>
                            <span className="px-3 py-1 bg-[#DC2626] text-white rounded-full text-xs font-bold">حرج</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#FCB614]/10 rounded-lg border-e-2 border-[#FCB614]">
                            <div>
                                <p className="font-bold text-[#0F3144]">مكيف الجناح الغربي</p>
                                <p className="text-sm text-[#FCB614]">يعمل بطاقة 60%</p>
                            </div>
                            <span className="px-3 py-1 bg-[#FCB614] text-white rounded-full text-xs font-bold">متوسط</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#2BB574]/10 rounded-lg border-e-2 border-[#2BB574]">
                            <div>
                                <p className="font-bold text-[#0F3144]">مكيف الجناح الشمالي</p>
                                <p className="text-sm text-[#2BB574]">يعمل بكفاءة</p>
                            </div>
                            <span className="px-3 py-1 bg-[#2BB574] text-white rounded-full text-xs font-bold">جيد</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-[#F7941D]" />
                        توقعات الطقس القادمة
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-700">اليوم</span>
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-[#F7941D]" />
                                <span className="font-bold">32°م</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-700">غداً</span>
                            <div className="flex items-center gap-2">
                                <Sun className="w-5 h-5 text-[#DC2626]" />
                                <span className="font-bold text-[#DC2626]">35°م ⚠️</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-700">بعد غد</span>
                            <div className="flex items-center gap-2">
                                <CloudRain className="w-5 h-5 text-[#269798]" />
                                <span className="font-bold">24°م</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority Actions */}
            <div className="bg-gradient-to-r from-[#DC2626] to-[#DC2626] text-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6" />
                    خطة العمل الوقائية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/20 rounded-lg p-4">
                        <p className="font-bold mb-2">1️⃣ أولوية قصوى</p>
                        <p className="text-sm">إصلاح مكيف الجناح الشرقي خلال 2 ساعة</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                        <p className="font-bold mb-2">2️⃣ الطاقم</p>
                        <p className="text-sm">زيادة الممرضين في النوبة المسائية</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                        <p className="font-bold mb-2">3️⃣ المستفيدون</p>
                        <p className="text-sm">توزيع سوائل باردة + نقل للجناح الشمالي</p>
                    </div>
                </div>
                <div className="mt-4 bg-white/10 rounded-lg p-3">
                    <p className="text-sm">
                        💡 <span className="font-bold">ملاحظة:</span> صيانة المكيفات لم تعد "رفاهية" - هي الآن <span className="font-bold">أولوية أمنية قصوى</span> مثبتة بالأرقام لمنع الشغب
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-3xl font-bold text-[#DC2626]">+300%</p>
                    <p className="text-sm text-gray-600">زيادة الحوادث فوق 26°م</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-3xl font-bold text-[#F7941D]">{currentTemp}°م</p>
                    <p className="text-sm text-gray-600">درجة الحرارة الحالية</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-3xl font-bold text-hrsd-teal">{prediction.confidence}%</p>
                    <p className="text-sm text-gray-600">دقة التنبؤ</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-3xl font-bold text-[#2BB574]">0</p>
                    <p className="text-sm text-gray-600">حوادث مع تكييف سليم</p>
                </div>
            </div>
        </div>
    );
};

export default BehavioralPrediction;
