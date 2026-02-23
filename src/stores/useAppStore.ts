import { create } from 'zustand';
import { Beneficiary } from '../types';

export type ViewMode = 'ADMIN' | 'DIRECTOR' | 'DEPARTMENT_HEAD' | 'STAFF';

interface AppState {
    activeBeneficiary: Beneficiary | null;
    isMasterViewOpen: boolean;
    currentView: ViewMode;
}

interface AppActions {
    setActiveBeneficiary: (beneficiary: Beneficiary | null) => void;
    setIsMasterViewOpen: (isOpen: boolean) => void;
    setView: (mode: ViewMode) => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
    activeBeneficiary: null,
    isMasterViewOpen: false,
    currentView: 'ADMIN',
    setActiveBeneficiary: (beneficiary) => set({ activeBeneficiary: beneficiary }),
    setIsMasterViewOpen: (isOpen) => set({ isMasterViewOpen: isOpen }),
    setView: (mode) => set({ currentView: mode }),
}));
