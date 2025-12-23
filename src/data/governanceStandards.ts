import { AuditStandard } from '../types/quality';

// تم استخراج هذه المعايير من "إطار حوكمة الجودة" و"دليل الجودة الشاملة"
//

export const governanceStandards: AuditStandard[] = [
    {
        id: 'ISO-4-1',
        category: 'سياق المنظمة (Context)',
        title: 'فهم احتياجات المستفيدين وأصحاب المصلحة',
        description: 'هل تم تحديد احتياجات المستفيدين (التمكين، الرعاية، الدمج) وتوثيقها في الملف الموحد؟',
        requirement: 'وجود بحث اجتماعي وتقييم طبي محدث خلال 6 أشهر.',
        weight: 'critical',
        clause: '4.2'
    },
    {
        id: 'ISO-5-2',
        category: 'القيادة (Leadership)',
        title: 'سياسة الجودة والالتزام',
        description: 'هل السياسات المطبقة تعكس التوجه نحو التمكين بدلاً من الرعاية التقليدية؟',
        requirement: 'توقيع المستفيد أو وليه على خطة التمكين الفردية.',
        weight: 'high',
        clause: '5.2'
    },
    {
        id: 'ISO-6-1',
        category: 'التخطيط (Planning)',
        title: 'إدارة المخاطر والفرص',
        description: 'هل تم تقييم مخاطر السلامة والصحة للمستفيد في خطة الرعاية؟',
        requirement: 'تعبئة نموذج "سجل المخاطر" للمستفيد وربطه بخطة الإخلاء.',
        weight: 'critical',
        clause: '6.1'
    },
    {
        id: 'ISO-7-1',
        category: 'الدعم (Support)',
        title: 'الموارد والبنية التحتية',
        description: 'هل بيئة المركز ومعدات التأهيل مناسبة لحالة المستفيد؟',
        requirement: 'تقرير صيانة وقائية للأجهزة المستخدمة مع المستفيد.',
        weight: 'medium',
        clause: '7.1'
    },
    {
        id: 'ISO-8-1',
        category: 'العمليات (Operation)',
        title: 'التخطيط والضبط التشغيلي',
        description: 'هل الخدمات المقدمة (إعاشة، كسوة، علاج) موثقة ومطابقة للمعايير؟',
        requirement: 'اكتمال سجلات العلامات الحيوية وصرف الوجبات والكسوة.',
        weight: 'critical',
        clause: '8.1'
    },
    {
        id: 'ISO-9-1',
        category: 'تقييم الأداء (Performance)',
        title: 'رصد وقياس وتحليل الأداء',
        description: 'هل يتم قياس مدى تحسن حالة المستفيد (الأثر) وليس فقط الخدمات المقدمة؟',
        requirement: 'وجود "مؤشر أداء" (KPI) لقياس التطور في الخطة التأهيلية.',
        weight: 'high',
        clause: '9.1'
    }
];
