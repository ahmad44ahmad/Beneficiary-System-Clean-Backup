import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Users,
    Package,
    Activity,
    Settings,
    FileText,
    CheckCircle2,
    Network,
    Target,
    X,
    ChevronDown,
    Home,
    Bell,
    LogOut,
    Heart,
    Utensils,
    Wrench,
    BarChart3,
    Brain,
    Syringe,
    ClipboardList,
    Users2,
    TrendingUp,
    Scale,
    Award,
    Compass,
    LayoutDashboard,
} from 'lucide-react';
import { useViewModeStore, isAggregatePersona } from '../../stores/useViewModeStore';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

/**
 * Sidebar navigation — three-tier hierarchy.
 *
 *  Tier 1: section         (e.g. "الحوكمة والجودة")
 *  Tier 2: item or subgroup
 *    - item      = direct nav link (e.g. "الملف الطبي")
 *    - subgroup  = branch with its own child links (e.g. "الجودة والتدقيق" → [4 links])
 *  Tier 3: sub-link        (children of a subgroup)
 *
 * Sizing/spacing comes from CSS custom properties in hrsd-theme.css
 * (--nav-*). Every tier has deliberate breathing room — no crammed rows.
 */
type NavLeaf = {
    kind: 'link';
    to: string;
    icon: React.ElementType;
    label: string;
    badge?: number;
};

type NavBranch = {
    kind: 'subgroup';
    label: string;
    icon: React.ElementType;
    defaultExpanded?: boolean;
    children: Array<{ to: string; label: string; badge?: number }>;
};

type NavEntry = NavLeaf | NavBranch;

interface NavSection {
    title: string;
    entries: NavEntry[];
}

/**
 * Aggregate personas (Wakeel, Branch GM) see only one nav item — the
 * leadership dashboard. They don't navigate operational surfaces.
 * Defined as a top-level constant so the structure stays static and
 * the only thing that varies is which array gets rendered.
 */
const AGGREGATE_NAV_SECTIONS: NavSection[] = [
    {
        title: 'عرض القيادات',
        entries: [
            { kind: 'link', to: '/aggregate', icon: LayoutDashboard, label: 'لوحة القيادة الإشرافية' },
        ],
    },
];

const NAV_SECTIONS: NavSection[] = [
    {
        title: 'الرئيسية',
        entries: [
            { kind: 'link', to: '/', icon: Home, label: 'الرئيسية' },
            { kind: 'link', to: '/beneficiaries', icon: Users, label: 'المستفيدون' },
        ],
    },
    {
        title: 'الخدمات الطبية',
        entries: [
            { kind: 'link', to: '/medical', icon: Heart, label: 'الملف الطبي' },
            { kind: 'link', to: '/daily-care', icon: ClipboardList, label: 'المتابعة اليومية' },
            { kind: 'link', to: '/medications', icon: Syringe, label: 'الأدوية' },
        ],
    },
    {
        title: 'الخدمات الاجتماعية',
        entries: [
            { kind: 'link', to: '/dignity', icon: Heart, label: 'ملف الكرامة' },
            { kind: 'link', to: '/empowerment', icon: Target, label: 'محرك التمكين' },
            { kind: 'link', to: '/family-portal', icon: Users2, label: 'بوابة الأسرة' },
            { kind: 'link', to: '/social-research', icon: FileText, label: 'البحث الاجتماعي' },
        ],
    },
    {
        // Was 10 flat items — broken into 4 branches for clarity.
        // Each sub-branch reads as important, not cramped.
        title: 'الحوكمة والجودة',
        entries: [
            {
                kind: 'subgroup',
                label: 'الحوكمة',
                icon: Network,
                defaultExpanded: true,
                children: [
                    { to: '/governance', label: 'الخيط الذهبي (الحوكمة)' },
                ],
            },
            {
                kind: 'subgroup',
                label: 'المخاطر والامتثال',
                icon: Scale,
                children: [
                    { to: '/risks', label: 'سجل المخاطر' },
                    { to: '/ipc', label: 'درع السلامة (IPC)' },
                    { to: '/compliance', label: 'الامتثال ISO' },
                ],
            },
            {
                kind: 'subgroup',
                label: 'الجودة والتدقيق',
                icon: CheckCircle2,
                children: [
                    { to: '/quality/manual', label: 'دليل الجودة ISO' },
                    { to: '/quality/ncr-capa', label: 'سجل NCR/CAPA', badge: 3 },
                    { to: '/quality/audit', label: 'التدقيق الداخلي' },
                    { to: '/quality', label: 'لوحة الجودة' },
                ],
            },
            {
                kind: 'subgroup',
                label: 'التميز والمؤشرات',
                icon: Award,
                children: [
                    { to: '/grc/excellence', label: 'مركز التميز' },
                    { to: '/indicators/strategic', label: 'المؤشرات الاستراتيجية' },
                    { to: '/legal-shield', label: 'الدرع القانوني' },
                ],
            },
        ],
    },
    {
        title: 'العمليات',
        entries: [
            { kind: 'link', to: '/operations', icon: Settings, label: 'لوحة التشغيل' },
            { kind: 'link', to: '/catering', icon: Utensils, label: 'الإعاشة' },
            { kind: 'link', to: '/assets', icon: Wrench, label: 'الأصول والصيانة' },
            { kind: 'link', to: '/clothing', icon: Package, label: 'المخزون والكسوة' },
        ],
    },
    {
        title: 'الذكاء والتنبؤ',
        entries: [
            { kind: 'link', to: '/pulse', icon: Activity, label: 'نبض المركز' },
            { kind: 'link', to: '/alerts', icon: Bell, label: 'التنبيهات الذكية' },
            { kind: 'link', to: '/knowledge', icon: Brain, label: 'المكتبة الرقمية' },
        ],
    },
    {
        title: 'التقارير',
        entries: [
            { kind: 'link', to: '/reports', icon: BarChart3, label: 'التقارير' },
            { kind: 'link', to: '/sroi', icon: TrendingUp, label: 'العائد الاجتماعي (SROI)' },
        ],
    },
    {
        title: 'القيادة الاستراتيجيّة',
        entries: [
            { kind: 'link', to: '/leadership-compass', icon: Compass, label: 'بوصلة القيادة' },
        ],
    },
    {
        title: 'الإدارة',
        entries: [
            { kind: 'link', to: '/org-structure', icon: Network, label: 'الهيكل التنظيمي' },
            { kind: 'link', to: '/staff', icon: Users, label: 'الموظفون' },
            { kind: 'link', to: '/permissions', icon: Settings, label: 'الصلاحيات' },
        ],
    },
];

