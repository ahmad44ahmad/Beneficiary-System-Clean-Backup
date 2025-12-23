import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUser } from '../../context/UserContext';

export const Header = () => {
    const { currentUser } = useUser();

    return (
        <header className="h-16 bg-gradient-to-r from-accent-teal to-primary border-b-4 border-secondary px-6 sticky top-0 z-10 flex items-center justify-between shadow-soft">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="بحث عام..."
                        className="w-full h-10 pr-10 pl-4 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative hover:bg-white/10 text-white">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Button>

                <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                    <div className="text-left hidden md:block">
                        <p className="text-base font-bold text-white leading-tight">{currentUser?.name}</p>
                        <p className="text-xs text-secondary-200 font-medium opacity-90">حساب تجريبي</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 shadow-sm backdrop-blur-sm">
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
