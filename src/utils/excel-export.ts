/**
 * Excel Export Utility
 * أداة تصدير Excel مع دعم RTL
 */

import ExcelJS from 'exceljs';

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
export async function exportToExcel<T extends Record<string, unknown>>(
    data: T[],
    columns: ExportColumn<T>[],
    options: ExportOptions
): Promise<void> {
    const { fileName, sheetName = "البيانات", rtl = true } = options;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName, {
        views: [{ rightToLeft: rtl }],
    });

    // Set columns with headers and widths
    worksheet.columns = columns.map(col => ({
        header: col.header,
        key: String(col.key),
        width: col.width || Math.max(
            col.header.length * 2,
            ...data.map(item => String(item[col.key] || "").length)
        ) + 2,
    }));

    // Add data rows
    for (const item of data) {
        const row: Record<string, string> = {};
        for (const col of columns) {
            const value = item[col.key];
            if (value === null || value === undefined) row[String(col.key)] = "";
            else if (Array.isArray(value)) row[String(col.key)] = value.join("، ");
            else if (typeof value === "object") row[String(col.key)] = JSON.stringify(value);
            else row[String(col.key)] = String(value);
        }
        worksheet.addRow(row);
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Write to buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fullFileName;
    a.click();
    URL.revokeObjectURL(url);
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
