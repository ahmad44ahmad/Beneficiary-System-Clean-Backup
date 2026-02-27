// Zod Validation Schemas for Basira System

import { z } from 'zod';

// Common Validation Helpers

// Saudi National ID: 10 digits starting with 1 or 2
const saudiNationalIdSchema = z.string()
    .trim()
    .regex(/^[12]\d{9}$/, 'رقم الهوية الوطنية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام');

// Saudi Phone Number: starts with 05 and 10 digits total
const saudiPhoneSchema = z.string()
    .trim()
    .regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');

// Arabic Name: 2-4 Arabic words
const arabicNameSchema = z.string()
    .trim()
    .min(5, 'الاسم يجب أن يحتوي على 5 أحرف على الأقل')
    .max(100, 'الاسم يجب ألا يتجاوز 100 حرف')
    .regex(/^[\u0600-\u06FF\s]+$/, 'الاسم يجب أن يكون باللغة العربية');

// Beneficiary Schemas

export const beneficiarySchema = z.object({
    nationalId: saudiNationalIdSchema,
    fullName: arabicNameSchema,
    gender: z.enum(['male', 'female'], { message: 'يرجى اختيار الجنس' }),
    dob: z.string().trim().max(255).min(1, 'تاريخ الميلاد مطلوب'),
    nationality: z.string().trim().max(255).min(1, 'الجنسية مطلوبة'),
    roomNumber: z.string().trim().max(255).optional(),
    bedNumber: z.string().trim().max(255).optional(),
    guardianName: z.string().trim().max(255).min(3, 'اسم ولي الأمر مطلوب'),
    guardianPhone: saudiPhoneSchema,
    guardianRelation: z.string().trim().max(255).min(1, 'صلة القرابة مطلوبة'),
    medicalDiagnosis: z.string().trim().max(2000).optional(),
    notes: z.string().trim().max(2000).optional(),
}).strict();

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;

// Visit Log Schemas

export const visitLogSchema = z.object({
    beneficiaryId: z.string().trim().max(255).min(1, 'معرف المستفيد مطلوب'),
    visitorName: arabicNameSchema,
    visitorPhone: saudiPhoneSchema.optional(),
    visitorRelation: z.string().trim().max(255).min(1, 'صلة القرابة مطلوبة'),
    visitDate: z.string().trim().max(255).min(1, 'تاريخ الزيارة مطلوب'),
    visitType: z.enum(['regular', 'emergency', 'medical', 'social'], { message: 'يرجى اختيار نوع الزيارة' }),
    notes: z.string().trim().max(2000).optional(),
}).strict();

export type VisitLogFormData = z.infer<typeof visitLogSchema>;

// Medical Schemas

export const vitalSignsSchema = z.object({
    beneficiaryId: z.string().trim().max(255).min(1, 'معرف المستفيد مطلوب'),
    temperature: z.number()
        .min(35, 'درجة الحرارة يجب أن تكون أعلى من 35')
        .max(42, 'درجة الحرارة يجب أن تكون أقل من 42'),
    bloodPressureSystolic: z.number()
        .min(70, 'الضغط الانقباضي منخفض جداً')
        .max(200, 'الضغط الانقباضي مرتفع جداً'),
    bloodPressureDiastolic: z.number()
        .min(40, 'الضغط الانبساطي منخفض جداً')
        .max(130, 'الضغط الانبساطي مرتفع جداً'),
    heartRate: z.number()
        .min(40, 'معدل النبض منخفض جداً')
        .max(180, 'معدل النبض مرتفع جداً'),
    oxygenSaturation: z.number()
        .min(70, 'مستوى الأكسجين منخفض جداً')
        .max(100, 'مستوى الأكسجين يجب أن يكون أقل من 100'),
    weight: z.number().min(10, 'الوزن غير صحيح').max(300, 'الوزن غير صحيح').optional(),
    notes: z.string().trim().max(2000).optional(),
}).strict();

