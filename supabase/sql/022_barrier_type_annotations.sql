-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة v2 — Barrier-Type Annotations
-- Migration 022 | 2026-04-22
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Purpose: Tag existing columns with the social-handicap barrier type(s) they
-- relate to (per launchpad-opus-4.7.md §6.2 / docs/dignity-index-v0.md §2).
--
-- NON-DESTRUCTIVE: only COMMENT ON statements. No DDL changes, no data changes.
-- Safe to re-run; idempotent.
--
-- Barrier type codes:
--   B1  عائق           — passive physical/material obstruction
--   B2  تحدٍّ           — active procedural/bureaucratic friction
--   B3  خصم            — declared interpersonal adversary
--   B4  مضادّ           — systemic institutional resistance
--   B5  داعم مزيّف      — fake supporter (signs but blocks)
--   B6  مصدر خوف        — stigma-generating source
--   B7  خوف             — internalized fear
--   B8  عُرف اجتماعي     — unwritten social norm
--   B9  ثقافة تابو      — cultural taboo
--   B10 مُسلَّم ديني     — religious given / unquestioned dogma
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- beneficiaries (core identity) — mixed signal, mostly context
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON COLUMN beneficiaries.mobility_type IS
    'Barrier signal: B1 (physical). Values كرسي_متحرك/طريح_فراش → passive barrier presence.';

COMMENT ON COLUMN beneficiaries.communication_type IS
    'Barrier signal: B1 (physical-sensory) + B6/B7 (if nonverbal carries stigma).';

COMMENT ON COLUMN beneficiaries.special_needs IS
    'Barrier signal: B1 (material accommodations required).';

COMMENT ON COLUMN beneficiaries.evacuation_category IS
    'Barrier signal: B1 (physical). أحمر/أصفر/أخضر.';

COMMENT ON COLUMN beneficiaries.medical_diagnosis IS
    'Clinical-framing legacy field (v1). v2 discussion: reframe as functional-assessment. Not a barrier itself; drives B1 exposure.';

COMMENT ON COLUMN beneficiaries.status IS
    'Lifecycle state: نشط/إجازة/منقول/متوفى. Transitions are events worth emitting to the Layer-2 ledger (Phase 2.1).';

-- ─────────────────────────────────────────────────────────────────────────────
-- daily_care_logs — the richest daily barrier signal source
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON COLUMN daily_care_logs.mood IS
    'Barrier signal: B6, B7 (fear / anxiety). Values anxious/withdrawn/fearful feed exposure scoring.';

COMMENT ON COLUMN daily_care_logs.social_interaction IS
    'Barrier signal: B3, B6, B8 (interpersonal + social-norm). Low interaction can indicate multiple barriers simultaneously.';

COMMENT ON COLUMN daily_care_logs.concerns IS
    'Free-text; source for all barrier types. NLP classification candidate in Phase 2+.';

COMMENT ON COLUMN daily_care_logs.incidents IS
    'Event-carrying field. Relevant to multiple barriers; triage manually v0, classify v1.';

COMMENT ON COLUMN daily_care_logs.recreational_activities IS
    'Barrier dissolution signal: B1 (if accessible-activity), B6/B7 (if social exposure), B8 (if breaking social norm).';

-- ─────────────────────────────────────────────────────────────────────────────
-- fall_risk_assessments / fall_incidents — physical safety (B1)
-- ─────────────────────────────────────────────────────────────────────────────
-- Falls are primarily B1 (physical environmental barriers). Any incident log
-- with guardian-blame themes may also reveal B5 (fake supporter).
COMMENT ON TABLE fall_risk_assessments IS
    'Primary barrier: B1. Secondary: B5 if risk flagged but not acted on by designated guardian.';

COMMENT ON TABLE fall_incidents IS
    'Primary barrier: B1. Root-cause free-text may reveal B2 (process friction), B4 (institutional).';

-- ─────────────────────────────────────────────────────────────────────────────
-- independence_tracking schema (sql/007) — the social-model bridgehead
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE beneficiary_classification IS
    'Social-model classification. Independence level = primary dignity-axis baseline. Multiple barriers contribute.';

COMMENT ON TABLE services_gap_analysis IS
    'Barrier signal: B2 (process friction), B4 (systemic resistance). Each gap = barrier instance.';

COMMENT ON TABLE independence_budget_analysis IS
    'Barrier signal: B4 (institutional), B13 reserved (charity-dominance if budget treats beneficiaries as cost centers).';

COMMENT ON TABLE human_rights_compliance IS
    'Direct CRPD-article map. Non-compliance = B4 institutional barrier. Fake signatures with no follow-through = B5.';

COMMENT ON TABLE external_services_benchmark IS
    'Inter-actor comparison. Used for Trust-Ground Layer-3 (Response) positioning. Not a barrier source itself.';

-- ─────────────────────────────────────────────────────────────────────────────
-- GRC / quality schema — institutional barrier surface
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE grc_risks IS
    'Institutional risks. Relevant barrier types depend on risk category — see grc_risk_categories tag.';

COMMENT ON TABLE grc_safety_incidents IS
    'Primarily B1 (physical) for most incidents; B4 if root cause is systemic.';

COMMENT ON TABLE grc_disability_codes IS
    'Administrative codes. Not a barrier source; descriptive only. v2: audit whether codes align with social model or reinforce medical framing.';

-- ─────────────────────────────────────────────────────────────────────────────
-- audit_logs — universal event stream, preserve for Trust-Ground Layer-2
-- ─────────────────────────────────────────────────────────────────────────────
COMMENT ON TABLE audit_logs IS
    'Universal audit trail. In Phase 2.1 (Layer-2 Events) this becomes the base for barrier-tagged event stream. Do not truncate.';

-- ═══════════════════════════════════════════════════════════════════════════════
-- Columns deliberately NOT annotated in v0
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- Medical data (vitals, medications, infection status): clinical-layer; barriers
-- are downstream (e.g., medication non-adherence → B1/B2). Tagging them directly
-- risks double-counting. Annotations arrive when medical modules are refactored
-- under the social model (Phase 2.6 / 3.2 in the LoC plan).
--
-- Catering/operations columns: out of scope for dignity measurement at v0.
--
-- Dental/speech/psychology assessments: scope question pending (see
-- docs/loc-reduction-plan.md §3.2). Annotation waits on reframe.
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- End of migration 022
-- ═══════════════════════════════════════════════════════════════════════════════
