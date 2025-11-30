import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export const Header = () => {
    const { currentUser } = useApp();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-64 left-0 z-10">
            <div className="flex items-center gap-4 w-96">
                <div className="relative w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="بحث عام..."
                        className="w-full h-9 pr-9 pl-4 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative">
                    <Bell className="w-5 h-5 text-gray-600 hover:text-primary transition-colors" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                        <p className="text-xs text-primary-600 capitalize font-medium">{currentUser?.role}</p>
                    </div>
                    <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center text-primary border border-primary-100">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};
