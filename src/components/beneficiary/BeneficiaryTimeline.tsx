import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock, Calendar, Pill, Heart, Utensils, AlertTriangle,
    FileText, Users, Activity, Camera,
    ChevronDown, ChevronUp, Award
} from 'lucide-react';

type EventType = 'admission' | 'medication' | 'therapy' | 'meal' | 'incident' | 'assessment' | 'visit' | 'achievement';

interface TimelineEvent {
    id: string;
    type: EventType;
    title: string;
    description: string;
    timestamp: string;
    date: string;
    details?: Record<string, string | number>;
    attachments?: { type: 'image' | 'document'; name: string }[];
    staffName?: string;
}

const EVENT_CONFIG: Record<EventType, { icon: React.ElementType; color: string; bgColor: string; borderColor: string; label: string }> = {
    admission: { icon: Users, color: 'text-[#269798]', bgColor: 'bg-[#269798]/20', borderColor: 'border-[#269798]', label: 'دخول' },
    medication: { icon: Pill, color: 'text-[#FCB614]', bgColor: 'bg-[#FCB614]/20', borderColor: 'border-[#FCB614]', label: 'دواء' },
    therapy: { icon: Activity, color: 'text-[#2BB574]', bgColor: 'bg-[#2BB574]/20', borderColor: 'border-[#2BB574]', label: 'علاج' },
    meal: { icon: Utensils, color: 'text-[#F7941D]', bgColor: 'bg-[#F7941D]/20', borderColor: 'border-[#F7941D]', label: 'وجبة' },
    incident: { icon: AlertTriangle, color: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]/20', borderColor: 'border-[#DC2626]', label: 'حادث' },
    assessment: { icon: FileText, color: 'text-[#269798]', bgColor: 'bg-[#269798]/20', borderColor: 'border-[#269798]', label: 'تقييم' },
    visit: { icon: Heart, color: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]/20', borderColor: 'border-[#DC2626]', label: 'زيارة' },
    achievement: { icon: Award, color: 'text-[#FCB614]', bgColor: 'bg-[#FCB614]/20', borderColor: 'border-[#FCB614]', label: 'إنجاز' },
};

const mockEvents: TimelineEvent[] = [
    { id: '1', type: 'medication', title: 'إعطاء دواء الأنسولين', description: '10 وحدات - حقن تحت الجلد', timestamp: '10:30', date: '2026-01-13', staffName: 'نايف الغامدي', details: { 'السكر قبل': '180 mg/dL', 'السكر بعد': '140 mg/dL' } },
    { id: '2', type: 'therapy', title: 'جلسة علاج طبيعي', description: 'تمارين المشي والتوازن', timestamp: '09:00', date: '2026-01-13', staffName: 'أ. سارة', details: { 'المدة': '45 دقيقة', 'التقييم': 'جيد' } },
    { id: '3', type: 'meal', title: 'وجبة الإفطار', description: 'نظام غذائي سكري', timestamp: '08:00', date: '2026-01-13', details: { 'الكمية': '80%', 'الملاحظات': 'شهية جيدة' } },
    { id: '4', type: 'assessment', title: 'قياس العلامات الحيوية', description: 'فحص روتيني صباحي', timestamp: '07:30', date: '2026-01-13', staffName: 'نايف الغامدي', details: { 'الضغط': '130/85', 'النبض': '78', 'الحرارة': '36.8°C', 'الأكسجين': '98%' } },
    { id: '5', type: 'visit', title: 'زيارة عائلية', description: 'زيارة ابن المستفيد', timestamp: '15:00', date: '2026-01-12', details: { 'المدة': '60 دقيقة', 'حالة المستفيد': 'سعيد' } },
    { id: '6', type: 'achievement', title: 'تحقيق هدف تأهيلي', description: 'المشي 50 متر بدون مساعدة', timestamp: '11:00', date: '2026-01-12', staffName: 'أ. سارة' },
    { id: '7', type: 'incident', title: 'حادثة سقوط بسيطة', description: 'سقوط أثناء النهوض من الكرسي', timestamp: '14:30', date: '2026-01-11', staffName: 'نايف الغامدي', details: { 'الإصابة': 'لا توجد', 'الإجراء': 'مراقبة' }, attachments: [{ type: 'document', name: 'تقرير_الحادثة.pdf' }] },
    { id: '8', type: 'admission', title: 'الدخول للمركز', description: 'تسجيل وتقييم أولي', timestamp: '10:00', date: '2026-01-01', staffName: 'أ. سعيد الغامدي' },
];

interface BeneficiaryTimelineProps {
    beneficiaryId?: string;
    beneficiaryName?: string;
}

export const BeneficiaryTimeline: React.FC<BeneficiaryTimelineProps> = ({
    beneficiaryName = 'محمد أحمد العمري'
}) => {
    const [events] = useState<TimelineEvent[]>(mockEvents);
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<EventType | 'all'>('all');
    const [searchTerm, _setSearchTerm] = useState('');

    const filteredEvents = events.filter(event => {
        const matchesType = filterType === 'all' || event.type === filterType;
        const matchesSearch = event.title.includes(searchTerm) || event.description.includes(searchTerm);
        return matchesType && matchesSearch;
    });

    // Group events by date
    const groupedEvents = filteredEvents.reduce((acc, event) => {
        if (!acc[event.date]) acc[event.date] = [];
        acc[event.date].push(event);
        return acc;
    }, {} as Record<string, TimelineEvent[]>);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) return 'اليوم';
        if (dateStr === yesterday.toISOString().split('T')[0]) return 'أمس';
        return date.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-white text-white p-6" dir="rtl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-[#269798] rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">الجدول الزمني</h1>
                        <p className="text-hrsd-cool-gray text-sm">{beneficiaryName}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {Object.entries(EVENT_CONFIG).slice(0, 4).map(([type, config]) => {
                        const count = events.filter(e => e.type === type).length;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilterType(filterType === type ? 'all' : type as EventType)}
                                className={`p-3 rounded-xl border transition-colors ${filterType === type ? `${config.bgColor} ${config.borderColor}` : 'bg-white/50 border-gray-200 hover:bg-gray-50'}`}
                            >
                                <config.icon className={`w-5 h-5 ${config.color} mx-auto mb-1`} />
                                <p className="text-lg font-bold">{count}</p>
                                <p className="text-xs text-hrsd-cool-gray">{config.label}</p>
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${filterType === 'all' ? 'bg-[#269798] text-white' : 'bg-white text-hrsd-cool-gray'}`}
                >
                    الكل
                </button>
                {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type as EventType)}
                        className={`px-4 py-2 rounded-xl whitespace-nowrap flex items-center gap-2 transition-colors ${filterType === type ? `${config.bgColor} ${config.color}` : 'bg-white text-hrsd-cool-gray'}`}
                    >
                        <config.icon className="w-4 h-4" />
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-8">
                {Object.entries(groupedEvents).map(([date, dateEvents]: [string, TimelineEvent[]]) => (
                    <div key={date}>
                        {/* Date Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-5 h-5 text-hrsd-cool-gray" />
                            <h3 className="text-lg font-bold text-hrsd-navy">{formatDate(date)}</h3>
                            <div className="flex-1 h-px bg-gray-50"></div>
                        </div>

                        {/* Events */}
                        <div className="space-y-3 me-6 border-e-2 border-gray-200 pe-6">
                            {dateEvents.map((event, index) => {
                                const config = EVENT_CONFIG[event.type];
                                const isExpanded = expandedEvent === event.id;

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="relative"
                                    >
                                        {/* Timeline Dot */}
                                        <div className={`absolute -end-9 w-4 h-4 rounded-full ${config.bgColor} border-2 border-slate-800`}></div>

                                        <div
                                            className={`${config.bgColor} rounded-2xl p-4 cursor-pointer hover:ring-2 hover:ring-${config.color.replace('text-', '')}/30 transition-all`}
                                            onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                                                        <config.icon className={`w-5 h-5 ${config.color}`} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-white">{event.title}</h4>
                                                            <span className={`px-2 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
                                                                {config.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-hrsd-cool-gray text-sm mt-1">{event.description}</p>
                                                        <div className="flex items-center gap-3 mt-2 text-hrsd-cool-gray text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {event.timestamp}
                                                            </span>
                                                            {event.staffName && (
                                                                <span>بواسطة: {event.staffName}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {(event.details || event.attachments) && (
                                                    <button className="p-1">
                                                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isExpanded && (event.details || event.attachments) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="mt-4 pt-4 border-t border-gray-300/50"
                                                    >
                                                        {event.details && (
                                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                                {Object.entries(event.details).map(([key, value]) => (
                                                                    <div key={key} className="bg-white/50 rounded-lg p-2">
                                                                        <p className="text-hrsd-cool-gray text-xs">{key}</p>
                                                                        <p className="text-white font-medium">{value}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {event.attachments && (
                                                            <div className="flex gap-2">
                                                                {event.attachments.map((att, i) => (
                                                                    <button
                                                                        key={i}
                                                                        className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        {att.type === 'image' ? <Camera className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                                                        <span className="text-sm">{att.name}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeneficiaryTimeline;
