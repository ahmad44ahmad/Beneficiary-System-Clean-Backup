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

const getLevelColor = (level: number) => level >= 10 ? 'from-[#FCB614] to-[#FCB614]' : level >= 5 ? 'from-[#FCB614] to-[#0F3144]' : 'from-[#269798] to-[#269798]';
const getCertStatus = (status: string) => ({ valid: { color: 'text-[#2BB574]', bg: 'bg-[#2BB574]/20', label: 'سارية' }, expiring: { color: 'text-[#FCB614]', bg: 'bg-[#FCB614]/20', label: 'قاربت' }, expired: { color: 'text-[#DC2626]', bg: 'bg-[#DC2626]/20', label: 'منتهية' } }[status] || { color: '', bg: '', label: '' });

export const StaffProfile: React.FC = () => {
    const [staff] = useState<StaffMember>(mockStaff);
    const progressToNextLevel = ((staff.gamification.points % 500) / 500) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-white to-white text-white p-6" dir="rtl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 rounded-3xl p-8 mb-6 border border-gray-200">
                <div className="flex items-start gap-6">
                    <div className="relative">
                        <div className={`w-28 h-28 rounded-2xl bg-gradient-to-br ${getLevelColor(staff.gamification.level)} p-1`}>
                            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                                <User className="w-12 h-12 text-hrsd-cool-gray" />
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -end-2 w-10 h-10 rounded-xl bg-gradient-to-br ${getLevelColor(staff.gamification.level)} flex items-center justify-center font-bold`}>{staff.gamification.level}</div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-1">{staff.name}</h1>
                        <p className="text-hrsd-cool-gray text-lg mb-4">{staff.role} - {staff.department}</p>
                        <div className="flex items-center gap-6 text-sm text-hrsd-cool-gray">
                            <span className="flex items-center gap-1"><Mail className="w-4 h-4" />{staff.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{staff.phone}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-[#F7941D]/20 border border-[#F7941D]/30 rounded-2xl p-4 text-center">
                            <Flame className="w-6 h-6 text-[#F7941D] mx-auto mb-1" />
                            <p className="text-2xl font-bold text-[#F7941D]">{staff.gamification.currentStreak}</p>
                            <p className="text-[#F7941D]/70 text-xs">سلسلة</p>
                        </div>
                        <div className="bg-[#FCB614]/20 border border-[#FCB614]/30 rounded-2xl p-4 text-center">
                            <Star className="w-6 h-6 text-[#FCB614] mx-auto mb-1" />
                            <p className="text-2xl font-bold text-[#FCB614]">{staff.gamification.points}</p>
                            <p className="text-[#FCB614]/70 text-xs">نقطة</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between mb-2 text-sm text-hrsd-cool-gray"><span>المستوى {staff.gamification.level + 1}</span><span>{staff.gamification.points % 500}/500</span></div>
                    <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNextLevel}%` }} className={`h-full rounded-full bg-gradient-to-r ${getLevelColor(staff.gamification.level)}`} />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4"><Award className="w-5 h-5 text-[#FCB614]" /><h3 className="font-bold">الشارات</h3></div>
                        <div className="grid grid-cols-2 gap-3">
                            {staff.gamification.badges.map((badge, i) => (
                                <div key={i} className="bg-gray-50/50 rounded-xl p-3 text-center">
                                    <div className="text-3xl mb-2">{badge.icon}</div>
                                    <p className="text-sm font-medium">{badge.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4"><FileText className="w-5 h-5 text-[#269798]" /><h3 className="font-bold">الشهادات</h3></div>
                        <div className="space-y-3">
                            {staff.certifications.map((cert, i) => {
                                const s = getCertStatus(cert.status);
                                return (<div key={i} className={`${s.bg} rounded-xl p-4`}><p className="font-medium">{cert.name}</p><span className={`text-xs ${s.color}`}>{s.label}</span></div>);
                            })}
                        </div>
                    </div>
                </div>
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6"><TrendingUp className="w-5 h-5 text-[#2BB574]" /><h3 className="font-bold">الأداء الشهري</h3></div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={staff.performance}>
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="score" stroke="#2BB574" strokeWidth={3} dot={{ fill: '#2BB574', r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6"><Target className="w-5 h-5 text-[#FCB614]" /><h3 className="font-bold">إحصائيات</h3></div>
                    <div className="space-y-4">
                        {[{ icon: Clock, bgClass: 'bg-[#269798]/20', bgIconClass: 'bg-[#269798]/30', textClass: 'text-[#269798]', label: 'ورديات', value: staff.stats.shiftsCompleted },
                        { icon: Pill, bgClass: 'bg-[#FCB614]/20', bgIconClass: 'bg-[#FCB614]/30', textClass: 'text-[#FCB614]', label: 'أدوية', value: staff.stats.medicationsGiven },
                        { icon: CheckCircle, bgClass: 'bg-[#2BB574]/20', bgIconClass: 'bg-[#2BB574]/30', textClass: 'text-[#2BB574]', label: 'تقييمات', value: staff.stats.assessmentsDone },
                        { icon: Shield, bgClass: 'bg-[#F7941D]/20', bgIconClass: 'bg-[#F7941D]/30', textClass: 'text-[#F7941D]', label: 'حوادث', value: staff.stats.incidentsReported }].map((s, i) => (
                            <div key={i} className={`${s.bgClass} rounded-xl p-4 flex items-center gap-4`}>
                                <div className={`w-12 h-12 ${s.bgIconClass} rounded-xl flex items-center justify-center`}>
                                    <s.icon className={`w-6 h-6 ${s.textClass}`} />
                                </div>
                                <div><p className="text-hrsd-cool-gray text-sm">{s.label}</p><p className={`text-2xl font-bold ${s.textClass}`}>{s.value}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;
