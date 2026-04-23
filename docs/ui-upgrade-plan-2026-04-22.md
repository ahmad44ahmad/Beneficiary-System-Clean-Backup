# UI Upgrade Plan — 2026-04-22 feedback pass

**Source:** Ahmad's 2026-04-22 brief (post-sidebar-v2 session)
**Branch:** `v2`
**Approach:** ship focused, domain-accurate improvements on the biggest pain points; defer the long-tail to next sessions.

---

## 1. Section-by-section audit

### 1.1 المخزون والكسوة (Clothing) — "قصور هائل"

**Source doc read:** `ضوابط الكسوة 2020` (وكالة التأهيل والتوجيه الاجتماعي) — full 22-page PDF.

**Operational model from the PDF (missing in current code):**

| Phase | Name | Key actors | Duration |
|---|---|---|---|
| 1 | طلب تأمين الكسوة | Technical depts → Deputy Minister office → Financial admin | 5-10 days |
| 2 | تأمين الكسوة | 4-member committee at center | Variable |
| 3 | تسديد العهدة (السلفة) | Warehouse officer + Financial admin | Within 2 months |
| 4 | معالجة الكسوة التالفة | Social observer + supervisory committee | Monthly cycle |

**Seasonal calendar:**
- Summer (الكسوة الصيفية): request filed 1 January (Gregorian)
- Winter (الكسوة الشتوية): request filed 1 July (Gregorian)
- Eid al-Fitr: request 1 Rajab (Hijri)
- Eid al-Adha: request 1 Ramadan (Hijri)

**Committee composition (fixed, per PDF §Phase 2):**
- President: رئيس القسم الاجتماعي (القسم الداخلي)
- Decision-recording member: مأمور العهدة
- Member: أخصائي اجتماعي
- Member: مراقب اجتماعي

**Quality specs (per PDF §4 Phase 2):**
- Cotton, comfortable, machine-washable
- No zippers/strings/metal pieces
- Bedridden: adapted for feeding tube placement
- Shoes: no high heels, no laces, comfortable
- Respect beneficiary preferences where possible

**Damage criteria (exactly 5 per PDF §Phase 4):**
1. حرق في القطعة (burn)
2. خرق في القطعة (tear)
3. تمزق في النسيج (fabric breakdown)
4. عدم صلاحية (stretching, color fade, size change)
5. وفاة المقيم (beneficiary death)

**Lost items:** written statement from responsible staff → HR investigation trigger.

**Critical rule:** NO selling or donating damaged clothing to charities (PDF §Phase 4.3).

**Settlement documents required (Phase 3):**
- Committee minutes
- Receipt minutes (Form 3)
- Purchase invoices
- Disbursement decision copy
- Proof of remaining-funds deposit at مؤسسة النقد

**Current Basira module state:**
- 7 files, 1,211 LoC, 7 tabs (inventory/needs/dispensation/procurement/discard/warehouse/forms)
- HAS: form-based CRUD
- MISSING: 4-phase cycle visualization, committee composition, seasonal calendar, advance (سلفة) tracking, damage reason dropdown with 5 types, settlement tracker, lost-items HR workflow

**Session delivery:**
- New `src/types/clothing.ts` with phase/committee/damage enums from the PDF
- `ClothingCommitteeCard` — the 4 members, their roles per §Phase 2
- `ClothingSeasonalCalendar` — 4 seasons with dates, next upcoming deadline
- `ClothingPhaseTracker` — 4-phase visual with current-phase highlighting
- Panel header restructured to show: phase tracker → committee → calendar → tabs

### 1.2 قسم الإعاشة والتغذية (Catering) — "قصور مهول"

**Source docs needed (Google Drive — not in this session):**
- Excel files: current company, contract, conditions
- حوكمة خدمات الإعاشة (governance)
- Kitchen + warehouse specifications
- "اللي عاشها" folder on Drive
- Weekly table: (Sat/Sun/Mon...) × (male/female) × طبلية × receipt data × violations × evaluation → for مستخلص

**Current module state:**
- 11 files, 2,168 LoC under `src/modules/catering/`
- Has: CateringDailyLog, CateringDashboard, CateringReports, MealSchedule, MonthlyInvoice, QualityChecklist, ViolationReport, ReceivingCommittee, useCateringLogic

**Missing per Ahmad's brief:**
- Weekly structured menu (مشاركة, ذكور, إناث) with طبلية linking
- Temperature monitoring per department/fridge
- Storage conditions (dry goods, fridge temps per section)
- Cleanliness monitoring per area
- Receipt committee with evaluation for مستخلص
- Link to وصف الأصناف / main contract conditions

**Deferred to:** follow-up session with Drive file access.

