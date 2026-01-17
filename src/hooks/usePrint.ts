// ═══════════════════════════════════════════════════════════════════════════
// usePrint Hook - Print functionality with Arabic RTL support
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';

interface PrintOptions {
    title?: string;
    subtitle?: string;
    orientation?: 'portrait' | 'landscape';
}

interface UsePrintResult {
    print: (options?: PrintOptions) => void;
    printTable: (data: any[], columns: { key: string; header: string }[], options?: PrintOptions) => void;
    isPrinting: boolean;
}

/**
 * Hook for printing with Arabic RTL support
 * Uses a new window approach for better print styling control
 */
export function usePrint(): UsePrintResult {
    const [isPrinting, setIsPrinting] = useState(false);

    const print = useCallback((options: PrintOptions = {}) => {
        setIsPrinting(true);

        // Trigger browser print dialog for current content
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 100);
    }, []);

    const printTable = useCallback((
        data: any[],
        columns: { key: string; header: string }[],
        options: PrintOptions = {}
    ) => {
        setIsPrinting(true);

        const { title = 'تقرير', subtitle, orientation = 'portrait' } = options;

        const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        @page { size: A4 ${orientation}; margin: 2cm; }
        * { box-sizing: border-box; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px solid #148287;
            padding-bottom: 15px;
        }
        .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; margin: 0; }
        .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
        .timestamp { font-size: 12px; color: #888; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: linear-gradient(135deg, #148287 0%, #0d6567 100%);
            color: white;
            padding: 12px 15px;
            border: 1px solid #0d6567;
            font-weight: 600;
            font-size: 14px;
        }
        td {
            padding: 10px 15px;
            border: 1px solid #e0e0e0;
            font-size: 13px;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            color: #888;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }
        .stats-row {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin: 15px 0;
            font-size: 13px;
        }
        .stat-item { color: #148287; font-weight: 600; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1 class="title">${title}</h1>
        </div>
        ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
        <div class="timestamp">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</div>
    </div>
    
    <div class="stats-row">
        <span class="stat-item">إجمالي السجلات: ${data.length}</span>
    </div>

    <table>
        <thead>
            <tr>
                ${columns.map(col => `<th>${col.header}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${data.map(row => `
                <tr>
                    ${columns.map(col => `<td>${row[col.key] ?? '-'}</td>`).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بمنطقة الباحة<br/>
        وزارة الموارد البشرية والتنمية الاجتماعية
    </div>

    <script>
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
        };
    </script>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
        }

        setTimeout(() => setIsPrinting(false), 500);
    }, []);

    return { print, printTable, isPrinting };
}

export default usePrint;
