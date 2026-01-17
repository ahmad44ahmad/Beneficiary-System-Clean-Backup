import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, User, Activity, Heart, Stethoscope,
    Users, ChevronLeft, ChevronRight, Plus, Filter, Search,
    CheckCircle, XCircle, AlertCircle, MoreHorizontal
} from 'lucide-react';

type AppointmentType = 'therapy' | 'checkup' | 'visit';
type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

interface Appointment {
    id: string;
    type: AppointmentType;
    title: string;
    beneficiaryName: string;
    beneficiaryId: string;
    staffName: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
}

const TYPE_CONFIG: Record<AppointmentType, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
    therapy: { icon: Activity, color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'علاج طبيعي' },
    checkup: { icon: Stethoscope, color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'فحص طبي' },
    visit: { icon: Users, color: 'text-pink-400', bgColor: 'bg-pink-500/20', label: 'زيارة عائلية' },
};

const STATUS_CONFIG: Record<AppointmentStatus, { color: string; bgColor: string; label: string }> = {
    scheduled: { color: 'text-slate-400', bgColor: 'bg-slate-500/20', label: 'مجدول' },
    confirmed: { color: 'text-blue-400', bgColor: 'bg-blue-500/20', label: 'مؤكد' },
    in_progress: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'جاري' },
    completed: { color: 'text-green-400', bgColor: 'bg-green-500/20', label: 'مكتمل' },
    cancelled: { color: 'text-red-400', bgColor: 'bg-red-500/20', label: 'ملغي' },
    no_show: { color: 'text-orange-400', bgColor: 'bg-orange-500/20', label: 'لم يحضر' },
};

const mockAppointments: Appointment[] = [
    { id: '1', type: 'therapy', title: 'جلسة علاج طبيعي', beneficiaryName: 'محمد العمري', beneficiaryId: 'B001', staffName: 'أ. سارة أحمد', location: 'غرفة العلاج 1', date: '2026-01-13', startTime: '09:00', endTime: '09:45', status: 'completed' },
    { id: '2', type: 'checkup', title: 'فحص دوري', beneficiaryName: 'فاطمة سعيد', beneficiaryId: 'B002', staffName: 'د. محمد بلال', location: 'عيادة الطبيب', date: '2026-01-13', startTime: '10:00', endTime: '10:30', status: 'in_progress' },
    { id: '3', type: 'visit', title: 'زيارة عائلية', beneficiaryName: 'خالد الدوسري', beneficiaryId: 'B003', staffName: '-', location: 'صالة الزيارات', date: '2026-01-13', startTime: '11:00', endTime: '12:00', status: 'confirmed' },
    { id: '4', type: 'therapy', title: 'جلسة تأهيل نطق', beneficiaryName: 'نورة محمد', beneficiaryId: 'B004', staffName: 'أ. منى السالم', location: 'غرفة العلاج 2', date: '2026-01-13', startTime: '13:00', endTime: '13:45', status: 'scheduled' },
    { id: '5', type: 'checkup', title: 'متابعة سكري', beneficiaryName: 'سعود العتيبي', beneficiaryId: 'B005', staffName: 'د. محمد بلال', location: 'عيادة الطبيب', date: '2026-01-13', startTime: '14:00', endTime: '14:30', status: 'scheduled' },
    { id: '6', type: 'therapy', title: 'تمارين توازن', beneficiaryName: 'هند السالم', beneficiaryId: 'B006', staffName: 'أ. سارة أحمد', location: 'قاعة العلاج الطبيعي', date: '2026-01-13', startTime: '15:00', endTime: '15:45', status: 'scheduled' },
];

