import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart3, ChevronLeft, CheckCircle, AlertCircle,
    XCircle, TrendingUp, RefreshCw, Target
} from 'lucide-react';
import { supabase } from '../../config/supabase';

interface BenchmarkStandard {
    indicator_name: string;
    indicator_code: string;
    ministry_target: number;
    excellent_threshold: number;
    good_threshold: number;
    acceptable_threshold: number;
    unit: string;
    category: string;
    is_higher_better: boolean;
    current_value?: number;
}

export const BenchmarkDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [benchmarks, setBenchmarks] = useState<BenchmarkStandard[]>([]);

    // Demo data with current values
    const demoData: BenchmarkStandard[] = [
        { indicator_name: 'نسبة إكمال العناية اليومية', indicator_code: 'CARE_COMPLETION', ministry_target: 95, excellent_threshold: 95, good_threshold: 85, acceptable_threshold: 75, unit: 'نسبة', category: 'جودة', is_higher_better: true, current_value: 88 },
        { indicator_name: 'معدل حوادث السقوط/1000 يوم', indicator_code: 'FALL_RATE', ministry_target: 2, excellent_threshold: 1, good_threshold: 3, acceptable_threshold: 5, unit: 'معدل', category: 'سلامة', is_higher_better: false, current_value: 2.5 },
        { indicator_name: 'نسبة الامتثال لنظافة اليدين', indicator_code: 'HAND_HYGIENE', ministry_target: 90, excellent_threshold: 95, good_threshold: 85, acceptable_threshold: 75, unit: 'نسبة', category: 'IPC', is_higher_better: true, current_value: 82 },
        { indicator_name: 'زمن الاستجابة للتنبيهات', indicator_code: 'ALERT_RESPONSE', ministry_target: 15, excellent_threshold: 10, good_threshold: 20, acceptable_threshold: 30, unit: 'دقيقة', category: 'استجابة', is_higher_better: false, current_value: 18 },
        { indicator_name: 'نسبة رضا الأسر', indicator_code: 'FAMILY_SATISFACTION', ministry_target: 85, excellent_threshold: 90, good_threshold: 80, acceptable_threshold: 70, unit: 'نسبة', category: 'رضا', is_higher_better: true, current_value: 72 },
        { indicator_name: 'تكلفة المستفيد اليومية', indicator_code: 'DAILY_COST', ministry_target: 350, excellent_threshold: 300, good_threshold: 400, acceptable_threshold: 500, unit: 'ريال', category: 'مالي', is_higher_better: false, current_value: 380 },
        { indicator_name: 'نسبة التسليم في الوقت', indicator_code: 'ON_TIME_HANDOVER', ministry_target: 95, excellent_threshold: 98, good_threshold: 90, acceptable_threshold: 80, unit: 'نسبة', category: 'جودة', is_higher_better: true, current_value: 92 },
        { indicator_name: 'نسبة الصيانة الوقائية المنجزة', indicator_code: 'PREVENTIVE_MAINTENANCE', ministry_target: 90, excellent_threshold: 95, good_threshold: 85, acceptable_threshold: 75, unit: 'نسبة', category: 'سلامة', is_higher_better: true, current_value: 78 },
    ];

    useEffect(() => {
        const fetchBenchmarks = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('benchmark_standards')
                .select('*');

            if (error || !data || data.length === 0) {
                setBenchmarks(demoData);
            } else {
                // Add demo current values
                const withValues = data.map((item, idx) => ({
                    ...item,
                    current_value: demoData[idx]?.current_value || Math.random() * 100
                }));
                setBenchmarks(withValues);
            }
            setLoading(false);
        };
        fetchBenchmarks();
    }, []);

    const getStatus = (benchmark: BenchmarkStandard): 'excellent' | 'good' | 'acceptable' | 'poor' => {
        const val = benchmark.current_value || 0;
        if (benchmark.is_higher_better) {
            if (val >= benchmark.excellent_threshold) return 'excellent';
            if (val >= benchmark.good_threshold) return 'good';
            if (val >= benchmark.acceptable_threshold) return 'acceptable';
            return 'poor';
        } else {
            if (val <= benchmark.excellent_threshold) return 'excellent';
            if (val <= benchmark.good_threshold) return 'good';
            if (val <= benchmark.acceptable_threshold) return 'acceptable';
            return 'poor';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'excellent': return <CheckCircle className="w-5 h-5 text-hrsd-green" />;
            case 'good': return <CheckCircle className="w-5 h-5 text-hrsd-teal" />;
            case 'acceptable': return <AlertCircle className="w-5 h-5 text-hrsd-gold" />;
            default: return <XCircle className="w-5 h-5 text-red-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'excellent': return 'badge-success';
            case 'good': return 'badge-info';
            case 'acceptable': return 'badge-warning';
            default: return 'badge-danger';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'excellent': return 'ممتاز';
            case 'good': return 'جيد';
            case 'acceptable': return 'مقبول';
            default: return 'ضعيف';
        }
    };

    // Calculate summary
    const summary = benchmarks.reduce((acc, b) => {
        const status = getStatus(b);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const overallScore = Math.round(
        (((summary.excellent || 0) * 100) + ((summary.good || 0) * 75) +
            ((summary.acceptable || 0) * 50) + ((summary.poor || 0) * 25)) / benchmarks.length
    );

    const categories = [...new Set(benchmarks.map(b => b.category))];

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                        <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر المقارنة المرجعية</h1>
                        <p className="text-hierarchy-small text-gray-500">مقارنة أداء المركز مع معايير الوزارة</p>
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
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-2xl p-6 text-white col-span-2 md:col-span-1">
                            <Target className="w-8 h-8 mb-2" />
                            <p className="text-4xl font-bold">{overallScore}%</p>
                            <p className="text-sm text-white/80">الأداء العام</p>
                        </div>
                        <div className="hrsd-card text-center">
                            <p className="text-2xl font-bold text-hrsd-green">{summary.excellent || 0}</p>
                            <p className="text-hierarchy-small text-gray-500">ممتاز</p>
                        </div>
                        <div className="hrsd-card text-center">
                            <p className="text-2xl font-bold text-hrsd-teal">{summary.good || 0}</p>
                            <p className="text-hierarchy-small text-gray-500">جيد</p>
                        </div>
                        <div className="hrsd-card text-center">
                            <p className="text-2xl font-bold text-hrsd-gold">{summary.acceptable || 0}</p>
                            <p className="text-hierarchy-small text-gray-500">مقبول</p>
                        </div>
                        <div className="hrsd-card text-center">
                            <p className="text-2xl font-bold text-red-600">{summary.poor || 0}</p>
                            <p className="text-hierarchy-small text-gray-500">ضعيف</p>
                        </div>
                    </div>

                    {/* Benchmarks by Category */}
                    {categories.map(category => (
                        <div key={category} className="hrsd-card mb-4">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4">{category}</h3>
                            <div className="space-y-3">
                                {benchmarks.filter(b => b.category === category).map((benchmark, idx) => {
                                    const status = getStatus(benchmark);
                                    const progress = benchmark.is_higher_better
                                        ? Math.min(100, (benchmark.current_value! / benchmark.ministry_target) * 100)
                                        : Math.min(100, (benchmark.ministry_target / benchmark.current_value!) * 100);

                                    return (
                                        <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(status)}
                                                    <span className="font-medium">{benchmark.indicator_name}</span>
                                                </div>
                                                <span className={getStatusBadge(status)}>{getStatusText(status)}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full transition-all ${status === 'excellent' ? 'bg-hrsd-green' :
                                                                status === 'good' ? 'bg-hrsd-teal' :
                                                                    status === 'acceptable' ? 'bg-hrsd-gold' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min(100, progress)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-left min-w-[100px]">
                                                    <span className="font-bold text-gray-900">{benchmark.current_value}</span>
                                                    <span className="text-gray-500 text-sm"> / {benchmark.ministry_target} {benchmark.unit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default BenchmarkDashboard;
