
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedInventory() {
    console.log('📦 Seeding Inventory Master Data...');

    // 1. Categories
    const categories = [
        { name: 'خضروات', name_en: 'Vegetables', color_code: '#4CAF50' },
        { name: 'فواكه', name_en: 'Fruits', color_code: '#FF9800' },
        { name: 'لحوم ودواجن', name_en: 'Meat & Poultry', color_code: '#F44336' },
        { name: 'منتجات ألبان', name_en: 'Dairy', color_code: '#2196F3' },
        { name: 'حبوب ومواد جافة', name_en: 'Grains & Dry Goods', color_code: '#795548' },
        { name: 'مواد نظافة', name_en: 'Cleaning Supplies', color_code: '#607D8B' }
    ];

    const { data: catData, error: catError } = await supabase
        .from('catering_categories')
        .upsert(categories, { onConflict: 'name' })
        .select();

    if (catError) console.error('Error seeding categories:', catError);
    else console.log(`✅ Upserted ${catData?.length} Categories`);

    // 2. Units
    const units = [
        { name: 'كيلوجرام', symbol: 'كجم' },
        { name: 'جرام', symbol: 'جم' },
        { name: 'لتر', symbol: 'لتر' },
        { name: 'كرتون', symbol: 'كرتون' },
        { name: 'حبة', symbol: 'حبة' },
        { name: 'جالون', symbol: 'جالون' }
    ];

    const { data: unitData, error: unitError } = await supabase
        .from('catering_units')
        .upsert(units, { onConflict: 'name' })
        .select();

    if (unitError) console.error('Error seeding units:', unitError);
    else console.log(`✅ Upserted ${unitData?.length} Units`);

    // 3. Raw Materials (Samples)
    if (catData && unitData) {
        // Helpers to find IDs
        const findCat = (n: string) => catData.find(c => c.name === n)?.id;
        const findUnit = (s: string) => unitData.find(u => u.symbol === s)?.id;

        const materials = [
            { code: 'RICE001', name_ar: 'أرز بسمتي', category_id: findCat('حبوب ومواد جافة'), unit_id: findUnit('كجم'), min_stock: 50 },
            { code: 'CHICK01', name_ar: 'دجاج مبرد', category_id: findCat('لحوم ودواجن'), unit_id: findUnit('كرتون'), min_stock: 20 },
            { code: 'OIL001', name_ar: 'زيت نباتي', category_id: findCat('حبوب ومواد جافة'), unit_id: findUnit('كرتون'), min_stock: 10 },
            { code: 'TOM001', name_ar: 'طماطم', category_id: findCat('خضروات'), unit_id: findUnit('كجم'), min_stock: 15 },
            { code: 'CLOR01', name_ar: 'كلور مبيض', category_id: findCat('مواد نظافة'), unit_id: findUnit('جالون'), min_stock: 5 },
        ];

        // Filter out items where foreign keys weren't found (safety)
        const validMaterials = materials.filter(m => m.category_id && m.unit_id);

        const { error: matError } = await supabase
            .from('catering_raw_materials')
            .upsert(validMaterials, { onConflict: 'code' });

        if (matError) console.error('Error seeding materials:', matError);
        else console.log(`✅ Upserted ${validMaterials.length} Raw Materials`);
    }

    console.log('✨ Inventory Seeding Complete!');
}

seedInventory();
