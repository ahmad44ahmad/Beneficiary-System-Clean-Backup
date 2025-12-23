import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DebugRoleSwitcher } from '../ui/DebugRoleSwitcher';

import { RiskAlertSystem } from '../safety/RiskAlertSystem';

export const MainLayout = () => {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-200 font-sans overflow-hidden" dir="rtl">
            <RiskAlertSystem />
            {/* Sidebar should be fixed width or shrinkable, usually standard width */}
            <div className="shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 m-4 rounded-3xl glass-panel transition-all duration-300">
                    <Outlet />
                </main>
            </div>
            <DebugRoleSwitcher />
        </div>
    );
};
