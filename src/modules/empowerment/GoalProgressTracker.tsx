import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Target, ChevronLeft, Plus, Save, Loader2,
    TrendingUp, Calendar, Clock, MessageSquare,
    User, Users, CheckCircle, AlertCircle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { empowermentService, RehabGoal, GoalProgressLog, REHAB_DOMAINS } from '../../services/empowermentService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Demo Progress Data
const DEMO_PROGRESS: GoalProgressLog[] = [
    { id: '1', goal_id: '1', recorded_value: 15, previous_value: 10, progress_note: 'تحسن ملحوظ في التوازن', session_type: 'individual', session_duration_minutes: 45, recorded_by: 'أ. أحمد', recorded_at: '2025-10-15T10:00:00' },
    { id: '2', goal_id: '1', recorded_value: 22, previous_value: 15, progress_note: 'بداية المشي باستخدام المشاية', session_type: 'individual', session_duration_minutes: 60, recorded_by: 'أ. أحمد', recorded_at: '2025-10-22T10:00:00' },
    { id: '3', goal_id: '1', recorded_value: 28, previous_value: 22, progress_note: 'مشي بدون مساعدة لمسافات قصيرة', session_type: 'individual', session_duration_minutes: 50, beneficiary_feedback: 'أشعر بتحسن كبير', recorded_by: 'أ. أحمد', recorded_at: '2025-11-01T10:00:00' },
    { id: '4', goal_id: '1', recorded_value: 35, previous_value: 28, progress_note: 'استقرار في المشي', session_type: 'individual', session_duration_minutes: 55, recorded_by: 'أ. أحمد', recorded_at: '2025-11-15T10:00:00' },
];

// Session Type Labels
const SESSION_TYPES = [
    { value: 'individual', label: 'فردي', icon: User },
    { value: 'group', label: 'جماعي', icon: Users },
    { value: 'home', label: 'منزلي', icon: Calendar },
];

