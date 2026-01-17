// src/config/theme/colors.ts
// HRSD Official Colors and Design Tokens

/**
 * ألوان وزارة الموارد البشرية والتنمية الاجتماعية الرسمية
 * Ministry of Human Resources and Social Development Official Colors
 */
export const colors = {
    // ═══════════════════════════════════════════════════════════════
    // الألوان الأساسية (Primary Colors)
    // ═══════════════════════════════════════════════════════════════
    primary: {
        teal: '#14b8a6',      // Primary action color
        emerald: '#10b981',   // Success/positive
        navy: '#14415A',      // HRSD official navy
    },

    // ═══════════════════════════════════════════════════════════════
    // ألوان التمييز (Accent Colors) - HRSD Brand
    // ═══════════════════════════════════════════════════════════════
    accent: {
        orange: '#F5961E',    // HRSD Orange
        gold: '#FAB414',      // HRSD Gold
        green: '#2D9B4E',     // HRSD Green
    },

    // ═══════════════════════════════════════════════════════════════
    // ألوان الدلالة (Semantic Colors)
    // ═══════════════════════════════════════════════════════════════
    semantic: {
        success: '#22c55e',   // نجاح
        warning: '#f59e0b',   // تحذير
        danger: '#ef4444',    // خطر
        info: '#3b82f6',      // معلومات
    },

    // ═══════════════════════════════════════════════════════════════
    // الوضع الداكن (Dark Mode - Default)
    // ═══════════════════════════════════════════════════════════════
    dark: {
        background: {
            primary: '#0f172a',    // slate-900
            secondary: '#1e293b',  // slate-800
            card: '#334155',       // slate-700
            elevated: '#475569',   // slate-600
        },
        text: {
            primary: '#f8fafc',    // slate-50
            secondary: '#cbd5e1',  // slate-300
            muted: '#94a3b8',      // slate-400
        },
        border: {
            light: 'rgba(255, 255, 255, 0.1)',
            medium: 'rgba(255, 255, 255, 0.2)',
        },
    },

    // ═══════════════════════════════════════════════════════════════
    // الوضع الفاتح (Light Mode)
    // ═══════════════════════════════════════════════════════════════
    light: {
        background: {
            primary: '#ffffff',
            secondary: '#f8fafc',
            card: '#ffffff',
            elevated: '#f1f5f9',
        },
        text: {
            primary: '#0f172a',
            secondary: '#475569',
            muted: '#64748b',
        },
        border: {
            light: 'rgba(0, 0, 0, 0.05)',
            medium: 'rgba(0, 0, 0, 0.1)',
        },
    },
};

// ═══════════════════════════════════════════════════════════════
// التدرجات (Gradients)
// ═══════════════════════════════════════════════════════════════
export const gradients = {
    // HRSD Brand Gradients
    hrsdPrimary: 'from-[#14415A] to-[#1e5a7a]',
    hrsdGold: 'from-[#FAB414] to-[#F5961E]',
    hrsdGreen: 'from-[#2D9B4E] to-[#22c55e]',

    // Semantic Gradients
    primary: 'from-teal-500 to-emerald-600',
    danger: 'from-red-500 to-rose-600',
    warning: 'from-amber-500 to-orange-600',
    success: 'from-green-500 to-emerald-600',
    info: 'from-blue-500 to-cyan-600',

    // Card Gradients
    cardDark: 'from-slate-800 to-slate-900',
    cardLight: 'from-white to-slate-50',
};

// ═══════════════════════════════════════════════════════════════
// الظلال (Shadows)
// ═══════════════════════════════════════════════════════════════
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: {
        teal: '0 0 20px rgba(20, 184, 166, 0.3)',
        gold: '0 0 20px rgba(250, 180, 20, 0.3)',
        danger: '0 0 20px rgba(239, 68, 68, 0.3)',
    },
};

export default colors;
