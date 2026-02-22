-- Catering & Nutrition Module Schema
-- 1. Catering Items (Menu Database)
CREATE TABLE IF NOT EXISTS public.catering_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ar TEXT NOT NULL,
    category TEXT CHECK (
        category IN (
            'طبق رئيسي',
            'مقبلات',
            'حلويات',
            'مشروبات',
            'خبز',
            'سلطة'
        )
    ),
    calories INTEGER,
    protein_g DECIMAL(5, 1),
    carbs_g DECIMAL(5, 1),
    fat_g DECIMAL(5, 1),
    is_diabetic_friendly BOOLEAN DEFAULT false,
    is_soft_diet_friendly BOOLEAN DEFAULT false,
    allergens TEXT [],
    -- e.g., ['قمح', 'بيض', 'حليب']
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Dietary Plans (Linked to Beneficiaries)
CREATE TABLE IF NOT EXISTS public.dietary_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (
        plan_type IN (
            'قياسي',
            'سكري',
            'كلوى',
            'لين',
            'سائل',
            'مهروس',
            'خالي من القمح'
        )
    ),
    allergies TEXT [] DEFAULT '{}',
    disliked_items TEXT [] DEFAULT '{}',
    special_instructions TEXT,
    last_assessment_date DATE DEFAULT CURRENT_DATE,
    nutritionist_id UUID REFERENCES public.employees(id),
    -- Optional: if we have a nutritionist user
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id) -- One active plan per beneficiary
);
-- 3. Daily Meals (Execution Log)
CREATE TABLE IF NOT EXISTS public.daily_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL CHECK (
        meal_type IN (
            'فطور',
            'غداء',
            'عشاء',
            'وجبة خفيفة 1',
            'وجبة خفيفة 2'
        )
    ),
    -- Status Workflow
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'preparing',
            'ready',
            'delivered',
            'consumed',
            'refused'
        )
    ),
    -- Content (Snapshot of what was served)
    items JSONB DEFAULT '[]',
    -- Array of { item_id, name, portion }
    -- Outcome
    consumption_percentage INTEGER CHECK (
        consumption_percentage BETWEEN 0 AND 100
    ),
    refusal_reason TEXT,
    notes TEXT,
    delivered_at TIMESTAMPTZ,
    delivered_by UUID REFERENCES public.employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS Policies
ALTER TABLE public.catering_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietary_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_meals ENABLE ROW LEVEL SECURITY;
-- Allow read/write for authenticated users (simplified for internal system)
CREATE POLICY "Enable all access for authenticated users" ON public.catering_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.dietary_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.daily_meals FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE public.daily_meals;