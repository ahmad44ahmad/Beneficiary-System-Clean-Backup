import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle, Phone, Clock, Users, Heart, Activity,
    CheckCircle, X, Shield, Zap, Radio, MapPin, User,
    Thermometer, Droplet, Wind
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
        icon: Heart, color: 'text-blue-400', bgColor: 'bg-blue-500', label: 'كود أزرق',
        protocol: ['اتصل بفريق الإنعاش', 'ابدأ الإنعاش القلبي', 'جهز الصدمات الكهربائية', 'أمّن مجرى التنفس']
    },
    fall: {
        icon: AlertTriangle, color: 'text-orange-400', bgColor: 'bg-orange-500', label: 'سقوط',
        protocol: ['لا تحرك المصاب', 'افحص الوعي والإصابات', 'اتصل بالطبيب', 'وثّق الحادثة']
    },
    fire: {
        icon: Zap, color: 'text-red-400', bgColor: 'bg-red-500', label: 'حريق',
        protocol: ['فعّل إنذار الحريق', 'أخلِ المنطقة', 'اتصل بالدفاع المدني', 'استخدم مطفأة الحريق']
    },
    choking: {
        icon: Wind, color: 'text-purple-400', bgColor: 'bg-purple-500', label: 'اختناق',
        protocol: ['طبّق مناورة هايملخ', 'اتصل بالطوارئ', 'راقب التنفس', 'جهز الإنعاش']
    },
    seizure: {
        icon: Activity, color: 'text-cyan-400', bgColor: 'bg-cyan-500', label: 'نوبة صرع',
        protocol: ['أمّن المريض من السقوط', 'لا تقيّد الحركة', 'سجّل مدة النوبة', 'اتصل بالطبيب']
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
            <p className="text-slate-400 text-sm mt-1">الوقت المنقضي</p>
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
        <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden" dir="rtl">
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
                            <p className="text-slate-400">حالة طوارئ نشطة</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold flex items-center gap-2 animate-pulse">
                            <Phone className="w-5 h-5" />
                            اتصال طوارئ
                        </button>
                        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold flex items-center gap-2">
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
                            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center"
                        >
                            <CountdownTimer startTime={emergency.startTime} />
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-slate-500 text-sm">النافذة الذهبية: 4 دقائق</p>
                                <div className="h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
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
                            className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-5 h-5 text-blue-400" />
                                <h3 className="font-bold text-lg">معلومات المستفيد</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">الاسم</span>
                                    <span className="font-bold">{emergency.beneficiaryName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">الرقم</span>
                                    <span>{emergency.beneficiaryId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">الموقع</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        {emergency.location}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">أبلغ عنها</span>
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
                                className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/50"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-5 h-5 text-red-400" />
                                    <h3 className="font-bold text-lg">العلامات الحيوية</h3>
                                    <span className="text-red-400 text-xs animate-pulse">مباشر</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-red-900/30 rounded-xl p-3 text-center">
                                        <p className="text-slate-400 text-xs mb-1">الضغط</p>
                                        <p className="text-xl font-bold text-red-400">{emergency.vitals.bp}</p>
                                    </div>
                                    <div className="bg-red-900/30 rounded-xl p-3 text-center">
                                        <p className="text-slate-400 text-xs mb-1">النبض</p>
                                        <p className="text-xl font-bold text-red-400">{emergency.vitals.hr}</p>
                                    </div>
                                    <div className="bg-red-900/30 rounded-xl p-3 text-center">
                                        <p className="text-slate-400 text-xs mb-1">الأكسجين</p>
                                        <p className="text-xl font-bold text-red-400">{emergency.vitals.spo2}%</p>
                                    </div>
                                    <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                                        <p className="text-slate-400 text-xs mb-1">الحرارة</p>
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
                        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-amber-400" />
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
                                            ? 'bg-green-500/20 border-green-500/50'
                                            : 'bg-slate-700/50 border-slate-600 hover:border-amber-500/50'}`}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-300'}`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                                        </div>
                                        <span className={`flex-1 text-right font-medium ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                                            {step}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-700">
                            <p className="text-slate-400 text-sm text-center">
                                {completedSteps.length}/{config.protocol.length} خطوات مكتملة
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Response Team */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-lg">فريق الاستجابة</h3>
                        </div>
                        <div className="space-y-4">
                            {emergency.responseTeam.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-center gap-4 p-4 rounded-xl border ${member.status === 'arrived' ? 'bg-green-500/20 border-green-500/50' :
                                        member.status === 'responding' ? 'bg-yellow-500/20 border-yellow-500/50' :
                                            'bg-slate-700/50 border-slate-600'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.status === 'arrived' ? 'bg-green-500' :
                                        member.status === 'responding' ? 'bg-yellow-500' : 'bg-slate-600'}`}>
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{member.name}</p>
                                        <p className="text-slate-400 text-sm">{member.role}</p>
                                    </div>
                                    <div className="text-left">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === 'arrived' ? 'bg-green-500/30 text-green-300' :
                                            member.status === 'responding' ? 'bg-yellow-500/30 text-yellow-300' :
                                                'bg-slate-600 text-slate-300'}`}>
                                            {member.status === 'arrived' ? 'وصل' :
                                                member.status === 'responding' ? 'في الطريق' : 'تم إبلاغه'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-6 space-y-3">
                            <button className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                                <Radio className="w-5 h-5" />
                                استدعاء دعم إضافي
                            </button>
                            <button className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
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
