# Dignity Index v0 — مؤشّر الكرامة (الإصدار الأولي)

**Status:** spec (not yet implemented)
**Author:** Claude Opus 4.7 (1M), 2026-04-22
**Owner for review:** Ahmad Al-Shahri
**Derived from:** `launchpad-opus-4.7.md` §6–§7.C; `PLAN-comprehensive-2026.md` §1.8, §2.2.

---

## 1. Purpose

The Dignity Index (DI) is Basira's **outcome-layer measurement** (Trust-Ground Layer 4). It answers one question, per beneficiary, per month:

> **Which of the 10 social-handicap barrier types is life throwing at this person, and which ones did our work dissolve this month?**

It does **not** measure:
- Staff performance (→ HR system)
- Financial efficiency (→ `modules/grc` + cost-tracking)
- Compliance (→ `modules/grc` standards)
- Clinical outcomes (→ medical team, out-of-scope per social model)

It **does** measure:
- Which barriers were present at the start of the period (exposure)
- Which barriers were touched by an intervention (action)
- Which barriers moved (outcome)
- The gap between staff-rated and beneficiary-rated dignity (trust signal)

---

## 2. The ten barrier types

Source: `launchpad-opus-4.7.md` §6.2 (do not modify without updating the launchpad).

| Code | نوع العوق | English | Axis |
|---|---|---|---|
| `B1` | عائق | Barrier — passive physical obstruction | Material |
| `B2` | تحدٍّ | Challenge — active friction | Material / procedural |
| `B3` | خصم | Opponent — declared adversary | Interpersonal |
| `B4` | مضادّ | Antagonist — systemic resistance | Institutional |
| `B5` | داعم مزيّف | Fake supporter — signs but blocks | Institutional |
| `B6` | مصدر خوف | Source of fear — stigma generator | Social |
| `B7` | خوف | Fear — internalized | Psychological |
| `B8` | عُرف اجتماعي | Social norm — unwritten expectation | Cultural |
| `B9` | ثقافة تابو | Taboo — unsayable | Cultural |
| `B10` | مُسلَّم ديني | Religious given — unquestioned dogma | Cultural |

**Reserved for later:** `B11` soft-bigotry (low expectation), `B12` missing-measurement, `B13` charity-dominance (see launchpad §6.2 "additional expansions"). v0 does not score these — they are logged if detected but not weighted.

---

## 3. Data sources (what already exists vs. what must be added)

### 3.1 Existing sources (v0 uses these)

| Source | File(s) | What we extract |
|---|---|---|
| `DignityProfile` | `src/types/dignity-profile.ts`, `src/types/index.ts:65+` | Beneficiary preferences, fears, communication style → feeds B6, B7 context |
| Empowerment goals | `src/modules/empowerment/*.tsx`, `services/empowermentService.ts` | Each goal targets a barrier → feeds B1-B5 dissolution events |
| `beneficiary_classification` (sql/007) | `supabase/sql/007_independence_tracking.sql:8` | Independence level → baseline exposure |
| `human_rights_compliance` (sql/007) | `supabase/sql/007_independence_tracking.sql:117` | Rights-gap events → feeds B4, B5 |
| Wellbeing / pulse | `services/wellbeingService.ts`, `components/pulse/*.tsx` | Staff-rated wellbeing axes → feeds all barriers (broad signal) |
| `beneficiaries.alerts` array | `src/types/index.ts:57` | Known risks → exposure context |
| `daily_care_logs` | `supabase/sql/001_core_schema.sql:55` | Daily events (mood, social interaction, concerns) → implicit barrier signals |

### 3.2 New sources needed for v1 (not v0)

- Beneficiary self-rating (the "Beneficiary Voice" ومضة, launchpad §7.C): monthly tap-based survey, voice option via Habibi-TTS reverse-STT (Phase 2.5+).
- Guardian-rated barriers (via family portal, Phase 2.3).
- Cross-actor events (school, primary care, community) — Phase 2–3.

v0 works entirely off §3.1 sources. No new tables in v0 except `dignity_index_snapshots` (see §5).

---

## 4. Scoring — three layers

### 4.1 Exposure (E)

Per beneficiary, per barrier type, per month: is this barrier *present in their life*?

Three values:
- `0` = not present or not applicable
- `1` = present, passive (life has it)
- `2` = present, active (actively affecting them this month)

