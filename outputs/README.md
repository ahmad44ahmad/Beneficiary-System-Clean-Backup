# 🗄️ قاعدة بيانات نظام إدارة المستفيدين

## 📖 نظرة عامة

تم إنشاء قاعدة بيانات **PostgreSQL** كاملة باستخدام **Supabase** لنظام إدارة بيانات المستفيدين. القاعدة تتضمن 22 جدول و3 views مع دعم كامل للعمليات والتقارير.

---

## 📁 محتويات الملفات

```
📦 outputs/
├── 📄 README.md                           # هذا الملف
├── 📄 DATABASE_SETUP.md                   # دليل إعداد مفصل
├── 📄 QUICK_START.md                      # البدء السريع
├── 📄 .env.example                        # نموذج متغيرات البيئة
│
├── 📂 database/
│   └── schema.sql                         # SQL Schema الكامل (22 جدول)
│
└── 📂 src/
    ├── 📂 config/
    │   └── supabase.ts                    # إعداد Supabase
    │
    ├── 📂 api/
    │   ├── beneficiaries.ts               # API المستفيدين
    │   └── rehabilitation.ts              # API خطط التأهيل
    │
    ├── 📂 hooks/
    │   └── useDatabase.ts                 # React Hooks جاهزة
    │
    └── 📂 components/examples/
        └── BeneficiaryManagementExample.tsx  # مثال تطبيقي كامل
```

---

## 🚀 البدء السريع

### 1. تثبيت المكتبة
```bash
npm install @supabase/supabase-js
```

### 2. إعداد Supabase
1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ مشروع
2. في **SQL Editor**، نفذ محتوى `database/schema.sql`
3. احصل على API Keys من **Settings → API**

### 3. إعداد البيئة
```bash
cp .env.example .env.local
# ضع قيم API في .env.local
```

### 4. ابدأ الاستخدام
```typescript
import { useBeneficiaries } from './hooks/useDatabase';

function MyComponent() {
    const { beneficiaries, loading } = useBeneficiaries();
    return {beneficiaries.map(b => b.full_name)};
}
```

📚 **للتفاصيل الكاملة**: راجع `QUICK_START.md` أو `DATABASE_SETUP.md`

---

## 📊 هيكل قاعدة البيانات

### 🔐 الأمان والمستخدمين
- **users** - بيانات المستخدمين وأدوارهم

### 👥 المستفيدين والطبي
- **beneficiaries** - بيانات المستفيدين الأساسية
- **medical_profiles** - السجلات الطبية
- **medical_examinations** - الفحوصات الطبية
- **vaccinations** - جدول التطعيمات

### 🎯 التأهيل
- **rehabilitation_plans** - خطط التأهيل
- **rehabilitation_goals** - الأهداف (SMART Goals)
- **interventions** - التدخلات العلاجية

### 👨‍👩‍👧‍👦 الاجتماعي
- **case_studies** - دراسات الحالة
- **social_research** - البحوث الاجتماعية
- **visit_logs** - سجل الزيارات
- **leave_requests** - طلبات الإجازات
- **family_case_studies** - دراسات حالة العائلة

### 📦 المخزون والدعم
- **inventory** - المخزون
- **inventory_transactions** - حركات المخزون
- **clothing_requests** - طلبات الكسوة
- **assets** - الأصول الثابتة
- **maintenance_tickets** - تذاكر الصيانة

### ⚙️ الإدارة اليومية
- **daily_shift_records** - سجل الورديات

### ⚠️ الجودة والسلامة
- **injury_reports** - تقارير الإصابات
- **risks** - سجل المخاطر
- **audit_records** - سجلات التدقيق
- **activity_logs** - سجل النشاطات (Audit Trail)

---

## 💻 الملفات البرمجية

### 1. `config/supabase.ts`
إعداد الاتصال مع Supabase
```typescript
import { supabase } from './config/supabase';
// جاهز للاستخدام!
```

### 2. `api/beneficiaries.ts`
جميع عمليات CRUD للمستفيدين
```typescript
import { 
    getBeneficiaries,      // جلب الكل
    getBeneficiaryById,    // جلب واحد
    createBeneficiary,     // إنشاء
    updateBeneficiary,     // تحديث
    deleteBeneficiary      // حذف (soft delete)
} from './api/beneficiaries';
```

### 3. `api/rehabilitation.ts`
جميع عمليات خطط التأهيل
```typescript
import { 
    getRehabilitationPlans,
    addGoalToPlan,
    updateGoalProgress,
    approvePlan,
    rejectPlan
} from './api/rehabilitation';
```

### 4. `hooks/useDatabase.ts`
React Hooks جاهزة للاستخدام
```typescript
// للقراءة
const { beneficiaries, loading } = useBeneficiaries();
const { plan } = useRehabilitationPlan(planId);

// للكتابة
const { create, update, remove } = useBeneficiaryMutations();

// للمصادقة
const { user, loading } = useAuth();
```

### 5. `components/examples/BeneficiaryManagementExample.tsx`
مثال تطبيقي كامل يوضح:
- ✅ جلب البيانات
- ✅ البحث والفلترة
- ✅ إنشاء سجل جديد
- ✅ تحديث سجل
- ✅ حذف سجل
- ✅ معالجة الأخطاء
- ✅ حالات التحميل

---

## 🎯 الميزات الرئيسية

### ✨ Schema محترف
- 22 جدول مترابط
- Foreign Keys للعلاقات
- Indexes للأداء
- Triggers للتحديث التلقائي
- Views جاهزة للتقارير

### 🔒 الأمان
- Row Level Security (RLS)
- Authentication جاهز
- Activity Logging
- Role-based Access Control

