import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Use the hardcoded credentials from the user's previous python script to ensure it works immediately
// (In a real prod env we would use process.env, but the user environment is messy)
const SUPABASE_URL = "https://ruesovrbhcjphmfdcpsa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MENU_ITEMS = [
    { name_ar: 'كبسة دجاج', category: 'طبق رئيسي', calories: 650, protein_g: 35, carbs_g: 80, fat_g: 20, is_soft_diet_friendly: false, is_diabetic_friendly: false },
    { name_ar: 'مرق خضار', category: 'طبق رئيسي', calories: 150, protein_g: 5, carbs_g: 20, fat_g: 5, is_soft_diet_friendly: true, is_diabetic_friendly: true },
    { name_ar: 'أرز أبيض مسلوق', category: 'طبق رئيسي', calories: 200, protein_g: 4, carbs_g: 45, fat_g: 1, is_soft_diet_friendly: true, is_diabetic_friendly: true },
    { name_ar: 'دجاج مشوي', category: 'طبق رئيسي', calories: 300, protein_g: 40, carbs_g: 0, fat_g: 10, is_soft_diet_friendly: true, is_diabetic_friendly: true },
    { name_ar: 'سلطة خضراء', category: 'سلطة', calories: 50, protein_g: 1, carbs_g: 5, fat_g: 0, is_soft_diet_friendly: false, is_diabetic_friendly: true },
    { name_ar: 'شوربة عدس', category: 'مقبلات', calories: 180, protein_g: 10, carbs_g: 25, fat_g: 3, is_soft_diet_friendly: true, is_diabetic_friendly: true },
    { name_ar: 'زبادي قليل الدسم', category: 'مقبلات', calories: 70, protein_g: 8, carbs_g: 10, fat_g: 0, is_soft_diet_friendly: true, is_diabetic_friendly: true },
    { name_ar: 'تفاح', category: 'حلويات', calories: 60, protein_g: 0, carbs_g: 15, fat_g: 0, is_soft_diet_friendly: false, is_diabetic_friendly: true },
    { name_ar: 'مهلبية', category: 'حلويات', calories: 250, protein_g: 5, carbs_g: 40, fat_g: 8, is_soft_diet_friendly: true, is_diabetic_friendly: false },
    { name_ar: 'خبز بر', category: 'خبز', calories: 80, protein_g: 3, carbs_g: 15, fat_g: 1, is_soft_diet_friendly: false, is_diabetic_friendly: true },
];

async function seedCatering() {
    console.log("🌱 Starting Catering Module Seeding...");

    // 1. Seed Menu Items
    console.log("🍽️ Seeding Menu Items...");
    const { data: menuItems, error: menuError } = await supabase
        .table('catering_items')
        .upsert(MENU_ITEMS, { onConflict: 'name_ar' })
        .select();

    if (menuError) {
        console.error("❌ Error seeding menu:", menuError);
        return;
    }
    console.log(`✅ Seeded ${menuItems.length} menu items.`);

    // 2. Fetch Beneficiaries (to link plans)
    const { data: beneficiaries, error: benError } = await supabase
        .table('beneficiaries')
        .select('id, full_name, medical_diagnosis, age'); // Assuming age might be in medical_diagnosis or just derived

    if (benError || !beneficiaries) {
        console.error("❌ Error fetching beneficiaries:", benError);
        return;
    }
    console.log(`👥 Found ${beneficiaries.length} beneficiaries to assign plans.`);

    // 3. Assign Dietary Plans
    const plans = beneficiaries.map(b => {
        let type = 'قياسي';
        let special = '';
        const diagnosis = b.medical_diagnosis || '';

        if (diagnosis.includes('سكري') || diagnosis.includes('Diabetes')) {
            type = 'سكري';
        } else if (diagnosis.includes('كلوى') || diagnosis.includes('Renal')) {
            type = 'كلوى';
        } else if (diagnosis.includes('صعوبة') || diagnosis.includes('بلع') || diagnosis.includes('Dysphagia')) {
            type = 'مهروس';
            special = 'تجنب السوائل الخفيفة';
        }

        return {
            beneficiary_id: b.id,
            plan_type: type,
            special_instructions: special,
            allergies: [],
            disliked_items: []
        };
    });

    const { error: planError } = await supabase
        .table('dietary_plans')
        .upsert(plans, { onConflict: 'beneficiary_id' });

    if (planError) {
        console.error("❌ Error seeding plans:", planError);
    } else {
        console.log(`✅ Assigned ${plans.length} dietary plans.`);
    }

    console.log("✨ Seeding Complete!");
}

seedCatering();
