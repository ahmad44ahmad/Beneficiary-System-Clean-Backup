# Scripts Directory

هذا المجلد يحتوي على سكريبتات إدارة قاعدة البيانات.

## الملفات الأساسية

| الملف | الوصف |
| ----- | ----- |
| `supabase_seed.sql` | SQL الرئيسي لبذر البيانات |
| `seed_all_tables.mjs` | بذر شامل لجميع الجداول |
| `run-migrations.js` | تشغيل ترحيلات قاعدة البيانات |
| `execute_schema.js` | تنفيذ مخطط قاعدة البيانات |
| `apply_migration.ts` | تطبيق ترحيل محدد |
| `setup-demo.js` | إعداد بيئة تجريبية |

## الاستخدام

```bash
# بذر البيانات
node scripts/seed_all_tables.mjs

# تشغيل الترحيلات
node scripts/run-migrations.js
```

## النسخ الاحتياطي

تم حفظ نسخة احتياطية من جميع السكريبتات القديمة في:
`scripts_backup_2026/`

آخر تحديث: 2026-01-31
