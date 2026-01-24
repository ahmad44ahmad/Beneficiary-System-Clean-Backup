import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    Sparkles,
    Target,
    X,
    ChevronDown,
    ChevronLeft,
    Home,
    Bell,
    LogOut,
    AlertTriangle,
    Shield,
    Heart,
    Utensils,
    Wrench,
    BarChart3,
    AlertOctagon,
    Brain,
    Syringe,
    ClipboardList,
    AlertCircle,
    Users2
} from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

interface NavItem {
    to: string;
    icon: React.ElementType;
    label: string;
    badge?: number;
    children?: { to: string; label: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, isMobile = false }) => {
    const location = useLocation();
    const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

    // Basira 5.0 Navigation Structure
    const navSections: NavSection[] = [
        {
            title: 'الرئيسية',
            items: [
                { to: '/', icon: Home, label: 'الرئيسية' },
                { to: '/beneficiaries', icon: Users, label: 'المستفيدون' },
            ]
        },
        {
            title: 'الخدمات الطبية',
            items: [
                { to: '/medical', icon: Heart, label: 'الملف الطبي' },
                { to: '/daily-care', icon: ClipboardList, label: 'المتابعة اليومية' },
                { to: '/medications', icon: Syringe, label: 'الأدوية' },
            ]
        },
        {
            title: 'الخدمات الاجتماعية',
            items: [
                { to: '/dignity', icon: Heart, label: 'ملف الكرامة' },
                { to: '/empowerment', icon: Target, label: 'محرك التمكين' },
                { to: '/family-portal', icon: Users2, label: 'بوابة الأسرة' },
                { to: '/social-research', icon: FileText, label: 'البحث الاجتماعي' },
            ]
        },
        {
            title: 'الحوكمة والجودة',
            items: [
                { to: '/risks', icon: AlertTriangle, label: 'سجل المخاطر' },
                { to: '/ipc', icon: Shield, label: 'درع السلامة (IPC)' },
                { to: '/compliance', icon: CheckCircle2, label: 'الامتثال ISO' },
            ]
        },
        {
            title: 'العمليات',
            items: [
                { to: '/catering', icon: Utensils, label: 'الإعاشة' },
                { to: '/assets', icon: Wrench, label: 'الأصول والصيانة' },
                { to: '/inventory', icon: Package, label: 'المخزون والكسوة' },
            ]
        },
        {
            title: 'الذكاء والتنبؤ',
            items: [
                { to: '/pulse', icon: Activity, label: 'نبض المركز' },
                { to: '/alerts', icon: Bell, label: 'التنبيهات الذكية' },
                { to: '/wisdom', icon: Brain, label: 'الحكمة الحية' },
            ]
        },
        {
            title: 'التقارير',
            items: [
                { to: '/reports', icon: BarChart3, label: 'التقارير' },
            ]
        },
        {
            title: 'الإدارة',
            items: [
                { to: '/org-structure', icon: Network, label: 'الهيكل التنظيمي' },
                { to: '/staff', icon: Users, label: 'الموظفون' },
                { to: '/permissions', icon: Settings, label: 'الصلاحيات' },
            ]
        }
    ];

    const toggleSection = (title: string) => {
        setExpandedSections(prev =>
            prev.includes(title)
                ? prev.filter(s => s !== title)
                : [...prev, title]
        );
    };

    const handleNavClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarClasses = isMobile
        ? `sidebar-drawer ${isOpen ? 'open' : ''}`
        : 'w-[300px] text-white flex flex-col h-screen border-l-4 border-[rgb(245,150,30)] shadow-xl flex-shrink-0 bg-[rgb(20,65,90)] desktop-only';

    return (
        <>
            {/* Overlay for mobile */}
            {isMobile && (
                <div
                    className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses} dir="rtl">
                {/* Header with colored frame: Orange border, Teal accent */}
                <div className="p-5 border-b-2 border-[rgb(245,150,30)] flex items-center justify-between bg-[rgb(10,45,65)]">
                    <div className="flex items-center gap-4">
                        {/* HRSD Official Logo - Larger size */}
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 border-2 border-[rgb(45,180,115)]">
                            <img
                                src="/assets/hrsd-logo.png"
                                alt="شعار وزارة الموارد البشرية"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-[rgb(250,180,20)]">مركز التأهيل الشامل بالباحة</h1>
                            <p className="text-[rgb(45,180,115)] text-sm mt-1 font-semibold">وزارة الموارد البشرية والتنمية الاجتماعية</p>
                        </div>
                    </div>

                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="إغلاق القائمة"
                        >
                            <X className="w-6 h-6 text-[rgb(250,180,20)]" />
                        </button>
                    )}
                </div>

                {/* User Quick Actions (Mobile) */}
                {isMobile && (
                    <div className="p-4 border-b border-white/10 bg-hrsd-navy-dark/50">
                        <div className="flex items-center justify-around">
                            <NavLink
                                to="/dashboard"
                                onClick={handleNavClick}
                                className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Home className="w-5 h-5 text-hrsd-gold" />
                                <span className="text-[10px] text-white/80">الرئيسية</span>
                            </NavLink>
                            <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5 text-white" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-hrsd-orange rounded-full"></span>
                                <span className="text-[10px] text-white/80">الإشعارات</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <LogOut className="w-5 h-5 text-white" />
                                <span className="text-[10px] text-white/80">خروج</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-3 overflow-y-auto hrsd-scrollbar">
                    {navSections.map((section, idx) => (
                        <div key={section.title} className="mb-3">
                            {/* Section Header */}
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-hrsd-gold/80 uppercase tracking-wider hover:text-hrsd-gold transition-colors"
                            >
                                <span>{section.title}</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedSections.includes(section.title) ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Section Items */}
                            {expandedSections.includes(section.title) && (
                                <div className="space-y-1 mt-1">
                                    {section.items.map((item) => (
                                        <div key={item.to}>
                                            <NavLink
                                                to={item.to}
                                                onClick={handleNavClick}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium group ${isActive
                                                        ? 'bg-hrsd-teal text-white shadow-md'
                                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-hrsd-gold' : 'text-gray-400 group-hover:text-white'
                                                            }`} />
                                                        <span>{item.label}</span>
                                                        {item.badge && (
                                                            <span className="mr-auto bg-hrsd-orange text-white text-xs px-2 py-0.5 rounded-full">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                        {item.children && (
                                                            <ChevronDown className="w-3 h-3 mr-auto text-gray-400" />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                            {/* Sub-items */}
                                            {item.children && (
                                                <div className="mr-6 mt-1 space-y-1 border-r-2 border-hrsd-teal/30 pr-2">
                                                    {item.children.map((child) => (
                                                        <NavLink
                                                            key={child.to}
                                                            to={child.to}
                                                            onClick={handleNavClick}
                                                            className={({ isActive }) =>
                                                                `block px-3 py-1.5 rounded-lg text-xs transition-all ${isActive
                                                                    ? 'bg-hrsd-teal/20 text-hrsd-gold'
                                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                                }`
                                                            }
                                                        >
                                                            {child.label}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Settings */}
                <div className="p-3 border-t border-white/10 bg-hrsd-navy-dark/50">
                    <NavLink
                        to="/settings"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium group ${isActive
                                ? 'bg-hrsd-teal text-white shadow-md'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Settings className={`w-4 h-4 transition-colors ${isActive ? 'text-hrsd-gold' : 'text-gray-400 group-hover:text-white'
                                    }`} />
                                <span>الإعدادات</span>
                            </>
                        )}
                    </NavLink>
                </div>

                {/* Footer Cleanup (Phase 0.1) */}
                <div className="p-4 border-t-2 border-[rgb(245,150,30)] bg-[rgb(10,45,65)] flex flex-col items-center gap-3">
                    <p className="text-white/60 text-xs text-center">
                        نظام بصيرة - وزارة الموارد البشرية والتنمية الاجتماعية
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