### ⚡ الأداء
- Indexes على الحقول المهمة
- Efficient queries
- Pagination support
- Real-time subscriptions

### 📝 التوثيق
- تعليقات عربية في SQL
- أمثلة كاملة
- دليل إعداد شامل

---

## 🔧 أمثلة الاستخدام

### مثال 1: جلب المستفيدين النشطين
```typescript
const { beneficiaries } = useBeneficiaries({ status: 'active' });
```

### مثال 2: إنشاء مستفيد جديد
```typescript
const { create } = useBeneficiaryMutations();

await create({
    full_name: 'أحمد محمد',
    national_id: '1234567890',
    gender: 'ذكر',
    dob: '2000-01-01',
    enrollment_date: '2024-01-01'
});
```

### مثال 3: تحديث تقدم هدف
```typescript
const { updateProgress } = useRehabPlanMutations();

await updateProgress(goalId, 75); // 75%
```

### مثال 4: البحث المتقدم
```typescript
import { searchBeneficiaries } from './api/beneficiaries';

const results = await searchBeneficiaries({
    fullName: 'أحمد',
    ageRange: { min: 20, max: 30 }
});
```

---

## 📈 التقارير والإحصائيات

### Views جاهزة
```sql
-- المستفيدين النشطين مع إحصائيات
SELECT * FROM active_beneficiaries_summary;

-- المخزون المنخفض
SELECT * FROM low_stock_items;

-- المخاطر الحرجة
SELECT * FROM critical_risks;
```

### API للإحصائيات
```typescript
import { getBeneficiariesStats } from './api/beneficiaries';

const stats = await getBeneficiariesStats();
// { total: 100, active: 85, male: 60, female: 25 }
```

---

## 🛡️ الأمان (Row Level Security)

### تفعيل RLS
```sql
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

-- مثال: المستخدمون يرون البيانات حسب صلاحياتهم
CREATE POLICY "Doctors can view all"
ON beneficiaries FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'doctor'
    )
);
```

---

## 🐛 حل المشاكل

### مشكلة: "Invalid API Key"
```bash
# تأكد من استخدام anon key وليس service_role key
# راجع: Supabase Dashboard > Settings > API
```

### مشكلة: "Permission Denied"
```sql
-- للاختبار: عطل RLS مؤقتاً
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### مشكلة: "CORS Error"
```bash
# أضف localhost في Supabase Dashboard
# Settings > API > URL Configuration
```

---

## 📚 الملفات المرجعية

| الملف | الوصف | الاستخدام |
|-------|-------|-----------|
| `DATABASE_SETUP.md` | دليل الإعداد الشامل | للإعداد الأول |
| `QUICK_START.md` | البدء السريع | للمراجعة السريعة |
| `schema.sql` | هيكل قاعدة البيانات | للتنفيذ في Supabase |
| `supabase.ts` | تكوين الاتصال | نسخ للمشروع |
| `beneficiaries.ts` | API المستفيدين | استيراد الدوال |
| `useDatabase.ts` | React Hooks | استخدام في المكونات |
| `BeneficiaryManagementExample.tsx` | مثال كامل | للمراجعة والتعلم |

---

## ✅ Checklist - خطوات الإعداد

- [ ] 1. تثبيت `@supabase/supabase-js`
- [ ] 2. إنشاء مشروع في Supabase
- [ ] 3. تنفيذ `schema.sql` في SQL Editor
- [ ] 4. نسخ API Keys
- [ ] 5. إنشاء `.env.local`
- [ ] 6. نسخ `config/supabase.ts` للمشروع
- [ ] 7. نسخ مجلد `api/` للمشروع
- [ ] 8. نسخ مجلد `hooks/` للمشروع
- [ ] 9. اختبار الاتصال
- [ ] 10. تجربة CRUD operations

---

## 🎓 موارد للتعلم

- **Supabase**: https://supabase.com/docs
- **PostgreSQL**: https://www.postgresqltutorial.com/
- **React + TypeScript**: https://react-typescript-cheatsheet.netlify.app/

---

## 💡 نصائح مهمة

1. **احفظ Database Password** - ستحتاجه للدخول المباشر
2. **استخدم .env.local** - لا تكتب API Keys في الكود
3. **فعّل RLS** - للأمان في production
4. **راجع Activity Logs** - لمراقبة التغييرات
5. **استخدم Indexes** - للاستعلامات السريعة

---

## 🆘 الدعم

إذا واجهت أي مشكلة:

1. راجع `DATABASE_SETUP.md` للحلول التفصيلية
2. تحقق من Console في المتصفح
3. راجع Supabase Dashboard → Logs
4. تأكد من صحة API Keys في `.env.local`

---

## 📊 الإحصائيات

- **عدد الجداول**: 22
- **عدد Views**: 3
- **عدد Triggers**: 11
- **عدد Indexes**: 40+
- **API Functions**: 30+
- **React Hooks**: 8

---

## 🎉 النتيجة

✅ قاعدة بيانات كاملة جاهزة للاستخدام
✅ API متكامل مع TypeScript
✅ React Hooks جاهزة
✅ أمثلة تطبيقية شاملة
✅ دليل إعداد مفصل
✅ دعم الأمان والصلاحيات

**جاهز للعمل! 🚀**

---

## 📞 الخطوات التالية

بعد إعداد قاعدة البيانات:

1. ✅ دمج API مع المكونات الحالية
2. ✅ إضافة Authentication للتطبيق
3. ✅ بناء لوحات التحكم
4. ✅ إضافة التقارير
5. ✅ النشر على Vercel/Netlify
