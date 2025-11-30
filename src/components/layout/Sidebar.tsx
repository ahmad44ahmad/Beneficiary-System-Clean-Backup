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
        <aside className="w-64 bg-primary text-white flex flex-col h-screen fixed right-0 top-0 border-l border-primary-700 z-50 shadow-xl">
            <div className="p-6 border-b border-primary-700 flex items-center gap-3 bg-primary-800">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-primary shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Saudi_Vision_2030_logo.svg/1200px-Saudi_Vision_2030_logo.svg.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                    <h1 className="font-bold text-base">مركز التأهيل الشامل</h1>
                    <p className="text-xs text-primary-200">وزارة الموارد البشرية</p>
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
                                    ? 'bg-primary-700 text-secondary shadow-sm translate-x-[-4px]'
                                    : 'text-primary-100 hover:bg-primary-600 hover:text-white hover:translate-x-[-2px]'
                            )
                        }
                    >
                        <item.icon className={cn("w-5 h-5", ({ isActive }: any) => isActive ? "text-secondary" : "text-primary-200")} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-primary-700 bg-primary-800">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                            isActive
                                ? 'bg-primary-700 text-secondary'
                                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                        )
                    }
                >
                    <Settings className="w-5 h-5" />
                    الإعدادات
                </NavLink>
            </div>
        </aside>
    );
};
