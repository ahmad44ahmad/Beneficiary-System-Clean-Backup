// CommandMenu - Ctrl+K shortcut for quick navigation
// A macOS Spotlight-style command palette

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnifiedData } from '../../context/UnifiedDataContext';
import {
    Search, Home, Users, Settings, Activity, FileText,
    Shield, Heart, Calendar, X, ArrowRight, Command,
    LayoutDashboard, ClipboardList, AlertTriangle,
    Stethoscope, Building2, BookOpen, PieChart
} from 'lucide-react';

interface CommandItem {
    id: string;
    label: string;
    labelEn: string;
    icon: React.ElementType;
    path: string;
    keywords: string[];
    category: 'main' | 'module' | 'tools' | 'settings';
}

// Quick navigation commands
const COMMANDS: CommandItem[] = [
    // Main
    { id: 'home', label: 'الرئيسية', labelEn: 'Home', icon: Home, path: '/', keywords: ['home', 'main', 'رئيسي'], category: 'main' },
    { id: 'dashboard', label: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard, path: '/executive', keywords: ['dashboard', 'لوحة'], category: 'main' },
    { id: 'beneficiaries', label: 'المستفيدون', labelEn: 'Beneficiaries', icon: Users, path: '/beneficiaries', keywords: ['beneficiaries', 'مستفيد'], category: 'main' },

    // Modules
    { id: 'medical', label: 'الملف الطبي', labelEn: 'Medical', icon: Stethoscope, path: '/medical', keywords: ['medical', 'طبي', 'صحة'], category: 'module' },
    { id: 'social', label: 'الاجتماعية', labelEn: 'Social', icon: Heart, path: '/social', keywords: ['social', 'اجتماعي'], category: 'module' },
    { id: 'quality', label: 'دليل الجودة', labelEn: 'Quality Manual', icon: BookOpen, path: '/quality/manual', keywords: ['quality', 'جودة'], category: 'module' },
    { id: 'grc', label: 'الحوكمة والمخاطر', labelEn: 'GRC', icon: Shield, path: '/grc', keywords: ['grc', 'risk', 'مخاطر', 'حوكمة'], category: 'module' },
    { id: 'safety', label: 'السلامة', labelEn: 'Safety', icon: AlertTriangle, path: '/safety/fall-risk', keywords: ['safety', 'سلامة', 'سقوط'], category: 'module' },
    { id: 'reports', label: 'التقارير', labelEn: 'Reports', icon: PieChart, path: '/reports', keywords: ['reports', 'تقارير'], category: 'module' },

    // Tools
    { id: 'schedule', label: 'الجداول', labelEn: 'Schedule', icon: Calendar, path: '/scheduling', keywords: ['schedule', 'جدول'], category: 'tools' },
    { id: 'operations', label: 'التشغيل', labelEn: 'Operations', icon: Building2, path: '/support', keywords: ['operations', 'تشغيل'], category: 'tools' },

    // Settings
    { id: 'settings', label: 'الإعدادات', labelEn: 'Settings', icon: Settings, path: '/settings', keywords: ['settings', 'إعدادات'], category: 'settings' },
];

export function CommandMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Dynamic data
    const { beneficiaries } = useUnifiedData();

    // Dynamically add beneficiaries to commands
    const dynamicCommands = [
        ...COMMANDS,
        ...(query ? beneficiaries
            .filter(b => b.fullName.includes(query) || b.id.includes(query))
            .map(b => ({
                id: `ben-${b.id}`,
                label: b.fullName,
                labelEn: b.id,
                icon: Users,
                path: `/beneficiaries/${b.id}`, // Assuming this route exists or opens modal
                keywords: [b.id, 'beneficiary', 'مستفيد'],
                category: 'main' as const
            })) : [])
    ];

    // Filter commands based on query
    const filteredCommands = query
        ? dynamicCommands.filter(cmd =>
            cmd.label.includes(query) ||
            cmd.labelEn.toLowerCase().includes(query.toLowerCase()) ||
            cmd.keywords.some(k => k.includes(query.toLowerCase()))
        )
        : COMMANDS;

    // Group by category
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    const categoryLabels: Record<string, string> = {
        main: 'رئيسي',
        module: 'الوحدات',
        tools: 'الأدوات',
        settings: 'الإعدادات',
    };

    // Keyboard shortcuts
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Open with Ctrl/Cmd + K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }

        // Close with Escape
        if (e.key === 'Escape') {
            setIsOpen(false);
        }

        if (!isOpen) return;

        // Navigate with arrows
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        }

        // Select with Enter
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            navigate(filteredCommands[selectedIndex].path);
            setIsOpen(false);
            setQuery('');
        }
    }, [isOpen, filteredCommands, selectedIndex, navigate]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = (path: string) => {
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 transition-all"
                title="البحث السريع (Ctrl+K)"
            >
                <Search className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">بحث...</span>
                <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded text-xs">
                    <Command className="w-3 h-3" />K
                </kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Command palette */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            dir="rtl"
                        >
                            {/* Search input */}
                            <div className="flex items-center gap-3 p-4 border-b border-white/10">
                                <Search className="w-5 h-5 text-gray-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="ابحث أو اذهب إلى..."
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-80 overflow-y-auto p-2">
                                {Object.entries(groupedCommands).map(([category, commands]) => (
                                    <div key={category} className="mb-4">
                                        <div className="px-3 py-1 text-xs text-gray-500 uppercase tracking-wide">
                                            {categoryLabels[category]}
                                        </div>
                                        {commands.map((cmd, idx) => {
                                            const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                                            const Icon = cmd.icon;
                                            return (
                                                <button
                                                    key={cmd.id}
                                                    onClick={() => handleSelect(cmd.path)}
                                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${globalIndex === selectedIndex
                                                        ? 'bg-teal-500/20 text-white'
                                                        : 'text-gray-400 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="flex-1 text-right">{cmd.label}</span>
                                                    <ArrowRight className="w-4 h-4 opacity-50" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}

                                {filteredCommands.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>لا توجد نتائج</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/5 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                                    <span>للتنقل</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Enter</kbd>
                                    <span>للاختيار</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd>
                                    <span>للإغلاق</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
