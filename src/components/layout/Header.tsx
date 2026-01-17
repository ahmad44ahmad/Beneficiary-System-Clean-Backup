import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandMenu } from '../ui/CommandMenu';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

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
    const { currentUser } = useUser();
    const location = useLocation();

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

            {/* Desktop: Command Menu Search */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md">
                <CommandMenu />
            </div>

            {/* Notifications + User */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:bg-white/10 p-2">
                    <Bell className="w-5 h-5 text-hrsd-gold" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-hrsd-orange rounded-full border-2 border-hrsd-navy animate-pulse"></span>
                </Button>

                {/* User Info */}
                <div className="flex items-center gap-3 pr-2 md:pr-4 md:border-r border-white/10">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-hrsd-gold leading-tight drop-shadow-md">{currentUser?.name || 'مستخدم'}</p>
                        <p className="text-xs text-hrsd-green font-medium">حساب تجريبي</p>
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
