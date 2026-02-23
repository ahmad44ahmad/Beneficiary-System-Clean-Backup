import { create } from 'zustand';

export type ViewMode = 'ADMIN' | 'DIRECTOR' | 'DEPARTMENT_HEAD' | 'STAFF';

interface ViewModeState {
    currentView: ViewMode;
}

interface ViewModeActions {
    setView: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState & ViewModeActions>()((set) => ({
    currentView: 'ADMIN',
    setView: (mode) => set({ currentView: mode }),
}));
