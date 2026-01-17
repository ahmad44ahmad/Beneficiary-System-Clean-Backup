/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './src/components/App';

import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './src/context/QueryProvider';
import { AppProvider } from './src/context/AppContext';
import { UnifiedDataProvider } from './src/context/UnifiedDataContext';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { ToastProvider } from './src/context/ToastContext';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider } from './src/config/theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ThemeProvider defaultMode="dark">
                <QueryProvider>
                    <BrowserRouter>
                        <AppProvider>
                            <UnifiedDataProvider>
                                <AuthProvider>
                                    <UserProvider>
                                        <ToastProvider>
                                            <App />
                                        </ToastProvider>
                                    </UserProvider>
                                </AuthProvider>
                            </UnifiedDataProvider>
                        </AppProvider>
                    </BrowserRouter>
                </QueryProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
