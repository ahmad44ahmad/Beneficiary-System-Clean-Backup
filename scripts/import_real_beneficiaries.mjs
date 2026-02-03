/**
 * استيراد بيانات المستفيدين الحقيقية - مركز التأهيل الشامل بالباحة
 * تم إنشاؤه: 2026-02-01
 * 
 * هذا السكريبت يقوم بـ:
 * 1. تصحيح المصطلحات الطبية وفق DSM-5 و ICD-11
 * 2. تحويل التواريخ الهجرية إلى ميلادية
 * 3. توليد أرقام هوية سعودية صالحة
 * 4. استخلاص التنبيهات التلقائية
 * 5. إدراج البيانات في Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ====== دوال التصحيح والتحويل ======

/**
 * تصحيح المصطلحات الطبية والأخطاء الإملائية
 */
function correctMedicalTerminology(text) {
    if (!text) return text;

    return text
        // تصحيح الأخطاء الإملائية
        .replace(/تخاف عقلي/g, 'اضطراب فكري')
        .replace(/نخلف عقلي/g, 'اضطراب فكري')
        .replace(/تخلف غقلي/g, 'اضطراب فكري')
        .replace(/تخلف عقلي/g, 'اضطراب فكري')
        .replace(/إضطراب/g, 'اضطراب')
        // تحديث المصطلحات
        .replace(/بكم/g, 'اضطراب النطق')
        .replace(/صغر حجم الرأس/g, 'صغر محيط الرأس')
        .replace(/ضعف ابصار/g, 'ضعف البصر')
        .replace(/كف ابصار/g, 'كف البصر')
        .replace(/قصور بافراز هرمون الثيروكسين/g, 'قصور الغدة الدرقية')
        .replace(/قصور بإفراز هرمون الثيروكسين/g, 'قصور الغدة الدرقية')
        .replace(/قصور في افراز هرمون الثروكسين/g, 'قصور الغدة الدرقية')
        .replace(/السكري النوع الثاني/g, 'داء السكري النمط 2')
        .replace(/السكري نوع 2/g, 'داء السكري النمط 2')
        .replace(/سكري النوع الثاني/g, 'داء السكري النمط 2')
        .replace(/السكري النوع الأول/g, 'داء السكري النمط 1')
        .replace(/ضعف طرفين سفلين/g, 'ضعف الطرفين السفليين')
        .replace(/شلل طرفين سفلين/g, 'شلل الطرفين السفليين')
        .replace(/فرط حركة(?![\s]*و)/g, 'فرط الحركة')
        .replace(/توحد/g, 'اضطراب طيف التوحد')
        .replace(/ثعلبة جلدية/g, 'داء الثعلبة')
        // تصحيحات إملائية عامة
        .replace(/مؤضية/g, 'مُؤذية')
        .replace(/الحياه/g, 'الحياة')
        .replace(/متوفيه/g, 'متوفاة')
        .replace(/كبيره/g, 'كبيرة')
        .replace(/فقيره/g, 'فقيرة')
        .replace(/مسيطرها/g, 'مُسيطَر')
        .replace(/متحكم/g, 'مُتحكَّم')
        .replace(/اخيه/g, 'أخيه')
        .replace(/أخوه/g, 'أخيه')
        .replace(/والدة متوفى/g, 'والده متوفى');
}

/**
 * تحويل التاريخ الهجري إلى ميلادي
 */
