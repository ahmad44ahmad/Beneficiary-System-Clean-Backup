import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, ChevronLeft, TrendingDown, TrendingUp,
    AlertTriangle, Calendar, RefreshCw, UserMinus
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DepartmentStats {
    department: string;
    total_staff: number;
    present: number;
    absent: number;
    on_leave: number;
    attendance_rate: number;
    care_completion_rate: number;
    impact_score: number;
}

export const HRImpactIndicator: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);

    // Demo data
    const demoStats: DepartmentStats[] = [
        { department: 'التمريض - ذكور', total_staff: 12, present: 10, absent: 1, on_leave: 1, attendance_rate: 83, care_completion_rate: 78, impact_score: 15 },
        { department: 'التمريض - إناث', total_staff: 8, present: 6, absent: 2, on_leave: 0, attendance_rate: 75, care_completion_rate: 65, impact_score: 28 },
        { department: 'الرعاية الاجتماعية', total_staff: 5, present: 5, absent: 0, on_leave: 0, attendance_rate: 100, care_completion_rate: 95, impact_score: 0 },
        { department: 'العلاج الطبيعي', total_staff: 3, present: 3, absent: 0, on_leave: 0, attendance_rate: 100, care_completion_rate: 92, impact_score: 0 },
        { department: 'الإشراف الليلي', total_staff: 6, present: 4, absent: 1, on_leave: 1, attendance_rate: 67, care_completion_rate: 55, impact_score: 35 },
        { department: 'الخدمات المساندة', total_staff: 10, present: 9, absent: 1, on_leave: 0, attendance_rate: 90, care_completion_rate: 88, impact_score: 8 },
    ];

    const weeklyTrend = [
        { day: 'الأحد', attendance: 92, care_quality: 88 },
        { day: 'الاثنين', attendance: 88, care_quality: 82 },
        { day: 'الثلاثاء', attendance: 85, care_quality: 78 },
        { day: 'الأربعاء', attendance: 90, care_quality: 85 },
        { day: 'الخميس', attendance: 78, care_quality: 68 },
        { day: 'الجمعة', attendance: 70, care_quality: 60 },
        { day: 'السبت', attendance: 75, care_quality: 65 },
    ];

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setDepartmentStats(demoStats);
            setLoading(false);
        }, 500);
    }, []);

    const overallAttendance = Math.round(
        departmentStats.reduce((sum, d) => sum + d.attendance_rate, 0) / departmentStats.length
    );

    const totalAbsent = departmentStats.reduce((sum, d) => sum + d.absent, 0);
    const criticalDepartments = departmentStats.filter(d => d.impact_score >= 20);

    const correlationInsight = {
        value: -0.78,
        interpretation: 'كلما زاد الغياب، انخفضت جودة العناية بنسبة 78%'
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="p-3 bg-gradient-to-br from-hrsd-orange to-hrsd-gold rounded-xl">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-hierarchy-title text-gray-900">مؤشر الموارد البشرية</h1>
                        <p className="text-hierarchy-small text-gray-500">ربط الغياب بجودة الخدمة</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className={`rounded-2xl p-6 text-white ${overallAttendance >= 85 ? 'bg-gradient-to-br from-hrsd-green to-hrsd-teal' : 'bg-gradient-to-br from-hrsd-gold to-hrsd-orange'}`}>
                            <Calendar className="w-8 h-8 mb-2" />
                            <p className="text-4xl font-bold">{overallAttendance}%</p>
                            <p className="text-sm text-white/80">نسبة الحضور اليوم</p>
                        </div>

                        <div className="hrsd-card">
                            <div className="flex items-center gap-3">
                                <UserMinus className="w-10 h-10 text-red-600" />
                                <div>
                                    <p className="text-3xl font-bold text-red-600">{totalAbsent}</p>
                                    <p className="text-hierarchy-small text-gray-500">غائبين اليوم</p>
                                </div>
                            </div>
                        </div>

                        <div className="hrsd-card">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-10 h-10 text-hrsd-gold" />
                                <div>
                                    <p className="text-3xl font-bold text-hrsd-gold">{criticalDepartments.length}</p>
                                    <p className="text-hierarchy-small text-gray-500">أقسام متأثرة</p>
                                </div>
                            </div>
                        </div>

                        <div className="hrsd-card bg-red-50">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-5 h-5 text-red-600" />
                                <span className="text-sm font-medium text-red-800">ارتباط الغياب بالجودة</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{Math.abs(correlationInsight.value * 100).toFixed(0)}%</p>
                            <p className="text-xs text-red-700 mt-1">{correlationInsight.interpretation}</p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4">الحضور حسب القسم</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={departmentStats} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" domain={[0, 100]} />
                                    <YAxis type="category" dataKey="department" width={120} />
                                    <Tooltip formatter={(value: number) => `${value}%`} />
                                    <Bar
                                        dataKey="attendance_rate"
                                        fill="rgb(20, 130, 135)"
                                        radius={[0, 4, 4, 0]}
                                        name="نسبة الحضور"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="hrsd-card">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4">اتجاه الحضور vs الجودة (أسبوعي)</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={weeklyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="attendance" stroke="rgb(20, 130, 135)" strokeWidth={2} name="الحضور %" />
                                    <Line type="monotone" dataKey="care_quality" stroke="rgb(245, 150, 30)" strokeWidth={2} name="جودة العناية %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Critical Departments */}
                    {criticalDepartments.length > 0 && (
                        <div className="hrsd-card mb-6">
                            <h3 className="text-hierarchy-subheading text-gray-800 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                أقسام تحتاج دعم عاجل
                            </h3>
                            <div className="space-y-3">
                                {criticalDepartments.map((dept, idx) => (
                                    <div key={idx} className="p-4 bg-red-50 rounded-xl border-r-4 border-red-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-red-900">{dept.department}</span>
                                            <span className="badge-danger">تأثير {dept.impact_score}%</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">الحضور</p>
                                                <p className="font-bold text-red-600">{dept.attendance_rate}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">الغياب</p>
                                                <p className="font-bold">{dept.absent} موظف</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">جودة العناية</p>
                                                <p className="font-bold text-red-600">{dept.care_completion_rate}%</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-red-700 mt-2">
                                            ⚠️ توصية: تعيين دعم طارئ من قسم آخر
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Department Table */}
                    <div className="hrsd-card">
                        <h3 className="text-hierarchy-subheading text-gray-800 mb-4">تفصيل الأقسام</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-3 text-right font-medium">القسم</th>
                                        <th className="p-3 text-center font-medium">الإجمالي</th>
                                        <th className="p-3 text-center font-medium">حاضر</th>
                                        <th className="p-3 text-center font-medium">غائب</th>
                                        <th className="p-3 text-center font-medium">إجازة</th>
                                        <th className="p-3 text-center font-medium">الحضور %</th>
                                        <th className="p-3 text-center font-medium">جودة العناية %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departmentStats.map((dept, idx) => (
                                        <tr key={idx} className={`border-b ${dept.impact_score >= 20 ? 'bg-red-50' : ''}`}>
                                            <td className="p-3 font-medium">{dept.department}</td>
                                            <td className="p-3 text-center">{dept.total_staff}</td>
                                            <td className="p-3 text-center text-hrsd-green">{dept.present}</td>
                                            <td className="p-3 text-center text-red-600">{dept.absent}</td>
                                            <td className="p-3 text-center text-hrsd-gold">{dept.on_leave}</td>
                                            <td className="p-3 text-center">
                                                <span className={dept.attendance_rate >= 85 ? 'text-hrsd-green' : 'text-red-600'}>
                                                    {dept.attendance_rate}%
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={dept.care_completion_rate >= 80 ? 'text-hrsd-green' : 'text-red-600'}>
                                                    {dept.care_completion_rate}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HRImpactIndicator;
