import { IncomingMail, OutgoingMail, MeetingMinute } from '../types';

export const incomingMail: IncomingMail[] = [
    {
        id: '1',
        date: '2024-01-15',
        subject: 'تعميم بخصوص إجازة العيد',
        sender: 'الوزارة - فرع المنطقة',
        receiverDept: 'إدارة المركز',
        letterNumber: 'IN-2024-001',
        priority: 'normal',
        status: 'processed',
        notes: 'تم التعميم على جميع الأقسام'
    },
    {
        id: '2',
        date: '2024-01-20',
        subject: 'طلب بيانات المستفيدين للربع الأول',
        sender: 'وكالة الوزارة للرعاية',
        receiverDept: 'الخدمات الاجتماعية',
        letterNumber: 'IN-2024-005',
        priority: 'urgent',
        status: 'pending'
    }
];

export const outgoingMail: OutgoingMail[] = [
    {
        id: '1',
        date: '2024-01-18',
        subject: 'رفع احتياج الكادر التمريضي',
        destination: 'إدارة الموارد البشرية - الفرع',
        senderDept: 'الخدمات الطبية',
        letterNumber: 'OUT-2024-003',
        priority: 'urgent',
        status: 'sent'
    }
];

export const meetingMinutes: MeetingMinute[] = [
    {
        id: '1',
        date: '2024-01-10',
        time: '09:00',
        location: 'قاعة الاجتماعات الرئيسية',
        attendees: ['مدير المركز', 'رئيس القسم الطبي', 'رئيس الخدمات الاجتماعية', 'المدير المالي'],
        agenda: 'مناقشة الخطة التشغيلية للعام الجديد',
        decisions: 'اعتماد الخطة المقترحة مع تعديل بند الصيانة',
        actionItems: [
            { task: 'تحديث عقود الصيانة', assignee: 'رئيس قسم الصيانة', dueDate: '2024-02-01', status: 'pending' },
            { task: 'رفع خطة الأنشطة', assignee: 'رئيس الخدمات الاجتماعية', dueDate: '2024-01-25', status: 'completed' }
        ]
    }
];
