import React, { useState, useEffect } from 'react';
import {
    Activity, AlertTriangle, Users, Heart, Utensils,
    Shield, Smile, TrendingUp, TrendingDown, Filter,
    Download, Printer, RefreshCw, ChevronLeft, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { wellbeingService, WellbeingScore, WellbeingStats } from '../../services/wellbeingService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// HRSD Colors
const COLORS = {
    primary: '#F5961E',
    secondary: '#FAB414',
    success: '#2DB473',
    teal: '#148287',
    navy: '#14415A',
    warning: '#FAB414',
    danger: '#DC2626',
};

export const IntegratedDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<WellbeingScore[]>([]);
    const [stats, setStats] = useState<WellbeingStats | null>(null);
    const [filterSection, setFilterSection] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<WellbeingScore | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [scoresData, statsData] = await Promise.all([
                wellbeingService.getWellbeingScores(),
                wellbeingService.getWellbeingStats()
            ]);
            setScores(scoresData);
            setStats(statsData);
        } finally {
            setLoading(false);
        }
    };

    const filteredScores = scores.filter(s => {
        if (filterSection !== 'all' && s.section !== filterSection) return false;
        if (filterStatus !== 'all' && s.status_color !== filterStatus) return false;
        return true;
    });

    const getScoreColor = (score: number) => wellbeingService.getScoreColor(score);
    const getStatusBg = (color: string) => {
        switch (color) {
            case 'أخضر': return 'bg-green-100 text-green-800';
            case 'أصفر': return 'bg-yellow-100 text-yellow-800';
            case 'أحمر': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل مؤشرات الرفاهية..." />;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6" dir="rtl">
            {/* Header */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-[#14415A]">لوحة الرفاهية المتكاملة</h1>
                    </div>
                    <p className="text-gray-600">مؤشر شامل يدمج بيانات الصحة والتغذية والسلامة</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        تحديث
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        طباعة
                    </button>
                    <button className="px-4 py-2 bg-[#14415A] text-white rounded-lg hover:bg-[#0f3246] flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        تصدير Excel
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {/* Total */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-[#14415A]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">إجمالي المستفيدين</p>
                                <h3 className="text-3xl font-bold text-[#14415A]">{stats.total_beneficiaries}</h3>
                            </div>
                            <Users className="w-8 h-8 text-[#14415A] opacity-50" />
                        </div>
                    </div>

                    {/* Average Score */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border-t-4" style={{ borderColor: getScoreColor(stats.avg_wellbeing_score) }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">متوسط الرفاهية</p>
                                <h3 className="text-3xl font-bold" style={{ color: getScoreColor(stats.avg_wellbeing_score) }}>
                                    {stats.avg_wellbeing_score}%
                                </h3>
                            </div>
                            <Activity className="w-8 h-8 opacity-50" style={{ color: getScoreColor(stats.avg_wellbeing_score) }} />
                        </div>
                    </div>

                    {/* Green */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-green-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">حالة ممتازة 🟢</p>
                                <h3 className="text-3xl font-bold text-green-600">{stats.green_count}</h3>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </div>

                    {/* Yellow */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-yellow-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">تحتاج متابعة 🟡</p>
                                <h3 className="text-3xl font-bold text-yellow-600">{stats.yellow_count}</h3>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
                        </div>
                    </div>

                    {/* Red */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border-t-4 border-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">حالة حرجة 🔴</p>
                                <h3 className="text-3xl font-bold text-red-600">{stats.red_count}</h3>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-500 opacity-50" />
                        </div>
                    </div>
                </div>
            )}

            {/* Component Scores Overview */}
            {stats && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Heart className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">متوسط الصحة</p>
                            <p className="text-xl font-bold text-gray-800">{stats.avg_health_score}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Utensils className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">متوسط التغذية</p>
                            <p className="text-xl font-bold text-gray-800">{stats.avg_nutrition_score}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">متوسط السلامة</p>
                            <p className="text-xl font-bold text-gray-800">{stats.avg_safety_score}%</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Smile className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">متوسط المزاج</p>
                            <p className="text-xl font-bold text-gray-800">{stats.avg_mood_score}%</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex gap-4 items-center">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                >
                    <option value="all">جميع الأقسام</option>
                    <option value="ذكور">ذكور</option>
                    <option value="إناث">إناث</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                >
                    <option value="all">جميع الحالات</option>
                    <option value="أخضر">🟢 ممتاز</option>
                    <option value="أصفر">🟡 متابعة</option>
                    <option value="أحمر">🔴 حرج</option>
                </select>
                <span className="text-gray-500 text-sm mr-auto">
                    عرض {filteredScores.length} من {scores.length} مستفيد
                </span>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-[#14415A] text-white">
                            <tr>
                                <th className="px-4 py-3 font-medium">م</th>
                                <th className="px-4 py-3 font-medium">الاسم</th>
                                <th className="px-4 py-3 font-medium">رقم الملف</th>
                                <th className="px-4 py-3 font-medium">القسم</th>
                                <th className="px-4 py-3 font-medium">الغرفة</th>
                                <th className="px-4 py-3 font-medium text-center">الصحة</th>
                                <th className="px-4 py-3 font-medium text-center">التغذية</th>
                                <th className="px-4 py-3 font-medium text-center">السلامة</th>
                                <th className="px-4 py-3 font-medium text-center">المزاج</th>
                                <th className="px-4 py-3 font-medium text-center">الدرجة الكلية</th>
                                <th className="px-4 py-3 font-medium text-center">الحالة</th>
                                <th className="px-4 py-3 font-medium text-center">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredScores.map((score, idx) => (
                                <tr key={score.beneficiary_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{score.full_name}</td>
                                    <td className="px-4 py-3 text-gray-600">{score.file_number}</td>
                                    <td className="px-4 py-3 text-gray-600">{score.section}</td>
                                    <td className="px-4 py-3 text-gray-600">{score.room_number}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono" style={{ color: getScoreColor(score.health_score) }}>
                                            {score.health_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono" style={{ color: getScoreColor(score.nutrition_score) }}>
                                            {score.nutrition_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono" style={{ color: getScoreColor(score.safety_score) }}>
                                            {score.safety_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="font-mono" style={{ color: getScoreColor(score.mood_score) }}>
                                            {score.mood_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className="text-xl font-bold"
                                            style={{ color: getScoreColor(score.wellbeing_score) }}
                                        >
                                            {score.wellbeing_score}%
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBg(score.status_color)}`}>
                                            {score.status_color === 'أخضر' ? '🟢 ممتاز' :
                                                score.status_color === 'أصفر' ? '🟡 متابعة' :
                                                    '🔴 حرج'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelectedBeneficiary(score)}
                                            className="p-2 hover:bg-gray-100 rounded-lg text-[#14415A]"
                                            title="عرض التفاصيل"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedBeneficiary && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBeneficiary(null)}>
                    <div className="bg-white rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#14415A]">{selectedBeneficiary.full_name}</h2>
                                <p className="text-gray-500">{selectedBeneficiary.file_number} | {selectedBeneficiary.section}</p>
                            </div>
                            <div
                                className="text-4xl font-bold px-4 py-2 rounded-xl"
                                style={{
                                    color: getScoreColor(selectedBeneficiary.wellbeing_score),
                                    backgroundColor: `${getScoreColor(selectedBeneficiary.wellbeing_score)}15`
                                }}
                            >
                                {selectedBeneficiary.wellbeing_score}%
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'الصحة', score: selectedBeneficiary.health_score, icon: Heart, color: '#DC2626', weight: '30%' },
                                { label: 'التغذية', score: selectedBeneficiary.nutrition_score, icon: Utensils, color: '#F97316', weight: '20%' },
                                { label: 'السلامة', score: selectedBeneficiary.safety_score, icon: Shield, color: '#3B82F6', weight: '20%' },
                                { label: 'المزاج', score: selectedBeneficiary.mood_score, icon: Smile, color: '#8B5CF6', weight: '15%' },
                                { label: 'النشاط', score: selectedBeneficiary.activity_score, icon: Activity, color: '#10B981', weight: '15%' },
                            ].map((item) => (
                                <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-5 h-5" style={{ color: item.color }} />
                                            <span className="font-medium">{item.label}</span>
                                            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{item.weight}</span>
                                        </div>
                                        <span className="font-mono font-bold" style={{ color: getScoreColor(item.score) }}>
                                            {item.score}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full transition-all"
                                            style={{
                                                width: `${item.score}%`,
                                                backgroundColor: getScoreColor(item.score)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedBeneficiary.requires_followup && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <span className="text-yellow-800">يحتاج متابعة خاصة</span>
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedBeneficiary(null)}
                            className="mt-6 w-full py-2 bg-[#14415A] text-white rounded-lg hover:bg-[#0f3246]"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntegratedDashboard;
