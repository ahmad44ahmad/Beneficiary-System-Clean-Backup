import React from 'react';
import { Bell, User, Menu, Eye, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandMenu } from '../ui/CommandMenu';
import { useUserStore } from '../../stores/useUserStore';
import { useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useViewModeStore, type Persona, PERSONA_META, isAggregatePersona } from '../../stores/useViewModeStore';
import { useTheme } from '../../config/theme';

interface HeaderProps {
    onMenuClick?: () => void;
}

// Page titles mapping
const pageTitles: Record<string, string> = {
    '/dashboard': 'لوحة القيادة',
    '/beneficiaries': 'المستفيدين',
    '/medical': 'القسم الطبي',
    '/social': 'الخدمات الاجتماعية',
    '/daily-follow-up': 'المتابعة اليومية',
    '/inventory': 'المستودع',
    '/clothing': 'الكسوة',
    '/training': 'التأهيل والتدريب',
    '/support': 'الخدمات المساندة',
    '/quality': 'الجودة',
    '/secretariat': 'السكرتارية',
    '/structure': 'الهيكل الإداري',
    '/basira': 'مشروع بصيرة',
    '/settings': 'الإعدادات',
    '/reports': 'التقارير',
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const currentUser = useUserStore(s => s.currentUser);
    const location = useLocation();
    const { currentView, setView } = useViewModeStore(useShallow(s => ({ currentView: s.currentView, setView: s.setView })));
    const { isDark, toggleTheme } = useTheme();

    // Get current page title
    const getPageTitle = () => {
        const path = location.pathname;
        // Check exact match first
        if (pageTitles[path]) return pageTitles[path];
        // Check if path starts with any known path
        for (const [key, value] of Object.entries(pageTitles)) {
            if (path.startsWith(key)) return value;
        }
        return 'مركز التأهيل الشامل بالباحة';
    };

    return (
        <header className="h-16 bg-gradient-to-l from-hrsd-navy to-hrsd-navy-dark border-b border-hrsd-teal/20 px-4 md:px-6 sticky top-0 z-30 flex items-center justify-between shadow-md" dir="rtl">

            {/* Mobile: Menu Button + Title */}
            <div className="flex items-center gap-3 md:hidden">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="فتح القائمة"
                >
                    <Menu className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-2">
                    <img
                        src="/assets/organization-logo.jpg"
                        alt="شعار المركز"
                        className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
                    />
                    <span className="font-bold text-white text-sm">{getPageTitle()}</span>
                </div>
            </div>

            {/* Desktop: HRSD ministry logo + Command Menu Search.
              * Per brand book, the ministry logo must appear unaltered on
              * Arabic content surfaces. On desktop it sits at the start of
              * the header (RTL: right edge after the sidebar). */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl">
                <img
                    src="/assets/hrsd-logo.png"
                    alt="شعار وزارة الموارد البشرية والتنمية الاجتماعية"
                    className="h-8 w-auto bg-white rounded p-1 flex-shrink-0"
                    title="وزارة الموارد البشرية والتنمية الاجتماعية"
                />
                <div className="h-7 w-px bg-white/15" aria-hidden="true" />
                <CommandMenu />
            </div>

            {/* Persona Switcher — surfaces the brand level (formal/default)
              * derived from the persona's scope. Aggregate-scope personas
              * (Wakeel, Branch GM) inherit Formal level; operational personas
              * (Dept Head, Staff) inherit Default. */}
            <div className="hidden lg:flex items-center gap-2">
                <div className="relative group">
                    <select
                        value={currentView}
                        onChange={(e) => setView(e.target.value as Persona)}
                        className="appearance-none bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg ps-8 pe-4 py-1.5 text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-hrsd-gold/50"
                        title="تغيير الشخصية"
                    >
                        <option value="WAKEEL" className="text-gray-900">{PERSONA_META.WAKEEL.canonical}</option>
                        <option value="BRANCH_GM" className="text-gray-900">{PERSONA_META.BRANCH_GM.canonical}</option>
                        <option value="DEPARTMENT_HEAD" className="text-gray-900">{PERSONA_META.DEPARTMENT_HEAD.canonical}</option>
                        <option value="STAFF" className="text-gray-900">{PERSONA_META.STAFF.canonical}</option>
                    </select>
                    <div className="absolute start-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Eye className="w-3.5 h-3.5 text-hrsd-gold" />
                    </div>
                </div>
                <span
                    className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded border border-white/20 text-white/70 select-none"
                    title="مستوى العرض المُشتق من نطاق الشخصية"
                >
                    {isAggregatePersona(currentView) ? 'المستوى: رسمي' : 'المستوى: افتراضي'}
                </span>
            </div>

            {/* Theme Toggle + Notifications + User */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="hover:bg-white/10 p-2"
                    title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
                >
                    {isDark ? (
                        <Sun className="w-5 h-5 text-hrsd-gold" />
                    ) : (
                        <Moon className="w-5 h-5 text-hrsd-gold" />
                    )}
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-white/10 p-2">
                    <Bell className="w-5 h-5 text-hrsd-gold" />
                </Button>

                {/* User Info */}
                <div className="flex items-center gap-3 pe-2 md:pe-4 md:border-e border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-hrsd-gold leading-tight drop-shadow-md">{currentUser?.name || 'مستخدم'}</p>
                        <p className="text-xs text-hrsd-green font-medium">{currentUser?.role || 'موظف'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-hrsd-gold to-hrsd-orange rounded-xl flex items-center justify-center text-white border border-white/20 shadow-md">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