const LINK_BASE =
    'flex items-center rounded-xl transition-all group text-gray-200 hover:text-white hover:bg-white/5';
const LINK_ACTIVE = 'bg-hrsd-teal text-white shadow-md';

const NavLinkRow: React.FC<{
    to: string;
    icon?: React.ElementType;
    label: string;
    badge?: number;
    tier: 'item' | 'sub-link';
    onClick?: () => void;
}> = ({ to, icon: Icon, label, badge, tier, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        data-nav-tier={tier}
        className={({ isActive }) =>
            `${LINK_BASE} ${tier === 'sub-link' ? 'gap-2.5 ps-3 pe-3' : ''} ${
                isActive ? `${LINK_ACTIVE} is-active` : ''
            }`
        }
    >
        {({ isActive }) => (
            <>
                {Icon && (
                    <Icon
                        className={`shrink-0 transition-colors ${
                            tier === 'sub-link' ? 'w-4 h-4' : 'w-5 h-5'
                        } ${isActive ? 'text-hrsd-gold' : 'text-gray-300 group-hover:text-white'}`}
                    />
                )}
                <span className="leading-snug">{label}</span>
                {badge !== undefined && (
                    <span className="ms-auto bg-hrsd-orange text-white text-[11px] font-bold px-2 py-0.5 rounded-full leading-none">
                        {badge}
                    </span>
                )}
            </>
        )}
    </NavLink>
);

const SubgroupBranch: React.FC<{
    branch: NavBranch;
    onNavClick?: () => void;
}> = ({ branch, onNavClick }) => {
    const [open, setOpen] = useState<boolean>(branch.defaultExpanded ?? false);
    const Icon = branch.icon;
    return (
        <div className="mb-1">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                data-nav-tier="subgroup"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-200 hover:text-white hover:bg-white/5 transition-colors"
                aria-expanded={open}
            >
                <Icon className="w-4 h-4 text-hrsd-gold/80 shrink-0" />
                <span className="flex-1 text-start">{branch.label}</span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <div className="nav-tree-guide mt-1.5 space-y-1">
                    {branch.children.map((child) => (
                        <NavLinkRow
                            key={child.to}
                            to={child.to}
                            label={child.label}
                            badge={child.badge}
                            tier="sub-link"
                            onClick={onNavClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose, isMobile = false }) => {
    const persona = useViewModeStore(s => s.currentView);
    const sections = isAggregatePersona(persona) ? AGGREGATE_NAV_SECTIONS : NAV_SECTIONS;

    const [expandedSections, setExpandedSections] = useState<string[]>(
        NAV_SECTIONS.map((s) => s.title), // all expanded by default; collapsing is user choice
    );

    const toggleSection = (title: string) => {
        setExpandedSections((prev) =>
            prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title],
        );
    };

    const handleNavClick = () => {
        if (isMobile && onClose) onClose();
    };

    const sidebarClasses = isMobile
        ? `sidebar-drawer ${isOpen ? 'open' : ''}`
        : 'w-[320px] text-white flex flex-col h-screen border-s-4 border-hrsd-orange shadow-xl flex-shrink-0 bg-hrsd-navy desktop-only';

    return (
        <>
            {isMobile && (
                <div
                    className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses} dir="rtl">
                {/* Header */}
                <div className="p-5 border-b-2 border-hrsd-orange flex items-center justify-between bg-hrsd-navy-dark">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 border-2 border-hrsd-green">
                            <img
                                src="/assets/hrsd-logo.png"
                                alt="شعار وزارة الموارد البشرية"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight text-white">
                                مركز التأهيل الشامل بالباحة
                            </h1>
                            <p
                                className="text-[13px] mt-1 font-semibold leading-snug"
                                style={{ color: 'var(--hrsd-green-light)' }}
                            >
                                وزارة الموارد البشرية والتنمية الاجتماعية
                            </p>
                        </div>
                    </div>

                    {isMobile && (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="إغلاق القائمة"
                        >
                            <X className="w-6 h-6 text-hrsd-gold" />
                        </button>
                    )}
                </div>

                {/* Mobile quick-actions row */}
                {isMobile && (
                    <div className="p-4 border-b border-white/10 bg-hrsd-navy-dark/50">
                        <div className="flex items-center justify-around">
                            <NavLink
                                to="/dashboard"
                                onClick={handleNavClick}
                                className="flex flex-col items-center gap-1.5 p-2.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Home className="w-5 h-5 text-hrsd-gold" />
                                <span className="text-[12px] text-white/80">الرئيسية</span>
                            </NavLink>
                            <button className="flex flex-col items-center gap-1.5 p-2.5 hover:bg-white/10 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5 text-white" />
                                <span className="absolute top-1 end-1 w-2 h-2 bg-hrsd-orange rounded-full"></span>
                                <span className="text-[12px] text-white/80">الإشعارات</span>
                            </button>
                            <button className="flex flex-col items-center gap-1.5 p-2.5 hover:bg-white/10 rounded-lg transition-colors">
                                <LogOut className="w-5 h-5 text-white" />
                                <span className="text-[12px] text-white/80">خروج</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation — spacious, hierarchical */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto hrsd-scrollbar">
                    {sections.map((section, idx) => {
                        const open = expandedSections.includes(section.title);
                        const isLast = idx === sections.length - 1;
                        return (
                            <div
                                key={section.title}
                                className={`${isLast ? '' : 'mb-5 pb-4 border-b border-white/10'}`}
                            >
                                {/* Tier-1 section header — sits proud, clearly a grouping not an item */}
                                <button
                                    type="button"
                                    onClick={() => toggleSection(section.title)}
                                    data-nav-tier="section"
                                    className="w-full flex items-center justify-between px-2 py-2 text-hrsd-gold hover:text-hrsd-gold-light transition-colors"
                                    aria-expanded={open}
                                >
                                    <span>{section.title}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-hrsd-gold/70 transition-transform ${
                                            open ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {open && (
                                    <div className="mt-2.5 space-y-1.5">
                                        {section.entries.map((entry) =>
                                            entry.kind === 'link' ? (
                                                <NavLinkRow
                                                    key={entry.to}
                                                    to={entry.to}
                                                    icon={entry.icon}
                                                    label={entry.label}
                                                    badge={entry.badge}
                                                    tier="item"
                                                    onClick={handleNavClick}
                                                />
                                            ) : (
                                                <SubgroupBranch
                                                    key={entry.label}
                                                    branch={entry}
                                                    onNavClick={handleNavClick}
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Settings */}
                <div className="p-3 border-t border-white/10 bg-hrsd-navy-dark/50">
                    <NavLinkRow
                        to="/settings"
                        icon={Settings}
                        label="الإعدادات"
                        tier="item"
                        onClick={handleNavClick}
                    />
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t-2 border-hrsd-orange bg-hrsd-navy-dark flex flex-col items-center gap-2">
                    <p className="text-white/70 text-[12px] text-center leading-snug">
                        نظام بصيرة — وزارة الموارد البشرية والتنمية الاجتماعية
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
