import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, RefreshCw, Grid, List,
    ChevronLeft, Activity, Printer, Download,
    FileSpreadsheet, ChevronDown, CheckSquare,
    Search, Archive, Trash, X
} from 'lucide-react';
import { supabase } from '../../config/supabase';
import { BeneficiaryCard } from './BeneficiaryCard';
import { BeneficiaryFilters, FilterState } from './BeneficiaryFilters';
import { SkeletonCard, SkeletonStatCard } from '../ui/Skeleton';
import { usePrint } from '../../hooks/usePrint';
import { useExport, BENEFICIARY_COLUMNS } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';
import { useAdvancedSearch } from '../../hooks/useAdvancedSearch';
import { useBatchOperations } from '../../hooks/useBatchOperations';
import { useAudit } from '../../hooks/useAudit';

interface Beneficiary {
    id: string;
    name: string;
    age: number;
    room: string;
    wing: string;
    admission_date: string;
    status: 'stable' | 'needs_attention' | 'critical';
    ipc_status: 'safe' | 'monitor' | 'alert';
    latest_goal?: string;
    avatar_url?: string;
    alerts?: string[]; // Alert tag IDs from domain-assets
}

export const BeneficiaryListPage: React.FC = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filters, setFilters] = useState<FilterState>({});

    // Hooks for print, export, and notifications
    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, exportToCsv, isExporting } = useExport();
    const { showToast } = useToast();

    // Advanced audit logging
    const { audit } = useAudit('beneficiaries');

    // Demo data for fallback
    const demoData: Beneficiary[] = [
        { id: '1', name: 'عبدالله محمد المالكي', age: 34, room: '101', wing: 'east', admission_date: '2024-01-15', status: 'stable', ipc_status: 'safe', latest_goal: 'تعلم الوضوء بشكل مستقل' },
        { id: '2', name: 'فاطمة أحمد الغامدي', age: 28, room: '102', wing: 'east', admission_date: '2024-02-20', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'المشاركة في الأنشطة الجماعية' },
        { id: '3', name: 'محمد علي الزهراني', age: 45, room: '105', wing: 'west', admission_date: '2023-06-10', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين مهارات التواصل' },
        { id: '4', name: 'نورة سعيد العمري', age: 31, room: '201', wing: 'north', admission_date: '2024-03-05', status: 'critical', ipc_status: 'alert', latest_goal: 'متابعة الحالة الصحية' },
        { id: '5', name: 'سعيد خالد القحطاني', age: 52, room: '202', wing: 'north', admission_date: '2023-09-12', status: 'stable', ipc_status: 'safe', latest_goal: 'الاعتماد على النفس في الأكل' },
        { id: '6', name: 'خالد عبدالله الشهري', age: 29, room: '301', wing: 'south', admission_date: '2024-01-28', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'تقليل السلوكيات العدوانية' },
        { id: '7', name: 'مريم ناصر البيشي', age: 35, room: '302', wing: 'south', admission_date: '2023-11-03', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين النوم الليلي' },
        { id: '8', name: 'أحمد يوسف الحارثي', age: 41, room: '103', wing: 'east', admission_date: '2024-04-10', status: 'stable', ipc_status: 'safe', latest_goal: 'المشي بدون مساعدة' },
        { id: '9', name: 'سارة محمد العتيبي', age: 26, room: '203', wing: 'north', admission_date: '2024-02-14', status: 'stable', ipc_status: 'safe', latest_goal: 'تعلم القراءة الأساسية' },
        { id: '10', name: 'علي حسن الدوسري', age: 38, room: '104', wing: 'east', admission_date: '2023-08-22', status: 'needs_attention', ipc_status: 'monitor', latest_goal: 'إدارة نوبات القلق' },
        { id: '11', name: 'هند عبدالرحمن السلمي', age: 33, room: '303', wing: 'south', admission_date: '2024-03-18', status: 'stable', ipc_status: 'safe', latest_goal: 'تحسين التفاعل الاجتماعي' },
        { id: '12', name: 'عمر فهد المطيري', age: 47, room: '106', wing: 'west', admission_date: '2023-05-07', status: 'stable', ipc_status: 'safe', latest_goal: 'الحفاظ على الوزن المثالي' },
    ];

    const calculateAge = (dateOfBirth: string | null): number => {
        if (!dateOfBirth) return 0;
        const today = new Date();
        const birth = new Date(dateOfBirth);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Use TanStack Query for data fetching with caching
    const { data: beneficiaries = [], isLoading, refetch } = useQuery<Beneficiary[]>({
        queryKey: ['beneficiaries', 'list'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('beneficiaries')
                .select('*')
                .order('full_name', { ascending: true });

            if (error || !data || data.length === 0) {
                return demoData;
            }

            // DEBUG: Log total count and first 3 records with their alerts field
            console.log('📊 [BeneficiaryListPage] Total records from Supabase:', data.length);
            const withAlerts = data.filter(b => b.alerts && Array.isArray(b.alerts) && b.alerts.length > 0);
            console.log('📊 [BeneficiaryListPage] Records with alerts:', withAlerts.length);
            if (withAlerts.length > 0) {
                console.log('📊 [BeneficiaryListPage] Sample alerts:', withAlerts.slice(0, 3).map(b => ({ name: b.full_name, alerts: b.alerts })));
            }
            if (data.length > 0) {
                console.log('📊 [BeneficiaryListPage] First record alerts field:', data[0].alerts, 'type:', typeof data[0].alerts);
            }

            return data.map(b => {
                return {
                    id: b.id,
                    name: b.full_name || b.name || 'غير معروف',
                    age: b.age || calculateAge(b.date_of_birth),
                    room: b.room_number || 'N/A',
                    wing: b.wing || 'east',
                    admission_date: b.admission_date || b.created_at,
                    status: b.health_status || 'stable',
                    ipc_status: b.ipc_status || 'safe',
                    latest_goal: b.latest_goal,
                    avatar_url: b.avatar_url,
                    alerts: b.alerts || []
                };
            });
        },
        staleTime: 0, // Force fresh data (alerts were added after initial cache)
        refetchOnMount: 'always',
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // Advanced Search with Multi-field Support
    // ═══════════════════════════════════════════════════════════════════════════
    const {
        query: searchQuery,
        setQuery: setSearchQuery,
        results: searchResults,
        isSearching,
        resultCount,
        hasActiveFilters: hasActiveSearch
    } = useAdvancedSearch(beneficiaries, {
        searchFields: ['name', 'id', 'room'],
        debounceMs: 300,
        caseSensitive: false
    });

    // Apply additional filters on top of search results
    const filteredBeneficiaries = useMemo(() => {
        let result = [...searchResults];

        // Apply dropdown filters
        if (filters.wing && filters.wing !== 'all') {
            result = result.filter(b => b.wing === filters.wing);
        }
        if (filters.health_status && filters.health_status !== 'all') {
            result = result.filter(b => b.status === filters.health_status);
        }
        if (filters.ipc_status && filters.ipc_status !== 'all') {
            result = result.filter(b => b.ipc_status === filters.ipc_status);
        }

        return result;
    }, [searchResults, filters]);

    // ═══════════════════════════════════════════════════════════════════════════
    // Batch Operations for Multi-select
    // ═══════════════════════════════════════════════════════════════════════════
    const {
        selectedIds,
        selectedItems,
        toggle: toggleSelect,
        selectAll,
        deselectAll,
        isSelected,
        selectionCount,
        isAllSelected,
        isPartiallySelected,
        executeAction,
        isExecuting
    } = useBatchOperations({
        data: filteredBeneficiaries,
        idField: 'id',
        module: 'beneficiaries',
        onExecute: async (action, items, payload) => {
            switch (action) {
                case 'archive':
                    await audit.update('batch', 'beneficiary', `أرشفة ${items.length} مستفيد`);
                    showToast(`تمت أرشفة ${items.length} مستفيد`, 'success');
                    break;
                case 'delete':
                    await audit.delete('batch', 'beneficiary', `حذف ${items.length} مستفيد`);
                    showToast(`تم حذف ${items.length} مستفيد`, 'success');
                    break;
                case 'export':
                    exportToExcel(items, BENEFICIARY_COLUMNS, { filename: 'المحددين' });
                    await audit.export(`تصدير ${items.length} مستفيد محدد`);
                    showToast(`تم تصدير ${items.length} مستفيد`, 'success');
                    break;
            }
        }
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    const getWingName = (wing: string) => {
        const wings: Record<string, string> = {
            east: 'الشرقي',
            west: 'الغربي',
            north: 'الشمالي',
            south: 'الجنوبي'
        };
        return wings[wing] || wing;
    };

    // Statistics
    const stats = {
        total: beneficiaries.length,
        stable: beneficiaries.filter(b => b.status === 'stable').length,
        needsAttention: beneficiaries.filter(b => b.status === 'needs_attention').length,
        critical: beneficiaries.filter(b => b.status === 'critical').length,
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // Action Handlers
    // ═══════════════════════════════════════════════════════════════════════════

    const handlePrint = async () => {
        const dataToExport = selectionCount > 0
            ? selectedItems
            : filteredBeneficiaries;

        printTable(dataToExport, [
            { key: 'name', header: 'الاسم' },
            { key: 'age', header: 'العمر' },
            { key: 'room', header: 'الغرفة' },
            { key: 'wing', header: 'الجناح' },
            { key: 'status', header: 'الحالة' },
        ], {
            title: 'قائمة المستفيدين',
            subtitle: `مركز التأهيل الشامل بالباحة - ${new Date().toLocaleDateString('ar-SA')}`,
        });
        await audit.print(`طباعة ${dataToExport.length} مستفيد`);
        showToast('جاري فتح نافذة الطباعة...', 'info');
    };

    const handleExportExcel = async () => {
        const dataToExport = selectionCount > 0
            ? selectedItems
            : filteredBeneficiaries;

        exportToExcel(dataToExport, BENEFICIARY_COLUMNS, {
            filename: 'قائمة_المستفيدين',
            title: 'قائمة المستفيدين - مركز التأهيل الشامل بالباحة',
        });
        await audit.export(`تصدير ${dataToExport.length} مستفيد إلى Excel`);
        showToast(`تم تصدير ${dataToExport.length} سجل إلى Excel`, 'success');
    };


    const handleSelectAll = () => {
        if (isAllSelected) {
            deselectAll();
            showToast('تم إلغاء تحديد الكل', 'info');
        } else {
            selectAll();
            showToast(`تم تحديد ${filteredBeneficiaries.length} مستفيد`, 'info');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg" title="رجوع">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="p-3 bg-gradient-to-br from-hrsd-teal to-hrsd-navy rounded-xl">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-hierarchy-title text-gray-900">قائمة المستفيدين</h1>
                            <p className="text-hierarchy-small text-gray-500">
                                إجمالي {stats.total} مستفيد • {stats.stable} مستقر • {stats.needsAttention} يحتاج متابعة • {stats.critical} حرج
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => refetch()}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            title="تحديث"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                title="عرض شبكي"
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                title="عرض قائمة"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={() => navigate('/beneficiaries/new')}
                            className="px-4 py-2 bg-hrsd-teal text-white rounded-lg flex items-center gap-2 hover:bg-hrsd-teal-dark transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">إضافة مستفيد</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="hrsd-card-stat border-l-hrsd-teal">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-hrsd-teal" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-hierarchy-label text-gray-500">إجمالي</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-hrsd-green">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-hrsd-green" />
                            <div>
                                <p className="text-2xl font-bold text-hrsd-green">{stats.stable}</p>
                                <p className="text-hierarchy-label text-gray-500">مستقر</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-hrsd-gold">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-hrsd-gold" />
                            <div>
                                <p className="text-2xl font-bold text-hrsd-gold">{stats.needsAttention}</p>
                                <p className="text-hierarchy-label text-gray-500">متابعة</p>
                            </div>
                        </div>
                    </div>
                    <div className="hrsd-card-stat border-l-red-500">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                                <p className="text-hierarchy-label text-gray-500">حرج</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* Toolbar - Print, Export, Bulk Actions */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    {/* Selection indicator */}
                    {selectionCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="px-3 py-1.5 bg-hrsd-teal/10 text-hrsd-teal rounded-lg text-sm font-medium"
                        >
                            {selectionCount} محدد
                        </motion.div>
                    )}

                    {/* Select All Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSelectAll}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                        aria-label="تحديد الكل"
                    >
                        <CheckSquare className={`w-4 h-4 ${isAllSelected ? 'text-hrsd-teal' : ''}`} />
                        <span className="hidden sm:inline">
                            {isAllSelected ? 'إلغاء التحديد' : 'تحديد الكل'}
                        </span>
                    </motion.button>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />

                    {/* Print Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="flex items-center gap-2 px-4 py-2 bg-hrsd-teal hover:bg-hrsd-teal-dark text-white rounded-lg transition-colors disabled:opacity-50"
                        aria-label="طباعة قائمة المستفيدين"
                    >
                        <Printer className={`w-4 h-4 ${isPrinting ? 'animate-pulse' : ''}`} />
                        <span className="hidden sm:inline">طباعة</span>
                    </motion.button>

                    {/* Export Excel Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-hrsd-green hover:bg-hrsd-green-dark text-white rounded-lg transition-colors disabled:opacity-50"
                        aria-label="تصدير إلى Excel"
                    >
                        <FileSpreadsheet className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                        <span className="hidden sm:inline">Excel</span>
                    </motion.button>

                    {/* Export Excel Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        aria-label="تصدير إلى Excel"
                        title="تصدير إلى Excel"
                    >
                        <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                        <span className="hidden sm:inline">Excel</span>
                    </motion.button>

                    {/* Results count moved here */}
                    <div className="flex-1 text-left">
                        <p className="text-hierarchy-small text-gray-500">
                            عرض {filteredBeneficiaries.length} من أصل {beneficiaries.length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <BeneficiaryFilters
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Loading State - Skeleton */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                            <SkeletonCard />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredBeneficiaries.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-hierarchy-heading text-gray-500 mb-2">لا توجد نتائج</h3>
                    <p className="text-hierarchy-small text-gray-400">
                        جرب تعديل معايير البحث أو الفلترة
                    </p>
                </div>
            )}

            {/* Beneficiary Grid/List */}
            {!isLoading && filteredBeneficiaries.length > 0 && (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-3'
                }>
                    {filteredBeneficiaries.map(beneficiary => (
                        <BeneficiaryCard
                            key={beneficiary.id}
                            id={beneficiary.id}
                            name={beneficiary.name}
                            age={beneficiary.age}
                            room={beneficiary.room}
                            wing={getWingName(beneficiary.wing)}
                            admission_date={beneficiary.admission_date}
                            status={beneficiary.status}
                            ipc_status={beneficiary.ipc_status}
                            latest_goal={beneficiary.latest_goal}
                            avatar_url={beneficiary.avatar_url}
                            alerts={beneficiary.alerts || []}
                        />
                    ))}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* Floating Batch Action Bar */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {selectionCount > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
                        style={{ minWidth: '400px', maxWidth: '90vw' }}
                    >
                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 
                                        text-white rounded-2xl shadow-2xl border border-white/10 
                                        backdrop-blur-xl p-4 flex items-center gap-4">

                            {/* Selection Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-hrsd-teal/20 border-2 border-hrsd-teal 
                                                rounded-xl flex items-center justify-center">
                                    <CheckSquare className="w-5 h-5 text-hrsd-teal" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg leading-tight">
                                        {selectionCount} مستفيد
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        من أصل {filteredBeneficiaries.length}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-10 w-px bg-white/10" />

                            {/* Actions */}
                            <div className="flex gap-2 flex-1">
                                {/* Export Selected */}
                                <button
                                    onClick={() => executeAction('export')}
                                    disabled={isExecuting}
                                    className="flex items-center gap-2 px-3 py-2 bg-emerald-600 
                                               hover:bg-emerald-700 rounded-lg transition-all 
                                               active:scale-95 disabled:opacity-50 text-sm font-medium"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">تصدير</span>
                                </button>

                                {/* Archive Selected */}
                                <button
                                    onClick={() => {
                                        if (confirm(`هل تريد أرشفة ${selectionCount} مستفيد؟`)) {
                                            executeAction('archive');
                                        }
                                    }}
                                    disabled={isExecuting}
                                    className="flex items-center gap-2 px-3 py-2 bg-amber-600 
                                               hover:bg-amber-700 rounded-lg transition-all 
                                               active:scale-95 disabled:opacity-50 text-sm font-medium"
                                >
                                    <Archive className="w-4 h-4" />
                                    <span className="hidden sm:inline">أرشفة</span>
                                </button>

                                {/* Delete Selected */}
                                <button
                                    onClick={() => {
                                        if (confirm(`⚠️ تحذير!\n\nهل تريد حذف ${selectionCount} مستفيد؟\nلا يمكن التراجع عن هذا الإجراء!`)) {
                                            executeAction('delete');
                                        }
                                    }}
                                    disabled={isExecuting}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 
                                               hover:bg-red-700 rounded-lg transition-all 
                                               active:scale-95 disabled:opacity-50 text-sm font-medium"
                                >
                                    <Trash className="w-4 h-4" />
                                    <span className="hidden sm:inline">حذف</span>
                                </button>
                            </div>

                            {/* Cancel */}
                            <button
                                onClick={deselectAll}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg 
                                           transition-all active:scale-95"
                                title="إلغاء التحديد"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Loading Overlay */}
                            {isExecuting && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/60 rounded-2xl backdrop-blur-sm 
                                               flex items-center justify-center"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <RefreshCw className="w-6 h-6 animate-spin text-white" />
                                        <p className="text-sm font-medium">جاري التنفيذ...</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BeneficiaryListPage;
