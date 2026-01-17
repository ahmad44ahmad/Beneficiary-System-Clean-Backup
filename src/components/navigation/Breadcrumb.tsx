// src/components/navigation/Breadcrumb.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// خريطة المسارات للعناوين العربية
const pathToTitle: Record<string, string> = {
    '/dashboard': 'لوحة القيادة',
    '/beneficiaries': 'المستفيدين',
    '/beneficiaries-list': 'قائمة المستفيدين',
    '/grc': 'الحوكمة والمخاطر',
    '/quality': 'دليل الجودة',
    '/quality/manual': 'دليل الجودة',
    '/emergency': 'الطوارئ',
    '/medication-admin': 'إدارة الأدوية',
    '/smart-alerts': 'التنبيهات الذكية',
    '/scheduling': 'المواعيد',
    '/medical-records': 'السجلات الطبية',
    '/catering': 'الإعاشة',
    '/operations-maintenance': 'الصيانة والتشغيل',
    '/strategic-kpis': 'المؤشرات الاستراتيجية',
    '/family-portal': 'بوابة الأسرة',
    '/empowerment': 'التمكين',
    '/ipc': 'مكافحة العدوى',
    '/social': 'الخدمات الاجتماعية',
    '/safety': 'السلامة',
    '/daily-care': 'الرعاية اليومية',
    '/reports': 'التقارير',
    '/settings': 'الإعدادات',
};

interface BreadcrumbProps {
    className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        return {
            path,
            label: pathToTitle[path] || segment.replace(/-/g, ' '),
        };
    });

    // Don't show breadcrumb on dashboard (home page)
    if (breadcrumbs.length === 0 || location.pathname === '/dashboard') {
        return null;
    }

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('mb-4', className)}
            dir="rtl"
        >
            <ol className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                {/* الرئيسية (Home) */}
                <li>
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">الرئيسية</span>
                    </Link>
                </li>

                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        <li className="text-gray-600">
                            <ChevronLeft className="w-4 h-4" />
                        </li>
                        <li>
                            {index === breadcrumbs.length - 1 ? (
                                // Current page (not a link)
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-white font-medium"
                                >
                                    {crumb.label}
                                </motion.span>
                            ) : (
                                // Parent page (clickable link)
                                <Link
                                    to={crumb.path}
                                    className="hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
