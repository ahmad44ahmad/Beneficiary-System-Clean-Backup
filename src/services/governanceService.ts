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
 * الخيط الذهبي (Golden Thread) — حوكمة الأهداف من رؤية ٢٠٣٠ إلى الخطة الفردية للمستفيد.
 *
 * يعمل بآلية roll-up: نسبة إنجاز كل عقدة = متوسط نسب أبنائها.
 * الأوراق (leaves) فقط تحمل قيمة مدخلة، والباقي يُحتسب تلقائياً.
 * لون الحالة يُشتقّ من النسبة: ≥٨٠٪ على المسار، ٦٠–٧٩٪ تحت الملاحظة، <٦٠٪ متأخر.
 */

interface GoalSeed {
    id: string;
    title: string;
    description: string;
    level: StrategicGoal['level'];
    children?: GoalSeed[];
    /** نسبة الإنجاز — تُستخدم فقط للأوراق؛ العُقَد الأعلى تحتسب من الأبناء */
    leafProgress?: number;
}

const GOAL_TREE: GoalSeed[] = [
    {
        id: 'V2030-1',
        title: 'مجتمع حيوي (رؤية ٢٠٣٠)',
        description: 'تمكين حياة عامرة وصحية للجميع',
        level: 'national',
        children: [
            {
                id: 'MIN-1',
                title: 'تمكين ذوي الإعاقة (الاستراتيجية الوزارية)',
                description: 'ضمان استقلالية واندماج ذوي الإعاقة في المجتمع',
                level: 'ministry',
                children: [
                    {
                        id: 'DEPT-1',
                        title: 'برنامج التأهيل المهني (هدف المركز)',
                        description: 'تأهيل ٥٠ مستفيداً لسوق العمل سنوياً',
                        level: 'department',
                        children: [
                            {
                                id: 'OP-1',
                                title: 'التدريب على الحرف اليدوية',
                                description: 'خطة فردية: إتقان النجارة',
                                level: 'operational',
                                leafProgress: 42,
                            },
                            {
                                id: 'OP-1B',
                                title: 'تدريب على الحاسب الآلي',
                                description: 'خطة فردية: استخدام البريد ومعالج النصوص',
                                level: 'operational',
                                leafProgress: 65,
                            },
                        ],
                    },
                    {
                        id: 'DEPT-2',
                        title: 'الاستقلالية الذاتية (هدف المركز)',
                        description: 'تحسين مهارات الحياة اليومية (ADL)',
                        level: 'department',
                        children: [
                            {
                                id: 'OP-2',
                                title: 'جلسات العلاج الوظيفي',
                                description: 'تدريب على الأكل والشرب باستقلالية',
                                level: 'operational',
                                leafProgress: 88,
                            },
                            {
                                id: 'OP-2B',
                                title: 'الإمساك بكوب الماء بشكل مستقل',
                                description: 'خطة فردية لـ«أبو سعد» — ٠٪ → ٨٠٪ خلال ١٢ أسبوعاً',
                                level: 'operational',
                                leafProgress: 44,
                            },
                        ],
                    },
                    {
                        id: 'DEPT-2C',
                        title: 'جسر الأسرة (هدف تجربة المستفيد)',
                        description: 'تفاعل أسري أسبوعي ≥ ٥٠٪',
                        level: 'department',
                        children: [
                            {
                                id: 'OP-3',
                                title: 'إرسال محتوى مرئي للأسر بعد اعتماد الإدارة',
                                description: 'مؤشر تفاعل أسبوعي',
                                level: 'operational',
                                leafProgress: 72,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: 'V2030-2',
        title: 'اقتصاد مزدهر (رؤية ٢٠٣٠)',
        description: 'رفع كفاءة الإنفاق الحكومي',
        level: 'national',
        children: [
            {
                id: 'MIN-2',
                title: 'الاستدامة المالية (الاستراتيجية الوزارية)',
                description: 'تطبيق معايير كفاءة الإنفاق',
                level: 'ministry',
                children: [
                    {
                        id: 'DEPT-3',
                        title: 'خفض الهدر الغذائي',
                        description: 'تقليل فائض الطعام بنسبة ٢٠٪',
                        level: 'department',
                        children: [
                            {
                                id: 'OP-4',
                                title: 'لجنة الاستلام بالتوقيعات الرقمية',
                                description: 'تطبيق محضر استلام يومي بصفر ورق',
                                level: 'operational',
                                leafProgress: 95,
                            },
                        ],
                    },
                    {
                        id: 'DEPT-4',
                        title: 'الالتزام التعاقدي والتشغيلي',
                        description: 'متابعة عقود (نظافة، صيانة، إعاشة، رعاية شخصية)',
                        level: 'department',
                        children: [
                            {
                                id: 'OP-5',
                                title: 'رفع الفواتير الإلكترونية الشهرية',
                                description: 'قبل اليوم ٢٥ من الشهر',
                                level: 'operational',
                                leafProgress: 80,
                            },
                            {
                                id: 'OP-6',
                                title: 'تقييم حالة المباني والوصولية',
                                description: 'جولة ميدانية ربع سنوية',
                                level: 'operational',
                                leafProgress: 70,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

function statusFromProgress(progress: number): StrategicGoal['status'] {
    if (progress >= 80) return 'on_track';
    if (progress >= 60) return 'at_risk';
    return 'delayed';
}

function buildGoalNode(seed: GoalSeed): StrategicGoal {
    const children = seed.children?.map(buildGoalNode);
    let progress: number;
    if (children && children.length > 0) {
        const sum = children.reduce((acc, c) => acc + c.progress, 0);
        progress = Math.round(sum / children.length);
    } else {
        progress = seed.leafProgress ?? 0;
    }
    return {
        id: seed.id,
        title: seed.title,
        description: seed.description,
        level: seed.level,
        progress,
        status: statusFromProgress(progress),
        children,
    };
}

export const getGovernanceTree = (): StrategicGoal[] => GOAL_TREE.map(buildGoalNode);
