// ═══════════════════════════════════════════════════════════════════════════
// Data Export Utility for Basira System
// Supports Excel and PDF export with Arabic content
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface ExportColumn {
    key: string;
    header: string; // Arabic header
    width?: number;
    type?: 'string' | 'number' | 'date' | 'boolean';
    format?: (value: any) => string;
}

export interface ExportOptions {
    filename: string;
    title?: string;
    subtitle?: string;
    columns: ExportColumn[];
    data: Record<string, any>[];
    includeTimestamp?: boolean;
    orientation?: 'portrait' | 'landscape';
}

// ═══════════════════════════════════════════════════════════════════════════
// CSV Export (Base format for Excel compatibility)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Export data to CSV format
 */
export function exportToCSV(options: ExportOptions): void {
    const { filename, columns, data, title, includeTimestamp = true } = options;

    // Build CSV content with BOM for Arabic support
    let csvContent = '\ufeff'; // UTF-8 BOM

    // Add title if provided
    if (title) {
        csvContent += `"${title}"\n`;
        if (includeTimestamp) {
            csvContent += `"تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}"\n`;
        }
        csvContent += '\n';
    }

    // Add headers
    csvContent += columns.map(col => `"${col.header}"`).join(',') + '\n';

    // Add data rows
    data.forEach(row => {
        const rowValues = columns.map(col => {
            let value = row[col.key];

            // Apply format function if provided
            if (col.format) {
                value = col.format(value);
            } else if (col.type === 'date' && value) {
                value = new Date(value).toLocaleDateString('ar-SA');
            } else if (col.type === 'boolean') {
                value = value ? 'نعم' : 'لا';
            }

            // Escape quotes and wrap in quotes
            const stringValue = String(value ?? '');
            return `"${stringValue.replace(/"/g, '""')}"`;
        });
        csvContent += rowValues.join(',') + '\n';
    });

    // Download
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8');
}

// ═══════════════════════════════════════════════════════════════════════════
// Excel Export (using simple XML format)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Export data to Excel format (SpreadsheetML)
 */
export function exportToExcel(options: ExportOptions): void {
    const { filename, columns, data, title, includeTimestamp = true } = options;

    // Build Excel XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
<Styles>
    <Style ss:ID="Header">
        <Font ss:Bold="1" ss:Size="12"/>
        <Interior ss:Color="#148287" ss:Pattern="Solid"/>
        <Font ss:Color="#FFFFFF"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Title">
        <Font ss:Bold="1" ss:Size="16"/>
        <Alignment ss:Horizontal="Center" ss:ReadingOrder="RightToLeft"/>
    </Style>
    <Style ss:ID="Data">
        <Alignment ss:Horizontal="Right" ss:ReadingOrder="RightToLeft"/>
    </Style>
</Styles>
<Worksheet ss:Name="البيانات">
<Table>`;

    const startRow = title ? 3 : 1;

    // Add title row if provided
    if (title) {
        xml += `
<Row ss:Index="1">
    <Cell ss:MergeAcross="${columns.length - 1}" ss:StyleID="Title">
        <Data ss:Type="String">${escapeXml(title)}</Data>
    </Cell>
</Row>`;
        if (includeTimestamp) {
            xml += `
<Row>
    <Cell ss:MergeAcross="${columns.length - 1}">
        <Data ss:Type="String">تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}</Data>
    </Cell>
</Row>`;
        }
    }

    // Add header row
    xml += `
<Row ss:Index="${startRow}">`;
    columns.forEach(col => {
        xml += `
    <Cell ss:StyleID="Header">
        <Data ss:Type="String">${escapeXml(col.header)}</Data>
    </Cell>`;
    });
    xml += `
</Row>`;

    // Add data rows
    data.forEach((row, index) => {
        xml += `
