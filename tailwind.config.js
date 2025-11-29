/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // HRSD Brand Colors
                primary: {
                    DEFAULT: '#FF9E1B', // Pantone 1375 C
                    light: '#FFB75E',
                    dark: '#D48200',
                },
                secondary: {
                    DEFAULT: '#FFB81C', // Pantone 1235 C
                },
                accent: {
                    DEFAULT: '#006C70', // Teal
                },
                // Map 'blue' to primary to fix existing components
                blue: {
                    50: '#FFF8E1', // Lightest Gold
                    100: '#FFE0B2',
                    200: '#FFCC80',
                    300: '#FFB74D',
                    400: '#FFA726',
                    500: '#FF9E1B', // Primary
                    600: '#FB8C00',
                    700: '#F57C00',
                    800: '#EF6C00',
                    900: '#E65100',
                }
            },
            fontFamily: {
                sans: ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