### 1.3 الأصول والصيانة (O&M) — "قصور"

**Source:** Google Drive files (not in this session).

**Deferred.**

### 1.4 الحوكمة والجودة — LIKED, polish only

- Ahmad liked: دليل جودة شامل (Quality Manual), مركز التميز
- Minor fixes needed: NCR/CAPA visual polish, Audit slight deficiency, Quality Dashboard

### 1.5 Typography — global fix

Ahmad flagged: "رقم البلاغ" and similar labels are ~11px. Target: **13px minimum** for secondary labels, **15px** for primary, **11-12px entirely removed**.

### 1.6 المتابعة اليومية (Daily Follow-up) — "أسوأ تصميم"

- Ugly orange color → needs HRSD palette alignment
- Missing: سجل ضعف الفترات (gap/weakness tracker for full-day or multi-day periods)
- Export: must be RTL in Excel, complete columns, printable, emailable

### 1.7 قائمة المستفيدين (Beneficiaries list) — layout

- Selection UX: "صندوق صغير, كلام صغير ومزدحم, 20% من أعلى الصفحة"
- Profile view: split-pane too narrow → needs generous layout
- Timeline section: feels empty, "ملخص سريع" not useful
- Export: starts with مشاركة then names → RTL Excel

### 1.8 الملف الطبي / العلامات الحيوية

- Purple color out of place → align to HRSD
- "خدمات الدعم" + خطة التغذية badly designed
- Quality part needs matching palette

### 1.9 Profile — context

- Icons don't render?
- "سياق المنظمة/القيادة" text too cramped, "تم تقييم" too short
- Colors: need more than black-and-white

### 1.10 Home page — content regression

- "بصيرة ابدأ" content changed undesirably
- Missing: AI engines intro, digitization story, quality pillars, compliance achievements section
- An image shouldn't be there (needs identification)
- **NEW:** Achievements section with center photos:
  - Red Crescent compliance — #1 in KSA
  - Infection Control compliance (1997 — **verify year**; may be 2022)
  - KPI awards from Rehab & Social Guidance Agency (multiple)
  - Special Olympics gold medal

### 1.11 Org chart — inaccurate

- Source: `الهيكل التنظيمي الباحة0 (2).pptx` (Ahmad's Desktop)
- Current chart has gaps
- **Deferred** — needs PPTX extraction.

### 1.12 NotebookLM Mind Map — content integration

- Two PNGs with the Basira 5.0 conceptual map
- Can be Arabized and embedded on home page or landing section
- **Deferred** — visual asset work.

### 1.13 2018 privatization spec — cross-walk

- `كراسة الشروط والمواصفات ... الخصخصة .pdf` from 2018
- Ahmad co-authored; early vision for rehab centers
- Task: review, extract any features worth adding to Basira sections/engines
- **Deferred** — reading task.

### 1.14 Strategic briefing doc

- `إعداد ملف إحاطة استراتيجي للمقابلة القيادية.docx`
- Context for Al-Baha, leadership interview prep
- May inform home-page narrative
- **Deferred.**

---

## 2. This session — execution order

1. **Clothing rebuild** — domain types + 3 new components + panel integration
2. **Typography pass** — global 11px → 13px where found
3. **Daily follow-up orange fix** — reskin with HRSD palette
4. **Home achievements section** — structure + image slots (you drop photos later)

Scope guard: if any item blows budget, stop and commit what's done. Don't leave half-working code.

## 3. Follow-up session intake

Before the next session, collect these to the Desktop or a shared folder so I can read them:
- Catering Excel files (current company, contract, weekly ops)
- حوكمة خدمات الإعاشة
- Kitchen/warehouse specs
- "اللي عاشها" folder contents
- O&M source files from Drive
- Center achievement photos (Red Crescent, KPI, Special Olympics, IPC)
- Al-Baha org chart PPTX (already on Desktop, need extraction tool)
- 2018 privatization spec for review

## 4. Decisions I'm taking under goal-level autonomy

Based on `feedback_autonomy.md` — executing without asking per-step:
- Clothing module: **additive** approach. Don't rewrite the 7 existing files. Add 3 new components + types file, wire them into the panel header.
- Home page achievements: build structure with **placeholder icon cards**. Image paths like `/assets/achievements/red-crescent.jpg` — you drop photos with those exact filenames into `public/assets/achievements/` when ready.
- Font minimum: **13px**. `text-xs` (12px) and `text-[11px]` replaced with `text-[13px]` where they appear in user-visible content (not badges/chips where 12px is deliberate).
- Daily follow-up: orange `bg-orange-*` → `bg-hrsd-teal-light/bg-hrsd-navy-light`. Keeps visual distinction without the "ugly orange" problem.
