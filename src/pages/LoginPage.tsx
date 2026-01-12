import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Eye, EyeOff, Lock, User, Building2,
    Fingerprint, Users, Clock, CheckCircle, ArrowLeft
} from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'credentials' | 'nafath'>('credentials');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    const handleNafathLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/dashboard');
        }, 2000);
    };

    const stats = [
        { icon: Users, value: '145', label: 'مستفيد', color: 'from-blue-500 to-cyan-500' },
        { icon: Clock, value: '24/7', label: 'رعاية', color: 'from-green-500 to-emerald-500' },
        { icon: Shield, value: '100%', label: 'أمان', color: 'from-purple-500 to-indigo-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex" dir="rtl">
            {/* Left Side - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgb(20,65,90)] via-[rgb(45,180,115)] to-[rgb(20,130,135)] opacity-90" />
                <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                            <Building2 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">نظام بصيرة</h1>
                        <p className="text-xl text-white/80">مركز التأهيل الشامل بالباحة</p>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-white/70 mb-12 leading-relaxed max-w-md"
                    >
                        نظام متكامل لإدارة رعاية المستفيدين بكفاءة عالية وجودة شاملة،
                        يوفر أدوات ذكية لفريق العمل لضمان أفضل مستوى من الخدمات.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center min-w-[100px]"
                            >
                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-white/80" />
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-white/60">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-8 left-16 right-16"
                    >
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>وزارة الموارد البشرية والتنمية الاجتماعية</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full lg:w-1/2 flex items-center justify-center p-8"
            >
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[rgb(45,180,115)] to-[rgb(20,130,135)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">نظام بصيرة</h1>
                    </div>

                    {/* Login Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
                        <p className="text-slate-400 mb-8">أدخل بياناتك للوصول إلى النظام</p>

                        {/* Login Method Toggle */}
                        <div className="flex gap-2 mb-8 bg-slate-700/50 rounded-xl p-1">
                            <button
                                onClick={() => setLoginMethod('credentials')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${loginMethod === 'credentials' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Lock className="w-4 h-4" />
                                اسم المستخدم
                            </button>
                            <button
                                onClick={() => setLoginMethod('nafath')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${loginMethod === 'nafath' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Fingerprint className="w-4 h-4" />
                                نفاذ
                            </button>
                        </div>

                        {loginMethod === 'credentials' ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Username */}
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">اسم المستخدم</label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="أدخل اسم المستخدم"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pr-12 pl-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-slate-400 text-sm mb-2">كلمة المرور</label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="أدخل كلمة المرور"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl pr-12 pl-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500" />
                                        <span className="text-slate-400">تذكرني</span>
                                    </label>
                                    <a href="#" className="text-emerald-400 hover:text-emerald-300">نسيت كلمة المرور؟</a>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            دخول
                                            <ArrowLeft className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                                >
                                    <Fingerprint className="w-12 h-12 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2">الدخول عبر نفاذ</h3>
                                <p className="text-slate-400 mb-6">استخدم تطبيق نفاذ للمصادقة الآمنة</p>
                                <button
                                    onClick={handleNafathLogin}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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

                    {/* Footer */}
                    <p className="text-center text-slate-500 text-sm mt-8">
                        © 2026 نظام بصيرة - مركز التأهيل الشامل بالباحة
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
