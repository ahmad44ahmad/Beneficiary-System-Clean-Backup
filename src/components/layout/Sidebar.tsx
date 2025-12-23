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
    FileText,
    GraduationCap,
    Building2,
    CheckCircle2,
    Network,
    Sparkles
} from 'lucide-react';
import { cn } from '../ui/Button';

export const Sidebar = () => {
    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'لوحة القيادة' },
        { to: '/basira', icon: Sparkles, label: 'مشروع بصيرة' },
        { to: '/beneficiaries', icon: Users, label: 'المستفيدين' },
        { to: '/medical', icon: Stethoscope, label: 'القسم الطبي' },
        { to: '/social', icon: Activity, label: 'الخدمات الاجتماعية' },
        { to: '/reports/strategic', icon: FileText, label: 'التقارير الاستراتيجية' },
        { to: '/inventory', icon: Package, label: 'المستودع' },
        { to: '/clothing', icon: Shirt, label: 'الكسوة' },
        { to: '/training', icon: GraduationCap, label: 'التأهيل والتدريب' },
        { to: '/support', icon: Building2, label: 'الخدمات المساندة' },
        { to: '/quality', icon: CheckCircle2, label: 'الجودة' },
        { to: '/secretariat', icon: FileText, label: 'السكرتارية' },
        { to: '/structure', icon: Network, label: 'الهيكل الإداري' },
        { to: '/daily-follow-up', icon: CalendarCheck, label: 'المتابعة اليومية' },
    ];

    return (
        <aside className="w-80 text-white flex flex-col h-screen border-l border-accent-teal z-50 shadow-xl flex-shrink-0 bg-accent-dark-blue">
            <div className="p-6 border-b border-accent-teal flex items-center gap-4 bg-black/20">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
                    <img src="/assets/organization-logo.jpg" alt="Organization Logo" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                    <h1 className="font-bold text-base leading-tight">مركز التأهيل الشامل</h1>
                    <p className="text-secondary text-xs mt-1 font-medium">وزارة الموارد البشرية والتنمية الاجتماعية</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-base font-medium group',
                                isActive
                                    ? 'bg-accent-teal text-secondary shadow-md translate-x-[-4px]'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5 hover:translate-x-[-2px]'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-secondary" : "text-gray-400 group-hover:text-white")} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-accent-teal bg-black/20">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors text-base font-medium group',
                            isActive
                                ? 'bg-accent-teal text-secondary shadow-md'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Settings className={cn("w-5 h-5 transition-colors", isActive ? "text-secondary" : "text-gray-400 group-hover:text-white")} />
                            الإعدادات
                        </>
                    )}
                </NavLink>
            </div>
        </aside>
    );
};
