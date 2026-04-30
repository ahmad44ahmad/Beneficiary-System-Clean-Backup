// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-white flex items-center justify-center p-6" dir="rtl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-[#DC2626]/30"
                    >
                        <div className="w-16 h-16 bg-[#DC2626]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                            حدث خطأ غير متوقع
                        </h2>

                        <p className="text-gray-400 mb-6">
                            نعتذر عن هذا الخطأ. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <pre className="bg-white p-4 rounded-lg text-left text-xs text-[#DC2626] mb-6 overflow-auto max-h-32">
                                {this.state.error.message}
                            </pre>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="flex items-center gap-2 px-4 py-2 bg-[#269798] hover:bg-[#1B7778] 
                         text-white rounded-xl transition-colors cursor-pointer"
                            >
                                <RefreshCw className="w-4 h-4" />
                                حاول مرة أخرى
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-200 
                         text-white rounded-xl transition-colors cursor-pointer"
                            >
                                <Home className="w-4 h-4" />
                                الرئيسية
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
