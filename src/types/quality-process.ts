export interface QualityProcess {
    id: string;
    department: string; // القسم
    name: string; // اسم العملية
    responsible: string; // المسؤول
    inputs: string; // المدخلات
    outputs: string; // المخرجات
    kpi: string; // مؤشرات الأداء
    frequency: string; // التكرار
    duration: string; // المدة
    description?: string; // وصف (optional, might be used for 'Input' column if it describes the process flow)
}
