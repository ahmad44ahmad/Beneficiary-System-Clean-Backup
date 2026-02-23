import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Shield,
    Brain,
    Users,
    ArrowLeft,
    CheckCircle2,
    Zap,
    Target,
    Award,
    Leaf,
    Lock,
    Globe,
    Activity,
    ChevronDown
} from 'lucide-react';
import { useWelcomeStats } from '../hooks/useWelcomeStats';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
const useCounter = (end: number, duration: number, start: boolean) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        let frame: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [end, duration, start]);
    return count;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const pillars = [
    {
        icon: Zap,
        num: '01',
        title: 'التحول الرقمي',
        description: 'رقمنة شاملة لجميع العمليات التشغيلية والإدارية بالمركز',
        color: '#148287',
        colorDark: '#0d6b6e',
        tags: ['أتمتة', 'رقمنة', 'كفاءة']
    },
    {
        icon: Brain,
        num: '02',
        title: 'الذكاء الاصطناعي',
        description: 'تنبؤات ذكية بالمخاطر وأنظمة إنذار مبكر مدعومة بالذكاء الاصطناعي',
        color: '#8b5cf6',
        colorDark: '#6d28d9',
        tags: ['تعلم آلي', 'تنبؤ', 'إنذار مبكر']
    },
    {
        icon: Target,
        num: '03',
        title: 'إدارة الجودة',
        description: 'منظومة جودة شاملة متوافقة مع معايير ISO 9001:2015',
        color: '#2DB473',
        colorDark: '#1a8a55',
        tags: ['ISO 9001', 'تحسين مستمر', 'CAPA']
    },
    {
        icon: Award,
        num: '04',
        title: 'التميز المؤسسي',
        description: 'حوكمة رشيدة ومؤشرات أداء استراتيجية لتحقيق التميز',
        color: '#FAB414',
        colorDark: '#d49a0e',
        tags: ['حوكمة', 'KPI', 'مساءلة']
    },
    {
        icon: Shield,
        num: '05',
        title: 'الامتثال والمعايير',
        description: 'التزام كامل بمعايير وزارة الموارد البشرية والمعايير الدولية',
        color: '#F5961E',
        colorDark: '#d07a10',
        tags: ['PDPL', 'رؤية 2030', 'HRSD']
    }
];

const trustBadges = [
    { icon: null, img: '/assets/hrsd-logo.png', label: 'وزارة الموارد البشرية' },
    { icon: null, text: 'ISO', label: 'ISO 9001:2015', color: '#148287' },
    { icon: Leaf, label: 'رؤية 2030', color: '#2DB473' },
    { icon: Lock, label: 'PDPL متوافق', color: '#FAB414' },
    { icon: Globe, label: 'معايير دولية', color: '#F5961E' }
];

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }
    })
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const staggerChild = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

// ─── Pillar Card Sub-component ────────────────────────────────────────────────
interface PillarData {
    icon: React.FC<{ className?: string }>;
    num: string;
    title: string;
    description: string;
    color: string;
    colorDark: string;
    tags: string[];
}

