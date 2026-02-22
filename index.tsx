/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './src/components/App';

import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './src/context/QueryProvider';
import { UnifiedDataProvider } from './src/context/UnifiedDataContext';
import { AuthProvider } from './src/context/AuthContext';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider } from './src/config/theme';
import { ToastRenderer } from './src/components/common/ToastRenderer';

// Start audit service for tracking user actions
import { startAuditService } from './src/services/auditService';
startAuditService();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider defaultMode="dark">
                <QueryProvider>
                    <BrowserRouter>
                        <UnifiedDataProvider>
                            <AuthProvider>
                                <App />
                                <ToastRenderer />
                            </AuthProvider>
                        </UnifiedDataProvider>
                    </BrowserRouter>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
