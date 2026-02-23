import { create } from 'zustand';
import { Beneficiary } from '../types';

interface AppState {
    activeBeneficiary: Beneficiary | null;
    theme: 'light' | 'dark';
    language: 'ar' | 'en';
    isMasterViewOpen: boolean;
}

interface AppActions {
    setActiveBeneficiary: (beneficiary: Beneficiary | null) => void;
    toggleTheme: () => void;
    setLanguage: (lang: 'ar' | 'en') => void;
    setIsMasterViewOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
    activeBeneficiary: null,
    theme: 'light',
    language: 'ar',
    isMasterViewOpen: false,

    setActiveBeneficiary: (beneficiary) => set({ activeBeneficiary: beneficiary }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    setLanguage: (lang) => set({ language: lang }),
    setIsMasterViewOpen: (isOpen) => set({ isMasterViewOpen: isOpen }),
}));
