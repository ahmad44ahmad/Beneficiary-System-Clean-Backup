# 🚀 البدء السريع (Quick Start)

## 1. التثبيت
```bash
npm install @supabase/supabase-js
```

## 2. الإعداد
1. أنشئ مشروع في [Supabase](https://supabase.com).
2. نفذ `schema.sql` في SQL Editor.
3. انسخ المفاتيح إلى `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. الاستخدام

### جلب البيانات
```typescript
import { useBeneficiaries } from './hooks/useDatabase';

const { beneficiaries, loading } = useBeneficiaries();
```

### إضافة بيانات
```typescript
import { useBeneficiaryMutations } from './hooks/useDatabase';

const { create } = useBeneficiaryMutations();
await create({ fullName: 'New User', status: 'active' });
```

## 4. الملفات المهمة
- `src/config/supabase.ts`: إعداد الاتصال.
- `src/hooks/useDatabase.ts`: Hooks للتعامل مع البيانات.
- `src/api/`: دوال التعامل المباشر مع Supabase.
