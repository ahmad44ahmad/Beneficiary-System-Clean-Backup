import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle, Phone, Users, Heart, Activity,
    CheckCircle, Shield, Zap, Radio, MapPin, User,
    Wind
} from 'lucide-react';

type EmergencyType = 'code_blue' | 'fall' | 'fire' | 'choking' | 'seizure';

interface EmergencyEvent {
    id: string;
    type: EmergencyType;
    status: 'active' | 'responding' | 'resolved';
    beneficiaryName: string;
    beneficiaryId: string;
    location: string;
    startTime: Date;
    reportedBy: string;
    vitals?: { bp: string; hr: number; spo2: number; temp: number };
    responseTeam: { name: string; role: string; status: 'notified' | 'responding' | 'arrived' }[];
}

const EMERGENCY_CONFIG: Record<EmergencyType, { icon: React.ElementType; color: string; bgColor: string; label: string; protocol: string[] }> = {
    code_blue: {
        icon: Heart, color: 'text-[#269798]', bgColor: 'bg-[#269798]', label: 'كود أزرق',
        protocol: ['اتصل بفريق الإنعاش', 'ابدأ الإنعاش القلبي', 'جهز الصدمات الكهربائية', 'أمّن مجرى التنفس']
    },
    fall: {
        icon: AlertTriangle, color: 'text-[#F7941D]', bgColor: 'bg-[#F7941D]', label: 'سقوط',
        protocol: ['لا تحرك المصاب', 'افحص الوعي والإصابات', 'اتصل بالطبيب', 'وثّق الحادثة']
    },
    fire: {
        icon: Zap, color: 'text-[#DC2626]', bgColor: 'bg-[#DC2626]', label: 'حريق',
        protocol: ['فعّل إنذار الحريق', 'أخلِ المنطقة', 'اتصل بالدفاع المدني', 'استخدم مطفأة الحريق']
    },
    choking: {
        icon: Wind, color: 'text-[#FCB614]', bgColor: 'bg-[#FCB614]', label: 'اختناق',
        protocol: ['طبّق مناورة هايملخ', 'اتصل بالطوارئ', 'راقب التنفس', 'جهز الإنعاش']
    },
    seizure: {
        icon: Activity, color: 'text-[#269798]', bgColor: 'bg-[#269798]', label: 'نوبة صرع',
        protocol: ['أمّن المستفيد من السقوط', 'لا تقيّد الحركة', 'سجّل مدة النوبة', 'اتصل بالطبيب']
    },
};

const mockEmergency: EmergencyEvent = {
    id: 'ER001',
    type: 'code_blue',
    status: 'active',
    beneficiaryName: 'محمد أحمد العمري',
    beneficiaryId: 'B001',
    location: 'غرفة 101 - جناح الذكور',
    startTime: new Date(Date.now() - 180000), // 3 minutes ago
    reportedBy: 'نايف الغامدي',
    vitals: { bp: '80/50', hr: 45, spo2: 85, temp: 36.2 },
    responseTeam: [
        { name: 'د. محمد بلال', role: 'طبيب', status: 'responding' },
        { name: 'نايف الغامدي', role: 'ممرض', status: 'arrived' },
        { name: 'سارة أحمد', role: 'ممرضة', status: 'notified' },
    ],
};

const CountdownTimer: React.FC<{ startTime: Date }> = ({ startTime }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return (
        <div className="text-center">
            <p className="text-6xl font-bold tabular-nums text-white">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-hrsd-cool-gray text-sm mt-1">الوقت المنقضي</p>
        </div>
    );
};

