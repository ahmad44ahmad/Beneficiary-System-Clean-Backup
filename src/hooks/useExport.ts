// ═══════════════════════════════════════════════════════════════════════════
// useExport Hook - Excel/CSV export functionality wrapper
// Wraps the existing export utilities with React hook patterns
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, ExportOptions, ExportColumn } from '../utils/export';

interface UseExportResult {
    exportToExcel: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    exportToCsv: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    exportToPdf: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    isExporting: boolean;
}

/**
 * Hook for exporting data to various formats
 * Wraps the existing export utilities with loading state
 */
export function useExport(): UseExportResult {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportToExcel = useCallback((
        data: object[],
        columns: ExportColumn[],
        options: Partial<ExportOptions> = {}
    ) => {
        setIsExporting(true);

        try {
            const fullOptions: ExportOptions = {
                filename: options.filename || 'export',
                title: options.title,
                subtitle: options.subtitle,
                columns,
                data: data as Record<string, unknown>[],
                includeTimestamp: options.includeTimestamp ?? true,
                orientation: options.orientation || 'portrait',
            };

            exportToExcel(fullOptions);
        } finally {
            setTimeout(() => setIsExporting(false), 500);
        }
    }, []);

    const handleExportToCsv = useCallback((
        data: object[],
        columns: ExportColumn[],
        options: Partial<ExportOptions> = {}
    ) => {
        setIsExporting(true);

        try {
            const fullOptions: ExportOptions = {
                filename: options.filename || 'export',
                title: options.title,
                subtitle: options.subtitle,
                columns,
                data: data as Record<string, unknown>[],
                includeTimestamp: options.includeTimestamp ?? true,
                orientation: options.orientation || 'portrait',
            };

            exportToCSV(fullOptions);
        } finally {
            setTimeout(() => setIsExporting(false), 500);
        }
    }, []);

    const handleExportToPdf = useCallback((
        data: object[],
        columns: ExportColumn[],
        options: Partial<ExportOptions> = {}
    ) => {
        setIsExporting(true);

        try {
            const fullOptions: ExportOptions = {
                filename: options.filename || 'export',
                title: options.title,
                subtitle: options.subtitle,
                columns,
                data: data as Record<string, unknown>[],
                includeTimestamp: options.includeTimestamp ?? true,
                orientation: options.orientation || 'portrait',
            };

            exportToPDF(fullOptions);
        } finally {
            setTimeout(() => setIsExporting(false), 500);
        }
    }, []);

    return {
        exportToExcel: handleExportToExcel,
        exportToCsv: handleExportToCsv,
        exportToPdf: handleExportToPdf,
        isExporting,
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// Pre-configured Export Helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pre-configured column definitions for common exports
 */
export const BENEFICIARY_COLUMNS: ExportColumn[] = [
    { key: 'name', header: 'الاسم' },
    { key: 'age', header: 'العمر', type: 'number' },
    { key: 'room', header: 'رقم الغرفة' },
    { key: 'wing', header: 'الجناح' },
    {
        key: 'status', header: 'الحالة الصحية', format: (v: unknown) => {
            switch (v) {
                case 'stable': return 'مستقر';
                case 'needs_attention': return 'يحتاج متابعة';
                case 'critical': return 'حرج';
                default: return String(v || '-');
            }
        }
    },
    {
        key: 'ipc_status', header: 'حالة IPC', format: (v: unknown) => {
            switch (v) {
                case 'safe': return 'آمن';
                case 'monitor': return 'تحت المراقبة';
                case 'alert': return 'تنبيه';
                default: return String(v || '-');
            }
        }
    },
    { key: 'admission_date', header: 'تاريخ القبول', type: 'date' },
];

export default useExport;
