import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastState {
    toasts: Toast[];
}

interface ToastActions {
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState & ToastActions>()((set) => ({
    toasts: [],

    showToast: (message, type = 'success') => {
        const id = Math.random().toString(36).slice(2, 11);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
        }, 3000);
    },

    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));
