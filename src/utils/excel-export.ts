/**
 * Excel Export Utility
 * أداة تصدير Excel مع دعم RTL
 */

import * as XLSX from 'xlsx';

export interface ExportColumn<T> {
    key: keyof T;
    header: string;
    width?: number;
}

export interface ExportOptions {
    fileName: string;
    sheetName?: string;
    rtl?: boolean;
}

/**
 * Exports data to Excel file with RTL support
 * تصدير البيانات إلى ملف Excel مع دعم RTL
 */
export function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn<T>[],
    options: ExportOptions
): void {
    const { fileName, sheetName = "البيانات", rtl = true } = options;

    // Create header row
    const headers = columns.map(col => col.header);

    // Create data rows
    const rows = data.map(item =>
        columns.map(col => {
            const value = item[col.key];
            // Handle different types
            if (value === null || value === undefined) return "";
            if (Array.isArray(value)) return value.join("، ");
            if (typeof value === "object") return JSON.stringify(value);
            return String(value);
        })
    );

    // Combine headers and rows
    const wsData = [headers, ...rows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    const colWidths = columns.map(col => ({
        wch: col.width || Math.max(
            col.header.length * 2,
            ...data.map(item => String(item[col.key] || "").length)
        ) + 2
    }));
    ws['!cols'] = colWidths;

    // Set RTL direction
    if (rtl) {
        ws['!dir'] = 'rtl';
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Trigger download
    XLSX.writeFile(wb, fullFileName);
}

/**
 * Exports beneficiaries list to Excel
 * تصدير قائمة المستفيدين إلى Excel
 */
export function exportBeneficiariesToExcel(
    beneficiaries: Array<{
        fileId?: string;
        fullName?: string;
        nationalId?: string;
        diagnosis?: string | { arabic?: string };
        room?: string | null;
        status?: string;
        admissionDate?: string;
    }>
): void {
    const columns: ExportColumn<typeof beneficiaries[0]>[] = [
        { key: "fileId", header: "رقم الملف", width: 15 },
        { key: "fullName", header: "الاسم الكامل", width: 35 },
        { key: "nationalId", header: "رقم الهوية", width: 15 },
        { key: "diagnosis", header: "التشخيص", width: 25 },
        { key: "room", header: "الغرفة", width: 10 },
        { key: "status", header: "الحالة", width: 12 },
        { key: "admissionDate", header: "تاريخ القبول", width: 15 }
    ];

    // Process data for export
    const processedData = beneficiaries.map(b => ({
        ...b,
        diagnosis: typeof b.diagnosis === "object" ? b.diagnosis?.arabic : b.diagnosis,
        room: b.room || "-",
        status: getStatusLabel(b.status || "")
    }));

    exportToExcel(processedData, columns, {
        fileName: "قائمة_المستفيدين",
        sheetName: "المستفيدين"
    });
}

/**
 * Status label helper
 */
function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        active: "نشط",
        daycare: "رعاية نهارية",
        discharged: "مخرج",
        pending: "قيد الانتظار"
    };
    return labels[status] || status;
}

/**
 * Exports attendance report to Excel
 */
export function exportAttendanceToExcel(
    attendanceData: Array<{
        beneficiaryName: string;
        date: string;
        checkIn?: string;
        checkOut?: string;
        status: string;
    }>
): void {
    const columns: ExportColumn<typeof attendanceData[0]>[] = [
        { key: "beneficiaryName", header: "اسم المستفيد", width: 30 },
        { key: "date", header: "التاريخ", width: 12 },
        { key: "checkIn", header: "وقت الحضور", width: 12 },
        { key: "checkOut", header: "وقت الانصراف", width: 12 },
        { key: "status", header: "الحالة", width: 15 }
    ];

    exportToExcel(attendanceData, columns, {
        fileName: "تقرير_الحضور",
        sheetName: "الحضور"
    });
}

/**
 * Exports medical report to Excel
 */
export function exportMedicalReportToExcel(
    medicalData: Array<{
        beneficiaryName: string;
        diagnosis: string;
        medications: string[];
        lastCheckup: string;
        notes: string;
    }>
): void {
    const columns: ExportColumn<typeof medicalData[0]>[] = [
        { key: "beneficiaryName", header: "اسم المستفيد", width: 30 },
        { key: "diagnosis", header: "التشخيص", width: 25 },
        { key: "medications", header: "الأدوية", width: 30 },
        { key: "lastCheckup", header: "آخر فحص", width: 12 },
        { key: "notes", header: "ملاحظات", width: 40 }
    ];

    exportToExcel(medicalData, columns, {
        fileName: "التقرير_الطبي",
        sheetName: "التقرير الطبي"
    });
}
