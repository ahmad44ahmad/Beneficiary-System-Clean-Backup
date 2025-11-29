import { VisitLog } from '../types';

export const visitLogs: VisitLog[] = [
    {
        id: 'log_1',
        beneficiaryId: '1401',
        type: 'internal',
        date: '2023-10-01',
        time: '10:00',
        visitorName: 'محمد علي',
        relation: 'أخ',
        notes: 'زيارة عائلية دورية، الحالة مستقرة.',
        employeeName: 'سعيد الغامدي'
    },
    {
        id: 'log_2',
        beneficiaryId: '1401',
        type: 'behavioral',
        date: '2023-10-05',
        time: '14:30',
        notes: 'لوحظ بعض الانفعال أثناء وجبة الغداء.',
        employeeName: 'خالد العتيبي'
    },
    {
        id: 'log_3',
        beneficiaryId: '365',
        type: 'emergency',
        date: '2023-10-10',
        time: '03:00',
        notes: 'ارتفاع مفاجئ في درجة الحرارة، تم استدعاء الطبيب.',
        employeeName: 'المناوب الليلي'
    }
];