function hijriToGregorian(hijriDate) {
    if (!hijriDate || hijriDate === 'ظروف خاصة' || hijriDate === 'لايوجد بسبب ظروف والدته الصحية') return null;

    const cleaned = String(hijriDate).replace(/\//g, '/').trim();
    const parts = cleaned.split('/');
    if (parts.length !== 3) return null;

    const [hYear, hMonth, hDay] = parts.map(n => parseInt(String(n).replace(/[^\d]/g, ''), 10));
    if (isNaN(hYear) || isNaN(hMonth) || isNaN(hDay)) return null;

    // تحويل تقريبي
    const gYear = Math.round(hYear * 0.970229 + 621.5643);
    const gMonth = Math.min(Math.max(hMonth || 1, 1), 12);
    const gDay = Math.min(Math.max(hDay || 1, 1), 28);

    return `${gYear}-${String(gMonth).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`;
}

/**
 * توليد رقم هوية سعودي صالح (خوارزمية Luhn)
 */
function generateValidSaudiID() {
    let baseDigits = '1'; // 1 للمواطن
    for (let i = 0; i < 8; i++) {
        baseDigits += Math.floor(Math.random() * 10);
    }

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let digit = Number(baseDigits[i]);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit = Math.floor(digit / 10) + (digit % 10);
        }
        sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return baseDigits + checkDigit;
}

/**
 * استخلاص مستوى IQ من النص
 */
function extractIQ(iqText) {
    if (!iqText) return null;
    const match = String(iqText).match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
}

/**
 * استخلاص التنبيهات من التشخيص
 */
function deriveAlerts(medicalDiagnosis, psychiatricDiagnosis, bedridden) {
    const alerts = [];
    const text = `${medicalDiagnosis || ''} ${psychiatricDiagnosis || ''}`.toLowerCase();

    if (text.includes('صرع')) alerts.push('epilepsy');
    if (text.includes('سكري') || text.includes('diabetes')) alerts.push('diabetic');
    if (text.includes('عدوان') || text.includes('عصبي') || text.includes('انفعال')) alerts.push('aggressiveBehavior');
    if (text.includes('بلع') || text.includes('تغذية') || text.includes('أنبوب معدي')) alerts.push('swallowingDifficulty');
    if (text.includes('سقوط') || text.includes('يمشي بصعوبة') || text.includes('مساندة') || bedridden === 'نعم') alerts.push('fallRisk');
    if (text.includes('بصر') || text.includes('نظر') || text.includes('حول') || text.includes('كف البصر')) alerts.push('visuallyImpaired');
    if (text.includes('سمع')) alerts.push('hearingImpaired');
    if (text.includes('حساسية')) alerts.push('foodAllergy');

    return [...new Set(alerts)];
}

/**
 * تحويل صلة القرابة
 */
function mapGuardianRelation(relation) {
    if (!relation) return 'other';
    const r = relation.trim().toLowerCase();
    const map = {
        'أب': 'father', 'اب': 'father',
        'أم': 'mother', 'ام': 'mother', 'والدته': 'mother',
        'أخ': 'brother', 'اخ': 'brother',
        'أخت': 'sister',
        'عم': 'uncle',
        'خال': 'uncle', 'خاله': 'uncle',
        'جد': 'grandfather',
        'جدة': 'grandmother',
        'ابن': 'son',
        'ابنة': 'daughter',
        'ظروف خاصة': 'institution',
        'أفب': 'father',
        'أبن ـخ': 'nephew'
    };

    for (const [key, value] of Object.entries(map)) {
        if (r.includes(key)) return value;
    }
    return 'other';
}

/**
 * تنسيق رقم الهاتف
 */
function formatPhone(phone) {
    if (!phone || phone === 'ظروف خاصة') return null;
    const cleaned = String(phone).replace(/[,\s-]/g, '');
    if (cleaned.length === 9) return `0${cleaned}`;
    return cleaned;
}

// ====== البيانات سيتم تحميلها من ملف خارجي ======
// أنظر: scripts/residents_data.json

