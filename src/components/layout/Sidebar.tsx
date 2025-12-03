import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Package,
    Shirt,
    CalendarCheck,
    Activity,
    Settings,
    FileText
} from 'lucide-react';
import { cn } from '../ui/Button';

export const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'لوحة القيادة' },
        { to: '/beneficiaries', icon: Users, label: 'المستفيدين' },
        { to: '/medical', icon: Stethoscope, label: 'القسم الطبي' },
        { to: '/social', icon: Activity, label: 'الخدمات الاجتماعية' },
        { to: '/reports/strategic', icon: FileText, label: 'التقارير الاستراتيجية' },
        { to: '/inventory', icon: Package, label: 'المستودع' },
        { to: '/clothing', icon: Shirt, label: 'الكسوة' },
        { to: '/daily-follow-up', icon: CalendarCheck, label: 'المتابعة اليومية' },
    ];

    return (
        <aside className="w-64 text-white flex flex-col h-screen border-l z-50 shadow-xl flex-shrink-0" style={{ backgroundColor: '#14415A', borderColor: '#148287' }}>
            <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: '#148287', backgroundColor: '#0f3447' }}>
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm p-1">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <linearGradient id="hrsdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#F5961E', stopOpacity: 1 }} />
                                <stop offset="50%" style={{ stopColor: '#FAB414', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#2DB473', stopOpacity: 1 }} />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="45" fill="url(#hrsdGradient)" opacity="0.1" />
                        <path d="M50 15 L55 35 L75 35 L60 48 L65 68 L50 55 L35 68 L40 48 L25 35 L45 35 Z" fill="#F5961E" />
                        <circle cx="50" cy="50" r="12" fill="#2DB473" />
                        <circle cx="50" cy="50" r="8" fill="#148287" />
                    </svg>
                </div>
                <div>
                    <h1 className="font-bold text-sm">مركز التأهيل الشامل</h1>
                    <p className="text-[10px]" style={{ color: '#FAB414' }}>وزارة الموارد البشرية والتنمية الاجتماعية</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium',
                                isActive
                                    ? 'shadow-sm translate-x-[-4px]'
                                    : 'text-gray-200 hover:text-white hover:translate-x-[-2px]'
                            )
                        }
                        style={({ isActive }: any) => isActive ? { backgroundColor: '#148287', color: '#FAB414' } : {}}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className="w-5 h-5" style={{ color: isActive ? '#FAB414' : '#E5E7EB' }} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t" style={{ borderColor: '#148287', backgroundColor: '#0f3447' }}>
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                            isActive
                                ? 'shadow-sm'
                                : 'text-gray-200 hover:text-white'
                        )
                    }
                    style={({ isActive }: any) => isActive ? { backgroundColor: '#148287', color: '#FAB414' } : {}}
                >
                    {({ isActive }) => (
                        <>
                            <Settings className="w-5 h-5" style={{ color: isActive ? '#FAB414' : '#E5E7EB' }} />
                            الإعدادات
                        </>
                    )}
                </NavLink>
            </div>
        </aside>
    );
};
