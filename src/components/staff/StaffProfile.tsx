import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Star, TrendingUp, Pill, Clock, Shield, CheckCircle, Flame, Target, FileText, Phone, Mail } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface StaffMember {
    id: string; name: string; role: string; department: string; email: string; phone: string;
    joinDate: string;
    certifications: { name: string; expiry: string; status: 'valid' | 'expiring' | 'expired' }[];
    gamification: { level: number; points: number; currentStreak: number; badges: { name: string; icon: string; earnedAt: string }[] };
    performance: { month: string; score: number }[];
    stats: { shiftsCompleted: number; medicationsGiven: number; assessmentsDone: number; incidentsReported: number };
}

const mockStaff: StaffMember = {
    id: 'S001', name: 'نايف بن عبدالله الغامدي', role: 'ممرض', department: 'جناح الذكور',
    email: 'naif@example.com', phone: '0501234567', joinDate: '2024-03-15',
    certifications: [
        { name: 'رخصة الهيئة السعودية', expiry: '2026-06-30', status: 'valid' },
        { name: 'BLS - الإنعاش القلبي', expiry: '2026-02-28', status: 'expiring' },
        { name: 'إدارة الأدوية', expiry: '2025-12-31', status: 'expired' },
    ],
    gamification: {
        level: 12, points: 4850, currentStreak: 15,
        badges: [
            { name: 'نجم الالتزام', icon: '⭐', earnedAt: '2026-01-10' },
            { name: 'خبير الأدوية', icon: '💊', earnedAt: '2026-01-05' },
            { name: 'حارس السلامة', icon: '🛡️', earnedAt: '2025-12-20' },
        ],
    },
    performance: [
        { month: 'أغسطس', score: 78 }, { month: 'سبتمبر', score: 82 },
        { month: 'أكتوبر', score: 85 }, { month: 'نوفمبر', score: 88 },
        { month: 'ديسمبر', score: 92 }, { month: 'يناير', score: 95 },
    ],
    stats: { shiftsCompleted: 248, medicationsGiven: 1520, assessmentsDone: 892, incidentsReported: 12 },
};

const getLevelColor = (level: number) => level >= 10 ? 'from-yellow-400 to-amber-500' : level >= 5 ? 'from-purple-400 to-indigo-500' : 'from-blue-400 to-cyan-500';
const getCertStatus = (status: string) => ({ valid: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'سارية' }, expiring: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'قاربت' }, expired: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'منتهية' } }[status] || { color: '', bg: '', label: '' });

export const StaffProfile: React.FC = () => {
    const [staff] = useState<StaffMember>(mockStaff);
    const progressToNextLevel = ((staff.gamification.points % 500) / 500) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6" dir="rtl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 rounded-3xl p-8 mb-6 border border-slate-700">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${getLevelColor(staff.gamification.level)} p-1`}>
                            <div className="w-full h-full rounded-xl bg-slate-800 flex items-center justify-center">
                                <User className="w-12 h-12 text-slate-400" />
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -end-2 w-10 h-10 rounded-xl bg-gradient-to-br ${getLevelColor(staff.gamification.level)} flex items-center justify-center font-bold`}>{staff.gamification.level}</div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-1">{staff.name}</h1>
                        <p className="text-slate-400 text-lg mb-4">{staff.role} - {staff.department}</p>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{staff.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{staff.phone}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-2xl p-4 text-center">
                            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-orange-400">{staff.gamification.currentStreak}</p>
                            <p className="text-orange-300/70 text-xs">سلسلة</p>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-4 text-center">
                            <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-purple-400">{staff.gamification.points}</p>
                            <p className="text-purple-300/70 text-xs">نقطة</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                    <div className="flex justify-between mb-2 text-sm text-slate-400"><span>المستوى {staff.gamification.level + 1}</span><span>{staff.gamification.points % 500}/500</span></div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNextLevel}%` }} className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(staff.gamification.level)}`} />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center gap-3 mb-4"><Award className="w-5 h-5 text-yellow-400" /><h3 className="font-bold">الشارات</h3></div>
                        <div className="grid grid-cols-2 gap-3">
                            {staff.gamification.badges.map((badge, i) => (
                                <div key={i} className="bg-slate-700/50 rounded-xl p-3 text-center">
                                    <div className="text-3xl mb-2">{badge.icon}</div>
                                    <p className="text-sm font-medium">{badge.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                        <div className="flex items-center gap-3 mb-4"><FileText className="w-5 h-5 text-blue-400" /><h3 className="font-bold">الشهادات</h3></div>
                        <div className="space-y-3">
                            {staff.certifications.map((cert, i) => {
                                const s = getCertStatus(cert.status);
                                return (<div key={i} className={`${s.bg} rounded-xl p-4`}><p className="font-medium">{cert.name}</p><span className={`text-xs ${s.color}`}>{s.label}</span></div>);
                            })}
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6"><TrendingUp className="w-5 h-5 text-green-400" /><h3 className="font-bold">الأداء الشهري</h3></div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={staff.performance}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-6"><Target className="w-5 h-5 text-amber-400" /><h3 className="font-bold">إحصائيات</h3></div>
                    <div className="space-y-4">
                        {[{ icon: Clock, bgClass: 'bg-blue-500/20', bgIconClass: 'bg-blue-500/30', textClass: 'text-blue-400', label: 'ورديات', value: staff.stats.shiftsCompleted },
                        { icon: Pill, bgClass: 'bg-purple-500/20', bgIconClass: 'bg-purple-500/30', textClass: 'text-purple-400', label: 'أدوية', value: staff.stats.medicationsGiven },
                        { icon: CheckCircle, bgClass: 'bg-green-500/20', bgIconClass: 'bg-green-500/30', textClass: 'text-green-400', label: 'تقييمات', value: staff.stats.assessmentsDone },
                        { icon: Shield, bgClass: 'bg-orange-500/20', bgIconClass: 'bg-orange-500/30', textClass: 'text-orange-400', label: 'حوادث', value: staff.stats.incidentsReported }].map((s, i) => (
                            <div key={i} className={`${s.bgClass} rounded-xl p-4 flex items-center gap-4`}>
                                <div className={`w-12 h-12 ${s.bgIconClass} rounded-xl flex items-center justify-center`}>
                                    <s.icon className={`w-6 h-6 ${s.textClass}`} />
                                </div>
                                <div><p className="text-slate-400 text-sm">{s.label}</p><p className={`text-2xl font-bold ${s.textClass}`}>{s.value}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
