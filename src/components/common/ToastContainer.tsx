import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';

export function ToastContainer() {
    const toasts = useToastStore((s) => s.toasts);
    const removeToast = useToastStore((s) => s.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white min-w-[300px] animate-in slide-in-from-right-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-600' :
                            toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                        }`}
                >
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {toast.type === 'info' && <Info className="w-5 h-5" />}
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="opacity-80 hover:opacity-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
