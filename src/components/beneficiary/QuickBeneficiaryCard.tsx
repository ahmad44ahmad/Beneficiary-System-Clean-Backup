import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Pill, AlertTriangle, Activity, Target, Moon, User, Phone, MapPin, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
};

export const QuickBeneficiaryCard: React.FC<QuickCardProps> = ({ isOpen, onClose }) => {
    const info = mockInfo;

    if (!isOpen) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()} dir="rtl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-3xl relative">
                    <button onClick={onClose} className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5 text-white" /></button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white">{info.name}</h2>
                                <TrendIcon trend={info.trend} />
                            </div>
                            <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
                                <span><MapPin className="w-3 h-3 inline ml-1" />{info.room}</span>
                                <span>{info.age} سنة</span>
                                <span><Calendar className="w-3 h-3 inline ml-1" />منذ {info.admissionDate}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"><span className="text-xl font-bold text-white">{info.wellbeingScore}</span></div>
                            <p className="text-white/70 text-xs mt-1">رفاهية</p>
                        </div>
                    </div>
                    {info.allergies.length > 0 && (
                        <div className="mt-4 bg-red-500/30 rounded-xl p-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-300" />
                            <span className="text-red-100 text-sm font-medium">حساسية: {info.allergies.join('، ')}</span>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Vitals */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-red-400" />العلامات الحيوية</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {[{ label: 'الضغط', value: info.vitals.bp, color: 'blue' }, { label: 'النبض', value: info.vitals.hr, color: 'pink' }, { label: 'الأكسجين', value: `${info.vitals.spo2}%`, color: 'cyan' }, { label: 'الحرارة', value: `${info.vitals.temp}°`, color: 'orange' }].map((v, i) => (
                                <div key={i} className={`bg-${v.color}-500/20 rounded-xl p-3 text-center`}>
                                    <p className="text-slate-400 text-xs">{v.label}</p>
                                    <p className={`text-lg font-bold text-${v.color}-400`}>{v.value}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-slate-500 text-xs mt-2">آخر تحديث: {info.vitals.lastUpdate}</p>
                    </div>

                    {/* Medications */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Pill className="w-4 h-4 text-purple-400" />الأدوية النشطة</h3>
                        <div className="space-y-2">
                            {info.activeMedications.map((med, i) => (
                                <div key={i} className="bg-purple-500/20 rounded-xl p-3 flex justify-between items-center">
                                    <div><p className="font-medium text-white">{med.name}</p><p className="text-purple-300 text-sm">{med.dosage}</p></div>
                                    <span className="text-purple-400 text-sm">القادم: {med.nextDue}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    {info.activeAlerts.length > 0 && (
                        <div>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-400" />التنبيهات النشطة</h3>
                            {info.activeAlerts.map((alert, i) => (
                                <div key={i} className={`rounded-xl p-3 ${alert.severity === 'high' ? 'bg-red-500/20 border border-red-500/50' : 'bg-yellow-500/20'}`}>
                                    <p className={alert.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}>{alert.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Rehab Goals */}
                    <div>
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-green-400" />أهداف التأهيل</h3>
                        <div className="space-y-3">
                            {info.rehabGoals.map((goal, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-1"><span className="text-slate-300 text-sm">{goal.name}</span><span className="text-green-400 text-sm">{goal.progress}%</span></div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${goal.progress}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Indicators */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-orange-500/20 rounded-xl p-4 text-center"><p className="text-slate-400 text-sm">خطر السقوط</p><p className="text-2xl font-bold text-orange-400">{info.fallRisk}/60</p></div>
                        <div className="bg-indigo-500/20 rounded-xl p-4 text-center"><Moon className="w-5 h-5 text-indigo-400 mx-auto mb-1" /><p className="text-slate-400 text-sm">جودة النوم</p><p className="text-2xl font-bold text-indigo-400">{info.sleepQuality}%</p></div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default QuickBeneficiaryCard;
