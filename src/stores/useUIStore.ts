// src/stores/useUIStore.ts
// Zustand v5 store for global UI state (modals, sidebar, search, loading overlay)
// Replaces scattered useState/Context patterns for cross-cutting UI concerns

import { create } from 'zustand';

interface UIState {
    // Modal state
    activeModal: string | null;
    modalData: Record<string, unknown> | null;
    openModal: (modalId: string, data?: Record<string, unknown>) => void;
    closeModal: () => void;

    // Sidebar state
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Search state
    globalSearchTerm: string;
    setGlobalSearchTerm: (term: string) => void;

    // Loading overlay
    isGlobalLoading: boolean;
    setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    // Modal
    activeModal: null,
    modalData: null,
    openModal: (modalId, data) => set({ activeModal: modalId, modalData: data ?? null }),
    closeModal: () => set({ activeModal: null, modalData: null }),

    // Sidebar
    sidebarCollapsed: false,
    toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    // Search
    globalSearchTerm: '',
    setGlobalSearchTerm: (term) => set({ globalSearchTerm: term }),

    // Loading overlay
    isGlobalLoading: false,
    setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}));
