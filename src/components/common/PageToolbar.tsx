// ═══════════════════════════════════════════════════════════════════════════
// PageToolbar - Reusable toolbar component for Print/Export/Actions
// Provides consistent UI across all list pages
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';
import { Printer, FileSpreadsheet, Download, CheckSquare, Square, Loader2 } from 'lucide-react';
import { usePrint } from '../../hooks/usePrint';
import { useExport } from '../../hooks/useExport';
import { useToast } from '../../context/ToastContext';

interface ColumnDef {
    key: string;
    header: string;
}

interface PageToolbarProps {
    /** Data array to export/print */
    data: any[];
    /** Column definitions for export/print */
    columns: ColumnDef[];
    /** Title for print/export documents */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Enable selection mode */
    enableSelection?: boolean;
    /** Number of selected items */
    selectedCount?: number;
    /** Total items count */
    totalCount?: number;
    /** Select all callback */
    onSelectAll?: () => void;
    /** Deselect all callback */
    onDeselectAll?: () => void;
    /** Show Excel export button */
    showExcel?: boolean;
    /** Show CSV export button */
    showCsv?: boolean;
    /** Show Print button */
    showPrint?: boolean;
    /** Additional actions */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
}

/**
 * Reusable toolbar component for list pages
 * Provides Print, Excel, CSV export functionality
 */
export const PageToolbar: React.FC<PageToolbarProps> = ({
    data,
    columns,
    title,
    subtitle,
    enableSelection = false,
    selectedCount = 0,
    totalCount = 0,
    onSelectAll,
    onDeselectAll,
    showExcel = true,
    showCsv = false,
    showPrint = true,
    children,
    className = ''
}) => {
    const { printTable, isPrinting } = usePrint();
    const { exportToExcel, exportToCsv, isExporting } = useExport();
    const { showToast } = useToast();

    const handlePrint = () => {
        if (data.length === 0) {
            showToast('لا توجد بيانات للطباعة', 'error');
            return;
        }
        printTable(data, columns, { title, subtitle });
        showToast('تم فتح نافذة الطباعة', 'success');
    };

    const handleExportExcel = () => {
        if (data.length === 0) {
            showToast('لا توجد بيانات للتصدير', 'error');
            return;
        }
        exportToExcel(data, columns, { filename: title.replace(/\s/g, '_') });
        showToast(`تم تصدير ${data.length} سجل إلى Excel`, 'success');
    };

    const handleExportCsv = () => {
        if (data.length === 0) {
            showToast('لا توجد بيانات للتصدير', 'error');
            return;
        }
        exportToCsv(data, columns, { filename: title.replace(/\s/g, '_') });
        showToast(`تم تصدير ${data.length} سجل إلى CSV`, 'success');
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm p-3 flex flex-wrap items-center gap-3 ${className}`} dir="rtl">
            {/* Selection Controls */}
            {enableSelection && (
                <div className="flex items-center gap-2 border-l pl-3">
                    {selectedCount > 0 ? (
                        <>
                            <span className="text-sm text-gray-600">
                                {selectedCount} من {totalCount} محدد
                            </span>
                            <button
                                onClick={onDeselectAll}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                                إلغاء التحديد
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onSelectAll}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                            <CheckSquare className="w-3 h-3" />
                            تحديد الكل
                        </button>
                    )}
                </div>
            )}

            {/* Count Indicator */}
            <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{data.length}</span> سجل
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Custom Actions */}
            {children}

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
                {showExcel && (
                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting || data.length === 0}
                        className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 flex items-center gap-2 text-sm disabled:opacity-50 transition-colors"
                        aria-label="تصدير إلى Excel"
                    >
                        {isExporting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <FileSpreadsheet className="w-4 h-4" />
                        )}
                        Excel
                    </button>
                )}

                {showCsv && (
                    <button
                        onClick={handleExportCsv}
                        disabled={isExporting || data.length === 0}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center gap-2 text-sm disabled:opacity-50 transition-colors"
                        aria-label="تصدير إلى CSV"
                    >
                        <Download className="w-4 h-4" />
                        CSV
                    </button>
                )}

                {showPrint && (
                    <button
                        onClick={handlePrint}
                        disabled={isPrinting || data.length === 0}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm disabled:opacity-50 transition-colors"
                        aria-label="طباعة"
                    >
                        {isPrinting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Printer className="w-4 h-4" />
                        )}
                        طباعة
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageToolbar;
