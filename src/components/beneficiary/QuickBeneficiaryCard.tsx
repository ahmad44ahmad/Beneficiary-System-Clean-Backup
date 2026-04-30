import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Pill, AlertTriangle, Target, Moon, User, MapPin, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface QuickCardProps {
    isOpen: boolean;
    onClose: () => void;
    beneficiaryId?: string;
}

interface BeneficiaryQuickInfo {
    id: string; name: string; age: number; room: string; admissionDate: string; diagnosis: string;
    allergies: string[];
    vitals: { bp: string; hr: number; spo2: number; temp: number; lastUpdate: string };
    activeMedications: { name: string; dosage: string; nextDue: string }[];
    activeAlerts: { type: string; message: string; severity: 'high' | 'medium' | 'low' }[];
    rehabGoals: { name: string; progress: number }[];
    fallRisk: number;
    sleepQuality: number;
    wellbeingScore: number;
    trend: 'up' | 'down' | 'stable';
}

const mockInfo: BeneficiaryQuickInfo = {
    id: 'B001', name: 'محمد أحمد العمري', age: 45, room: 'غ-101', admissionDate: '2024-06-15', diagnosis: 'إعاقة حركية - شلل نصفي',
    allergies: ['البنسلين', 'الأسبرين'],
    vitals: { bp: '130/85', hr: 78, spo2: 98, temp: 36.8, lastUpdate: '10:30' },
    activeMedications: [
        { name: 'أملوديبين', dosage: '5 ملغ', nextDue: '12:00' },
        { name: 'ميتفورمين', dosage: '500 ملغ', nextDue: '13:00' },
    ],
    activeAlerts: [{ type: 'fall_risk', message: 'خطر سقوط مرتفع', severity: 'high' }],
    rehabGoals: [{ name: 'المشي 50 متر', progress: 75 }, { name: 'استخدام اليد اليسرى', progress: 40 }],
    fallRisk: 52, sleepQuality: 72, wellbeingScore: 78, trend: 'up',
};

const TrendIcon: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-[#2BB574]" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-[#DC2626]" />;
    return <Minus className="w-4 h-4 text-hrsd-cool-gray" />;
};

export const QuickBeneficiaryCard: React.FC<QuickCardProps> = ({ isOpen, onClose }) => {
    const info = mockInfo;

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} dir="rtl">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#1B7778] to-[#1B7778] p-6 rounded-t-3xl relative">
                    <button onClick={onClose} className="absolute top-4 start-4 p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5 text-white" /></button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white">{info.name}</h2>
                                <TrendIcon trend={info.trend} />
                            </div>
                            <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
                                <span><MapPin className="w-3 h-3 inline ms-1" />{info.room}</span>
                                <span>{info.age} سنة</span>
                                <span><Calendar className="w-3 h-3 inline ms-1" />منذ {info.admissionDate}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"><span className="text-xl font-bold text-white">{info.wellbeingScore}</span></div>
                            <p className="text-white/70 text-xs mt-1">رفاهية</p>
                        </div>
                    </div>
                    {info.allergies.length > 0 && (
                        <div className="mt-4 bg-[#DC2626]/30 rounded-xl p-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                            <span className="text-[#DC2626]/40 text-sm font-medium">حساسية: {info.allergies.join('، ')}</span>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Vitals */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-[#DC2626]" />العلامات الحيوية</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {[{ label: 'الضغط', value: info.vitals.bp, bgClass: 'bg-[#269798]/20', textClass: 'text-[#269798]' }, { label: 'النبض', value: info.vitals.hr, bgClass: 'bg-[#DC2626]/20', textClass: 'text-[#DC2626]' }, { label: 'الأكسجين', value: `${info.vitals.spo2}%`, bgClass: 'bg-[#269798]/20', textClass: 'text-[#269798]' }, { label: 'الحرارة', value: `${info.vitals.temp}°`, bgClass: 'bg-[#F7941D]/20', textClass: 'text-[#F7941D]' }].map((v, i) => (
                                <div key={i} className={`${v.bgClass} rounded-xl p-3 text-center`}>
                                    <p className="text-hrsd-cool-gray text-xs">{v.label}</p>
                                    <p className={`text-lg font-bold ${v.textClass}`}>{v.value}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-hrsd-cool-gray text-xs mt-2">آخر تحديث: {info.vitals.lastUpdate}</p>
                    </div>

                    {/* Medications */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Pill className="w-4 h-4 text-[#FCB614]" />الأدوية النشطة</h3>
                        <div className="space-y-2">
                            {info.activeMedications.map((med, i) => (
                                <div key={i} className="bg-[#FCB614]/20 rounded-xl p-3 flex justify-between items-center">
                                    <div><p className="font-medium text-white">{med.name}</p><p className="text-[#FCB614] text-sm">{med.dosage}</p></div>
                                    <span className="text-[#FCB614] text-sm">القادم: {med.nextDue}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    {info.activeAlerts.length > 0 && (
                        <div>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#F7941D]" />التنبيهات النشطة</h3>
                            {info.activeAlerts.map((alert, i) => (
                                <div key={i} className={`rounded-xl p-3 ${alert.severity === 'high' ? 'bg-[#DC2626]/20 border border-[#DC2626]/50' : 'bg-[#FCB614]/20'}`}>
                                    <p className={alert.severity === 'high' ? 'text-[#DC2626]' : 'text-[#FCB614]'}>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Rehab Goals */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-[#2BB574]" />أهداف التأهيل</h3>
                        <div className="space-y-3">
                            {info.rehabGoals.map((goal, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1"><span className="text-hrsd-navy text-sm">{goal.name}</span><span className="text-[#2BB574] text-sm">{goal.progress}%</span></div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden"><div className="h-full bg-[#2BB574] rounded-full" style={{ width: `${goal.progress}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Indicators */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#F7941D]/20 rounded-xl p-4 text-center"><p className="text-hrsd-cool-gray text-sm">خطر السقوط</p><p className="text-2xl font-bold text-[#F7941D]">{info.fallRisk}/60</p></div>
                        <div className="bg-[#0F3144]/20 rounded-xl p-4 text-center"><Moon className="w-5 h-5 text-[#0F3144] mx-auto mb-1" /><p className="text-hrsd-cool-gray text-sm">جودة النوم</p><p className="text-2xl font-bold text-[#0F3144]">{info.sleepQuality}%</p></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QuickBeneficiaryCard;