async function importData() {
    console.log('📥 بدء استيراد بيانات المستفيدين الحقيقية...\n');

    // تحميل البيانات من ملف JSON
    const fs = await import('fs/promises');
    const dataPath = resolve(__dirname, 'residents_data.json');

    let residentsData;
    try {
        const rawData = await fs.readFile(dataPath, 'utf-8');
        residentsData = JSON.parse(rawData);
        console.log(`✅ تم تحميل ${residentsData.length} سجل من الملف\n`);
    } catch (err) {
        console.error('❌ خطأ في تحميل البيانات:', err.message);
        console.log('\n💡 تأكد من إنشاء ملف scripts/residents_data.json');
        return;
    }

    // تحويل البيانات
    const beneficiaries = [];

    for (let i = 1; i < residentsData.length; i++) {
        const row = residentsData[i];
        if (!row || !row[0]) continue;

        const [
            name, fileNum, gender, nationality, birthDate, age,
            admissionDate, guardianRelation, phone, address,
            visitFrequency, lastVisit, socialStatus,
            medicalDiagnosis, disabilityType, iqLevel, bedridden, psychiatricDiagnosis
        ] = row;

        const correctedMedical = correctMedicalTerminology(medicalDiagnosis);
        const correctedPsych = correctMedicalTerminology(psychiatricDiagnosis);

        beneficiaries.push({
            file_id: `RHB-2026-${String(fileNum).padStart(6, '0')}`,
            national_id: generateValidSaudiID(),
            name: name?.trim() || 'غير معروف',
            gender: 'male',
            nationality: nationality || 'سعودي',
            date_of_birth: hijriToGregorian(birthDate),
            age: typeof age === 'number' ? age : null,
            admission_date: hijriToGregorian(admissionDate),
            status: 'active',

            medical_diagnosis: correctedMedical,
            disability_type: disabilityType,
            iq_level: extractIQ(iqLevel),
            bedridden: bedridden === 'نعم',
            psychiatric_diagnosis: correctedPsych,

            guardian_name: guardianRelation !== 'ظروف خاصة' ? `ولي أمر ${name?.split(' ')[0]}` : null,
            guardian_relation: mapGuardianRelation(guardianRelation),
            guardian_phone: formatPhone(phone),
            guardian_address: address !== 'ظروف خاصة' ? address : null,

            social_status: correctMedicalTerminology(socialStatus),
            visit_frequency: visitFrequency !== 'ظروف خاصة' ? visitFrequency : null,
            last_visit_date: hijriToGregorian(lastVisit),

            alerts: deriveAlerts(medicalDiagnosis, psychiatricDiagnosis, bedridden),
            notes: `نوع الإعاقة: ${disabilityType || 'غير محدد'}`
        });
    }

    console.log(`✅ تم تحويل ${beneficiaries.length} مستفيد\n`);

    // إحصائيات
    const stats = {
        withEpilepsy: beneficiaries.filter(b => b.alerts.includes('epilepsy')).length,
        withDiabetes: beneficiaries.filter(b => b.alerts.includes('diabetic')).length,
        bedridden: beneficiaries.filter(b => b.bedridden).length,
        withAlerts: beneficiaries.filter(b => b.alerts.length > 0).length
    };

    console.log('📊 إحصائيات:');
    console.log(`   - مع صرع: ${stats.withEpilepsy}`);
    console.log(`   - مع سكري: ${stats.withDiabetes}`);
    console.log(`   - طريحو فراش: ${stats.bedridden}`);
    console.log(`   - مع تنبيهات: ${stats.withAlerts}\n`);

    // الإدراج في Supabase
    console.log('📤 إدراج البيانات في Supabase...\n');

    // إدراج على دفعات
    const batchSize = 50;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < beneficiaries.length; i += batchSize) {
        const batch = beneficiaries.slice(i, i + batchSize);

        const { data, error } = await supabase
            .from('beneficiaries')
            .insert(batch)
            .select('id');

        if (error) {
            console.error(`❌ خطأ في الدفعة ${Math.floor(i / batchSize) + 1}:`, error.message);
            errors += batch.length;
        } else {
            inserted += data.length;
            console.log(`   ✓ دفعة ${Math.floor(i / batchSize) + 1}: ${data.length} سجل`);
        }
    }

    console.log(`\n✅ تم إدراج ${inserted} سجل بنجاح`);
    if (errors > 0) console.log(`⚠️ فشل إدراج ${errors} سجل`);

    // التحقق النهائي
    const { count } = await supabase
        .from('beneficiaries')
        .select('*', { count: 'exact', head: true });

    console.log(`\n📊 إجمالي السجلات في قاعدة البيانات: ${count}`);
}

importData().catch(console.error);
