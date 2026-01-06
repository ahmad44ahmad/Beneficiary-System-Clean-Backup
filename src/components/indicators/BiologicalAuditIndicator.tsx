import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingDown, AlertTriangle, Utensils, Heart,
    Scale, Activity, ChevronLeft, Info, BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Types
interface FoodInventoryRecord {
    date: string;
    meat_kg: number;
    fruits_kg: number;
    vegetables_kg: number;
}

interface MedicalRecord {
    beneficiary_id: string;
    beneficiary_name: string;
    date: string;
    weight_kg: number;
    hemoglobin_level: number;
}

interface DiscrepancyAlert {
    id: string;
    date: string;
    issue: string;
    severity: 'critical' | 'high' | 'medium';
    details: string;
    recommendation: string;
}

export const BiologicalAuditIndicator: React.FC = () => {
    const navigate = useNavigate();

    // Demo data - Replace with Supabase queries
    const foodTrend = [
        { month: 'يناير', inventory_out: 450, expected: 450, weight_avg: 72 },
        { month: 'فبراير', inventory_out: 440, expected: 450, weight_avg: 71.5 },
        { month: 'مارس', inventory_out: 420, expected: 450, weight_avg: 70.8 },
        { month: 'أبريل', inventory_out: 350, expected: 450, weight_avg: 69.2 }, // Suspicious drop
        { month: 'مايو', inventory_out: 340, expected: 450, weight_avg: 68.5 }, // Critical
    ];

    const alerts: DiscrepancyAlert[] = [
        {
            id: '1',
            date: '2026-05-15',
            issue: 'تناقض حاد: خروج لحوم من المخزن لا يتطابق مع الوزن',
            severity: 'critical',
            details: 'المخزون يُظهر خروج 450 كجم لحوم شهرياً، لكن متوسط وزن المستفيدين انخفض من 72 إلى 68.5 كجم',
            recommendation: 'تحقيق فوري + إشعار نزاهة + فحص طبي مستعجل للمستفيدين'
        },
        {
            id: '2',
            date: '2026-05-10',
            issue: 'انخفاض مستوى الهيموجلوبين رغم خروج اللحوم',
            severity: 'high',
            details: 'متوسط الهيموجلوبين انخفض من 13.5 إلى 11.2 رغم عدم تغيير كميات اللحوم المستهلكة حسب السجلات',
            recommendation: 'فحص جودة اللحوم + مراجعة عقد المقاول'
        },
        {
            id: '3',
            date: '2026-04-20',
            issue: 'عدم تطابق الفواكه والخضروات',
            severity: 'medium',
            details: 'السجل يُظهر 200 كجم فواكه أسبوعياً لكن لا توجد تحسينات في مستويات الفيتامينات',
            recommendation: 'مراجعة نوعية المنتجات + عينات عشوائية'
        }
    ];

    const severityColors = {
        critical: 'bg-red-50 border-red-500 text-red-900',
        high: 'bg-orange-50 border-orange-500 text-orange-900',
        medium: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    };

    const severityIcons = {
        critical: '🚨',
        high: '⚠️',
        medium: '⚡',
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-teal-dark rounded-xl">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">مؤشر التدقيق البيولوجي</h1>
                        <p className="text-gray-500">كشف الفساد عبر ربط المخزون بالصحة</p>
                    </div>
                </div>

                <div className="bg-hrsd-teal-light/20 border border-hrsd-teal rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-hrsd-teal flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-hrsd-navy">
                        <p className="font-bold mb-1">🧬 كيف يعمل:</p>
                        <p>يربط النظام بين <span className="font-bold">خروج الطعام من المخزن</span> و <span className="font-bold">الفحوصات الطبية للمستفيدين</span>. إذا خرجت كميات كبيرة من اللحوم لكن الوزن والهيموجلوبين منخفضان = شبهة سرقة أو تلاعب.</p>
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-hrsd-teal" />
                    الاتجاه: المخزون vs الصحة
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={foodTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="left" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="inventory_out"
                            stroke="rgb(20, 130, 135)" /* HRSD Teal */
                            strokeWidth={2}
                            name="خروج من المخزن (كجم)"
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="expected"
                            stroke="rgb(40, 160, 165)" /* HRSD Teal Light */
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="المتوقع (كجم)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="weight_avg"
                            stroke="rgb(45, 180, 115)" /* HRSD Green */
                            strokeWidth={2}
                            name="متوسط الوزن (كجم)"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                        🚨 <span className="font-bold">تنبيه خطير:</span> المخزون يُظهر خروج كميات طبيعية، لكن أوزان المستفيدين في انخفاض مستمر منذ شهرين!
                    </p>
                </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    التنبيهات النشطة ({alerts.length})
                </h3>
                {alerts.map(alert => (
                    <div key={alert.id} className={`border-r-4 rounded-xl p-5 ${severityColors[alert.severity]}`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{severityIcons[alert.severity]}</span>
                                <div>
                                    <h4 className="font-bold text-lg">{alert.issue}</h4>
                                    <p className="text-sm opacity-75">{alert.date}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm"><span className="font-bold">التفاصيل:</span> {alert.details}</p>
                            <div className="bg-white/50 rounded-lg p-3">
                                <p className="text-sm font-bold">✅ التوصية:</p>
                                <p className="text-sm">{alert.recommendation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats Summary */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Utensils className="w-10 h-10 text-hrsd-teal" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">340 كجم</p>
                            <p className="text-sm text-gray-500">خروج لحوم شهري</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Heart className="w-10 h-10 text-red-600" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">11.2</p>
                            <p className="text-sm text-gray-500">متوسط الهيموجلوبين</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Scale className="w-10 h-10 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold text-red-600">68.5 كجم</p>
                            <p className="text-sm text-gray-500">متوسط الوزن (منخفض)</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <TrendingDown className="w-10 h-10 text-orange-600" />
                        <div>
                            <p className="text-2xl font-bold text-orange-600">-24%</p>
                            <p className="text-sm text-gray-500">فجوة غير مبررة</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">🚨 إجراء فوري مطلوب</h3>
                <p className="mb-4">التناقضات الحالية تتطلب تحقيقاً سريعاً. النظام سيرسل تقريراً تلقائياً إلى:</p>
                <div className="grid grid-cols-3 gap-3">
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                        مدير المركز
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                        هيئة نزاهة
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                        وحدة الرقابة الداخلية
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BiologicalAuditIndicator;
