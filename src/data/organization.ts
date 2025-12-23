export interface OrgNode {
    id: string;
    label: string;
    type: 'manager' | 'department' | 'unit';
    children?: OrgNode[];
}

export const CENTER_STRUCTURE: OrgNode = {
    id: 'manager',
    label: 'إدارة مركز التأهيل الشامل',
    type: 'manager',
    children: [
        {
            id: 'secretariat',
            label: 'السكرتارية',
            type: 'department'
        },
        {
            id: 'quality',
            label: 'قسم الجودة',
            type: 'department'
        },
        {
            id: 'medical',
            label: 'قسم الخدمات الطبية',
            type: 'department',
            children: [
                { id: 'med_therapy', label: 'العلاج الطبي', type: 'unit' },
                { id: 'rehab_therapy', label: 'العلاج التأهيلي', type: 'unit' }
            ]
        },
        {
            id: 'finance',
            label: 'قسم المالية والتشغيل',
            type: 'department',
            children: [
                { id: 'custody', label: 'العهد', type: 'unit' },
                { id: 'purchasing', label: 'الصرف والمشتريات', type: 'unit' },
                { id: 'ops_maint', label: 'التشغيل والصيانة', type: 'unit' }
            ]
        },
        {
            id: 'social',
            label: 'قسم الخدمات الاجتماعية',
            type: 'department',
            children: [
                { id: 'comm_rehab', label: 'التأهيل المجتمعي', type: 'unit' },
                { id: 'internal_followup', label: 'المتابعة الداخلية', type: 'unit' },
                { id: 'family_rehab', label: 'التأهيل الأسري', type: 'unit' }
            ]
        },
        {
            id: 'support',
            label: 'قسم الخدمات المساندة',
            type: 'department',
            children: [
                { id: 'admin_comm', label: 'الاتصالات الإدارية', type: 'unit' },
                { id: 'hr', label: 'الموارد البشرية', type: 'unit' },
                { id: 'it', label: 'تقنية المعلومات', type: 'unit' },
                { id: 'security', label: 'الأمن والسلامة', type: 'unit' },
                { id: 'pr', label: 'العلاقات العامة والإعلام', type: 'unit' }
            ]
        }
    ]
};
