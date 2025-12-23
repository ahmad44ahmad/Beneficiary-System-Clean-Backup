export interface DignityProfile {
    id: string;
    beneficiaryId: string;

    // Core Identity
    nickname?: string; // What they like to be called
    personalityType: 'social' | 'introverted' | 'energetic' | 'calm' | 'observer';
    personalityDescription: string;

    // My Comfort (The "Dignity" Aspect)
    sensoryPreferences: {
        lighting: 'dim' | 'bright' | 'natural' | 'any';
        noise: 'quiet' | 'moderate' | 'lively' | 'any';
        temperature: 'cool' | 'warm' | 'normal';
        smells?: string[]; // E.g., likes lavender, hates bleach
    };

    // Preferences
    favorites: {
        food: string[];
        activities: string[];
        places: string[]; // Within the center or outside
        people: string[]; // Favorite staff or peers
        colors: string[];
    };

    dislikes: {
        food: string[];
        triggers: string[]; // What upsets them
        fears: string[];
    };

    // Communication
    communicationStyle: 'verbal' | 'sign_language' | 'gestures' | 'pictures' | 'mixed';
    bestWayToEngage: string; // Tip for staff

    // The "Deeds" Log (Small wins and contributions)
    deeds: {
        id: string;
        date: string;
        title: string;
        description: string;
        category: 'spiritual' | 'social' | 'personal' | 'creative' | 'helping_others';
        impactLevel: 'high' | 'medium' | 'low';
        verifiedBy?: string; // Staff name
    }[];

    lastUpdated: string;
}

// Mock Data for Development
export const MOCK_DIGNITY_PROFILES: DignityProfile[] = [
    {
        id: 'dp1',
        beneficiaryId: '101', // Linked to 'أحمد محمد' or similar active beneficiary
        nickname: 'أبو حميد',
        personalityType: 'social',
        personalityDescription: 'يحب التحدث مع الجميع، ويبادر بالسلام. ابتسامته دائمة وتنعكس إيجابياً على من حوله.',
        sensoryPreferences: {
            lighting: 'bright',
            noise: 'lively',
            temperature: 'cool',
            smells: ['العود', 'المسك']
        },
        favorites: {
            food: ['كبسة دجاج', 'فواكه', 'عصير برتقال'],
            activities: ['كرة القدم', 'مشاهدة التلفاز', 'جلسات الشاي'],
            places: ['الحديقة الخارجية', 'المصلى'],
            people: ['المشرف خالد', 'الزميل سعيد'],
            colors: ['أزرق', 'أخضر']
        },
        dislikes: {
            food: ['باذنجان', 'سمك'],
            triggers: ['الصوت العالي المفاجئ', 'تأخير الوجبات'],
            fears: ['الظلام']
        },
        communicationStyle: 'verbal',
        bestWayToEngage: 'ابدأ بالسلام واسأله عن أخبار فريقه المفضل.',
        deeds: [
            {
                id: 'd1',
                date: '2025-12-10',
                title: 'مساعدة زميل',
                description: 'قام بمساعدة زميله المقعد في الوصول إلى صالة الطعام.',
                category: 'helping_others',
                impactLevel: 'high',
                verifiedBy: 'أ. صالح'
            },
            {
                id: 'd2',
                date: '2025-12-12',
                title: 'حفظ سورة قصيرة',
                description: 'أتم حفظ سورة الإخلاص بنجاح.',
                category: 'spiritual',
                impactLevel: 'medium',
                verifiedBy: 'أ. محمد'
            }
        ],
        lastUpdated: '2025-12-18'
    }
];
