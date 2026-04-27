import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, ChevronLeft, Plus, RefreshCw,
    TrendingUp, Clock, Award,
    User, Calendar, BarChart3, Sparkles
} from 'lucide-react';
import { empowermentService, RehabGoal, REHAB_DOMAINS } from '../../services/empowermentService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Progress Bar Component
const PROGRESS_COLORS: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
};

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = 'emerald' }) => (
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
            className={`h-full ${PROGRESS_COLORS[color] || 'bg-emerald-500'} transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
    </div>
);

// Status Badge
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        planned: 'bg-gray-100 text-gray-600',
        in_progress: 'bg-blue-100 text-blue-700',
        achieved: 'bg-green-100 text-green-700',
        partially_achieved: 'bg-yellow-100 text-yellow-700',
        on_hold: 'bg-orange-100 text-orange-700',
        abandoned: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
        planned: 'مخطط',
        in_progress: 'قيد التنفيذ',
        achieved: 'مُحقق ✅',
        partially_achieved: 'جزئي',
        on_hold: 'معلق',
        abandoned: 'متروك',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.planned}`}>
            {labels[status] || status}
        </span>
    );
};

// Goal Card Component
const GoalCard: React.FC<{ goal: RehabGoal; onClick: () => void }> = ({ goal, onClick }) => {
    const domain = REHAB_DOMAINS.find(d => d.value === goal.domain);

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{domain?.icon || '🎯'}</span>
                    <div>
                        <p className="font-bold text-gray-800">{goal.goal_title}</p>
                        <p className="text-xs text-gray-500">{domain?.label || goal.domain}</p>
                    </div>
                </div>
                <StatusBadge status={goal.status} />
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{goal.goal_description}</p>

            <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">التقدم</span>
                    <span className="font-bold text-emerald-600">{goal.progress_percentage}%</span>
                </div>
                <ProgressBar value={goal.progress_percentage} />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {goal.target_date}
                </span>
                {goal.assigned_to && (
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {goal.assigned_to}
                    </span>
                )}
            </div>
        </div>
    );
};

export const EmpowermentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState<RehabGoal[]>([]);
    const [filterDomain, setFilterDomain] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await empowermentService.getGoals();
            setGoals(data);
        } catch (err) {
            console.error('EmpowermentDashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const stats = {
        total: goals.length,
        achieved: goals.filter(g => g.status === 'achieved').length,
        inProgress: goals.filter(g => g.status === 'in_progress').length,
        avgProgress: goals.length > 0
            ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)
            : 0,
    };

    // Filter goals
    const filteredGoals = goals.filter(g => {
        if (filterDomain !== 'all' && g.domain !== filterDomain) return false;
        if (filterStatus !== 'all' && g.status !== filterStatus) return false;
        return true;
    });

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل أهداف التمكين..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-emerald-100 rounded-xl">
                        <Target className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">محرك التمكين</h1>
                        <p className="text-gray-500">إدارة الأهداف التأهيلية الذكية (SMART)</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        تحديث
                    </button>
                    <button
                        onClick={() => navigate('/empowerment/goal/new')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        هدف جديد
                    </button>
                </div>
            </div>

            {/* Three Strategic Tracks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xl">١</div>
                        <h3 className="font-bold text-emerald-900">تمكين الاستقلال الذاتي</h3>
                    </div>
                    <p className="text-sm text-gray-600">تحسين مهارات الحياة اليومية ورفع قدرة المستفيد على القيام بشؤونه باستقلالية.</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl">٢</div>
                        <h3 className="font-bold text-blue-900">تمكين الدمج المجتمعي</h3>
                    </div>
                    <p className="text-sm text-gray-600">تيسير المشاركة في الأنشطة المجتمعية والتفاعل الاجتماعي خارج المركز.</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white text-xl">٣</div>
                        <h3 className="font-bold text-amber-900">تمكين العودة لسوق العمل</h3>
                    </div>
                    <p className="text-sm text-gray-600">تطوير المهارات المهنية وفتح مسارات تأهيل تنتهي بفرص عمل مناسبة.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-blue-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">إجمالي الأهداف</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-green-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">أهداف مُحققة</p>
                            <p className="text-2xl font-bold text-green-600">{stats.achieved}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-yellow-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">قيد التنفيذ</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border-r-4 border-emerald-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">متوسط التقدم</p>
                            <p className="text-2xl font-bold text-emerald-600">{stats.avgProgress}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center">
                {/* Domain Filter */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterDomain('all')}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filterDomain === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                        الكل
                    </button>
                    {REHAB_DOMAINS.slice(0, 5).map(d => (
                        <button
                            key={d.value}
                            onClick={() => setFilterDomain(d.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${filterDomain === d.value ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                            <span>{d.icon}</span>
                            {d.label}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                >
                    <option value="all">جميع الحالات</option>
                    <option value="planned">مخطط</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="achieved">مُحقق</option>
                    <option value="on_hold">معلق</option>
                </select>
            </div>

            {/* Goals Grid */}
            {filteredGoals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGoals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onClick={() => navigate(`/empowerment/goal/${goal.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-xl">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">لا توجد أهداف مطابقة</p>
                    <button
                        onClick={() => navigate('/empowerment/goal/new')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                        إنشاء هدف جديد
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmpowermentDashboard;