const PillarCard: React.FC<{ pillar: PillarData }> = ({ pillar }) => (
    <motion.div
        className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-3xl p-8 transition-all duration-500"
        variants={staggerChild}
        whileHover={{ borderColor: `${pillar.color}4d` }}
    >
        <div className="flex items-center gap-4 mb-6">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{
                    background: `linear-gradient(135deg, ${pillar.color}, ${pillar.colorDark})`,
                    boxShadow: `0 8px 24px ${pillar.color}33`
                }}
            >
                <pillar.icon className="w-7 h-7 text-white" />
            </div>
            <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 text-sm font-mono">
                {pillar.num}
            </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
        <p className="text-white/50 leading-relaxed text-sm mb-4">{pillar.description}</p>
        <div className="flex flex-wrap gap-2">
            {pillar.tags.map((tag) => (
                <span key={tag} className="bg-white/5 rounded-lg px-3 py-1 text-white/40 text-xs">{tag}</span>
            ))}
        </div>
        <div
            className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 -z-10 blur-xl transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${pillar.color}1a, transparent)` }}
        />
    </motion.div>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const [statsReady, setStatsReady] = useState(false);
    const liveStats = useWelcomeStats();

    useEffect(() => {
        if (!liveStats.loading) {
            const timer = setTimeout(() => setStatsReady(true), 600);
            return () => clearTimeout(timer);
        }
    }, [liveStats.loading]);

    const beneficiaryCount = useCounter(liveStats.beneficiariesCount || 50, 1500, statsReady);
    const complianceCount = useCounter(liveStats.complianceRate || 94, 1200, statsReady);

    const stats = [
        { value: liveStats.loading ? '...' : `${beneficiaryCount}+`, label: 'مستفيد نشط', icon: Users, color: '#148287' },
        { value: liveStats.loading ? '...' : `${complianceCount}%`, label: 'نسبة الامتثال', icon: CheckCircle2, color: '#2DB473' },
        { value: 'ISO', label: 'معايير الجودة العالمية', icon: Shield, color: '#FAB414' },
        { value: '24/7', label: 'مراقبة مستمرة', icon: Activity, color: '#F5961E' }
    ];

    return (
        <div className="min-h-screen bg-[#0a1628] overflow-x-hidden" dir="rtl">
            {/* ═══ Background Layer ═══ */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                {/* Gradient Mesh */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 600px 600px at 80% 10%, rgba(20,130,135,0.15) 0%, transparent 70%), radial-gradient(ellipse 500px 500px at 15% 85%, rgba(45,180,115,0.1) 0%, transparent 70%), radial-gradient(ellipse 800px 800px at 50% 50%, rgba(20,65,90,0.2) 0%, transparent 70%)'
                    }}
                />
                {/* Tech Grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(20,130,135,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(20,130,135,0.04) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />
                {/* Floating Orbs */}
                <div
                    className="absolute w-[500px] h-[500px] rounded-full blur-3xl will-change-transform"
                    style={{
                        top: '-100px',
                        right: '-100px',
                        background: 'radial-gradient(circle, rgba(20,130,135,0.2) 0%, transparent 70%)',
                        animation: 'orbFloat 20s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute w-[400px] h-[400px] rounded-full blur-3xl will-change-transform"
                    style={{
                        bottom: '-50px',
                        left: '10%',
                        background: 'radial-gradient(circle, rgba(45,180,115,0.15) 0%, transparent 70%)',
                        animation: 'orbFloat 25s ease-in-out infinite reverse'
                    }}
                />
                <div
                    className="absolute w-[300px] h-[300px] rounded-full blur-3xl will-change-transform"
                    style={{
                        top: '40%',
                        left: '50%',
                        background: 'radial-gradient(circle, rgba(250,180,20,0.1) 0%, transparent 70%)',
                        animation: 'orbFloat 18s ease-in-out infinite 5s'
                    }}
                />
                {/* Scan Line */}
                <div
                    className="absolute inset-x-0 h-[1px]"
                    style={{
                        background: 'linear-gradient(to right, transparent, rgba(20,130,135,0.3), transparent)',
                        animation: 'scanLine 8s linear infinite'
                    }}
                />
            </div>

            {/* ═══ Content ═══ */}
            <div className="relative z-10">

                {/* ─── Section 1: Ministry Bar ─── */}
                <header className="sticky top-0 z-20 bg-[#0a1628]/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 rounded-xl p-1.5 flex-shrink-0">
                                <img
                                    src="/assets/hrsd-logo.png"
                                    alt="شعار وزارة الموارد البشرية"
                                    className="w-9 h-9 md:w-10 md:h-10 object-contain"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-white/70 text-xs font-medium">وزارة الموارد البشرية والتنمية الاجتماعية</p>
                                <p className="text-[#FAB414] text-[13px] font-bold">مركز التأهيل الشامل بالباحة</p>
                            </div>
                            <p className="sm:hidden text-[#FAB414] text-sm font-bold">مركز التأهيل الشامل</p>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#2DB473]" style={{ animation: 'pulseRing 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DB473]" />
                                </span>
                                <span className="text-[#2DB473] text-xs hidden sm:inline">متصل</span>
                            </div>
                            <span className="text-white/40 text-xs hidden md:inline">منطقة الباحة</span>
                            <span className="bg-white/5 px-2 py-0.5 rounded text-white/30 text-[10px] font-mono hidden md:inline">v5.0</span>
                        </div>
                    </div>
                </header>

                {/* ─── Section 2: Hero ─── */}
                <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-16 text-center relative">
                    {/* Top Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Sparkles className="w-4 h-4 text-[#FAB414]" />
                        <span className="text-white/70 text-sm">نظام إدارة المستفيدين الذكي</span>
                        <span className="w-[1px] h-3 bg-white/20" />
                        <span className="text-[#2DB473] text-xs font-mono">الإصدار 5.0</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        className="text-[80px] md:text-[120px] lg:text-[150px] font-bold leading-none mb-4 overflow-visible will-change-[background-position]"
                        style={{
                            background: 'linear-gradient(120deg, #FAB414 0%, #F5961E 25%, #FFD700 50%, #FAB414 75%, #F5961E 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'shimmerGold 4s linear infinite',
                            filter: 'drop-shadow(0 0 40px rgba(250,180,20,0.3))'
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        بصيرة
                    </motion.h1>

                    {/* Arabic Subtitle */}
                    <motion.p
                        className="text-2xl md:text-3xl text-white/80 font-light mb-3 tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        رؤية ذكية لرعاية استثنائية
                    </motion.p>

                    {/* English Subtitle */}
                    <motion.p
                        className="text-sm md:text-base text-white/30 font-mono tracking-[0.3em] uppercase mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                    >
                        INTELLIGENT CARE MANAGEMENT PLATFORM
                    </motion.p>

                    {/* CTA Button */}
                    <motion.button
                        onClick={() => navigate('/system-entry')}
                        className="group relative overflow-hidden bg-gradient-to-l from-[#F5961E] to-[#FAB414] text-[#0a1628] font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-[#FAB414]/20 hover:shadow-[#FAB414]/40 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span>ابدأ</span>
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {/* Shimmer overlay */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </motion.button>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                    >
                        <ChevronDown className="w-5 h-5 text-white/30 animate-bounce" />
                        <span className="text-white/20 text-[10px]">اكتشف المزيد</span>
                    </motion.div>
                </section>

                {/* ─── Section 3: Live Statistics Ribbon ─── */}
                <section className="py-12 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-transparent via-[#148287]/5 to-transparent">
                    <motion.div
                        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#148287]/30 rounded-2xl p-6 text-center transition-all duration-500 hover:bg-white/[0.06]"
                                variants={staggerChild}
                            >
                                <div
                                    className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${stat.color}33, ${stat.color}0d)` }}
                                >
                                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-white/50 text-sm">{stat.label}</div>
                                {/* Bottom accent */}
                                <div
                                    className="absolute bottom-0 inset-x-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: `linear-gradient(to right, transparent, ${stat.color}80, transparent)` }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ─── Section 4: Five Pillars ─── */}
                <section className="py-20 px-4 sm:px-6 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-[#148287]/10 border border-[#148287]/20 rounded-full px-4 py-1.5 mb-6">
                                <Award className="w-4 h-4 text-[#148287]" />
                                <span className="text-[#148287] text-sm font-medium">ركائز التميز المؤسسي</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">خمس ركائز للتحول الرقمي</h2>
                            <p className="text-white/50 text-lg max-w-2xl mx-auto">منظومة متكاملة تجمع بين أحدث التقنيات وأفضل الممارسات العالمية</p>
                        </motion.div>

                        {/* Pillars Grid — Top Row (3 cards) */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            {pillars.slice(0, 3).map((pillar, index) => (
                                <PillarCard key={index} pillar={pillar} />
                            ))}
                        </motion.div>

                        {/* Pillars Grid — Bottom Row (2 cards, centered) */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[calc(66.67%+10px)] mx-auto lg:max-w-none lg:grid-cols-2 lg:w-2/3 lg:mx-auto"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            {pillars.slice(3).map((pillar, index) => (
                                <PillarCard key={index + 3} pillar={pillar} />
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ─── Section 5: Trust Signals Bar ─── */}
                <section className="py-16 px-4 sm:px-6 md:px-8">
                    <motion.div
                        className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.8 }}
                    >
                        {trustBadges.map((badge, index) => (
                            <React.Fragment key={index}>
                                <div className="group flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:border-[#148287]/30 group-hover:bg-white/[0.06] transition-all duration-300">
                                        {badge.img ? (
                                            <img src={badge.img} alt={badge.label} className="w-8 h-8 object-contain" />
                                        ) : badge.text ? (
                                            <span className="text-sm font-bold" style={{ color: badge.color }}>{badge.text}</span>
                                        ) : badge.icon ? (
                                            <badge.icon className="w-6 h-6" style={{ color: badge.color }} />
                                        ) : null}
                                    </div>
                                    <span className="text-white/40 text-xs text-center">{badge.label}</span>
                                </div>
                                {index < trustBadges.length - 1 && (
                                    <div className="hidden md:block w-[1px] h-8 bg-white/[0.06]" />
                                )}
                            </React.Fragment>
                        ))}
                    </motion.div>
                </section>

                {/* ─── Section 6: Secondary CTA ─── */}
                <section className="py-20 px-4 sm:px-6 md:px-8">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                    >
                        <motion.div
                            className="relative overflow-hidden rounded-3xl p-12 border border-white/[0.06]"
                            style={{
                                background: 'linear-gradient(135deg, rgba(20,130,135,0.1), transparent, rgba(45,180,115,0.1))'
                            }}
                            variants={fadeUp}
                            custom={0}
                        >
                            {/* Decoration */}
                            <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[20px] border-white/[0.02] -translate-y-1/2 -translate-x-1/2" />

                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">جاهز للانطلاق؟</h3>
                            <p className="text-white/50 mb-8 leading-relaxed">
                                ابدأ رحلتك في إدارة رعاية المستفيدين بأعلى معايير الجودة والكفاءة
                            </p>

                            <button
                                onClick={() => navigate('/system-entry')}
                                className="group relative overflow-hidden inline-flex items-center gap-3 bg-gradient-to-l from-[#F5961E] to-[#FAB414] text-[#0a1628] font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl shadow-[#FAB414]/20 hover:shadow-[#FAB414]/40 hover:scale-105 transition-all duration-300"
                            >
                                <span>ابدأ الآن</span>
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                            </button>

                            {/* Live Status */}
                            <div className="mt-6 flex items-center justify-center gap-2 text-xs">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#2DB473] animate-ping opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2DB473]" />
                                </span>
                                <span className="text-[#2DB473]">النظام يعمل الآن</span>
                                <span className="text-white/20">|</span>
                                <span className="text-white/30">{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ─── Section 7: Footer ─── */}
                <footer className="border-t border-white/[0.05] px-4 sm:px-6 md:px-8 py-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-white/25 text-xs text-center md:text-right">
                            © 2026 مركز التأهيل الشامل بالباحة | وزارة الموارد البشرية والتنمية الاجتماعية
                        </div>
                        <div className="flex flex-col items-center md:items-start gap-0.5">
                            <span className="text-white/20 text-[11px]">تصميم و تطوير: قسم الجودة</span>
                            <span className="text-white/[0.12] text-[10px]">أحمد بن عبدالله الشهري</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default WelcomePage;
