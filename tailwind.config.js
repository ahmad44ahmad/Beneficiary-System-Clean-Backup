/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // HRSD Official Brand Colors
                hrsd: {
                    navy: {
                        DEFAULT: '#1a365d',
                        dark: '#0f2744',
                        light: '#2d4a7c',
                    },
                    teal: {
                        DEFAULT: '#0d9488',
                        dark: '#0a7469',
                        light: '#14b8a6',
                    },
                    gold: {
                        DEFAULT: '#eab308',
                        dark: '#ca8a04',
                        light: '#facc15',
                    },
                    orange: '#f97316',
                    green: '#22c55e',
                    red: '#ef4444',
                },
                // Legacy colors (keeping for compatibility)
                primary: {
                    DEFAULT: '#0d9488',
                    light: '#14b8a6',
                    dark: '#0a7469',
                },
                secondary: {
                    DEFAULT: '#eab308',
                    bg: '#fefce8',
                },
                accent: {
                    DEFAULT: '#0d9488',
                    teal: '#0d9488',
                    green: '#22c55e',
                    blue: '#1a365d',
                    'dark-blue': '#1a365d',
                },
                surface: '#ffffff',
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
            borderRadius: {
                'default': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            fontFamily: {
                sans: ['Readex Pro', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
                readex: ['Readex Pro', 'sans-serif'],
            },
            screens: {
                'xs': '375px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                // iPhone Pro Max specific
                'iphone-pro-max': '430px',
            },
            spacing: {
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-top': 'env(safe-area-inset-top)',
                'mobile-nav': '64px',
                'sidebar': '280px',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up': 'slideUp 0.4s ease-out forwards',
                'slide-right': 'slideRight 0.3s ease-out forwards',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
        },
    },
    plugins: [],
};

