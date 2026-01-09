import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heart, ChevronLeft, TrendingUp, TrendingDown,
    MessageCircle, AlertTriangle, ThumbsUp, ThumbsDown, RefreshCw
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SatisfactionData {
    month: string;
    satisfaction_score: number;
    complaints_count: number;
    compliments_count: number;
}

export const SatisfactionPulse: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [currentScore, setCurrentScore] = useState(72);
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('down');

    // Demo data
    const monthlyData: SatisfactionData[] = [
        { month: '2025-07', satisfaction_score: 85, complaints_count: 2, compliments_count: 8 },
        { month: '2025-08', satisfaction_score: 82, complaints_count: 3, compliments_count: 6 },
        { month: '2025-09', satisfaction_score: 78, complaints_count: 4, compliments_count: 5 },
        { month: '2025-10', satisfaction_score: 75, complaints_count: 5, compliments_count: 4 },
        { month: '2025-11', satisfaction_score: 70, complaints_count: 6, compliments_count: 3 },
        { month: '2025-12', satisfaction_score: 72, complaints_count: 5, compliments_count: 4 },
    ];

    const recentFeedback = [
        { type: 'complaint', date: '2026-01-08', source: 'أسرة المستفيد أحمد', content: 'تأخر في إبلاغنا عن حالة ابننا الصحية', status: 'pending', severity: 'high' },
        { type: 'complaint', date: '2026-01-06', source: 'أسرة المستفيدة فاطمة', content: 'جودة الطعام غير مرضية', status: 'resolved', severity: 'medium' },
        { type: 'compliment', date: '2026-01-05', source: 'أسرة المستفيد خالد', content: 'شكراً على العناية الممتازة بابننا', status: 'acknowledged', severity: 'positive' },
        { type: 'complaint', date: '2026-01-03', source: 'زائر', content: 'صعوبة في الوصول لمواقف السيارات', status: 'in_progress', severity: 'low' },
    ];

    const escalationRisks = [
        { family: 'أسرة المستفيد أحمد', issue: 'عدم الإبلاغ', days_pending: 3, risk_level: 'high' },
        { family: 'أسرة المستفيدة سارة', issue: 'شكوى غذاء متكررة', days_pending: 7, risk_level: 'medium' },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 500);
    }, []);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-hrsd-green';
        if (score >= 60) return 'text-hrsd-gold';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'from-hrsd-green to-hrsd-green-dark';
        if (score >= 60) return 'from-hrsd-gold to-hrsd-gold-dark';
        return 'from-red-500 to-red-600';
    };

    const pieData = [
        { name: 'راضي', value: 72, color: 'rgb(45, 180, 115)' },
        { name: 'محايد', value: 18, color: 'rgb(250, 180, 20)' },
        { name: 'غير راضي', value: 10, color: 'rgb(239, 68, 68)' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className={`p-3 bg-gradient-to-br ${getScoreBg(currentScore)} rounded-xl`}>
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر الرضا الآني</h1>
                        <p className="text-hierarchy-small text-gray-500">توقع مشاكل العلاقات العامة قبل التصعيد</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mr-auto p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <RefreshCw className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hrsd-teal"></div>
                </div>
            ) : (
                <>
                    {/* Main Score Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className={`bg-gradient-to-br ${getScoreBg(currentScore)} rounded-2xl p-6 text-white col-span-1`}>
                            <p className="text-white/80 text-sm mb-2">نسبة الرضا الحالية</p>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-bold">{currentScore}%</span>
                                {trend === 'down' ? (
                                    <TrendingDown className="w-6 h-6 text-white/80 mb-2" />
                                ) : (
                                    <TrendingUp className="w-6 h-6 text-white/80 mb-2" />
                                )}
                            </div>
                            <p className="text-sm mt-2 text-white/80">
                                {currentScore >= 80 ? 'ممتاز - استمر!' : currentScore >= 60 ? 'يحتاج انتباه' : 'تحذير - خطر تصعيد!'}
                            </p>
                        </div>

                        <div className="hrsd-card">
                            <h4 className="text-hierarchy-small text-gray-500 mb-3">توزيع الرضا</h4>
                            <ResponsiveContainer width="100%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={60}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 text-xs">
                                {pieData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hrsd-card">
                            <h4 className="text-hierarchy-small text-gray-500 mb-3">إحصائيات الشهر</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                    <ThumbsDown className="w-6 h-6 text-red-600 mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-red-600">5</p>
                                    <p className="text-xs text-gray-500">شكاوى</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <ThumbsUp className="w-6 h-6 text-hrsd-green mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-hrsd-green">4</p>
                                    <p className="text-xs text-gray-500">إشادات</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="hrsd-card mb-6">
                        <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-hrsd-teal" />
                            اتجاه الرضا (6 أشهر)
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickFormatter={(v) => {
                                    const [year, month] = v.split('-');
                                    const months = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                                    return months[parseInt(month)];
                                }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="satisfaction_score" stroke="rgb(20, 130, 135)" strokeWidth={3} name="نسبة الرضا" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Escalation Risks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                خطر تصعيد للوزارة
                            </h3>
                            {escalationRisks.length > 0 ? (
                                <div className="space-y-3">
                                    {escalationRisks.map((risk, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border-r-4 ${risk.risk_level === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{risk.family}</p>
                                                    <p className="text-sm text-gray-600">{risk.issue}</p>
                                                </div>
                                                <div className="text-left">
                                                    <span className={`badge-${risk.risk_level === 'high' ? 'danger' : 'warning'}`}>
                                                        {risk.days_pending} يوم
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                ⚠️ توصية: اتصل بالأسرة خلال 24 ساعة
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 py-4">لا توجد مخاطر تصعيد حالياً</p>
                            )}
                        </div>

                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-hrsd-teal" />
                                آخر التعليقات
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {recentFeedback.map((feedback, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg ${feedback.type === 'complaint' ? 'bg-red-50' : 'bg-green-50'}`}>
                                        <div className="flex items-start gap-2">
                                            {feedback.type === 'complaint' ? (
                                                <ThumbsDown className="w-4 h-4 text-red-600 mt-1" />
                                            ) : (
                                                <ThumbsUp className="w-4 h-4 text-hrsd-green mt-1" />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{feedback.source}</p>
                                                <p className="text-xs text-gray-600">{feedback.content}</p>
                                                <p className="text-xs text-gray-400 mt-1">{feedback.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SatisfactionPulse;