export const GoalProgressTracker: React.FC = () => {
    const navigate = useNavigate();
    const { goalId } = useParams<{ goalId: string }>();

    // State
    const [goal, setGoal] = useState<RehabGoal | null>(null);
    const [progressLogs, setProgressLogs] = useState<GoalProgressLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [newValue, setNewValue] = useState('');
    const [progressNote, setProgressNote] = useState('');
    const [sessionType, setSessionType] = useState('individual');
    const [sessionDuration, setSessionDuration] = useState('45');
    const [beneficiaryFeedback, setBeneficiaryFeedback] = useState('');
    const [recorderName, setRecorderName] = useState('');

    useEffect(() => {
        fetchData();
    }, [goalId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const goals = await empowermentService.getGoals();
            const currentGoal = goals.find(g => g.id === goalId) || goals[0];
            setGoal(currentGoal);

            // Simulate progress logs fetch
            setProgressLogs(DEMO_PROGRESS);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProgress = async () => {
        if (!newValue || !recorderName.trim()) {
            alert('الرجاء إدخال القيمة المسجلة واسم المسجل');
            return;
        }

        setSubmitting(true);
        try {
            await empowermentService.logProgress({
                goal_id: goal?.id,
                recorded_value: parseFloat(newValue),
                previous_value: goal?.current_value,
                progress_note: progressNote,
                session_type: sessionType,
                session_duration_minutes: parseInt(sessionDuration),
                beneficiary_feedback: beneficiaryFeedback || undefined,
                recorded_by: recorderName,
            });

            alert('✅ تم تسجيل التقدم بنجاح');
            setShowAddForm(false);
            // Reset form
            setNewValue('');
            setProgressNote('');
            setBeneficiaryFeedback('');
            fetchData();
        } finally {
            setSubmitting(false);
        }
    };

    // Prepare chart data
    const chartData = progressLogs.map(log => ({
        date: new Date(log.recorded_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
        value: log.recorded_value,
    }));

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل سجل التقدم..." />;
    }

    if (!goal) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">لم يتم العثور على الهدف</p>
            </div>
        );
    }

    const domain = REHAB_DOMAINS.find(d => d.value === goal.domain);

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="bg-gradient-to-l from-teal-600 via-cyan-600 to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate('/empowerment')} className="p-2 hover:bg-white/10 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-3xl">{domain?.icon || '🎯'}</span>
                    <div>
                        <h1 className="text-xl font-bold">{goal.goal_title}</h1>
                        <p className="text-white/80 text-sm">{domain?.label}</p>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-white/70 text-xs mb-1">القيمة الأولية</p>
                        <p className="text-2xl font-bold">{goal.baseline_value} {goal.measurement_unit}</p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-3 text-center border-2 border-white/30">
                        <p className="text-white/70 text-xs mb-1">القيمة الحالية</p>
                        <p className="text-2xl font-bold">{goal.current_value || progressLogs[progressLogs.length - 1]?.recorded_value || goal.baseline_value} {goal.measurement_unit}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-white/70 text-xs mb-1">الهدف</p>
                        <p className="text-2xl font-bold">{goal.target_value} {goal.measurement_unit}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>نسبة الإنجاز</span>
                        <span className="font-bold">{goal.progress_percentage}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-500"
                            style={{ width: `${goal.progress_percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    مسار التقدم
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, (goal.target_value || 100) * 1.1]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0891B2"
                            strokeWidth={3}
                            dot={{ fill: '#0891B2', r: 5 }}
                            name="القيمة"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Add Progress Button */}
            {!showAddForm && (
                <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full mb-6 p-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2 shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    تسجيل جلسة جديدة
                </button>
            )}

            {/* Add Progress Form */}
            {showAddForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">تسجيل تقدم جديد</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">القيمة الجديدة *</label>
                            <input
                                type="number"
                                value={newValue}
                                onChange={e => setNewValue(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                placeholder={`بالـ ${goal.measurement_unit}`}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm mb-1">مدة الجلسة (دقيقة)</label>
                            <input
                                type="number"
                                value={sessionDuration}
                                onChange={e => setSessionDuration(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1">نوع الجلسة</label>
                        <div className="flex gap-2">
                            {SESSION_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => setSessionType(type.value)}
                                    className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-all ${sessionType === type.value
                                            ? 'bg-teal-100 text-teal-700 border-2 border-teal-500'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1">ملاحظات الأخصائي</label>
                        <textarea
                            value={progressNote}
                            onChange={e => setProgressNote(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none min-h-[80px] resize-none"
                            placeholder="ملاحظات حول الجلسة والتقدم..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            تعليق المستفيد
                        </label>
                        <input
                            type="text"
                            value={beneficiaryFeedback}
                            onChange={e => setBeneficiaryFeedback(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="ما قاله المستفيد عن التجربة..."
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm mb-1">اسم المسجل *</label>
                        <input
                            type="text"
                            value={recorderName}
                            onChange={e => setRecorderName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            placeholder="اسمك"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubmitProgress}
                            disabled={submitting}
                            className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            حفظ
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            )}

            {/* Progress History */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        سجل الجلسات ({progressLogs.length})
                    </h3>
                </div>
                <div className="divide-y">
                    {progressLogs.map((log, idx) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.recorded_value! > (log.previous_value || 0)
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                        {log.recorded_value! > (log.previous_value || 0)
                                            ? <TrendingUp className="w-5 h-5" />
                                            : <AlertCircle className="w-5 h-5" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">
                                            {log.recorded_value} {goal.measurement_unit}
                                            <span className="text-sm font-normal text-gray-500 mr-2">
                                                (↑ {(log.recorded_value! - (log.previous_value || 0)).toFixed(1)})
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(log.recorded_at).toLocaleDateString('ar-SA', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                    {SESSION_TYPES.find(t => t.value === log.session_type)?.label || log.session_type}
                                </span>
                            </div>
                            {log.progress_note && (
                                <p className="text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">{log.progress_note}</p>
                            )}
                            {log.beneficiary_feedback && (
                                <p className="text-teal-600 text-sm mt-2 flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    "{log.beneficiary_feedback}"
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">سُجل بواسطة: {log.recorded_by}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoalProgressTracker;