**Derivation rules for v0:**
- `B1` exposure = `2` if beneficiary uses wheelchair + any `daily_care_logs.concerns` mentions access issues this month; `1` if wheelchair + no such event; `0` otherwise
- `B2` exposure = `2` if any approval/process friction logged in `human_rights_compliance` this month; `1` if historic but no current; `0` otherwise
- `B3`–`B5` exposure = from `human_rights_compliance.gap_type` + staff notes
- `B6`, `B7` exposure = from `DignityProfile.dislikes.fears` + `dislikes.triggers`; staff confirmation in `daily_care_logs.mood = 'anxious'|'fearful'|'withdrawn'`
- `B8`–`B10` exposure = initialized from intake social research; manual update by social worker
- Default when unknown: `NULL` (not zero — don't claim a barrier isn't present when we haven't asked)

### 4.2 Action (A)

Per beneficiary, per barrier type, per month: how many interventions explicitly targeted this barrier?

Count of events where:
- Empowerment goal set with `targetedBarrier = B_n`
- Daily care log entry with `barrier_dissolution_attempt = B_n`
- Any module-native "event" that carries a `barrier_type` tag

v0 does **not** score intervention quality — only count. Quality comes in v1 with guardian/beneficiary confirmation.

### 4.3 Movement (M)

Per beneficiary, per barrier type, per month: did the exposure decrease?

- `M = E_previous_month - E_current_month`
- Clamped to `[-2, +2]`
- Positive = dissolution; negative = regression; zero = steady-state

### 4.4 The Dignity Index score (v0 formula)

$$
DI_{beneficiary, month} = \sum_{n=1}^{10} w_n \cdot M_n
$$

Where `w_n` is a barrier-type weight. **v0 uses equal weights (all `w_n = 1`).** Different weights are a Phase 2 decision — they encode political/philosophical judgments and should be deliberated with Ahmad, not chosen by Claude.

Score range per beneficiary-month: `[-20, +20]`.

**⚠️ صراحة:** this score is deliberately simple. It is designed to be **legible to non-technical ministerial reviewers**, not to win at statistics. Complexity arrives with v1 when calibration data exists.

---

## 5. Data model — v0 additions

Single new table (to land in v2 as a new migration):

```sql
-- supabase/sql/v2_xxx_dignity_index_snapshots.sql (to be created)
CREATE TABLE IF NOT EXISTS dignity_index_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id),
    period_month DATE NOT NULL,  -- first day of month

    -- per-barrier exposure at month start (NULL = unknown/not-asked)
    exposure_b1  SMALLINT, exposure_b2  SMALLINT, exposure_b3 SMALLINT, exposure_b4 SMALLINT,
    exposure_b5  SMALLINT, exposure_b6  SMALLINT, exposure_b7 SMALLINT, exposure_b8 SMALLINT,
    exposure_b9  SMALLINT, exposure_b10 SMALLINT,

    -- per-barrier action count during month
    action_b1  INTEGER DEFAULT 0, action_b2  INTEGER DEFAULT 0, action_b3 INTEGER DEFAULT 0,
    action_b4  INTEGER DEFAULT 0, action_b5  INTEGER DEFAULT 0, action_b6 INTEGER DEFAULT 0,
    action_b7  INTEGER DEFAULT 0, action_b8  INTEGER DEFAULT 0, action_b9 INTEGER DEFAULT 0,
    action_b10 INTEGER DEFAULT 0,

    -- per-barrier movement (computed vs previous month)
    movement_b1  SMALLINT, movement_b2  SMALLINT, movement_b3 SMALLINT, movement_b4 SMALLINT,
    movement_b5  SMALLINT, movement_b6  SMALLINT, movement_b7 SMALLINT, movement_b8 SMALLINT,
    movement_b9  SMALLINT, movement_b10 SMALLINT,

    -- derived
    total_score INTEGER,              -- sum of movement_* with equal weights
    exposure_coverage DECIMAL(3,2),   -- fraction of barriers with non-NULL exposure (data-quality metric)

    -- self/guardian-rated (optional, populated by Phase 2+)
    self_rated_total INTEGER,
    gap_vs_staff INTEGER,             -- self_rated_total - total_score (positive = staff underestimating)

    computed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,

    UNIQUE (beneficiary_id, period_month)
);
```

**Service layer:** new `src/services/dignityIndexService.ts` — functions:
- `computeSnapshot(beneficiaryId, month)` — runs rules in §4.1, writes snapshot
- `getTrajectory(beneficiaryId, months)` — reads historical snapshots
- `centerRollup(centerId, month)` — aggregate across beneficiaries for leadership view

**UI layer:** single dashboard card, `components/dashboard/DignityIndexCard.tsx`:
- 10 horizontal bars (one per barrier)
- Each bar: exposure bar + action count badge + movement arrow (↑ green / ↓ red / → gray)
- Click = drill into month with the specific events that caused the movement

---

## 6. Worked example — one beneficiary, one month

Beneficiary: محمد (file #104). Admitted 2024-09, wheelchair user, withdrawn socially per `DignityProfile`.

**Period:** 2026-03-01 → 2026-03-31.

### Exposure at 2026-03-01
- `B1` = 2 (access issue logged 2026-02-28)
- `B2` = 1 (historic friction getting weekly outing approved, no current event)
- `B3`–`B5` = NULL (not assessed)
- `B6` = 2 (two anxiety events logged Feb)
- `B7` = 2 (fear of noise — in DignityProfile)
- `B8` = NULL
- `B9` = NULL
- `B10` = NULL
- `exposure_coverage` = 4/10 = 0.40 ← flag: data coverage too low; v1 must close this

### Actions during March
- `action_b1` = 3 (ramp-installation event + two accessible-activity outings)
- `action_b6` = 2 (two calm-session interventions)
- `action_b7` = 1 (noise-canceling headset trial)
- All others = 0

### Exposure at 2026-03-31
- `B1` = 1 (no access event this month — but still a wheelchair user = passive presence)
- `B6` = 1
- `B7` = 2 (headset trial didn't land)
- B2, B3–B5, B8–B10 unchanged

### Movement
- `movement_b1` = 2 - 1 = **+1** (dissolved one level)
- `movement_b6` = 2 - 1 = **+1**
- `movement_b7` = 2 - 2 = **0**
- `total_score = +2`

### Interpretation for the dashboard card
> "محمد تقدّم هذا الشهر في عائقَين (B1, B6). B7 لم يتحرّك رغم محاولة. 60% من أنواع العَوْق لم تُقيَّم بعد — تحسين التقييم مطلب v1."

Governmental Arabic. Beneficiary not patient. Action names reference the 10-barrier dictionary, not clinical codes. **No CBAHI mention anywhere.**

---

## 7. What v0 deliberately is NOT

- **Not a ranking tool.** We never publish "beneficiary X has score 10 and Y has 3." Scores are for per-person trajectories, not comparisons.
- **Not a staff appraisal input.** Score dips can reflect data-coverage changes, seasonal events, external shocks — not staff failure.
- **Not a classification algorithm.** Weighting and calibration arrive in v1; v0 treats all barriers equally because political/philosophical weighting requires Ahmad + stakeholder input.
- **Not a cross-center tool.** v0 lives at Al-Baha only. Multi-center rollup waits until schemas are stable and weights are validated.
- **Not ML.** No models, no predictions — rule-based only. Launchpad §7.I predictive model is Phase 3+ and needs ethics review.

---

## 8. Implementation slice (for Phase 1.10 future work)

When v0 gets built (not in this planning session):

1. Migration `v2_001_dignity_index_snapshots.sql` — create the table above.
2. `src/services/dignityIndexService.ts` — the three functions.
3. `src/services/barrierClassifier.ts` — rules engine per §4.1 (separate service so the rules can be tested in isolation).
4. `src/components/dashboard/DignityIndexCard.tsx` — the 10-bar UI.
5. `tests/e2e/dignity-index-card.spec.ts` — Playwright: for seeded beneficiary محمد above, the card shows +2 score and flags B1/B6 as moved.
6. No changes to `main` — all on `v2`.

Estimated: 5–7 working days once this spec is approved.

---

## 9. Open questions (need Ahmad's ruling)

- **9.1 Weighting authority.** Who decides non-equal weights in v1? Ahmad alone? Advisory group? Recommendation: Ahmad, with advisory review before any ministerial presentation.
- **9.2 Public visibility.** Does the score surface to the beneficiary themselves? Only to the guardian? Only to staff? Recommendation: v0 = staff only; v1 = beneficiary-viewable with governmental Arabic framing that preserves dignity.
- **9.3 Score sign convention.** Positive = dissolved barriers (dignity gained). Negative = barriers regressed. Double-check this is the right psychological framing — some beneficiaries may see "negative dignity score" as a stigma. Alternative: publish only "movement events," not cumulative scores. Recommendation: internal cumulative for staff planning; public-facing only shows movement events.
- **9.4 Cultural barrier data (B8–B10).** Assessing "social norm / taboo / religious given" requires skilled social-worker interview, not a checkbox. v0 leaves these NULL unless social research has explicit data. v1 needs an instrument.
- **9.5 Beneficiary Voice trigger.** When does a self-rating become mandatory input? Monthly? Event-triggered? Needs operational design input from Al-Baha staff.

---

*End of v0 spec. Ahmad reviews and decides §9. Build cards come after approval.*
