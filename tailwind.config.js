/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--primary-color)',
                    light: 'var(--primary-light)',
                    dark: 'var(--primary-dark)',
                    50: '#fff8ed',
                    100: '#ffedd6',
                    200: '#ffd9ad',
                    300: '#ffbf7a',
                    400: '#ff9e47',
                    500: '#F5961E',
                    600: '#d9790f',
                    700: '#b35d0b',
                    800: '#8f4810',
                    900: '#753c10',
                },
                secondary: {
                    DEFAULT: 'var(--secondary-color)',
                    bg: 'var(--secondary-bg)',
                    50: '#fefce8',
                    100: '#fff9c2',
                    200: '#fff08a',
                    300: '#ffe047',
                    400: '#FAB414',
                    500: '#eab308',
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                accent: {
                    DEFAULT: 'var(--accent-teal)',
                    teal: 'var(--accent-teal)',
                    green: 'var(--accent-green)',
                    blue: 'var(--accent-dark-blue)',
                },
                surface: 'var(--white-color)',
            },
            boxShadow: {
                'soft': 'var(--shadow-soft)',
                'glass': 'var(--shadow-glass)',
            },
            borderRadius: {
                'default': 'var(--radius)',
            },
            fontFamily: {
                sans: ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
