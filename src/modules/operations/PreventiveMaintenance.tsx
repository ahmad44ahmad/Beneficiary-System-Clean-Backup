import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import {
    Calendar,
    Plus,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Filter,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface PreventiveTask {
    id: string;
    asset_id: string;
    task_name: string;
    task_description: string;
    frequency: string;
    next_due_date: string;
    last_completed_date: string;
    assigned_team: string;
    is_mandatory: boolean;
    compliance_standard: string;
    status: string;
    asset?: { name_ar: string; asset_code: string };
}

export const PreventiveMaintenance: React.FC = () => {
    const [tasks, setTasks] = useState<PreventiveTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [view, setView] = useState<'calendar' | 'list'>('list');

    useEffect(() => {
        fetchTasks();
    }, [currentMonth]);

    const fetchTasks = async () => {
        setLoading(true);
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('om_preventive_schedules')
            .select(`
                *,
                asset:om_assets(name_ar, asset_code)
            `)
            .gte('next_due_date', startOfMonth)
            .lte('next_due_date', endOfMonth)
            .order('next_due_date', { ascending: true });

        if (!error) setTasks(data || []);
        setLoading(false);
    };

    const frequencyLabels: Record<string, string> = {
        daily: 'يومي',
        weekly: 'أسبوعي',
        monthly: 'شهري',
        quarterly: 'ربع سنوي',
        semi_annual: 'نصف سنوي',
        annual: 'سنوي'
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days = [];
        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getTasksForDay = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return tasks.filter(t => t.next_due_date === dateStr);
    };

    const isOverdue = (date: string) => new Date(date) < new Date();
    const isToday = (day: number) => {
        const today = new Date();
        return today.getFullYear() === currentMonth.getFullYear()
            && today.getMonth() === currentMonth.getMonth()
            && today.getDate() === day;
    };

    const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link to="/operations" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        العودة للتشغيل والصيانة
                    </Link>
                    <h1 className="text-2xl font-bold text-hrsd-primary flex items-center gap-3">
                        <Calendar className="w-7 h-7" />
                        الصيانة الوقائية
                    </h1>
                    <p className="text-gray-500 mt-1">جدول المهام المجدولة والصيانة الدورية</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setView('list')}
                            className={`px-4 py-2 rounded-lg text-sm ${view === 'list' ? 'bg-white shadow' : ''}`}
                        >
                            قائمة
                        </button>
                        <button
                            onClick={() => setView('calendar')}
                            className={`px-4 py-2 rounded-lg text-sm ${view === 'calendar' ? 'bg-white shadow' : ''}`}
                        >
                            تقويم
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-hrsd-primary text-white rounded-lg hover:bg-hrsd-primary/90 flex items-center gap-2 shadow-lg">
                        <Plus className="w-5 h-5" />
                        إضافة مهمة
                    </button>
                </div>
            </div>

            {/* Month Navigation */}
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-blue-600">{tasks.length}</p>
                    <p className="text-sm text-gray-500">مهام هذا الشهر</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'completed').length}</p>
                    <p className="text-sm text-gray-500">مكتملة</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-amber-600">{tasks.filter(t => t.status === 'active' && !isOverdue(t.next_due_date)).length}</p>
                    <p className="text-sm text-gray-500">قادمة</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow text-center">
                    <p className="text-2xl font-bold text-red-600">{tasks.filter(t => isOverdue(t.next_due_date) && t.status === 'active').length}</p>
                    <p className="text-sm text-gray-500">متأخرة</p>
                </div>
            </div>

            {/* Calendar View */}
            {view === 'calendar' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {getDaysInMonth().map((day, idx) => (
                            <div
                                key={idx}
                                className={`min-h-[80px] p-2 rounded-lg border ${day === null ? 'bg-gray-50 border-transparent' :
                                        isToday(day) ? 'bg-blue-50 border-blue-300' :
                                            'bg-white border-gray-100 hover:border-hrsd-primary/30'
                                    }`}
                            >
                                {day && (
                                    <>
                                        <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
                                            {day}
                                        </span>
                                        <div className="mt-1 space-y-1">
                                            {getTasksForDay(day).map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`text-xs px-2 py-1 rounded truncate ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            isOverdue(task.next_due_date) ? 'bg-red-100 text-red-800' :
                                                                'bg-amber-100 text-amber-800'
                                                        }`}
                                                    title={task.task_name}
                                                >
                                                    {task.task_name}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* List View */}
            {view === 'list' && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
                    ) : tasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p>لا توجد مهام صيانة وقائية لهذا الشهر</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 text-right">المهمة</th>
                                    <th className="p-4 text-right">الأصل</th>
                                    <th className="p-4 text-center">التكرار</th>
                                    <th className="p-4 text-center">تاريخ الاستحقاق</th>
                                    <th className="p-4 text-center">الحالة</th>
                                    <th className="p-4 text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-medium">{task.task_name}</div>
                                            <div className="text-sm text-gray-500">{task.task_description}</div>
                                        </td>
                                        <td className="p-4">
                                            {task.asset?.name_ar || '-'}
                                            <div className="text-xs text-gray-400">{task.asset?.asset_code}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                                                {frequencyLabels[task.frequency] || task.frequency}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`${isOverdue(task.next_due_date) && task.status === 'active' ? 'text-red-600 font-medium' : ''}`}>
                                                {new Date(task.next_due_date).toLocaleDateString('ar-SA')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {task.status === 'completed' ? (
                                                <span className="flex items-center justify-center gap-1 text-green-600">
                                                    <CheckCircle2 className="w-4 h-4" /> مكتمل
                                                </span>
                                            ) : isOverdue(task.next_due_date) ? (
                                                <span className="flex items-center justify-center gap-1 text-red-600">
                                                    <AlertTriangle className="w-4 h-4" /> متأخر
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1 text-amber-600">
                                                    <Clock className="w-4 h-4" /> قادم
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                                                تم التنفيذ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default PreventiveMaintenance;