<Row ss:Index="${startRow + index + 1}">`;
        columns.forEach(col => {
            let value = row[col.key];
            let type = 'String';

            // Apply format function if provided
            if (col.format) {
                value = col.format(value);
            } else if (col.type === 'date' && value) {
                value = new Date(value).toLocaleDateString('ar-SA');
            } else if (col.type === 'boolean') {
                value = value ? 'نعم' : 'لا';
            } else if (col.type === 'number' && typeof value === 'number') {
                type = 'Number';
            }

            xml += `
    <Cell ss:StyleID="Data">
        <Data ss:Type="${type}">${escapeXml(String(value ?? ''))}</Data>
    </Cell>`;
        });
        xml += `
</Row>`;
    });

    xml += `
</Table>
</Worksheet>
</Workbook>`;

    // Download
    downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}

// ═══════════════════════════════════════════════════════════════════════════
// PDF Export (using print-based approach)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Export data to PDF by opening print dialog
 */
export function exportToPDF(options: ExportOptions): void {
    const { columns, data, title, includeTimestamp = true, orientation = 'portrait' } = options;

    // Create printable HTML
    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>${title || 'تقرير'}</title>
    <style>
        @page { size: A4 ${orientation}; margin: 2cm; }
        body {
            font-family: 'Cairo', 'Tajawal', 'Arial', sans-serif;
            direction: rtl;
            text-align: right;
            color: #1a1a1a;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #148287;
            padding-bottom: 15px;
        }
        .title { font-size: 24px; font-weight: bold; color: #14415a; }
        .timestamp { font-size: 12px; color: #666; margin-top: 5px; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #148287;
            color: white;
            padding: 10px;
            border: 1px solid #0d6567;
            font-weight: bold;
        }
        td {
            padding: 8px 10px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #e8f4f8; }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        ${title ? `<div class="title">${title}</div>` : ''}
        ${includeTimestamp ? `<div class="timestamp">تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')} ${new Date().toLocaleTimeString('ar-SA')}</div>` : ''}
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
                    ${columns.map(col => {
        let value = row[col.key];
        if (col.format) value = col.format(value);
        else if (col.type === 'date' && value) value = new Date(value).toLocaleDateString('ar-SA');
        else if (col.type === 'boolean') value = value ? 'نعم' : 'لا';
        return `<td>${value ?? ''}</td>`;
    }).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
    <div class="footer">
        نظام بصيرة - مركز التأهيل الشامل بالباحة
    </div>
    <script>window.print();</script>
</body>
</html>`;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════════════════════
// Pre-configured Export Templates
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Export beneficiaries list
 */
export function exportBeneficiariesList(data: any[], format: 'csv' | 'excel' | 'pdf' = 'excel'): void {
    const options: ExportOptions = {
        filename: 'قائمة_المستفيدين',
        title: 'قائمة المستفيدين',
        columns: [
            { key: 'nationalId', header: 'رقم الهوية' },
            { key: 'fullName', header: 'الاسم الكامل' },
            { key: 'gender', header: 'الجنس', format: v => v === 'male' ? 'ذكر' : 'أنثى' },
            { key: 'dob', header: 'تاريخ الميلاد', type: 'date' },
            { key: 'roomNumber', header: 'رقم الغرفة' },
            { key: 'status', header: 'الحالة' },
        ],
        data,
    };

    if (format === 'csv') exportToCSV(options);
    else if (format === 'excel') exportToExcel(options);
    else exportToPDF(options);
}

/**
 * Export incidents report
 */
export function exportIncidentsReport(data: any[], format: 'csv' | 'excel' | 'pdf' = 'excel'): void {
    const options: ExportOptions = {
        filename: 'تقرير_الحوادث',
        title: 'تقرير الحوادث',
        columns: [
            { key: 'date', header: 'التاريخ', type: 'date' },
            { key: 'beneficiaryName', header: 'المستفيد' },
            { key: 'type', header: 'نوع الحادث' },
            { key: 'severity', header: 'الخطورة' },
            { key: 'location', header: 'الموقع' },
            { key: 'reportedBy', header: 'المبلغ' },
            { key: 'status', header: 'الحالة' },
        ],
        data,
        orientation: 'landscape',
    };

    if (format === 'csv') exportToCSV(options);
    else if (format === 'excel') exportToExcel(options);
    else exportToPDF(options);
}