export type VitalSignsFormData = z.infer<typeof vitalSignsSchema>;

// Medication Schemas

export const medicationSchema = z.object({
    name: z.string().trim().max(255).min(2, 'اسم الدواء مطلوب'),
    dosage: z.string().trim().max(255).min(1, 'الجرعة مطلوبة'),
    frequency: z.enum(['once', 'twice', 'three_times', 'four_times', 'as_needed'], { message: 'يرجى اختيار تكرار الجرعة' }),
    startDate: z.string().trim().max(255).min(1, 'تاريخ البداية مطلوب'),
    endDate: z.string().trim().max(255).optional(),
    prescribedBy: z.string().trim().max(255).min(3, 'اسم الطبيب مطلوب'),
    notes: z.string().trim().max(2000).optional(),
}).strict();

export type MedicationFormData = z.infer<typeof medicationSchema>;

// Incident Report Schemas

export const incidentReportSchema = z.object({
    beneficiaryId: z.string().trim().max(255).min(1, 'معرف المستفيد مطلوب'),
    incidentDate: z.string().trim().max(255).min(1, 'تاريخ الحادث مطلوب'),
    incidentTime: z.string().trim().max(255).min(1, 'وقت الحادث مطلوب'),
    location: z.string().trim().max(255).min(3, 'مكان الحادث مطلوب'),
    incidentType: z.enum(['fall', 'injury', 'medical_emergency', 'behavioral', 'other'], { message: 'يرجى اختيار نوع الحادث' }),
    severity: z.enum(['low', 'medium', 'high', 'critical'], { message: 'يرجى تحديد شدة الحادث' }),
    description: z.string().trim().max(2000).min(20, 'الوصف يجب أن يحتوي على 20 حرف على الأقل'),
    actionTaken: z.string().trim().max(2000).min(10, 'الإجراء المتخذ مطلوب'),
    reportedBy: z.string().trim().max(255).min(3, 'اسم المبلغ مطلوب'),
    witnesses: z.string().trim().max(2000).optional(),
    followUpRequired: z.boolean().default(false),
}).strict();

export type IncidentReportFormData = z.infer<typeof incidentReportSchema>;

// Maintenance Request Schemas

export const maintenanceRequestSchema = z.object({
    assetId: z.string().trim().max(255).optional(),
    location: z.string().trim().max(255).min(3, 'الموقع مطلوب'),
    issueType: z.enum(['electrical', 'plumbing', 'hvac', 'structural', 'equipment', 'other'], { message: 'يرجى اختيار نوع المشكلة' }),
    priority: z.enum(['low', 'medium', 'high', 'urgent'], { message: 'يرجى تحديد الأولوية' }),
    description: z.string().trim().max(2000).min(10, 'وصف المشكلة مطلوب'),
    requestedBy: z.string().trim().max(255).min(3, 'اسم مقدم الطلب مطلوب'),
}).strict();

export type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>;

// Leave Request Schemas

export const leaveRequestSchema = z.object({
    beneficiaryId: z.string().trim().max(255).min(1, 'معرف المستفيد مطلوب'),
    leaveType: z.enum(['day', 'weekend', 'vacation', 'medical', 'emergency'], { message: 'يرجى اختيار نوع الإجازة' }),
    startDate: z.string().trim().max(255).min(1, 'تاريخ البداية مطلوب'),
    endDate: z.string().trim().max(255).min(1, 'تاريخ النهاية مطلوب'),
    guardianName: arabicNameSchema,
    guardianPhone: saudiPhoneSchema,
    guardianId: saudiNationalIdSchema,
    destination: z.string().trim().max(255).min(5, 'وجهة الإجازة مطلوبة'),
    reason: z.string().trim().max(2000).min(10, 'سبب الإجازة مطلوب'),
}).strict();

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

// Utility Functions

/**
 * Validate form data and return errors in Arabic
 */
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
} {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        errors[path] = issue.message;
    }

    return { success: false, errors };
}
