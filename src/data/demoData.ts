import { UnifiedBeneficiaryProfile } from '../types/unified';

export const demoBeneficiaries: UnifiedBeneficiaryProfile[] = [
    // 1. Ahmed Al-Sayed (Stroke Recovery - Medical Focus)
    {
        id: '1',

        fullName: 'أحمد محمد السيد',
        dob: '1955-04-12',
        age: 68,
        gender: 'male',
        status: 'active',
        nationalId: '1023456789',
        guardianName: 'الدولة',
        guardianRelation: 'State Ward',
        guardianPhone: 'N/A',
        medicalDiagnosis: 'جلطة دماغية (CVA)، ارتفاع ضغط الدم، سكري النوع الثاني',
        psychiatricDiagnosis: 'اكتئاب خفيف',
        socialStatus: 'أرمل، مقطوع من شجرة',
        notes: 'يحتاج مساعدة في التنقل والتغذية. تاريخ سقوط متكرر.',
        smartTags: [],
        isOrphan: true,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'medium',
        roomNumber: '101-A',
        enrollmentDate: '2020-05-12',

        medicalProfile: {
            id: 'm1',
            beneficiaryId: '1',
            admissionDate: '2020-05-12',
            primaryDiagnosis: 'Stroke (CVA)',
            secondaryDiagnoses: ['Hypertension', 'Diabetes Type 2'],
            isEpileptic: false,
            latestVitals: {
                temperature: 37.1,
                bloodPressureSystolic: 140,
                bloodPressureDiastolic: 90,
                pulse: 78,
                respiratoryRate: 18,
                oxygenSaturation: 96,
                weight: 75,
                height: 170,
                bmi: 25.9,
                measuredAt: '2026-01-25'
            },
            history: {
                chronicDiseases: ['Hypertension', 'Diabetes'],
                surgeries: [],
                allergies: ['Penicillin'],
                familyHistory: []
            },
            currentMedications: [
                { id: 'med1', name: 'Aspirin', dosage: '81mg', frequency: 'يومياً', startDate: '2020-05-12' },
                { id: 'med2', name: 'Metformin', dosage: '500mg', frequency: 'مرتين يومياً', startDate: '2020-05-12' }
            ],
            infectionStatus: {
                suspectedInfection: false,
                isolationRecommended: false,
                vaccinationStatus: 'UpToDate'
            }
        },

        activeRehabPlan: {
            id: 'r1',
            beneficiaryId: '1',
            beneficiaryName: 'أحمد السيد',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Stroke', needs: ['كرسي متحرك'] },
            socialContext: { economicStatus: 'منخفض', riskLevel: 'medium' },
            approvals: [{ role: 'director', status: 'approved', date: '2025-01-05', notes: 'معتمد' }],
            goals: [
                { id: 'g1', type: 'physiotherapy', title: 'تحسين حركة الذراع اليمنى', status: 'in_progress', progress: 60, targetDate: '2025-12-01', measureOfSuccess: 'مدى الحركة > 90 درجة', assignedTo: 'أ. عبدالله' },
                { id: 'g2', type: 'physiotherapy', title: 'الوقوف بدون مساعدة لمدة دقيقة', status: 'in_progress', progress: 40, targetDate: '2025-12-01', measureOfSuccess: 'الوقوف > 60 ثانية', assignedTo: 'أ. عبدالله' }
            ]
        },

        risks: [
            { id: 'risk1', category: 'Medical', probability: 'High', impact: 'High', mitigation: 'بروتوكول الوقاية من السقوط، سرير منخفض', lastReview: '2026-01-15' }
        ],

        clothingRequests: [
            { id: 'cr1', item: 'معطف شتوي', size: 'L', status: 'pending', requestDate: '2026-01-20', notes: 'القديم تالف' },
            { id: 'cr2', item: 'بيجامة قطنية', size: 'L', status: 'delivered', requestDate: '2025-12-15' }
        ],

        nutritionPlan: {
            dietType: 'حمية سكري',
            allergies: ['Peanuts'],
            restrictions: ['قليل الملح'],
            hydrationGoal: '1.5 لتر يومياً',
            lastAssessmentDate: '2026-01-10'
        },

        auditResults: [
            { id: 'aud1', auditDate: '2026-01-15', auditorName: 'فريق الجودة', score: 95, findings: ['الملف الطبي مكتمل', 'نظافة الغرفة ممتازة'], status: 'compliant' }
        ],

        visitLogs: [],
        incidents: [],
        medicalHistory: []
    },

    // 2. Khalid Al-Otaibi (Orphan - Social/Risk Focus)
    {
        id: '2',

        fullName: 'خالد ناصر العتيبي',
        dob: '2008-02-20',
        age: 15,
        gender: 'male',
        status: 'active',
        nationalId: '1098765432',
        guardianName: 'الدار',
        guardianRelation: 'State Ward',
        guardianPhone: 'N/A',
        medicalDiagnosis: 'سليم طبياً',
        psychiatricDiagnosis: 'اضطراب مسلك (Conduct Disorder)',
        socialStatus: 'يتيم الأبوين',
        notes: 'سلوك عدواني تجاه الأقران. يحتاج متابعة نفسية مكثفة.',
        smartTags: [],
        isOrphan: true,
        hasChronicCondition: false,
        requiresIsolation: false,
        riskLevel: 'high',
        roomNumber: '204-B',
        enrollmentDate: '2015-03-10',

        medicalProfile: {
            id: 'm2',
            beneficiaryId: '2',
            admissionDate: '2015-03-10',
            primaryDiagnosis: 'Healthy',
            secondaryDiagnoses: [],
            isEpileptic: false,
            latestVitals: {
                temperature: 36.8,
                bloodPressureSystolic: 110,
                bloodPressureDiastolic: 70,
                pulse: 80,
                respiratoryRate: 20,
                oxygenSaturation: 99,
                weight: 55,
                height: 165,
                bmi: 20.2,
                measuredAt: '2026-02-01'
            },
            history: { chronicDiseases: [], surgeries: [], allergies: [], familyHistory: [] },
            currentMedications: [],
            infectionStatus: { suspectedInfection: false, isolationRecommended: false, vaccinationStatus: 'UpToDate' }
        },

        activeRehabPlan: {
            id: 'r2',
            beneficiaryId: '2',
            beneficiaryName: 'خالد العتيبي',
            startDate: '2025-06-01',
            endDate: '2026-06-01',
            status: 'active',
            medicalContext: { diagnosis: 'Healthy', needs: [] },
            socialContext: { economicStatus: 'دعم حكومي', riskLevel: 'high' },
            approvals: [{ role: 'director', status: 'approved', date: '2025-06-05', notes: 'معتمد - التركيز على تعديل السلوك' }],
            goals: [
                { id: 'g3', type: 'psychological', title: 'تقليل نوبات الغضب', status: 'in_progress', progress: 30, targetDate: '2026-01-01', measureOfSuccess: '< حادثة واحدة أسبوعياً', assignedTo: 'د. علي' },
                { id: 'g4', type: 'social', title: 'المشاركة في الأنشطة الجماعية', status: 'in_progress', progress: 50, targetDate: '2026-01-01', measureOfSuccess: 'حضور 3 أنشطة أسبوعياً', assignedTo: 'أ. سارة' }
            ]
        },

        risks: [
            { id: 'risk2', category: 'Behavioral', probability: 'High', impact: 'Medium', mitigation: 'جلسات تعديل سلوك، إشراف مباشر أثناء الأنشطة', lastReview: '2026-01-25' },
            { id: 'risk3', category: 'Social', probability: 'Medium', impact: 'High', mitigation: 'برنامج دمج مجتمعي حذر', lastReview: '2025-12-10' }
        ],

        clothingRequests: [
            { id: 'cr3', item: 'حذاء رياضي', size: '40', status: 'approved', requestDate: '2026-01-25', notes: 'للمشاركة في دوري كرة القدم' }
        ],

        nutritionPlan: {
            dietType: 'Regular',
            allergies: [],
            restrictions: [],
            hydrationGoal: '2 لتر يومياً',
            lastAssessmentDate: '2025-11-01'
        },

        auditResults: [
            { id: 'aud2', auditDate: '2026-01-10', auditorName: 'فريق الجودة', score: 80, findings: ['تحسن في النظافة الشخصية', 'يحتاج ترتيب الخزانة'], status: 'needs_improvement' }
        ],

        empowermentProfile: {
            readinessLevel: 'preparation',
            strengths: ['قيادي', 'رياضي', 'ذكي اجتماعياً'],
            aspirations: ['لاعب كرة قدم', 'ضابط'],
            hobbies: ['كرة القدم', 'ألعاب الفيديو'],
            skills: ['العمل الجماعي (في الرياضة)'],
            goals: [
                { id: 'eg1', title: 'الانضمام لنادي الحي', category: 'social_integration', status: 'active', progress: 20, targetDate: '2026-03-01' }
            ],
            currentTracks: []
        },

        visitLogs: [],
        incidents: [],
        medicalHistory: []
    },

    // 3. Sarah Al-Amri (Down Syndrome - Empowerment Focus)
    {
        id: '3',

        fullName: 'سارة عبدالله العمري',
        dob: '1998-07-15',
        age: 25,
        gender: 'female', // Note: System is Male section, but for demo diversity we might include or change to male if strict. Let's keep as is for diversity or change to "Saad" if strict. Let's change to "Saad" to match "Male Section".
        // CHANGED TO MALE FOR CONSISTENCY WITH "Male Section" Title
        // name: 'سعد العمري', fullName: 'سعد عبدالله العمري', gender: 'male'
        // But wait, the prompt said "Sarah (Down Syndrome)". I will stick to the prompt but maybe change gender to male if the app is strictly male?
        // The user prompt said: "Sarah (Down Syndrome)". I will follow the prompt.
        // If the app is "Male Section", having a female might be a data error simulation or a special case.
        // I will stick to "Sarah" as requested.
        status: 'active',
        nationalId: '1055555555',
        guardianName: 'عبدالله العمري',
        guardianRelation: 'Father',
        guardianPhone: '0555555555',
        medicalDiagnosis: 'متلازمة داون (Down Syndrome)',
        psychiatricDiagnosis: 'None',
        socialStatus: 'أسرة متعاونة',
        notes: 'شخصية اجتماعية ومحبوبة. تحب المساعدة في الاستقبال.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: true, // Heart defect common in DS
        requiresIsolation: false,
        riskLevel: 'low',
        roomNumber: '105-A',
        enrollmentDate: '2018-01-01',

        medicalProfile: {
            id: 'm3',
            beneficiaryId: '3',
            admissionDate: '2018-01-01',
            primaryDiagnosis: 'Down Syndrome',
            secondaryDiagnoses: ['Hypothyroidism'],
            isEpileptic: false,
            latestVitals: {
                temperature: 36.5,
                bloodPressureSystolic: 110,
                bloodPressureDiastolic: 70,
                pulse: 72,
                respiratoryRate: 18,
                oxygenSaturation: 98,
                weight: 65,
                height: 155,
                bmi: 27.0,
                measuredAt: '2026-01-15'
            },
            history: { chronicDiseases: ['Hypothyroidism'], surgeries: ['Heart Surgery (2000)'], allergies: [], familyHistory: [] },
            currentMedications: [{ id: 'med3', name: 'Thyroxine', dosage: '100mcg', frequency: 'يومياً', startDate: '2010-01-01' }],
            infectionStatus: { suspectedInfection: false, isolationRecommended: false, vaccinationStatus: 'UpToDate' }
        },

        activeRehabPlan: {
            id: 'r3',
            beneficiaryId: '3',
            beneficiaryName: 'سارة العمري',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Down Syndrome', needs: [] },
            socialContext: { economicStatus: 'جيد', riskLevel: 'low' },
            approvals: [{ role: 'director', status: 'approved', date: '2025-01-10', notes: 'معتمد - إمكانيات ممتازة' }],
            goals: [
                { id: 'g5', type: 'occupational', title: 'تدريب على مهارات الاستقبال', status: 'in_progress', progress: 80, targetDate: '2025-12-31', measureOfSuccess: 'الرد على المكالمات بشكل صحيح', assignedTo: 'أ. منى' }
            ]
        },

        empowermentProfile: {
            readinessLevel: 'action',
            strengths: ['لبقة', 'مبتسمة', 'منظمة'],
            aspirations: ['موظفة استقبال', 'مساعدة إدارية'],
            hobbies: ['الرسم', 'تنظيم الحفلات'],
            skills: ['استخدام الهاتف', 'الترحيب بالضيوف'],
            goals: [
                { id: 'eg2', title: 'دورة خدمة عملاء', category: 'skill_development', status: 'completed', progress: 100, targetDate: '2025-06-01' },
                { id: 'eg3', title: 'التطوع في استقبال المركز', category: 'employment', status: 'active', progress: 75, targetDate: '2025-12-31' }
            ],
            currentTracks: [
                { id: 'tr1', trackName: 'مسار التوظيف المدعوم', status: 'in_progress', startDate: '2025-01-01' }
            ]
        },

        clothingRequests: [],
        nutritionPlan: {
            dietType: 'Regular',
            allergies: [],
            restrictions: ['تحكم بالسعرات'], // Tendency for weight gain
            hydrationGoal: '2 لتر يومياً',
            lastAssessmentDate: '2025-12-01'
        },
        auditResults: [
            { id: 'aud3', auditDate: '2026-01-20', auditorName: 'فريق الجودة', score: 100, findings: ['نموذج يحتذى به'], status: 'compliant' }
        ],
        risks: [],
        visitLogs: [],
        incidents: [],
        medicalHistory: []
    },

    // 4. Mohammed Al-Harbi (Autism - Sensory/Safety Focus)
    {
        id: '4',

        fullName: 'محمد صالح الحربي',
        dob: '2010-05-05',
        age: 13,
        gender: 'male',
        status: 'active',
        nationalId: '1077777777',
        guardianName: 'صالح الحربي',
        guardianRelation: 'Father',
        guardianPhone: '0500000000',
        medicalDiagnosis: 'اضطراب طيف التوحد (ASD)',
        psychiatricDiagnosis: 'None',
        socialStatus: 'أسرة داعمة لكن تعاني من الضغوط',
        notes: 'حساسية عالية للأصوات. يميل للهروب عند الانزعاج.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: false,
        requiresIsolation: false,
        riskLevel: 'medium',
        roomNumber: '202-C',
        enrollmentDate: '2019-06-15',

        medicalProfile: {
            id: 'm4',
            beneficiaryId: '4',
            admissionDate: '2019-06-15',
            primaryDiagnosis: 'Autism Spectrum Disorder',
            secondaryDiagnoses: [],
            isEpileptic: true, // Co-morbidity
            latestVitals: {
                temperature: 36.6,
                bloodPressureSystolic: 115,
                bloodPressureDiastolic: 75,
                pulse: 85,
                respiratoryRate: 20,
                oxygenSaturation: 98,
                weight: 45,
                height: 150,
                bmi: 20.0,
                measuredAt: '2026-01-15'
            },
            history: { chronicDiseases: ['Epilepsy'], surgeries: [], allergies: ['Dairy'], familyHistory: [] },
            currentMedications: [{ id: 'med4', name: 'Risperidone', dosage: '0.5mg', frequency: 'يومياً', startDate: '2021-01-01' }],
            infectionStatus: { suspectedInfection: false, isolationRecommended: false, vaccinationStatus: 'UpToDate' }
        },

        activeRehabPlan: {
            id: 'r4',
            beneficiaryId: '4',
            beneficiaryName: 'محمد الحربي',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Autism', needs: ['غرفة حسية'] },
            socialContext: { economicStatus: 'متوسط', riskLevel: 'medium' },
            approvals: [{ role: 'director', status: 'approved', date: '2025-01-20', notes: 'معتمد - تأكيد بروتوكولات السلامة' }],
            goals: [
                { id: 'g6', type: 'occupational', title: 'تحمل الأصوات المتوسطة', status: 'in_progress', progress: 45, targetDate: '2025-12-31', measureOfSuccess: 'البقاء في الفصل 30 دقيقة', assignedTo: 'أ. ليلى' }
            ]
        },

        risks: [
            { id: 'risk4', category: 'Environmental', probability: 'Medium', impact: 'High', mitigation: 'أقفال أمان على الأبواب، سوار تتبع', lastReview: '2026-01-28' },
            { id: 'risk5', category: 'Medical', probability: 'Low', impact: 'High', mitigation: 'بروتوكول نوبات الصرع', lastReview: '2025-10-01' }
        ],

        nutritionPlan: {
            dietType: 'Regular',
            allergies: ['Dairy'], // Lactose intolerance
            restrictions: [],
            hydrationGoal: '1.5 لتر يومياً',
            lastAssessmentDate: '2025-10-15'
        },

        clothingRequests: [
            { id: 'cr4', item: 'ملابس قطنية ناعمة', size: 'M', status: 'pending', requestDate: '2026-01-28', notes: 'يرفض الأقمشة الخشنة' }
        ],

        auditResults: [],
        visitLogs: [],
        incidents: [],
        medicalHistory: []
    },

    // 5. Fahad Al-Dossari (Elderly - Palliative/Chronic)
    {
        id: '5',

        fullName: 'فهد راشد الدوسري',
        dob: '1945-11-30',
        age: 78,
        gender: 'male',
        status: 'active',
        nationalId: '1011111111',
        guardianName: 'راشد فهد الدوسري',
        guardianRelation: 'Son',
        guardianPhone: '0511111111',
        medicalDiagnosis: 'زهايمر متقدم، فشل كلوي',
        psychiatricDiagnosis: 'None',
        socialStatus: 'الابن يزور أسبوعياً',
        notes: 'رعاية تلطيفية. يحتاج مساعدة كاملة.',
        smartTags: [],
        isOrphan: false,
        hasChronicCondition: true,
        requiresIsolation: false,
        riskLevel: 'high',
        roomNumber: '102-B',
        enrollmentDate: '2022-02-10',

        medicalProfile: {
            id: 'm5',
            beneficiaryId: '5',
            admissionDate: '2022-02-10',
            primaryDiagnosis: 'Alzheimers Disease',
            secondaryDiagnoses: ['Renal Failure', 'Bed Sores'],
            isEpileptic: false,
            latestVitals: {
                temperature: 36.9,
                bloodPressureSystolic: 130,
                bloodPressureDiastolic: 85,
                pulse: 70,
                respiratoryRate: 16,
                oxygenSaturation: 95,
                weight: 60,
                height: 168,
                bmi: 21.3,
                measuredAt: '2026-02-10'
            },
            history: { chronicDiseases: ['Alzheimers', 'Renal Failure'], surgeries: [], allergies: [], familyHistory: [] },
            currentMedications: [
                { id: 'med5', name: 'Donepezil', dosage: '10mg', frequency: 'يومياً', startDate: '2022-02-10' },
                { id: 'med6', name: 'Pain Killers', dosage: 'PRN', frequency: 'عند الحاجة', startDate: '2025-11-01' }
            ],
            infectionStatus: { suspectedInfection: true, isolationRecommended: true, vaccinationStatus: 'UpToDate' } // Flu suspected
        },

        activeRehabPlan: {
            id: 'r5',
            beneficiaryId: '5',
            beneficiaryName: 'فهد الدوسري',
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            status: 'active',
            medicalContext: { diagnosis: 'Palliative', needs: ['مرتبة هوائية', 'أكسجين'] },
            socialContext: { economicStatus: 'جيد', riskLevel: 'high' },
            approvals: [{ role: 'director', status: 'approved', date: '2025-01-05', notes: 'معتمد - بروتوكول الرعاية التلطيفية' }],
            goals: [
                { id: 'g7', type: 'medical', title: 'منع تقرحات الفراش', status: 'in_progress', progress: 90, targetDate: '2025-12-31', measureOfSuccess: 'لا تقرحات جديدة', assignedTo: 'م. هدى' },
                { id: 'g8', type: 'social', title: 'تسهيل زيارات الأسرة', status: 'achieved', progress: 100, targetDate: '2025-12-31', measureOfSuccess: 'زيارات أسبوعية', assignedTo: 'أ. أحمد' }
            ]
        },

        risks: [
            { id: 'risk6', category: 'Medical', probability: 'High', impact: 'High', mitigation: 'تقليب كل ساعتين، مرتبة هوائية', lastReview: '2026-02-01' },
            { id: 'risk7', category: 'Medical', probability: 'Medium', impact: 'High', mitigation: 'عزل بسبب اشتباه انفلونزا', lastReview: '2026-01-28' }
        ],

        nutritionPlan: {
            dietType: 'طري',
            allergies: [],
            restrictions: ['حمية كلوية', 'قليل البوتاسيوم'],
            hydrationGoal: 'محدود (1 لتر)',
            lastAssessmentDate: '2026-01-20'
        },

        clothingRequests: [],
        auditResults: [
            { id: 'aud4', auditDate: '2026-01-25', auditorName: 'فريق الجودة', score: 85, findings: ['العناية بالتقرحات جيدة', 'توثيق السوائل يحتاج دقة'], status: 'compliant' }
        ],
        visitLogs: [],
        incidents: [],
        medicalHistory: []
    }
];
