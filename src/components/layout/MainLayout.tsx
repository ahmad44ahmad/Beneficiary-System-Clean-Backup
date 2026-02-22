import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from '../DemoBanner';
import { MobileNav } from './MobileNav';
import { RiskAlertSystem } from '../safety/RiskAlertSystem';
import { FallRiskAlertBanner } from '../alerts/FallRiskAlertBanner';
import { MedicationReminderAlert } from '../alerts/MedicationReminderAlert';
import { ShiftHandoverAlert } from '../alerts/ShiftHandoverAlert';
import { IncidentNotificationAlert } from '../alerts/IncidentNotificationAlert';
import { DebugRoleSwitcher } from '../ui/DebugRoleSwitcher';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { Breadcrumb } from '../navigation/Breadcrumb';

// Import HRSD theme
import '../../styles/hrsd-theme.css';

// Loading fallback for lazy-loaded routes
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-hrsd-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-500 dark:text-slate-400 text-sm">جاري التحميل...</span>
        </div>
    </div>
);

export const MainLayout = () => {
    // Enable real-time Supabase subscription for critical data
    useRealtimeSubscription();

    const _location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-hrsd-bg-light dark:bg-slate-900 font-sans overflow-hidden transition-colors duration-300" dir="rtl">
            {/* Global Risk Alert System */}
            <RiskAlertSystem />

            {/* Realtime Alert Components */}
            <FallRiskAlertBanner />
            <MedicationReminderAlert />
            <ShiftHandoverAlert />
            <IncidentNotificationAlert />

            {/* Desktop Sidebar */}
            <Sidebar isMobile={false} />

            {/* Mobile Sidebar Drawer */}
            <Sidebar
                isOpen={isMobileMenuOpen}
                onClose={handleMenuClose}
                isMobile={true}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <DemoBanner />
                {/* Header */}
                <Header onMenuClick={handleMenuToggle} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 hrsd-scrollbar bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Breadcrumb className="mb-4" />
                        <Suspense fallback={<LoadingFallback />}>
                            <ErrorBoundary>
                                <Outlet />
                            </ErrorBoundary>
                        </Suspense>
                    </div>
                </main>

                {/* Debug Role Switcher (Development Only) */}
                <DebugRoleSwitcher />
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav onMenuClick={handleMenuToggle} />
        </div>
    );
};

export default MainLayout;
