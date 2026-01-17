// src/config/theme/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'basira-theme-mode';

interface ThemeProviderProps {
    children: ReactNode;
    defaultMode?: ThemeMode;
}

/**
 * Theme Provider for managing dark/light mode.
 * Uses localStorage for persistence, with proper hydration handling.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultMode = 'dark'
}) => {
    // Initialize with default, then sync with localStorage in useEffect
    const [mode, setModeState] = useState<ThemeMode>(defaultMode);

    // Read from localStorage after mount (avoids hydration mismatch)
    useEffect(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            setModeState(stored);
        }
    }, []);

    // Apply theme class to document root
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(mode);

        // Also set color-scheme for native elements
        root.style.colorScheme = mode;
    }, [mode]);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem(THEME_STORAGE_KEY, newMode);
    };

    const toggleTheme = () => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                setMode,
                toggleTheme,
                isDark: mode === 'dark'
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access the theme context.
 * Must be used within a ThemeProvider.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
