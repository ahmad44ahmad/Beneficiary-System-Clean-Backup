import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Eye, EyeOff, Lock, User,
    Fingerprint, Brain, Award, ShieldCheck, ArrowLeft
} from 'lucide-react';

/**
 * Login page — Phase 1 sovereign surface.
 * Brand level: Default (light mode, full secondary palette).
 *
 * Per HRSD Brand Guidelines:
 * - Light-mode background (white)
 * - HRSD ministry logo prominent, top-right (RTL)
 * - Body text in cool gray; headlines in navy
 * - Maximum 2-3 brand colors per surface (navy + gold + teal here)
 * - No fabricated "100% أمان" claim — replaced with the three pillars
 *   the user explicitly requested 2026-04-30:
 *   AI · المؤسسي التميز · الامتثال
 */
export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'credentials' | 'nafath'>('credentials');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1200);
    };

    const handleNafathLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    /**
     * The three pillars Ahmad requested as the system's value proposition.
     * They replace the prior "145 / 24/7 / 100%" stat strip — that was
     * marketing-style, this is institutional positioning.
     */
    const pillars = [
        {
            icon: Brain,
            title: 'الذكاء الاصطناعي',
            blurb: 'نماذج تنبؤيّة لخدمة المستفيدين',
        },
        {
            icon: Award,
            title: 'التميّز المؤسسي',
            blurb: 'متوافق مع منظومة جودة الوزارة',
        },
        {
            icon: ShieldCheck,
            title: 'الامتثال والحوكمة',
            blurb: 'حماية البيانات والأمن السيبراني الوطني',
        },
    ];

    return (
        <div className="min-h-screen bg-white flex" dir="rtl">
            {/* Right side (Arabic-first): Branding pane */}
            <motion.aside
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-hrsd-navy"
            >
                {/* Subtle wave pattern in HRSD teal at low opacity (brand-book wave element) */}
                <div className="absolute inset-0 hrsd-wave-bg opacity-40" />
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    }}
                />

                <div className="relative z-10 flex flex-col justify-between px-12 xl:px-16 py-14 text-white w-full max-w-2xl">
                    {/* Top: HRSD ministry logo + title */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/hrsd-logo.png"
                                alt="شعار وزارة الموارد البشرية والتنمية الاجتماعية"
                                className="h-14 w-auto bg-white rounded-lg p-2"
                            />
                            <div className="text-sm leading-relaxed text-white/85">
                                <p className="font-semibold">المملكة العربية السعودية</p>
                                <p>وزارة الموارد البشرية والتنمية الاجتماعية</p>
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-6">
                            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight mb-2">
                                نظام <span className="text-hrsd-gold">بصيرة</span>
                            </h1>
                            <p className="text-lg text-white/80">
                                مركز التأهيل الشامل بالباحة
                            </p>
                        </div>
                    </motion.div>

                    {/* Middle: Three pillars (replaces the stat strip) */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-5 my-12"
                    >
                        {pillars.map((p, idx) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                                    <p.icon className="w-5 h-5 text-hrsd-gold" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold mb-1">{p.title}</h3>
                                    <p className="text-sm text-white/65 leading-relaxed">{p.blurb}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bottom: Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-xs text-white/45 leading-relaxed"
                    >
                        منظومة رقمية لإدارة خدمات التأهيل والمتابعة وفق ضوابط الوزارة
                        <br />
                        ومعايير حماية البيانات الشخصية والأمن السيبراني الوطنية.
                    </motion.div>
                </div>
            </motion.aside>

            {/* Left side: Login form (light surface) */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white"
            >
                <div className="w-full max-w-md">
                    {/* Mobile logo strip — visible only when branding pane is hidden */}
                    <div className="lg:hidden text-center mb-8">
                        <img
                            src="/assets/hrsd-logo.png"
                            alt="شعار الوزارة"
                            className="h-12 w-auto mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-hrsd-navy">
                            نظام بصيرة
                        </h1>
                        <p className="text-sm text-hrsd-cool-gray mt-1">
                            مركز التأهيل الشامل بالباحة
                        </p>
                    </div>

                    {/* Login Card */}
                    <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                    >
                        <h2 className="text-2xl font-bold text-hrsd-navy mb-1">
                            تسجيل الدخول
                        </h2>
                        <p className="text-sm text-hrsd-cool-gray mb-7">
                            أدخل بياناتك للوصول إلى النظام
                        </p>

                        {/* Login method toggle */}
                        <div className="flex gap-1.5 mb-7 bg-gray-100 rounded-xl p-1">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('credentials')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                                    loginMethod === 'credentials'
                                        ? 'bg-white text-hrsd-navy shadow-sm'
                                        : 'text-hrsd-cool-gray hover:text-hrsd-navy'
                                }`}
                            >
                                <Lock className="w-4 h-4" />
                                اسم المستخدم
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMethod('nafath')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                                    loginMethod === 'nafath'
                                        ? 'bg-white text-hrsd-navy shadow-sm'
                                        : 'text-hrsd-cool-gray hover:text-hrsd-navy'
                                }`}
                            >
                                <Fingerprint className="w-4 h-4" />
                                نفاذ
                            </button>
                        </div>

                        {loginMethod === 'credentials' ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-hrsd-navy mb-2">
                                        اسم المستخدم
                                    </label>
                                    <div className="relative">
                                        <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hrsd-cool-gray" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) =>
                                                setFormData({ ...formData, username: e.target.value })
                                            }
                                            placeholder="أدخل اسم المستخدم"
                                            className="w-full bg-white border border-gray-300 rounded-xl pr-10 pl-3.5 py-3 text-hrsd-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/30 focus:border-hrsd-teal transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-hrsd-navy mb-2">
                                        كلمة المرور
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-hrsd-cool-gray" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({ ...formData, password: e.target.value })
                                            }
                                            placeholder="أدخل كلمة المرور"
                                            className="w-full bg-white border border-gray-300 rounded-xl pr-10 pl-10 py-3 text-hrsd-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hrsd-teal/30 focus:border-hrsd-teal transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-hrsd-cool-gray hover:text-hrsd-navy transition-colors"
                                            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-hrsd-teal focus:ring-hrsd-teal"
                                        />
                                        <span className="text-hrsd-cool-gray">تذكّرني</span>
                                    </label>
                                    <a href="#" className="text-hrsd-teal hover:text-hrsd-navy font-medium">
                                        نسيت كلمة المرور؟
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-hrsd-navy hover:bg-hrsd-navy-light text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            دخول
                                            <ArrowLeft className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-hrsd-navy rounded-2xl flex items-center justify-center mx-auto mb-5"
                                >
                                    <Fingerprint className="w-10 h-10 text-hrsd-gold" />
                                </motion.div>
                                <h3 className="text-lg font-bold text-hrsd-navy mb-1">
                                    الدخول عبر نفاذ
                                </h3>
                                <p className="text-sm text-hrsd-cool-gray mb-6">
                                    استخدم تطبيق نفاذ للمصادقة الآمنة
                                </p>
                                <button
                                    onClick={handleNafathLogin}
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-hrsd-navy hover:bg-hrsd-navy-light text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Fingerprint className="w-5 h-5" />
                                            المتابعة بنفاذ
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>

                    <p className="text-center text-xs text-hrsd-cool-gray mt-7">
                        © 2026 نظام بصيرة — مركز التأهيل الشامل بالباحة
                    </p>
                </div>
            </motion.section>
        </div>
    );
};

export default LoginPage;
