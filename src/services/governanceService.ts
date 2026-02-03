export interface StrategicGoal {
    id: string;
    title: string;
    description: string;
    level: 'national' | 'ministry' | 'department' | 'operational';
    children?: StrategicGoal[];
    progress: number;
    status: 'on_track' | 'at_risk' | 'delayed';
}

/**
 * FEATURE 4: THE GOLDEN THREAD (Governance)
 * Mock service to demonstrate the "Line of Sight" from Vision 2030 to Daily Tasks.
 */
export const getGovernanceTree = (): StrategicGoal[] => {
    return [
        {
            id: 'V2030-1',
            title: 'مجتمع حيوي (Vision 2030)',
            description: 'تمكين حياة عامرة وصحية للجميع',
            level: 'national',
            progress: 85,
            status: 'on_track',
            children: [
                {
                    id: 'MIN-1',
                    title: 'تمكين ذوي الإعاقة (HRSD Strategic)',
                    description: 'ضمان استقلالية واندماج ذوي الإعاقة في المجتمع',
                    level: 'ministry',
                    progress: 78,
                    status: 'on_track',
                    children: [
                        {
                            id: 'DEPT-1',
                            title: 'برنامج التأهيل المهني (Center Goal)',
                            description: 'تأهيل 50 مستفيد لسوق العمل سنوياً',
                            level: 'department',
                            progress: 65,
                            status: 'at_risk',
                            children: [
                                {
                                    id: 'OP-1',
                                    title: 'التدريب على الحرف اليدوية (Beneficiary Plan)',
                                    description: 'خطة محمد علي: اتقان النجارة',
                                    level: 'operational',
                                    progress: 40,
                                    status: 'delayed'
                                }
                            ]
                        },
                        {
                            id: 'DEPT-2',
                            title: 'الاستقلالية الذاتية (Center Goal)',
                            description: 'تحسين مهارات الحياة اليومية (ADL)',
                            level: 'department',
                            progress: 88,
                            status: 'on_track',
                            children: [
                                {
                                    id: 'OP-2',
                                    title: 'جلسات العلاج الوظيفي (Beneficiary Plan)',
                                    description: 'تدريب على الأكل والشرب باستقلالية',
                                    level: 'operational',
                                    progress: 90,
                                    status: 'on_track'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'V2030-2',
            title: 'اقتصاد مزدهر (Vision 2030)',
            description: 'رفع كفاءة الإنفاق الحكومي',
            level: 'national',
            progress: 92,
            status: 'on_track',
            children: [
                {
                    id: 'MIN-2',
                    title: 'الاستدامة المالية (HRSD Strategic)',
                    description: 'تطبيق معايير الكفاءة التشغيلية',
                    level: 'ministry',
                    progress: 95,
                    status: 'on_track',
                    children: [
                        {
                            id: 'DEPT-3',
                            title: 'خفض الهدر الغذائي (Operations)',
                            description: 'تقليل فائض الطعام بنسبة 20%',
                            level: 'department',
                            progress: 95,
                            status: 'on_track'
                        }
                    ]
                }
            ]
        }
    ];
};
