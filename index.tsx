/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './src/components/App';

import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import { UnifiedDataProvider } from './src/context/UnifiedDataContext';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { ToastProvider } from './src/context/ToastContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
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
    </React.StrictMode>
);
