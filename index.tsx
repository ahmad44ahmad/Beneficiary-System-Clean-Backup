/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import { useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './src/components/App';

import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './src/context/QueryProvider';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider } from './src/config/theme';
import { ToastContainer } from './src/components/common/ToastContainer';
import { useAuthStore } from './src/stores/useAuthStore';
import { useDataStore } from './src/stores/useDataStore';

// Start audit service for tracking user actions
import { startAuditService } from './src/services/auditService';
startAuditService();

function AuthInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const cleanup = useAuthStore.getState().initialize();
        return cleanup;
    }, []);
    return <>{children}</>;
}

function DataInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        useDataStore.getState().fetchData();
    }, []);
    return <>{children}</>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider defaultMode="dark">
                <QueryProvider>
                    <BrowserRouter>
                        <AuthInitializer>
                            <DataInitializer>
                                <App />
                                <ToastContainer />
                            </DataInitializer>
                        </AuthInitializer>
                    </BrowserRouter>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
