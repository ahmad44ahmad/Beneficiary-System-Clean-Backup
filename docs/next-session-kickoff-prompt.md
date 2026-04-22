# Next Session Kickoff Prompt

> Paste the block below as the first message in a fresh Claude Code session to resume Basira work at 100% context.

---

## The prompt (copy from here to end)

```
أهلاً. هذه جلسة جديدة على مشروع بصيرة — v2. اقرأ السياق قبل أي تنفيذ.

## اقرأ أولاً (ملفات ذاكرة — إلزامي)

1. `C:\Users\aass1\.claude\projects\C--Users-aass1\memory\MEMORY.md` (الفهرس)
2. `project_basira_canonical_path.md` — المسار + الفرع + توقيع الواجهة (مُحدَّث 2026-04-22)
3. `project_basira_leadership_compass.md` — مرجع ميزة بوصلة القيادة (7 تبويبات)
4. `feedback_helper_over_display.md` — فلسفة التصميم: مساعد لا شاشة عرض
5. `feedback_decisions_are_permanent.md` — القرارات لا تُحذف أبداً
6. `feedback_aesthetic_metaphor.md` — الحس الجمالي — القيثارة
7. `feedback_autonomy.md` — استقلالية على مستوى الهدف
8. `feedback_final_step_failures.md` — تحقق من المخرَج المرئي قبل الإعلان

## ثم اقرأ وثيقة التسليم الكاملة

`C:\dev\basira\docs\handoff-2026-04-22-full-context.md`

فيها: ما شُحن في آخر كتلة، ما هو مفتوح، الحالة الحالية، قواعد العمل، مسارات الملفات.

## الحالة الحالية (ملخص سريع)

- المسار: `C:\dev\basira\`
- الفرع: `v2` (لا تلمس `main` أو الوسوم)
- خادم التطوير: `npm run dev` على المنفذ 5175
- آخر ميزة شُحنت: **بوصلة القيادة** (`/leadership-compass`) — 7 تبويبات، helper-over-display
- 0 أخطاء lint، 0 أخطاء tsc
- هجرات Supabase 022/023/024 لم تُطبَّق بعد

## قواعد غير قابلة للتفاوض

1. **القرارات دائمة** — لا DELETE على `strategic_decisions` (مفروض على مستوى RLS)
2. **Helper-over-display** — كل سطح قرار ينتهي بإجراء، لا مجرد عرض
3. **مستفيد لا مريض** في كل نص مرئي
4. **عربية حكومية رسمية** للمحتوى المؤسسي (يتم، يُحدد، يلتزم)
5. **لا CBAHI** في توثيق PT أو بصيرة
6. **لا اسم أحمد** على الأسطح المؤسسية — صوت مؤسسي فقط
7. **لا push إلى main** أو وسوم بدون إذن صريح
8. **تحقَّق من المخرَج المرئي** قبل إعلان الإنجاز (اجلب URL، افحص النص/التوقيع)

## ما أريد منك الآن

[اختر واحداً أو أكثر من الخيارات أدناه، أو اطلب شيئاً خارج القائمة]

**أ. مراجعة كود Leadership Compass بوكيل فرعي**
  شغّل subagent يستعرض التبويبات السبعة للتأكد من الاتساق (الألوان، الفراغات، الطباعة، المنطق). أريد تقريراً مركّزاً، لا تعديلاً مباشراً.

**ب. ربط البيانات الحقيقية**
  طبّق الهجرات 022/023/024 على Supabase ثم استبدل `SEED_*` في تبويبات القيادة بـ hooks حقيقية. الشكل مطابق للجداول 1:1.

**ج. حزمة التسليم للوكالة (الأمن)**
  ابنِ 11 وثيقة تسليم الأمن السيبراني — المرحلة الثانية من خطة `docs/security-compliance-analysis-2026-04-22.md`.

**د. تلميع الواجهة**
  pass استجابية للجوال/اللوحي على بوصلة القيادة، + ورقة طباعة A4 لملخصات القرار.

**هـ. إغلاق الثغرات**
  تدوير كلمة مرور Supabase + إغلاق 5 Dependabot + تثبيت CodeQL عبر واجهة GitHub.

**و. شيء آخر**
  سأخبرك.

--- 

ابدأ بقراءة الذاكرة ووثيقة التسليم، ثم أخبرني أي الخيارات تفضّل، أو اقترح أنت.
```

---

## Notes for the user

- The prompt above is ~50 lines; safe to paste into the Claude Code message box.
- After pasting, wait for Claude to confirm it has read memory + handoff before giving the next instruction.
- If the session drifts, redirect to `handoff-2026-04-22-full-context.md` rather than re-explaining.