const MiniCalendar: React.FC<{ selectedDate: Date; onDateChange: (date: Date) => void }> = ({ selectedDate, onDateChange }) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: Date[] = [];

        // Add empty days for alignment
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(new Date(year, month, -(firstDay.getDay() - i - 1)));
        }

        // Add days of month
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const days = getDaysInMonth(currentMonth);
    const today = new Date();

    return (
        <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-1 hover:bg-slate-700 rounded"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
                <span className="font-medium">
                    {currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
                </span>
                <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-1 hover:bg-slate-700 rounded"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
                {['أحد', 'اثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isSelected = day.toDateString() === selectedDate.toDateString();
                    const isToday = day.toDateString() === today.toDateString();
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

                    return (
                        <button
                            key={i}
                            onClick={() => onDateChange(day)}
                            className={`w-8 h-8 rounded-lg text-sm transition-colors ${isSelected
                                ? 'bg-blue-500 text-white'
                                : isToday
                                    ? 'bg-blue-500/30 text-blue-400'
                                    : isCurrentMonth
                                        ? 'hover:bg-slate-700 text-white'
                                        : 'text-slate-600'}`}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export const SchedulingSystem: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterType, setFilterType] = useState<AppointmentType | 'all'>('all');
    const [appointments] = useState<Appointment[]>(mockAppointments);

    const filteredAppointments = appointments.filter(apt =>
        filterType === 'all' || apt.type === filterType
    );

    const stats = {
        total: appointments.length,
        completed: appointments.filter(a => a.status === 'completed').length,
        inProgress: appointments.filter(a => a.status === 'in_progress').length,
        upcoming: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[rgb(20,130,135)] to-[rgb(20,65,90)] rounded-2xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">نظام المواعيد الذكي</h1>
                        <p className="text-slate-400 text-sm">إدارة جدولة العلاج والزيارات والفحوصات</p>
                    </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-[rgb(20,130,135)] to-[rgb(45,180,115)] rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Plus className="w-5 h-5" />
                    موعد جديد
                </button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-xl p-4 text-center"
                >
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-slate-400 text-sm">إجمالي المواعيد</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[rgb(45,180,115)]/20 rounded-xl p-4 text-center border border-[rgb(45,180,115)]/30"
                >
                    <p className="text-3xl font-bold text-[rgb(45,180,115)]">{stats.completed}</p>
                    <p className="text-[rgb(45,180,115)]/70 text-sm">مكتملة</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[rgb(245,150,30)]/20 rounded-xl p-4 text-center border border-[rgb(245,150,30)]/30"
                >
                    <p className="text-3xl font-bold text-[rgb(245,150,30)]">{stats.inProgress}</p>
                    <p className="text-[rgb(245,150,30)]/70 text-sm">جارية</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[rgb(20,130,135)]/20 rounded-xl p-4 text-center border border-[rgb(20,130,135)]/30"
                >
                    <p className="text-3xl font-bold text-[rgb(20,130,135)]">{stats.upcoming}</p>
                    <p className="text-[rgb(20,130,135)]/70 text-sm">قادمة</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Sidebar */}
                <div className="space-y-4">
                    <MiniCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />

                    {/* Type Filters */}
                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                        <p className="text-slate-400 text-sm mb-3">تصفية حسب النوع</p>
                        <button
                            onClick={() => setFilterType('all')}
                            className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors text-right ${filterType === 'all' ? 'bg-[rgb(20,130,135)] text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                        >
                            جميع المواعيد
                        </button>
                        {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as AppointmentType)}
                                className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${filterType === type ? `${config.bgColor} ${config.color}` : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                            >
                                <config.icon className="w-4 h-4" />
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                            مواعيد {selectedDate.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h2>
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="بحث..."
                                className="bg-slate-800 border border-slate-700 rounded-lg pr-9 pl-4 py-2 text-sm text-white placeholder-slate-500 w-48 focus:outline-none focus:border-[rgb(20,130,135)]"
                            />
                        </div>
                    </div>

                    {/* Timeline View */}
                    <div className="space-y-3">
                        {filteredAppointments.map((apt, index) => {
                            const typeConfig = TYPE_CONFIG[apt.type];
                            const statusConfig = STATUS_CONFIG[apt.status];

                            return (
                                <motion.div
                                    key={apt.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex gap-4 p-4 rounded-xl border ${apt.status === 'in_progress' ? 'bg-[rgb(245,150,30)]/10 border-[rgb(245,150,30)]/30' : 'bg-slate-800/50 border-slate-700'}`}
                                >
                                    {/* Time */}
                                    <div className="text-center w-20 flex-shrink-0">
                                        <p className="text-lg font-bold">{apt.startTime}</p>
                                        <p className="text-slate-500 text-xs">{apt.endTime}</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full ${typeConfig.bgColor} flex items-center justify-center`}>
                                            <typeConfig.icon className={`w-5 h-5 ${typeConfig.color}`} />
                                        </div>
                                        <div className="flex-1 w-px bg-slate-700 my-2"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{apt.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${statusConfig.bgColor} ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    <User className="w-3 h-3 inline ml-1" />
                                                    {apt.beneficiaryName}
                                                </p>
                                                <p className="text-slate-500 text-sm">
                                                    {apt.staffName !== '-' && `${apt.staffName} • `}{apt.location}
                                                </p>
                                            </div>
                                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulingSystem;
