/**
 * Arabic Translations / الترجمات العربية
 * Central location for all UI text translations
 */

// Status Labels
export const STATUS_LABELS = {
    active: 'نشط',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    discharged: 'مخرج',
    daycare: 'رعاية نهارية',
    inactive: 'غير نشط',
    cancelled: 'ملغي',
    overdue: 'متأخر',
    scheduled: 'مجدول',
    inProgress: 'قيد التنفيذ'
} as const;

// Action Labels
export const ACTION_LABELS = {
    add: 'إضافة',
    addNew: 'إضافة جديد',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    search: 'بحث',
    filter: 'تصفية',
    export: 'تصدير',
    print: 'طباعة',
    close: 'إغلاق',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    update: 'تحديث',
    view: 'عرض',
    download: 'تحميل',
    upload: 'رفع'
} as const;

// Entity Labels
export const ENTITY_LABELS = {
    beneficiary: 'مستفيد',
    beneficiaries: 'المستفيدين',
    guardian: 'ولي الأمر',
    staff: 'موظف',
    user: 'مستخدم',
    room: 'غرفة',
    bed: 'سرير',
    medication: 'دواء',
    diagnosis: 'تشخيص',
    report: 'تقرير',
    alert: 'تنبيه',
    notification: 'إشعار'
} as const;

// Time Labels
export const TIME_LABELS = {
    today: 'اليوم',
    yesterday: 'أمس',
    tomorrow: 'غداً',
    thisWeek: 'هذا الأسبوع',
    lastWeek: 'الأسبوع الماضي',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    date: 'التاريخ',
    time: 'الوقت'
} as const;

// Priority Labels
export const PRIORITY_LABELS = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة',
    critical: 'حرجة',
    urgent: 'عاجلة'
} as const;

// Message Labels
export const MESSAGE_LABELS = {
    success: 'تم بنجاح',
    error: 'حدث خطأ',
    warning: 'تحذير',
    info: 'معلومة',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    noResults: 'لا توجد نتائج'
} as const;

/**
 * Get Arabic status label
 */
export function getStatusLabel(status: string): string {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
}

/**
 * Get Arabic action label
 */
export function getActionLabel(action: string): string {
    return ACTION_LABELS[action as keyof typeof ACTION_LABELS] || action;
}

/**
 * Get Arabic priority label
 */
export function getPriorityLabel(priority: string): string {
    return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || priority;
}

// Guardian Relation Labels
export const GUARDIAN_RELATIONS = {
    father: 'أب',
    mother: 'أم',
    brother: 'أخ',
    sister: 'أخت',
    uncle: 'عم',
    aunt: 'عمة',
    grandfather: 'جد',
    grandmother: 'جدة',
    legalGuardian: 'وكيل شرعي',
    other: 'أخرى'
} as const;

// Gender Labels
export const GENDER_LABELS = {
    male: 'ذكر',
    female: 'أنثى'
} as const;

// Days of Week
export const DAYS_OF_WEEK = {
    sunday: 'الأحد',
    monday: 'الإثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت'
} as const;

// Months
export const MONTHS = {
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    july: 'يوليو',
    august: 'أغسطس',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر'
} as const;

// Hijri Months
export const HIJRI_MONTHS = {
    muharram: 'محرم',
    safar: 'صفر',
    rabiAlAwwal: 'ربيع الأول',
    rabiAlThani: 'ربيع الثاني',
    jumadaAlAwwal: 'جمادى الأول',
    jumadaAlThani: 'جمادى الثاني',
    rajab: 'رجب',
    shaaban: 'شعبان',
    ramadan: 'رمضان',
    shawwal: 'شوال',
    dhuAlQidah: 'ذو القعدة',
    dhuAlHijjah: 'ذو الحجة'
} as const;
