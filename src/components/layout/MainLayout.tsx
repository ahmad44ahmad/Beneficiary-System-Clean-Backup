import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { RiskAlertSystem } from '../safety/RiskAlertSystem';
import { RealTimeAlerts } from '../common/RealTimeAlerts';
import { DebugRoleSwitcher } from '../ui/DebugRoleSwitcher';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import { Breadcrumb } from '../navigation/Breadcrumb';

// Import HRSD theme
import '../../styles/hrsd-theme.css';

export const MainLayout = () => {
    // Enable real-time Supabase subscription for critical data
    useRealtimeSubscription();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleMenuClose = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-hrsd-bg-light font-sans overflow-hidden" dir="rtl">
            {/* Global Risk Alert System */}
            <RiskAlertSystem />

            {/* Real-Time Alerts Notification - Temporarily disabled for presentation */}
            {/* TODO: Re-enable after demo - uncomment the line below */}
            {/* <RealTimeAlerts /> */}

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
                {/* Header */}
                <Header onMenuClick={handleMenuToggle} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 hrsd-scrollbar bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Breadcrumb className="mb-4" />
                        <Outlet />
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
