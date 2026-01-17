// ═══════════════════════════════════════════════════════════════════════════
// AuditLogViewer - View and export audit logs for ministry compliance
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, Search, Filter, Calendar, User, Activity,
    Download, FileSpreadsheet, Printer, ChevronDown, ChevronUp,
    AlertCircle, CheckCircle, XCircle, Shield, Clock, Eye
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { usePrint } from '../../hooks/usePrint';
import { useExport } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { NoData } from '../common/EmptyState';

// Audit log entry type
interface AuditLogEntry {
    id: string;
    timestamp: string;
    user_id: string;
    user_name: string;
    user_role: string;
    action: string;
    module: string;
    resource_id?: string;
    resource_type?: string;
    description: string;
    success: boolean;
    error_message?: string;
}

// Action to Arabic labels
const ACTION_LABELS: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    create: { label: 'إنشاء', color: 'text-green-600 bg-green-100', icon: CheckCircle },
    read: { label: 'عرض', color: 'text-blue-600 bg-blue-100', icon: Eye },
    update: { label: 'تحديث', color: 'text-amber-600 bg-amber-100', icon: Activity },
    delete: { label: 'حذف', color: 'text-red-600 bg-red-100', icon: XCircle },
    login: { label: 'دخول', color: 'text-emerald-600 bg-emerald-100', icon: User },
    logout: { label: 'خروج', color: 'text-gray-600 bg-gray-100', icon: User },
    export: { label: 'تصدير', color: 'text-purple-600 bg-purple-100', icon: Download },
    print: { label: 'طباعة', color: 'text-indigo-600 bg-indigo-100', icon: Printer },
    approve: { label: 'موافقة', color: 'text-green-600 bg-green-100', icon: CheckCircle },
    reject: { label: 'رفض', color: 'text-red-600 bg-red-100', icon: XCircle },
};

// Module labels
const MODULE_LABELS: Record<string, string> = {
    beneficiaries: 'المستفيدين',
    medical: 'الرعاية الطبية',
    social: 'الخدمات الاجتماعية',
    catering: 'الإعاشة',
    operations: 'التشغيل والصيانة',
    grc: 'الحوكمة والمخاطر',
    quality: 'الجودة',
    system: 'النظام',
};

// Demo audit logs for when no database connection
const DEMO_LOGS: AuditLogEntry[] = [
    {
        id: '1',
        timestamp: new Date().toISOString(),
        user_id: 'demo-user-1',
        user_name: 'أحمد محمد المنصوري',
        user_role: 'admin',
        action: 'create',
        module: 'beneficiaries',
        resource_id: 'ben-001',
        resource_type: 'beneficiary',
        description: 'إضافة مستفيد جديد: محمد أحمد العلي',
        success: true
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user_id: 'demo-user-2',
        user_name: 'سارة عبدالله الغامدي',
        user_role: 'nurse',
        action: 'update',
        module: 'medical',
        resource_id: 'med-profile-123',
        resource_type: 'medical_profile',
        description: 'تحديث السجل الطبي للمستفيد',
        success: true
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user_id: 'demo-user-1',
        user_name: 'أحمد محمد المنصوري',
        user_role: 'admin',
        action: 'export',
        module: 'beneficiaries',
        description: 'تصدير قائمة المستفيدين إلى Excel',
        success: true
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        user_id: 'demo-user-3',
        user_name: 'خالد سعد القحطاني',
        user_role: 'specialist',
        action: 'approve',
        module: 'grc',
        resource_id: 'risk-001',
        resource_type: 'risk_assessment',
        description: 'الموافقة على تقييم المخاطر السريرية',
        success: true
    }
];