export const EmergencyDashboard: React.FC = () => {
    const [emergency] = useState<EmergencyEvent>(mockEmergency);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const config = EMERGENCY_CONFIG[emergency.type];

    const toggleStep = (index: number) => {
        setCompletedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="min-h-screen bg-white text-white relative overflow-hidden" dir="rtl">
            {/* Pulsing Background */}
            <motion.div
                className={`absolute inset-0 ${config.bgColor} opacity-20`}
                animate={{ opacity: [0.1, 0.25, 0.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />

            <div className="relative z-10 p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${config.bgColor} rounded-2xl flex items-center justify-center shadow-lg animate-pulse`}>
                            <config.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{config.label}</h1>
                            <p className="text-hrsd-cool-gray">حالة طوارئ نشطة</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-[#B91C1C] hover:bg-[#B91C1C] rounded-xl font-bold flex items-center gap-2 animate-pulse">
                            <Phone className="w-5 h-5" />
                            اتصال طوارئ
                        </button>
                        <button className="px-6 py-3 bg-[#1E9658] hover:bg-[#1E9658] rounded-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            إنهاء الطوارئ
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Patient Info & Timer */}
                    <div className="space-y-6">
                        {/* Timer */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center"
                        >
                            <CountdownTimer startTime={emergency.startTime} />
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-hrsd-cool-gray text-sm">النافذة الذهبية: 4 دقائق</p>
                                <div className="h-2 bg-gray-50 rounded-full mt-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#2BB574] via-[#FCB614] to-[#DC2626]"
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 240, ease: 'linear' }}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Patient Info */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-5 h-5 text-[#269798]" />
                                <h3 className="font-bold text-lg">معلومات المستفيد</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-hrsd-cool-gray">الاسم</span>
                                    <span className="font-bold">{emergency.beneficiaryName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-hrsd-cool-gray">الرقم</span>
                                    <span>{emergency.beneficiaryId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-hrsd-cool-gray">الموقع</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-[#DC2626]" />
                                        {emergency.location}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-hrsd-cool-gray">أبلغ عنها</span>
                                    <span>{emergency.reportedBy}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Vitals */}
                        {emergency.vitals && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#DC2626]/50"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-5 h-5 text-[#DC2626]" />
                                    <h3 className="font-bold text-lg">العلامات الحيوية</h3>
                                    <span className="text-[#DC2626] text-xs animate-pulse">مباشر</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#7F1D1D]/30 rounded-xl p-3 text-center">
                                        <p className="text-hrsd-cool-gray text-xs mb-1">الضغط</p>
                                        <p className="text-xl font-bold text-[#DC2626]">{emergency.vitals.bp}</p>
                                    </div>
                                    <div className="bg-[#7F1D1D]/30 rounded-xl p-3 text-center">
                                        <p className="text-hrsd-cool-gray text-xs mb-1">النبض</p>
                                        <p className="text-xl font-bold text-[#DC2626]">{emergency.vitals.hr}</p>
                                    </div>
                                    <div className="bg-[#7F1D1D]/30 rounded-xl p-3 text-center">
                                        <p className="text-hrsd-cool-gray text-xs mb-1">الأكسجين</p>
                                        <p className="text-xl font-bold text-[#DC2626]">{emergency.vitals.spo2}%</p>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-xl p-3 text-center">
                                        <p className="text-hrsd-cool-gray text-xs mb-1">الحرارة</p>
                                        <p className="text-xl font-bold">{emergency.vitals.temp}°C</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Middle Column - Protocol */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-[#FCB614]" />
                            <h3 className="font-bold text-lg">بروتوكول الاستجابة</h3>
                        </div>
                        <div className="space-y-4">
                            {config.protocol.map((step, index) => {
                                const isCompleted = completedSteps.includes(index);
                                return (
                                    <motion.button
                                        key={index}
                                        onClick={() => toggleStep(index)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isCompleted
                                            ? 'bg-[#2BB574]/20 border-[#2BB574]/50'
                                            : 'bg-gray-50/50 border-gray-300 hover:border-[#FCB614]/50'}`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-[#2BB574] text-white' : 'bg-gray-200 text-hrsd-navy'}`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                        </div>
                                        <span className={`flex-1 text-right font-medium ${isCompleted ? 'line-through text-hrsd-cool-gray' : 'text-white'}`}>
                                            {step}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <p className="text-hrsd-cool-gray text-sm text-center">
                                {completedSteps.length}/{config.protocol.length} خطوات مكتملة
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Response Team */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-5 h-5 text-[#269798]" />
                            <h3 className="font-bold text-lg">فريق الاستجابة</h3>
                        </div>
                        <div className="space-y-4">
                            {emergency.responseTeam.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-xl border ${member.status === 'arrived' ? 'bg-[#2BB574]/20 border-[#2BB574]/50' :
                                        member.status === 'responding' ? 'bg-[#FCB614]/20 border-[#FCB614]/50' :
                                            'bg-gray-50/50 border-gray-300'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.status === 'arrived' ? 'bg-[#2BB574]' :
                                        member.status === 'responding' ? 'bg-[#FCB614]' : 'bg-gray-200'}`}>
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-hrsd-cool-gray text-sm">{member.role}</p>
                                    </div>
                                    <div className="text-left">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'arrived' ? 'bg-[#2BB574]/30 text-[#2BB574]' :
                                            member.status === 'responding' ? 'bg-[#FCB614]/30 text-[#FCB614]' :
                                                'bg-gray-200 text-hrsd-navy'}`}>
                                            {member.status === 'arrived' ? 'وصل' :
                                                member.status === 'responding' ? 'في الطريق' : 'تم إبلاغه'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 space-y-3">
                            <button className="w-full py-3 bg-[#269798]/20 hover:bg-[#269798]/30 text-[#269798] rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                                <Radio className="w-5 h-5" />
                                استدعاء دعم إضافي
                            </button>
                            <button className="w-full py-3 bg-[#FCB614]/20 hover:bg-[#FCB614]/30 text-[#FCB614] rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                                <Phone className="w-5 h-5" />
                                اتصال بالإسعاف
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyDashboard;
