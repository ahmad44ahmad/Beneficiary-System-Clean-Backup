// src/config/theme/colors.ts
// HRSD Official Colors and Design Tokens
//
// Source of truth: src/design-system/tokens.ts (built from PDF page 25-28).
// This file is a legacy facade for components that still consume `colors.x.y`.
// New code should import from `src/design-system/tokens.ts` directly.

import { brand, semantic as brandSemantic } from '../../design-system/tokens';

/**
 * ألوان وزارة الموارد البشرية والتنمية الاجتماعية الرسمية
 * Ministry of Human Resources and Social Development Official Colors
 */
export const colors = {
    // الألوان الأساسية (Primary Colors)
    primary: {
        teal: brand.teal.hex,         // #269798 — Pantone 2235C
        emerald: brand.green.hex,     // #2BB574 — Pantone 2414C
        navy: brand.navy.hex,         // #0F3144 — Pantone 2189C
    },

    // ألوان التمييز (Accent Colors) - HRSD Brand
    accent: {
        orange: brand.orange.hex,     // #F7941D — Pantone 2011C
        gold: brand.gold.hex,         // #FCB614 — Pantone 7409C
        green: brand.green.hex,       // #2BB574 — Pantone 2414C
    },

    // ألوان الدلالة (Semantic Colors) — NOT brand colors. Reserved for status states.
    semantic: {
        success: brandSemantic.success,
        warning: brandSemantic.warning,
        danger: brandSemantic.danger,
        info: brandSemantic.info,
    },

    // الوضع الداكن (Dark Mode - Default)
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

    // الوضع الفاتح (Light Mode)
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

// التدرجات (Gradients) — using corrected HRSD palette
export const gradients = {
    // HRSD Brand Gradients
    hrsdPrimary: 'from-[#0F3144] to-[#1F4A60]',
    hrsdGold: 'from-[#FCB614] to-[#F7941D]',
    hrsdGreen: 'from-[#2BB574] to-[#269798]',

    // Semantic Gradients (status only, not brand)
    primary: 'from-[#269798] to-[#269798]',
    danger: 'from-[#DC2626] to-[#DC2626]',
    warning: 'from-[#FCB614] to-[#F7941D]',
    success: 'from-[#2BB574] to-[#2BB574]',
    info: 'from-[#269798] to-[#0F3144]',

    // Card Gradients (light mode preferred per brand book)
    cardDark: 'from-[#0A2030] to-[#0F3144]',
    cardLight: 'from-white to-[#F9FAFB]',
};

// الظلال (Shadows)
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: {
        teal: '0 0 20px rgba(38, 151, 152, 0.3)',
        gold: '0 0 20px rgba(252, 182, 20, 0.3)',
        danger: '0 0 20px rgba(220, 38, 38, 0.3)',
    },
};

export default colors;