export const AuditLogViewer: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState<string>('all');
    const [filterAction, setFilterAction] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [usingDemo, setUsingDemo] = useState(false);

    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, isExporting } = useExport();
    const { showToast } = useToast();

    // Fetch audit logs
    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            if (!supabase) {
                setLogs(DEMO_LOGS);
                setUsingDemo(true);
                return;
            }

            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(500);

            if (error) {
                console.log('[AuditLogViewer] Using demo data:', error.message);
                setLogs(DEMO_LOGS);
                setUsingDemo(true);
                return;
            }

            setLogs(data || DEMO_LOGS);
            setUsingDemo(!data || data.length === 0);
        } catch (err) {
            console.error('[AuditLogViewer] Error:', err);
            setLogs(DEMO_LOGS);
            setUsingDemo(true);
        } finally {
            setLoading(false);
        }
    };

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.description.includes(searchTerm) ||
            log.user_name.includes(searchTerm) ||
            (log.resource_id || '').includes(searchTerm);
        const matchesModule = filterModule === 'all' || log.module === filterModule;
        const matchesAction = filterAction === 'all' || log.action === filterAction;

        let matchesDate = true;
        if (dateFrom) {
            matchesDate = matchesDate && new Date(log.timestamp) >= new Date(dateFrom);
        }
        if (dateTo) {
            matchesDate = matchesDate && new Date(log.timestamp) <= new Date(dateTo + 'T23:59:59');
        }

        return matchesSearch && matchesModule && matchesAction && matchesDate;
    });

    // Export columns
    const EXPORT_COLUMNS = [
        { key: 'timestamp', header: 'التاريخ والوقت' },
        { key: 'user_name', header: 'المستخدم' },
        { key: 'user_role', header: 'الدور' },
        { key: 'action', header: 'الإجراء' },
        { key: 'module', header: 'الوحدة' },
        { key: 'description', header: 'الوصف' },
        { key: 'success', header: 'النتيجة' }
    ];

    const handleExport = () => {
        if (filteredLogs.length === 0) {
            showToast('لا توجد سجلات للتصدير', 'error');
            return;
        }
        const exportData = filteredLogs.map(log => ({
            ...log,
            action: ACTION_LABELS[log.action]?.label || log.action,
            module: MODULE_LABELS[log.module] || log.module,
            success: log.success ? 'نجاح' : 'فشل',
            timestamp: new Date(log.timestamp).toLocaleString('ar-SA')
        }));
        exportToExcel(exportData, EXPORT_COLUMNS, { filename: 'سجل_التدقيق' });
        showToast(`تم تصدير ${filteredLogs.length} سجل`, 'success');
    };

    const handlePrint = () => {
        if (filteredLogs.length === 0) {
            showToast('لا توجد سجلات للطباعة', 'error');
            return;
        }
        const printData = filteredLogs.map(log => ({
            ...log,
            action: ACTION_LABELS[log.action]?.label || log.action,
            module: MODULE_LABELS[log.module] || log.module,
            success: log.success ? 'نجاح' : 'فشل',
            timestamp: new Date(log.timestamp).toLocaleString('ar-SA')
        }));
        printTable(printData, EXPORT_COLUMNS, {
            title: 'سجل التدقيق - BASIRA System',
            subtitle: `تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}`
        });
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('ar-SA'),
            time: date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) {
        return <LoadingSpinner fullScreen message="جاري تحميل سجل التدقيق..." />;
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-hrsd-primary flex items-center gap-3">
                        <Shield className="w-7 h-7" />
                        سجل التدقيق والمراجعة
                    </h1>
                    <p className="text-gray-500 mt-1">
                        تتبع جميع العمليات والإجراءات في النظام للامتثال والمساءلة
                    </p>
                    {usingDemo && (
                        <p className="text-amber-600 text-sm mt-1">⚠️ بيانات تجريبية - لا يوجد اتصال بقاعدة البيانات</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        disabled={isExporting || filteredLogs.length === 0}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center gap-2 disabled:opacity-50"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                        تصدير Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting || filteredLogs.length === 0}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Printer className="w-5 h-5" />
                        طباعة
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative lg:col-span-2">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="البحث بالوصف أو اسم المستخدم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary focus:border-transparent"
                    />
                </div>

                {/* Module Filter */}
                <select
                    value={filterModule}
                    onChange={(e) => setFilterModule(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary"
                >
                    <option value="all">جميع الوحدات</option>
                    {Object.entries(MODULE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                {/* Action Filter */}
                <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hrsd-primary"
                >
                    <option value="all">جميع الإجراءات</option>
                    {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                {/* Date Range */}
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="من"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="إلى"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-blue-600">{filteredLogs.length}</p>
                    <p className="text-sm text-gray-500">إجمالي السجلات</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-green-600">
                        {filteredLogs.filter(l => l.success).length}
                    </p>
                    <p className="text-sm text-gray-500">عمليات ناجحة</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-red-600">
                        {filteredLogs.filter(l => !l.success).length}
                    </p>
                    <p className="text-sm text-gray-500">عمليات فاشلة</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center">
                    <p className="text-2xl font-bold text-amber-600">
                        {new Set(filteredLogs.map(l => l.user_id)).size}
                    </p>
                    <p className="text-sm text-gray-500">مستخدمين نشطين</p>
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {filteredLogs.length === 0 ? (
                    <NoData title="لا توجد سجلات تدقيق" />
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredLogs.slice(0, 50).map((log) => {
                            const { date, time } = formatTimestamp(log.timestamp);
                            const actionConfig = ACTION_LABELS[log.action] || { label: log.action, color: 'text-gray-600 bg-gray-100', icon: Activity };
                            const ActionIcon = actionConfig.icon;
                            const isExpanded = expandedId === log.id;

                            return (
                                <motion.div
                                    key={log.id}
                                    className="p-4 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Action Icon */}
                                        <div className={`p-2 rounded-lg ${actionConfig.color}`}>
                                            <ActionIcon className="w-5 h-5" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium text-gray-800">{log.description}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{date} - {time}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <User className="w-4 h-4" />
                                                    {log.user_name}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${actionConfig.color}`}>
                                                    {actionConfig.label}
                                                </span>
                                                <span className="text-gray-500">
                                                    {MODULE_LABELS[log.module] || log.module}
                                                </span>
                                                {log.success ? (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <CheckCircle className="w-4 h-4" />
                                                        نجاح
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-600">
                                                        <XCircle className="w-4 h-4" />
                                                        فشل
                                                    </span>
                                                )}
                                            </div>

                                            {/* Expanded Details */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="mt-3 pt-3 border-t border-gray-100"
                                                    >
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-500">معرف المستخدم</p>
                                                                <p className="font-mono">{log.user_id}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">الدور</p>
                                                                <p>{log.user_role}</p>
                                                            </div>
                                                            {log.resource_id && (
                                                                <div>
                                                                    <p className="text-gray-500">معرف المورد</p>
                                                                    <p className="font-mono">{log.resource_id}</p>
                                                                </div>
                                                            )}
                                                            {log.resource_type && (
                                                                <div>
                                                                    <p className="text-gray-500">نوع المورد</p>
                                                                    <p>{log.resource_type}</p>
                                                                </div>
                                                            )}
                                                            {log.error_message && (
                                                                <div className="col-span-2">
                                                                    <p className="text-red-500">رسالة الخطأ</p>
                                                                    <p className="text-red-700">{log.error_message}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Expand Icon */}
                                        <div className="text-gray-400">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {filteredLogs.length > 50 && (
                    <div className="p-4 bg-gray-50 text-center text-gray-500">
                        عرض أول 50 سجل من أصل {filteredLogs.length}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogViewer;
