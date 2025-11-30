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
                    DEFAULT: '#006241', // HRSD Green
                    50: '#e6efec',
                    100: '#cce0d9',
                    200: '#99c2b3',
                    300: '#66a38c',
                    400: '#338566',
                    500: '#006241',
                    600: '#004f34',
                    700: '#003b27',
                    800: '#00271a',
                    900: '#00140d',
                },
                secondary: {
                    DEFAULT: '#D4AF37', // HRSD Gold
                    50: '#fbf7eb',
                    100: '#f7efd6',
                    200: '#efdfad',
                    300: '#e7cf85',
                    400: '#dfbf5c',
                    500: '#D4AF37',
                    600: '#aa8c2c',
                    700: '#806921',
                    800: '#554616',
                    900: '#2a230b',
                },
                accent: '#c5a47e',
                surface: '#F9FAFB',
            },
            fontFamily: {
                sans: ['Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
