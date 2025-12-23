import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Heart,
    Bell,
    Menu,
    Home,
    Stethoscope,
    ClipboardList
} from 'lucide-react';

interface MobileNavProps {
    onMenuClick: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onMenuClick }) => {
    const location = useLocation();

    const navItems = [
        { to: '/dashboard', icon: Home, label: 'الرئيسية' },
        { to: '/beneficiaries', icon: Users, label: 'المستفيدين' },
        { to: '/daily-follow-up', icon: ClipboardList, label: 'المتابعة' },
        { to: '/medical', icon: Stethoscope, label: 'الطبي' },
    ];

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <nav className="mobile-nav md:hidden" dir="rtl">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={`mobile-nav-item ${isActive(item.to) ? 'active' : ''}`}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                </NavLink>
            ))}

            {/* Menu Button */}
            <button
                onClick={onMenuClick}
                className="mobile-nav-item"
                aria-label="فتح القائمة"
            >
                <Menu className="w-5 h-5" />
                <span>القائمة</span>
            </button>
        </nav>
    );
};

export default MobileNav;
