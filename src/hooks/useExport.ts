// useExport Hook - Excel/CSV export functionality wrapper
// Wraps the existing export utilities with React hook patterns

import { useState, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, ExportOptions, ExportColumn } from '../utils/export';

interface UseExportResult {
    exportToExcel: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    exportToCsv: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    exportToPdf: (data: object[], columns: ExportColumn[], options?: Partial<ExportOptions>) => void;
    isExporting: boolean;
}

function buildOptions(data: object[], columns: ExportColumn[], options: Partial<ExportOptions>): ExportOptions {
    return {
        filename: options.filename || 'export',
        title: options.title,
        subtitle: options.subtitle,
        columns,
        data: data as Record<string, unknown>[],
        includeTimestamp: options.includeTimestamp ?? true,
        orientation: options.orientation || 'portrait',
    };
}

export function useExport(): UseExportResult {
    const [isExporting, setIsExporting] = useState(false);

    const runExport = useCallback((exportFn: (opts: ExportOptions) => void, data: object[], columns: ExportColumn[], options: Partial<ExportOptions> = {}) => {
        setIsExporting(true);
        try {
            exportFn(buildOptions(data, columns, options));
        } finally {
            setTimeout(() => setIsExporting(false), 500);
        }
    }, []);

    return {
        exportToExcel: (data, columns, options = {}) => runExport(exportToExcel, data, columns, options),
        exportToCsv: (data, columns, options = {}) => runExport(exportToCSV, data, columns, options),
        exportToPdf: (data, columns, options = {}) => runExport(exportToPDF, data, columns, options),
        isExporting,
    };
}

// Pre-configured Export Helpers

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
