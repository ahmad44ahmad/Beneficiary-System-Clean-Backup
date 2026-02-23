import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
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

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState & ToastActions>((set) => ({
    toasts: [],
    showToast: (message, type = 'success') => {
        const id = Math.random().toString(36).slice(2, 11);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        const timer = setTimeout(() => {
            set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
            timers.delete(id);
        }, 3000);
        timers.set(id, timer);
    },
    removeToast: (id) => {
        const timer = timers.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.delete(id);
        }
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },
}));

/** Drop-in replacement for the old useToast() hook */
export const useToast = () => {
    const showToast = useToastStore((s) => s.showToast);
    return { showToast };
};
