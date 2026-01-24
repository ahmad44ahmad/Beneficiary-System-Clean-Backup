-- جدول الحكمة المؤسسية
CREATE TABLE IF NOT EXISTS wisdom_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    -- السؤال المتوقع
    answer TEXT NOT NULL,
    -- الإجابة/الحكمة
    source TEXT,
    -- "المدير السابق رحمه الله"
    source_role TEXT,
    -- "مدير المركز"
    context TEXT,
    -- "أزمة نجران 2015"
    category TEXT CHECK (
        category IN (
            'crisis',
            'staffing',
            'ramadan',
            'operations',
            'quality',
            'families',
            'general'
        )
    ),
    tags TEXT [],
    useful_count INTEGER DEFAULT 0,
    -- عدد مرات الإفادة
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
-- بيانات أولية من ندوب المعارك
INSERT INTO wisdom_entries (
        question,
        answer,
        source,
        context,
        category,
        tags
    )
VALUES (
        'كيف نتعامل مع نقص الكوادر في رمضان؟',
        'في رمضان 2019، واجهنا نقصاً حاداً في الكوادر. الحل كان: 1) تقسيم الورديات لفترات أقصر (6 ساعات بدلاً من 8)، 2) إشراك المتطوعين من الجمعيات الخيرية للأنشطة غير الطبية، 3) تأجيل الإجازات غير الضرورية مع تعويض مالي. المهم: لا تضحي بجودة الرعاية - قلل الأنشطة الثانوية أولاً.',
        'المدير السابق رحمه الله',
        'رمضان 2019 - نقص 40% من الكوادر',
        'staffing',
        ARRAY ['رمضان', 'نقص كوادر', 'تطوع', 'ورديات']
    ),
    (
        'كيف نتعامل مع إفلاس شركة الإعاشة؟',
        'عندما أفلست شركة الإعاشة فجأة في 2018، اتخذنا إجراءات طوارئ: 1) تواصل فوري مع المطاعم المحلية لعقود مؤقتة، 2) طلب دعم من فرع الوزارة لتسريع التعاقد البديل، 3) إشراك أسر المستفيدين في توفير وجبات مؤقتة مع تعويض رمزي. الدرس: دائماً احتفظ بقائمة موردين بديلين.',
        'مدير الخدمات المساندة',
        'أزمة إفلاس شركة الإعاشة 2018',
        'crisis',
        ARRAY ['إعاشة', 'أزمة', 'موردين', 'طوارئ']
    ),
    (
        'كيف نتعامل مع نقل المستفيدين في حالة طوارئ؟',
        'في نقل نجران 2015 أثناء الحرب، نقلنا 47 مستفيداً في ليلة واحدة. المفاتيح: 1) التنسيق المسبق مع الدفاع المدني والهلال الأحمر، 2) ملفات طوارئ جاهزة لكل مستفيد (الأدوية، الحالة، التواصل مع الأسرة)، 3) فريق متقدم يجهز المكان المستقبل، 4) طمأنة المستفيدين بشكل مستمر. النتيجة: صفر حوادث.',
        'مدير المركز السابق',
        'نقل نجران الطارئ 2015',
        'crisis',
        ARRAY ['طوارئ', 'نقل', 'حرب', 'إخلاء']
    ),
    (
        'كيف نحافظ على معنويات الموظفين؟',
        'المعنويات أهم من الميزانية. في أصعب الأوقات: 1) اجتماع صباحي قصير (5 دقائق) للتحفيز، 2) الاعتراف العلني بالإنجازات الصغيرة، 3) مرونة في الجدولة للظروف العائلية، 4) وجبة غداء جماعية أسبوعية على حساب المركز. تذكر: الموظف المحترق يضر المستفيد.',
        'المدير السابق رحمه الله',
        'خبرة 20 سنة',
        'staffing',
        ARRAY ['معنويات', 'احتراق وظيفي', 'تحفيز']
    ),
    (
        'كيف نتعامل مع شكاوى الأسر؟',
        'الشكوى فرصة لا تهديد. القاعدة الذهبية: 1) استمع بصدق دون مقاطعة، 2) اعترف بالمشكلة حتى لو لم تكن خطأك، 3) قدم حلاً ملموساً بموعد محدد، 4) تابع شخصياً. معظم الأسر يريدون أن يُسمعوا، لا أن يُعوضوا. الشفافية تبني الثقة.',
        'رئيس الخدمات الاجتماعية',
        'خبرة متراكمة',
        'families',
        ARRAY ['شكاوى', 'أسر', 'تواصل']
    );
-- سجل قرارات الضمير للتدقيق والتعلم
CREATE TABLE IF NOT EXISTS conscience_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID,
    -- Removed FK constraint for simplicity in demo
    proposed_action TEXT NOT NULL,
    action_type TEXT NOT NULL,
    ethical_score INTEGER NOT NULL,
    -- 0-100
    dignity_impact TEXT CHECK (
        dignity_impact IN ('positive', 'neutral', 'negative')
    ),
    autonomy_impact TEXT,
    -- Optional
    requires_human_approval BOOLEAN DEFAULT false,
    alternatives JSONB,
    -- ["مراقبة مكثفة", "تعيين مرافق"]
    decision TEXT CHECK (
        decision IN (
            'approved',
            'modified',
            'rejected',
            'escalated',
            'auto_approved'
        )
    ),
    human_approver UUID REFERENCES auth.users(id),
    final_action TEXT,
    context JSONB,
    -- {isRamadan: true, isNight: false}
    created_at TIMESTAMP DEFAULT NOW()
);
-- تفعيل RLS
ALTER TABLE wisdom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conscience_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wisdom_read" ON wisdom_entries FOR
SELECT USING (true);
CREATE POLICY "wisdom_write" ON wisdom_entries FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "conscience_read" ON conscience_log FOR
SELECT USING (true);
CREATE POLICY "conscience_write" ON conscience_log FOR
INSERT WITH CHECK (true);
-- Allow system writes