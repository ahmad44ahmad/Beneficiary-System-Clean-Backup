import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SystemEntryPage: React.FC = () => {
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            navigate('/dashboard');
        }, 3500);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [navigate]);

    const handleClick = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        navigate('/dashboard');
    };

    const stagger = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
    };

    return (
        <div
            className="min-h-screen bg-[#0a1628] flex items-center justify-center cursor-pointer select-none overflow-hidden"
            dir="rtl"
            onClick={handleClick}
        >
            {/* Background subtle radial */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#148287]/5 blur-3xl" />
            </div>

            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-6"
                variants={stagger}
                initial="hidden"
                animate="visible"
            >
                {/* HRSD Logo */}
                <motion.img
                    src="/assets/hrsd-logo.png"
                    alt="شعار وزارة الموارد البشرية والتنمية الاجتماعية"
                    className="w-28 h-28 md:w-36 md:h-36 mb-8 drop-shadow-[0_0_30px_rgba(250,180,20,0.3)]"
                    variants={scaleIn}
                />

                {/* Ministry Name */}
                <motion.h1
                    className="text-white/80 text-lg md:text-xl font-medium mb-2"
                    variants={fadeUp}
                >
                    وزارة الموارد البشرية والتنمية الاجتماعية
                </motion.h1>

                {/* Center Name */}
                <motion.h2
                    className="text-[#FAB414] text-xl md:text-2xl font-bold mb-8"
                    variants={fadeUp}
                >
                    مركز التأهيل الشامل بالباحة
                </motion.h2>

                {/* Divider */}
                <motion.div
                    className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#148287] to-transparent mb-8"
                    variants={fadeUp}
                />

                {/* System Name */}
                <motion.p
                    className="text-white/60 text-base font-light tracking-wider mb-2"
                    variants={fadeUp}
                >
                    نظام بصيرة
                </motion.p>

                {/* English subtitle */}
                <motion.p
                    className="text-white/20 text-xs font-mono tracking-[0.2em]"
                    variants={fadeUp}
                >
                    BASIRA — Beneficiary Management System
                </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-white/5 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
            >
                <div
                    className="h-full bg-gradient-to-r from-[#148287] to-[#2DB473] rounded-full"
                    style={{ animation: 'progressFill 3s linear forwards', animationDelay: '0.5s', width: '0%' }}
                />
            </motion.div>

            {/* Click hint */}
            <motion.p
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/10 text-[10px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.5 }}
            >
                انقر للمتابعة
            </motion.p>
        </div>
    );
};

export default SystemEntryPage;
